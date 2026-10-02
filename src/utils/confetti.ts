import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00F0FF', '#9D4EDD', '#00FF9D', '#FF007A', '#FFB800'],
      disableForReducedMotion: true,
    });
  } catch (e) {
    // Fail silently if canvas isn't supported
  }
};

export const triggerBossVictoryConfetti = () => {
  try {
    const end = Date.now() + 2 * 1000;
    const colors = ['#00F0FF', '#9D4EDD', '#FFB800', '#FF007A'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (e) {}
};
