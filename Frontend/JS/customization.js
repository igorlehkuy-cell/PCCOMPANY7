// Game and Requirements Data
const gamesData = [
    {
        id: 'cs2',
        name: 'CS2',
        color: '#f2a900',
        reqs: {
            30: { price: 300, cpu: 'Intel Core i3', gpu: 'GTX 1650', ram: '8гб', rom: '256гб SSD', text: 'Мінімальні налаштування. Підійде для ознайомлення.' },
            60: { price: 500, cpu: 'Intel Core i5', gpu: 'RTX 3060', ram: '16гб', rom: '512гб SSD', text: 'Високі налаштування. Комфортна гра без фризів.' },
            90: { price: 650, cpu: 'Intel Core i5', gpu: 'RTX 4060', ram: '16гб', rom: '1тб SSD', text: 'Максимальні налаштування. Плавна картинка.' },
            120: { price: 850, cpu: 'Intel Core i7', gpu: 'RTX 4060 Ti', ram: '16гб', rom: '1тб SSD', text: 'Ультра налаштування для напівпрофесійної гри.' },
            150: { price: 1100, cpu: 'Intel Core i7', gpu: 'RTX 4070', ram: '32гб', rom: '1тб SSD', text: 'Кіберспортивний рівень для ідеального кліку.' },
            180: { price: 1400, cpu: 'Intel Core i9', gpu: 'RTX 4070 Ti', ram: '32гб', rom: '1тб M.2', text: 'Ентузіаст. Максимум можливостей рушія.' },
            210: { price: 1800, cpu: 'Intel Core i9', gpu: 'RTX 4080', ram: '32гб', rom: '2тб M.2', text: 'Надвисокі частоти кадрів для 240Hz моніторів.' },
            240: { price: 2500, cpu: 'Intel Core i9', gpu: 'RTX 4090', ram: '64гб', rom: '2тб M.2 Gen4', text: 'Абсолютний максимум без жодних компромісів.' }
        }
    },
    {
        id: 'cyberpunk',
        name: 'Cyberpunk 2077',
        color: '#fcee0a',
        reqs: {
            30: { price: 550, cpu: 'Intel Core i5', gpu: 'GTX 1660 Ti', ram: '16гб', rom: '512гб SSD', text: 'Низькі налаштування, 1080p. Базовий рівень.' },
            60: { price: 800, cpu: 'Intel Core i7', gpu: 'RTX 3060 Ti', ram: '16гб', rom: '1тб SSD', text: 'Високі налаштування, DLSS. Комфортне проходження.' },
            90: { price: 1150, cpu: 'Intel Core i7', gpu: 'RTX 4070', ram: '32гб', rom: '1тб SSD', text: 'Ультра налаштування, Ray Tracing On.' },
            120: { price: 1800, cpu: 'Intel Core i9', gpu: 'RTX 4080', ram: '32гб', rom: '1тб NVMe', text: 'Overdrive Mode. Неймовірна графіка.' },
            150: { price: 2600, cpu: 'Intel Core i9', gpu: 'RTX 4090', ram: '64гб', rom: '2тб NVMe', text: 'Найкращий ігровий експірієнс 4K.' },
            180: { price: 2800, cpu: 'Intel Core i9', gpu: 'RTX 4090', ram: '64гб', rom: '2тб NVMe', text: 'Для 4K 144Hz моніторів з максимальним відкликом.' },
            210: { price: 3200, cpu: 'Intel Core i9', gpu: 'RTX 4090', ram: '64гб', rom: '4тб NVMe', text: 'Безпрецедентна потужність.' },
            240: { price: 3800, cpu: 'Intel Core i9', gpu: 'RTX 4090', ram: '64гб', rom: '4тб NVMe', text: 'Екстремальний рівень для майбутнього.' }
        }
    },
    {
        id: 'dota2',
        name: 'Dota 2',
        color: '#b83626',
        reqs: {
            30: { price: 250, cpu: 'Intel Core i3', gpu: 'UHD Graphics', ram: '8гб', rom: '256гб SSD', text: 'Базова продуктивність.' },
            60: { price: 350, cpu: 'Intel Core i3', gpu: 'GTX 1650', ram: '8гб', rom: '512гб SSD', text: 'Стабільні 60 FPS на високих.' },
            90: { price: 450, cpu: 'Intel Core i5', gpu: 'RTX 3050', ram: '16гб', rom: '512гб SSD', text: 'Максимальні налаштування 1080p.' },
            120: { price: 550, cpu: 'Intel Core i5', gpu: 'RTX 3060', ram: '16гб', rom: '1тб SSD', text: 'Кіберспортивний мінімум.' },
            150: { price: 700, cpu: 'Intel Core i7', gpu: 'RTX 4060', ram: '16гб', rom: '1тб SSD', text: 'Ідеально для турнірів.' },
            180: { price: 900, cpu: 'Intel Core i7', gpu: 'RTX 4060 Ti', ram: '32гб', rom: '1тб NVMe', text: 'Жодних просадок у масових файтах.' },
            210: { price: 1100, cpu: 'Intel Core i9', gpu: 'RTX 4070', ram: '32гб', rom: '2тб NVMe', text: 'Для стрімінгу та гри на найвищих FPS.' },
            240: { price: 1350, cpu: 'Intel Core i9', gpu: 'RTX 4070 Ti', ram: '32гб', rom: '2тб NVMe', text: 'Ультимативна Dota машина.' }
        }
    },
    {
        id: 'gta5',
        name: 'GTA V',
        color: '#5b8e36',
        reqs: {
            30: { price: 300, cpu: 'Intel Core i3', gpu: 'GTX 1650', ram: '8гб', rom: '512гб HDD', text: 'Нормальні налаштування.' },
            60: { price: 450, cpu: 'Intel Core i5', gpu: 'GTX 1660', ram: '16гб', rom: '512гб SSD', text: 'Високі налаштування, стабільна гра.' },
            90: { price: 600, cpu: 'Intel Core i5', gpu: 'RTX 3060', ram: '16гб', rom: '1тб SSD', text: 'Ультра налаштування з модами.' },
            120: { price: 750, cpu: 'Intel Core i7', gpu: 'RTX 4060', ram: '16гб', rom: '1тб SSD', text: 'Комфортна гра в GTA Online.' },
            150: { price: 1050, cpu: 'Intel Core i7', gpu: 'RTX 4070', ram: '32гб', rom: '1тб NVMe', text: 'Графіка майбутнього з Redux.' },
            180: { price: 1350, cpu: 'Intel Core i9', gpu: 'RTX 4070 Ti', ram: '32гб', rom: '2тб NVMe', text: 'Для важких графічних модів.' },
            210: { price: 1650, cpu: 'Intel Core i9', gpu: 'RTX 4080', ram: '32гб', rom: '2тб NVMe', text: 'Ідеальна плавність на RP серверах.' },
            240: { price: 2150, cpu: 'Intel Core i9', gpu: 'RTX 4090', ram: '64гб', rom: '2тб NVMe', text: 'Максимум фреймів на FiveM.' }
        }
    },
    {
        id: 'valorant',
        name: 'Valorant',
        color: '#ff4655',
        reqs: {
            30: { price: 230, cpu: 'Intel Core i3', gpu: 'Intel UHD', ram: '8гб', rom: '256гб SSD', text: 'Ноутбучний геймінг.' },
            60: { price: 320, cpu: 'Intel Core i3', gpu: 'GTX 1650', ram: '8гб', rom: '512гб SSD', text: 'Комфортна гра на 60Гц моніторі.' },
            90: { price: 420, cpu: 'Intel Core i5', gpu: 'GTX 1660 Super', ram: '16гб', rom: '512гб SSD', text: 'Більше кадрів для кращої реакції.' },
            120: { price: 580, cpu: 'Intel Core i5', gpu: 'RTX 3060', ram: '16гб', rom: '1тб SSD', text: 'Стабільні 100+ FPS на ультрах.' },
            150: { price: 680, cpu: 'Intel Core i7', gpu: 'RTX 3060 Ti', ram: '16гб', rom: '1тб SSD', text: 'Для моніторів 144Гц.' },
            180: { price: 850, cpu: 'Intel Core i7', gpu: 'RTX 4060', ram: '16гб', rom: '1тб NVMe', text: 'Кіберспортивний рівень.' },
            210: { price: 1150, cpu: 'Intel Core i9', gpu: 'RTX 4070', ram: '32гб', rom: '1тб NVMe', text: 'Для професіоналів та стрімерів.' },
            240: { price: 1400, cpu: 'Intel Core i9', gpu: 'RTX 4070 Ti', ram: '32гб', rom: '2тб NVMe', text: 'Ультимативний інструмент для перемог.' }
        }
    },
    {
        id: 'witcher3',
        name: 'The Witcher 3',
        color: '#a3a3a3',
        reqs: {
            30: { price: 400, cpu: 'Intel Core i5', gpu: 'GTX 1650', ram: '8гб', rom: '512гб SSD', text: 'Нове видання (Next-Gen) на середніх.' },
            60: { price: 650, cpu: 'Intel Core i5', gpu: 'RTX 3060', ram: '16гб', rom: '1тб SSD', text: 'Високі налаштування, 60 FPS.' },
            90: { price: 850, cpu: 'Intel Core i7', gpu: 'RTX 3060 Ti', ram: '16гб', rom: '1тб SSD', text: 'Ультра налаштування.' },
            120: { price: 1100, cpu: 'Intel Core i7', gpu: 'RTX 4070', ram: '32гб', rom: '1тб NVMe', text: 'Ультра з початковим Ray Tracing.' },
            150: { price: 1450, cpu: 'Intel Core i9', gpu: 'RTX 4070 Ti', ram: '32гб', rom: '2тб NVMe', text: 'Максимальний Ray Tracing.' },
            180: { price: 1850, cpu: 'Intel Core i9', gpu: 'RTX 4080', ram: '32гб', rom: '2тб NVMe', text: 'Для гри в 4K з високим FPS.' },
            210: { price: 2600, cpu: 'Intel Core i9', gpu: 'RTX 4090', ram: '64гб', rom: '4тб NVMe', text: 'Абсолютний максимум з усіма модами.' },
            240: { price: 3400, cpu: 'Intel Core i9', gpu: 'RTX 4090', ram: '64гб', rom: '4тб NVMe', text: 'Неймовірно плавне занурення.' }
        }
    }
];

