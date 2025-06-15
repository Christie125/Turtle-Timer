document.addEventListener('mousemove', (e) => {
  const star = document.createElement('div');
  star.className = 'star-sparkle';
  star.style.left = `${e.pageX}px`;
  star.style.top = `${e.pageY}px`;

  // Optional: Add slight rotation or variation
  star.style.transform = `rotate(${Math.random() * 360}deg)`;

  document.body.appendChild(star);

  setTimeout(() => {
    star.remove();
  }, 100); // Slightly longer than before
});
