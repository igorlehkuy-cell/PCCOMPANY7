from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os

from . import models, schemas
from .database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Run migrations and seed admin user
from sqlalchemy import text, func
from .database import SessionLocal
from . import auth

db = SessionLocal()
try:
    # 1. Check & add is_admin and avatar_url columns if missing
    table_info = db.execute(text("PRAGMA table_info(users)")).fetchall()
    columns = [row[1] for row in table_info]
    if "is_admin" not in columns:
        db.execute(text("ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0"))
    if "avatar_url" not in columns:
        db.execute(text("ALTER TABLE users ADD COLUMN avatar_url VARCHAR"))
    if "bonus_points" not in columns:
        db.execute(text("ALTER TABLE users ADD COLUMN bonus_points INTEGER DEFAULT 0"))
    db.commit()
    
    # 2. Seed master admin
    admin_email = "admin@pccompany.com"
    db_admin = db.query(models.User).filter(models.User.email == admin_email).first()
    if not db_admin:
        hashed_password = auth.get_password_hash("admin123")
        admin_user = models.User(
            email=admin_email,
            name="Головний Адмін",
            phone="+380000000000",
            hashed_password=hashed_password,
            is_active=1,
            is_admin=1
        )
        db.add(admin_user)
        db.commit()
except Exception as e:
    print(f"Startup DB Migration/Seeding error: {e}")
finally:
    db.close()


app = FastAPI(title="PC Company API")

# Setup CORS for frontend
origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:63342",
    "http://127.0.0.1:63342",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:4200",
    "http://127.0.0.1:4200",
    "null",  # for file:// protocol
    # Production hosting
    "https://*.netlify.app",
    "https://*.onrender.com",
    "https://*.vercel.app",
    "https://*.surge.sh",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.(netlify\.app|onrender\.com)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from datetime import timedelta
import jwt
from . import auth

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    if user.is_active == 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ваш акаунт заблоковано"
        )
    return user

def check_admin(current_user: models.User = Depends(get_current_user)):
    if current_user.is_admin != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостатньо прав доступу"
        )
    return current_user







@app.get("/api/products", response_model=List[schemas.ProductResponse])
def get_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = db.query(models.Product).offset(skip).limit(limit).all()
    return products