let selectedGameId = 'cs2';
let currentPrice = 0;

const componentPrices = {
    'intel core i3': 100, 'intel core i3-10100f': 70, 'intel core i3-12100f': 95, 'intel core i3-13100f': 120, 'intel core i3-14100f': 130, 'intel core i5': 200, 'intel core i7': 350, 'intel core i9': 550,
    'amd ryzen 5': 180, 'amd ryzen 7': 320, 'amd ryzen 9': 500,
    'gtx 1650': 150, 'rtx 3060': 280, 'rtx 4060': 320, 'rtx 4070': 550, 'rtx 4080': 1000, 'rtx 4090': 1600,
    'radeon rx 7600': 260, 'radeon rx 7900 xtx': 1000,
    'h610 / a520': 80, 'b760 / b550': 130, 'z790 / x670': 250, 'z790 premium': 400,
    'сток (box)': 10, 'башта (120mm)': 40, 'башта (двосекційна)': 80, 'сро 240mm': 120, 'сро 360mm': 180,
    '500w bronze': 50, '600w bronze': 65, '650w bronze': 75, '750w gold': 110, '850w gold': 140, '1000w gold': 200,
    '256гб ssd': 30, '512гб ssd': 50, '1тб ssd': 80, '2тб ssd': 140, '4тб ssd': 250,
    '8гб': 30, '16гб': 50, '32гб': 100, '64гб': 200
};

