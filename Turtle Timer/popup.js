let timerSet = false;
let intervalId;

// Styling the star sparkle mouse effect
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

// Opens the timer popup when the turtle is clicked
let popup = document.getElementById("popup");

function openPopup() {
    popup.classList.add("open-popup");
}

function closePopup() {
    popup.classList.remove("open-popup");
}

const turtle = document.getElementById("turtle");
turtle.addEventListener("click", () => {
  if (timerSet === true) {
    notification("Timer is already set. Please wait for it to finish before setting a new one.");
    return; // Prevent opening the popup if timer is already set
  }
        openPopup();
});

const button = document.getElementById("button")

button.addEventListener("click", (event) => {
    closePopup();
    saveTimerData();
    event.preventDefault();
});

// Forever loop to alternate turtle images every second
let turtleAnimationInterval = null;

function animateTurtle() {
  const turtleImg = document.getElementById("turtle");
  let toggle = false;
  if (turtleAnimationInterval) clearInterval(turtleAnimationInterval);
  turtleAnimationInterval = setInterval(() => {
    turtleImg.src = toggle ? "/images/logo-no-bg.png" : "/images/logo-no-bg-2.png";
    toggle = !toggle;
  }, 1000);
}

function stopTurtleAnimation() {
  const turtleImg = document.getElementById("turtle");
  turtleImg.src = "/images/logo-no-bg.png"; // Reset to the original image
  if (turtleAnimationInterval) {
    clearInterval(turtleAnimationInterval);
    turtleAnimationInterval = null;
  }
}

function saveTimerData() {
  if (timerSet === true) {
    return; // Prevent setting the timer again if it's already set
  }
  const minutes = document.querySelector('#mins');
  if (!minutes || minutes.value.trim() === "" || isNaN(Number(minutes.value)) || Number(minutes.value) < 0) {
    notification("Please enter a valid number of minutes.");
  return;
}
  const seconds = document.querySelector('#secs');
  if (!seconds || seconds.value.trim() === "" || isNaN(Number(seconds.value)) || Number(seconds.value) < 0) {
    notification("Please enter a valid number of seconds.");
    return;
  }
  const totalTime = parseInt(minutes.value) * 60 + parseInt(seconds.value);
  const timerData = {
    startTime: Date.now(),
    endTime: Date.now() + (totalTime*1000),
    duration: totalTime,
    repeatCount: parseInt(document.querySelector('#repeat').value) || 1
  }

  // Save to localStorage
  localStorage.setItem('timerData', JSON.stringify(timerData));
  timerSet = true; // Set the flag to true to prevent further setting

  animateTurtle();
  setTimer();
}

function setTimer() {
  const timerData = JSON.parse(localStorage.getItem('timerData'));
  if (!timerData) {
    notification("No timer data found in localStorage.");
    return;
  }

  const duration = timerData.duration * 1000; // Convert to milliseconds
  const repeatCount = timerData.repeatCount;

  let currentRepeat = 0;

  function runTimer() {
    const endTime = Date.now() + duration;
    localStorage.setItem('timerData', JSON.stringify({ ...timerData, endTime }));

    resetDisplay();
    showHowMuchTimeLeft(endTime);

    setTimeout(() => {
      notification(`Timer is done!`);
      currentRepeat++;

      if (currentRepeat < repeatCount) {
        runTimer();
      } else {
        localStorage.removeItem('timerData');
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        document.getElementById('time-left-display').hidden = true;
        timerSet = false;
        stopTurtleAnimation();
      }
    }, duration);
  }

  function resetDisplay() {
    let timeLeftDisplay = document.getElementById('time-left-display');
    if (timeLeftDisplay) {
      timeLeftDisplay.innerHTML = ""; // Clear old content
      timeLeftDisplay.hidden = false; // Makes sure it's visible
    }
  }

  function showHowMuchTimeLeft(endTime) {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    function updateDisplay() {
      const now = Date.now();
      const timeLeft = Math.max(0, endTime - now);
      const minutesLeft = Math.floor(timeLeft / 60000);
      const secondsLeft = Math.floor((timeLeft % 60000) / 1000);
      const display = document.getElementById('time-left-display');
      if (display) {
        display.innerHTML = `Time left: ${minutesLeft} : ${secondsLeft}`;
        display.hidden = false;
      }

      if (timeLeft <= 0) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    intervalId = setInterval(updateDisplay, 1000);
    updateDisplay();
  }

  runTimer();
}


function notification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  const turtle = document.getElementById("turtle");
  setTimeout(() => {
    notification.remove();
  }, 3000); // Remove after 3 seconds
}
