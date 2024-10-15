function createPixieDust(x, y) {
    const pixieDust = document.createElement('div');
        pixieDust.classList.add('pixie-dust');
        pixieDust.style.left = `${x}px`;
        pixieDust.style.top = `${y}px`;
        pixieDust.style.width = `${Math.random() * 30 + 5}px`;
        pixieDust.style.height = pixieDust.style.width;
        document.querySelector('.hero-bg').appendChild(pixieDust);

        setTimeout(() => {
            pixieDust.remove();
        }, 1000);
}

  document.querySelector('.hero-bg').addEventListener('mousemove', function(e) {
    if (!('ontouchstart' in window)) {
      const rect = this.getBoundingClientRect();
      createPixieDust(e.clientX - rect.left, e.clientY - rect.top);
    }
  });

  document.querySelector('.hero-bg').addEventListener('touchmove', function(e) {
    const rect = this.getBoundingClientRect();
    const touch = e.touches[0];
    createPixieDust(touch.clientX - rect.left, touch.clientY - rect.top);
  });

  document.querySelector('.hero-bg').addEventListener('touchstart', function(e) {
    const rect = this.getBoundingClientRect();
    const touch = e.touches[0];
    createPixieDust(touch.clientX - rect.left, touch.clientY - rect.top);
  });