function getPriceForText(text) {
    if(!text) return 0;
    const t = text.toLowerCase().trim();
    if (componentPrices[t]) return componentPrices[t];
    for (let key in componentPrices) {
        if (t.includes(key) || key.includes(t)) {
            return componentPrices[key];
        }
    }
    return 50; 
}

document.addEventListener('DOMContentLoaded', () => {
    const gamesGrid = document.getElementById('gamesGrid');
    const fpsSlider = document.getElementById('fpsSlider');
    const fpsLabel = document.getElementById('fpsLabel');
    const recommendedText = document.getElementById('recommendedText');
    const customPriceDisplay = document.getElementById('customPriceDisplay');
    
    const cpuList = document.getElementById('cpuList');
    const gpuList = document.getElementById('gpuList');
    const mbList = document.getElementById('mbList');
    const coolerList = document.getElementById('coolerList');
    const psuList = document.getElementById('psuList');
    const romList = document.getElementById('romList');
    const ramList = document.getElementById('ramList');
    
    // Helpers for interactive lists
    function recalculatePrice() {
        let total = 0;
        const lists = [cpuList, gpuList, mbList, coolerList, psuList, romList, ramList];
        lists.forEach(list => {
            if(!list) return;
            const selected = list.querySelector('.selected-item');
            if(selected) {
                total += getPriceForText(selected.innerText);
            }
        });
        
        currentPrice = total > 0 ? total : currentPrice;
        if (customPriceDisplay) {
            customPriceDisplay.innerText = '$' + currentPrice;
        }
    }

    function selectCorrespondingItem(listElement, recommendedValue) {
        if(!listElement) return;
        const items = Array.from(listElement.querySelectorAll('li:not(.recommended-li):not(.expandable)'));
        let matched = false;
        
        items.forEach(item => item.classList.remove('selected-item'));
        const recLower = recommendedValue.toLowerCase();
        
        for (let item of items) {
             const itemText = item.innerText.toLowerCase();
             if (itemText.includes(recLower) || recLower.includes(itemText)) {
                 item.classList.add('selected-item');
                 
                 const parentSubList = item.closest('.sub-list');
                 if (parentSubList) parentSubList.style.display = 'block';
                 
                 matched = true;
                 break;
             }
        }
        if (!matched && items.length > 0) {
            items[0].classList.add('selected-item');
            const parentSubList = items[0].closest('.sub-list');
            if (parentSubList) parentSubList.style.display = 'block';
        }
    }

    function setupSelectableLists() {
        const lists = [cpuList, gpuList, mbList, coolerList, psuList, romList, ramList];
        lists.forEach(list => {
            if (!list) return;
            list.addEventListener('click', (e) => {
                const target = e.target;
                
                if (target.classList.contains('parent-title')) {
                    const subList = target.nextElementSibling;
                    if (subList && subList.classList.contains('sub-list')) {
                        subList.style.display = subList.style.display === 'none' ? 'block' : 'none';
                    }
                    return;
                }
                
                if(target.tagName === 'LI' && !target.classList.contains('recommended-li') && !target.classList.contains('expandable')) {
                    Array.from(list.querySelectorAll('li:not(.recommended-li):not(.expandable)')).forEach(li => li.classList.remove('selected-item'));
                    target.classList.add('selected-item');
                    recalculatePrice();
                }
            });
        });
    }
    setupSelectableLists();

    // Initialize Game Boxes
    gamesGrid.innerHTML = '';
    gamesData.forEach(game => {
        const box = document.createElement('div');
        box.className = 'game-box' + (game.id === selectedGameId ? ' active' : '');
        box.style.backgroundColor = game.color;
        box.style.color = '#fff';
        box.style.textShadow = '0px 0px 3px rgba(0,0,0,0.8)';
        box.innerText = game.name;
        
        box.addEventListener('click', () => {
            document.querySelectorAll('.game-box').forEach(b => b.classList.remove('active'));
            box.classList.add('active');
            selectedGameId = game.id;
            updateRecommendations();
        });
        
        gamesGrid.appendChild(box);
    });

    // Initialize Slider
    fpsSlider.addEventListener('input', (e) => {
        const fps = e.target.value;
        fpsLabel.innerText = fps + ' FPS';
        updateRecommendations();
    });

    // Function to Update Specs
    function updateRecommendations() {
        const fpsValue = parseInt(fpsSlider.value, 10);
        const game = gamesData.find(g => g.id === selectedGameId);
        
        if (game) {
            // Find closest FPS requirement or exact match
            const fpsKeys = Object.keys(game.reqs).map(k => parseInt(k, 10)).sort((a,b)=>a-b);
            let closestFps = fpsKeys[0];
            for(let key of fpsKeys) {
                if (key <= fpsValue) {
                    closestFps = key;
                } else {
                    break;
                }
            }
            
            const reqs = game.reqs[closestFps];
            currentPrice = reqs.price;
            
            let mb = 'H610 / A520';
            let cooler = 'Башта (120mm)';
            let psu = '500W 80+ Bronze';

            if (reqs.cpu.includes('i9')) {
                mb = 'Z790 / X670E (Premium)';
                cooler = 'СРО (Водяне) 360mm';
            } else if (reqs.cpu.includes('i7')) {
                mb = 'Z790 / B760 / X670';
                cooler = 'СРО 240mm / Башта (Два кулери)';
            } else if (reqs.cpu.includes('i5')) {
                mb = 'B760 / B550';
                cooler = 'Башта (120mm)';
            }

            if (reqs.gpu.includes('4090')) psu = '1000W 80+ Gold';
            else if (reqs.gpu.includes('4080')) psu = '850W 80+ Gold';
            else if (reqs.gpu.includes('4070')) psu = '750W 80+ Gold';
            else if (reqs.gpu.includes('4060') || reqs.gpu.includes('3060 Ti')) psu = '650W 80+ Bronze';
            else if (reqs.gpu.includes('3060')) psu = '600W 80+ Bronze';
            else psu = '500W 80+ Bronze';

            // Text updates
            recommendedText.innerHTML = `
                <strong>${game.name} @ ${fpsValue} FPS:</strong><br>
                ${reqs.text}<br><br>
                <strong>Характеристики:</strong><br>
                Процесор: ${reqs.cpu}<br>
                Відеокарта: ${reqs.gpu}<br>
                Мат. плата: ${mb}<br>
                БЖ: ${psu}<br>
                RAM: ${reqs.ram} | ROM: ${reqs.rom}
            `;
            
            if (cpuList) { updateListWithRecommendation(cpuList, reqs.cpu); selectCorrespondingItem(cpuList, reqs.cpu); }
            if (gpuList) { updateListWithRecommendation(gpuList, reqs.gpu); selectCorrespondingItem(gpuList, reqs.gpu); }
            if (mbList) { updateListWithRecommendation(mbList, mb); selectCorrespondingItem(mbList, mb); }
            if (coolerList) { updateListWithRecommendation(coolerList, cooler); selectCorrespondingItem(coolerList, cooler); }
            if (psuList) { updateListWithRecommendation(psuList, psu); selectCorrespondingItem(psuList, psu); }
            if (romList) { updateListWithRecommendation(romList, reqs.rom); selectCorrespondingItem(romList, reqs.rom); }
            if (ramList) { updateListWithRecommendation(ramList, reqs.ram); selectCorrespondingItem(ramList, reqs.ram); }

            recalculatePrice();
        }
    }
    
    function updateListWithRecommendation(listElement, recommendedValue) {
        const existingRec = listElement.querySelector('.recommended-li');
        if (existingRec) {
            existingRec.remove();
        }
        
        const recLi = document.createElement('li');
        recLi.className = 'recommended-li';
        recLi.style.color = '#2e7d32'; // Dark Green
        recLi.style.fontWeight = 'bold';
        recLi.style.marginTop = '10px';
        recLi.innerText = `[ Рекомендовано: ${recommendedValue} ]`;
        
        listElement.appendChild(recLi);
    }

    // Initial call
    updateRecommendations();
    
    // Add to cart setup
    const addBtn = document.querySelector('.add-to-cart-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const fpsValue = parseInt(fpsSlider.value, 10);
            const game = gamesData.find(g => g.id === selectedGameId);
            
            const customId = 'custom-' + Date.now();
            const selectedCpu = document.querySelector('#cpuList .selected-item')?.innerText || 'CPU';
            const selectedGpu = document.querySelector('#gpuList .selected-item')?.innerText || 'GPU';
            const fullName = `Персональна збірка (${selectedCpu} + ${selectedGpu})`;
            const type = 'desktop';

            // Push to real cart from script.js using currentPrice
            if (typeof addProductToCart === 'function') {
                addProductToCart(customId, fullName, currentPrice, type);
            } else {
                // Fallback
                let cart = JSON.parse(localStorage.getItem('pc-company-cart')) || [];
                cart.push({id: customId, name: fullName, price: currentPrice, type, quantity: 1});
                localStorage.setItem('pc-company-cart', JSON.stringify(cart));
                window.showToast(`${fullName} додано до кошика!`, 'success');
            }
        });
    }
});
