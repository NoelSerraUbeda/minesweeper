document.addEventListener('DOMContentLoaded', function() {
  function startCounter() {
    let count = 0;
    const counterElement = document.querySelector('.counter h2');

    function updateCounter() {
      const formattedCount = count.toString().padStart(3, '0');
      counterElement.textContent = formattedCount;
    }

    updateCounter();

    function incrementCounter() {
      count++;
      updateCounter();
    }

    const intervalId = setInterval(incrementCounter, 1000);

    document.addEventListener('gameEnd', function() {
      clearInterval(intervalId);
    });
  }

  startCounter();
});

