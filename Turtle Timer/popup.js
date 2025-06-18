let timerSet = false;
let intervalId;

// Styling the star sparkle mouse effect
document.addEventListener('mousemove', (e) => {
  const star = document.createElement('div');
  star.className = 'star-sparkle';
  star.style.left = `${e.pageX}px`;
  star.style.top = `${e.pageY}px`;
  star.style.transform = `rotate(${Math.random() * 360}deg)`;
  document.body.appendChild(star);

  // Removes the star after a short delay to make the trail shorter
  setTimeout(() => {
    star.remove();
  }, 100);
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
    return;
  }
  openPopup();
});

const button = document.getElementById("button")

button.addEventListener("click", (event) => {
    closePopup();
    saveTimerData();
    event.preventDefault();
});

// Forever loop that alternates turtle images every second to make an animation
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


// Function to save timer data to localStorage and start the timer
function saveTimerData() {
  if (timerSet === true) {
    return; 
  }
  const minutes = document.querySelector('#mins');
  if (!minutes || minutes.value.trim() === "" || isNaN(Number(minutes.value)) || Number(minutes.value) < 0 || Number(minutes.value) > 99999) {
    notification("Please enter a valid number of minutes. Please do not make the number too large.");
  return;
}
  const seconds = document.querySelector('#secs');
  if (!seconds || seconds.value.trim() === "" || isNaN(Number(seconds.value)) || Number(seconds.value) < 0 || Number(seconds.value) > 59) {
    notification("Please enter a valid number of seconds. Please do not make the number too large.");
    return;
  }
  const totalTime = parseInt(minutes.value) * 60 + parseInt(seconds.value);
  const timerData = {
    startTime: Date.now(),
    endTime: Date.now() + (totalTime*1000),
    duration: totalTime,
    repeatCount: parseInt(document.querySelector('#repeat').value) || 1
  }

  localStorage.setItem('timerData', JSON.stringify(timerData));
  timerSet = true; 

  animateTurtle();
  setTimer();
}

function setTimer() {
  const timerData = JSON.parse(localStorage.getItem('timerData'));
  if (!timerData) {
    notification("No timer data found in localStorage.");
    return;
  }

  const duration = timerData.duration * 1000;
  const repeatCount = timerData.repeatCount;

  let currentRepeat = 0;

  function runTimer() {
    const endTime = Date.now() + duration;
    localStorage.setItem('timerData', JSON.stringify({ ...timerData, endTime }));

    resetDisplay();
    showHowMuchTimeLeft(endTime);

    setTimeout(() => {
      notification(`Timer is done!`);
      playSound();
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
      timeLeftDisplay.hidden = false;
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
  }, 3000);
}

let audio = null;
function playSound() {  
  if (!audio) {
    audio = new Audio('music.mp3');
  }
  audio.pause();
  audio.currentTime = 0;
  audio.play();
}