@app.post("/api/products", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db), current_user: models.User = Depends(check_admin)):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.put("/api/products/{product_id}", response_model=schemas.ProductResponse)
def update_product(product_id: int, product: schemas.ProductCreate, db: Session = Depends(get_db), current_user: models.User = Depends(check_admin)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product.model_dump().items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/api/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(check_admin)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return None


@app.get("/api/users/me", response_model=schemas.UserResponse)
def get_user_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.get("/api/users", response_model=List[schemas.UserResponse])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(check_admin)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@app.post("/api/users", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        name=user.name,
        phone=user.phone,
        hashed_password=hashed_password,
        is_admin=0
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.patch("/api/users/{user_id}", response_model=schemas.UserResponse)
def update_user_status(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(check_admin)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent master admin from self-demotion or self-blocking
    if db_user.email == "admin@pccompany.com" and current_user.email == "admin@pccompany.com":
        if user_update.is_active == 0 or user_update.is_admin == 0:
            raise HTTPException(status_code=400, detail="Головний адміністратор не може видалити або обмежити свої права")

    if user_update.is_active is not None:
        db_user.is_active = user_update.is_active
    if user_update.is_admin is not None:
        db_user.is_admin = user_update.is_admin
        
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/api/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(check_admin)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if db_user.email == "admin@pccompany.com":
        raise HTTPException(status_code=400, detail="Головного адміністратора не можна видалити")
        
    db.delete(db_user)
    db.commit()
    return None

@app.post("/api/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if user.is_active == 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ваш акаунт заблоковано"
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# ──────────────────────────── Orders ──────────────────────────────────────

@app.get("/api/orders", response_model=List[schemas.OrderResponse])
def get_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(check_admin)):
    orders = db.query(models.Order).offset(skip).limit(limit).all()
    return orders

@app.patch("/api/orders/{order_id}", response_model=schemas.OrderResponse)
def update_order_status(order_id: int, status_update: schemas.OrderStatusUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(check_admin)):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if status_update.status is not None:
        db_order.status = status_update.status
    if status_update.payment_status is not None:
        db_order.payment_status = status_update.payment_status
        
    db.commit()
    db.refresh(db_order)
    return db_order


# ──────────────────────────── Promocodes ──────────────────────────────────

@app.get("/api/promocodes", response_model=List[schemas.PromocodeResponse])
def get_promocodes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(check_admin)):
    promocodes = db.query(models.Promocode).offset(skip).limit(limit).all()
    return promocodes

@app.get("/api/promocodes/check/{code}", response_model=schemas.PromocodeResponse)
def check_promocode(code: str, db: Session = Depends(get_db)):
    db_promo = db.query(models.Promocode).filter(models.Promocode.code == code).first()
    if not db_promo:
        raise HTTPException(status_code=404, detail="Промокод не знайдено")
    if db_promo.is_active == 0:
        raise HTTPException(status_code=400, detail="Промокод неактивний")
    return db_promo

@app.post("/api/promocodes", response_model=schemas.PromocodeResponse, status_code=status.HTTP_201_CREATED)
def create_promocode(promocode: schemas.PromocodeCreate, db: Session = Depends(get_db), current_user: models.User = Depends(check_admin)):
    db_promo = db.query(models.Promocode).filter(models.Promocode.code == promocode.code).first()
    if db_promo:
        raise HTTPException(status_code=400, detail="Promocode with this code already exists")
        
    new_promo = models.Promocode(**promocode.model_dump())
    db.add(new_promo)
    db.commit()
    db.refresh(new_promo)
    return new_promo

@app.delete("/api/promocodes/{promocode_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_promocode(promocode_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(check_admin)):
    db_promo = db.query(models.Promocode).filter(models.Promocode.id == promocode_id).first()
    if not db_promo:
        raise HTTPException(status_code=404, detail="Promocode not found")
        
    db.delete(db_promo)
    db.commit()
    return None

# ──────────────────────────── Rentals ─────────────────────────────────────

@app.get("/api/rentals", response_model=List[schemas.RentalResponse])
def get_rentals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(check_admin)):
    rentals = db.query(models.Rental).offset(skip).limit(limit).all()
    return rentals

@app.patch("/api/rentals/{rental_id}", response_model=schemas.RentalResponse)
def update_rental_status(rental_id: int, status_update: schemas.RentalStatusUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(check_admin)):
    db_rental = db.query(models.Rental).filter(models.Rental.id == rental_id).first()
    if not db_rental:
        raise HTTPException(status_code=404, detail="Rental not found")
    
    if status_update.status is not None:
        db_rental.status = status_update.status
    if status_update.return_date is not None:
        db_rental.return_date = status_update.return_date
        
    db.commit()
    db.refresh(db_rental)
    return db_rental

# ──────────────────────────── Customizations ──────────────────────────────

@app.get("/api/customizations", response_model=List[schemas.CustomizationResponse])
def get_customizations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(check_admin)):
    customizations = db.query(models.CustomizationRequest).offset(skip).limit(limit).all()
    return customizations

@app.patch("/api/customizations/{customization_id}", response_model=schemas.CustomizationResponse)
def update_customization_status(customization_id: int, status_update: schemas.CustomizationStatusUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(check_admin)):
    db_cust = db.query(models.CustomizationRequest).filter(models.CustomizationRequest.id == customization_id).first()
    if not db_cust:
        raise HTTPException(status_code=404, detail="Customization not found")
    
    if status_update.status is not None:
        db_cust.status = status_update.status
    if status_update.admin_comment is not None:
        db_cust.admin_comment = status_update.admin_comment
        
    db.commit()
    db.refresh(db_cust)
    return db_cust

# ──────────────────────────── News ────────────────────────────────────────

@app.get("/api/news", response_model=List[schemas.NewsResponse])
def get_news(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    news = db.query(models.News).offset(skip).limit(limit).all()
    return news

@app.post("/api/news", response_model=schemas.NewsResponse, status_code=status.HTTP_201_CREATED)
def create_news(news: schemas.NewsCreate, db: Session = Depends(get_db), current_user: models.User = Depends(check_admin)):
    db_news = models.News(**news.model_dump(), author_id=current_user.id)
    if db_news.is_published:
        db_news.published_at = func.now()
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    return db_news

@app.put("/api/news/{news_id}", response_model=schemas.NewsResponse)
def update_news(news_id: int, news: schemas.NewsCreate, db: Session = Depends(get_db), current_user: models.User = Depends(check_admin)):
    db_news = db.query(models.News).filter(models.News.id == news_id).first()
    if not db_news:
        raise HTTPException(status_code=404, detail="News not found")
    
    for key, value in news.model_dump().items():
        setattr(db_news, key, value)
    
    if db_news.is_published and db_news.published_at is None:
        db_news.published_at = func.now()
        
    db.commit()
    db.refresh(db_news)
    return db_news

@app.delete("/api/news/{news_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_news(news_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(check_admin)):
    db_news = db.query(models.News).filter(models.News.id == news_id).first()
    if not db_news:
        raise HTTPException(status_code=404, detail="News not found")
        
    db.delete(db_news)
    db.commit()
    return None

# ──────────────────────────── Bonus System ──────────────────────────────

@app.post("/api/users/me/checkout_bonus", response_model=schemas.CheckoutBonusResponse)
def checkout_bonus(data: schemas.CheckoutBonusRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Validate enough points to use
    if data.used_bonus_points > current_user.bonus_points:
        raise HTTPException(status_code=400, detail="Not enough bonus points")
        
    # Calculate earned points (e.g. 5% of order_total)
    earned = int(data.order_total * 0.05)
    
    # Update balance
    current_user.bonus_points = current_user.bonus_points - data.used_bonus_points + earned
    db.commit()
    db.refresh(current_user)
    
    return schemas.CheckoutBonusResponse(
        earned_points=earned,
        new_balance=current_user.bonus_points
    )


# ── Serve Frontend static files ──────────────────────────────────────────────
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "Frontend")

if os.path.isdir(FRONTEND_DIR):
    # Монтуємо CSS, JS, images на правильні URL-шляхи
    css_dir = os.path.join(FRONTEND_DIR, "CSS")
    js_dir = os.path.join(FRONTEND_DIR, "JS")
    images_dir = os.path.join(FRONTEND_DIR, "images")

    if os.path.isdir(css_dir):
        app.mount("/CSS", StaticFiles(directory=css_dir), name="css")
    if os.path.isdir(js_dir):
        app.mount("/JS", StaticFiles(directory=js_dir), name="js")
    if os.path.isdir(images_dir):
        app.mount("/images", StaticFiles(directory=images_dir), name="images")

    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

@app.get("/", response_class=FileResponse)
async def serve_index():
    index_path = os.path.join(FRONTEND_DIR, "html", "index.html")
    if os.path.isfile(index_path):
        return index_path
    return {"message": "PC Company API. See /docs for Swagger UI."}

@app.get("/{page}.html", response_class=FileResponse)
async def serve_page(page: str):
    html_path = os.path.join(FRONTEND_DIR, "html", f"{page}.html")
    if os.path.isfile(html_path):
        return html_path
    fallback = os.path.join(FRONTEND_DIR, "html", "index.html")
    return fallback

