(function () {
    const paws = ['🐾'];
    let lastX = 0, lastY = 0, lastTime = 0;

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 30 || now - lastTime < 80) return;
        lastX = e.clientX; lastY = e.clientY; lastTime = now;

        const paw = document.createElement('div');
        paw.className = 'paw-trail';
        paw.textContent = paws[0];

        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        paw.style.cssText = `
      left: ${e.clientX - 10}px;
      top: ${e.clientY - 10}px;
      --rot: ${angle}deg;
      font-size: ${Math.random() * 6 + 16}px;
    `;
        document.body.appendChild(paw);
        setTimeout(() => paw.remove(), 1200);
    });
})();
