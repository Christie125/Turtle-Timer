let timerSet = false;

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
    alert("Timer is already set. Please wait for it to finish before setting a new one.");
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

// Forever loop to alternate turtle images every 1.5 seconds
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
    alert("Please enter a valid number of minutes.");
  return;
}
  const seconds = document.querySelector('#secs');
  if (!seconds || seconds.value.trim() === "" || isNaN(Number(seconds.value)) || Number(seconds.value) < 0) {
    alert("Please enter a valid number of seconds.");
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
    alert("No timer data found in localStorage.");
    return;
  }

  const duration = timerData.duration * 1000; // Convert to milliseconds
  const repeatCount = timerData.repeatCount;

  let currentRepeat = 0;

  function runTimer() {
    setTimeout(() => {
      alert("Timer is done!");
      currentRepeat++;
      if (currentRepeat < repeatCount) {
        runTimer();
      } else {
        localStorage.removeItem('timerData');
        timerSet = false;
        stopTurtleAnimation(); // Stop the turtle animation when done
      }
    }, duration);
  }

  function showHowMuchTimeLeft() {
    let timeLeftDisplay = document.getElementById('time-left-display');
    const timerData = JSON.parse(localStorage.getItem('timerData'));
    if (!timerData) return;

    function updateDisplay() {
      const now = Date.now();
      const endTime = timerData.endTime;
      const timeLeft = Math.max(0, endTime - now);
      const minutesLeft = Math.floor(timeLeft / 60000);
      const secondsLeft = Math.floor((timeLeft % 60000) / 1000);
      timeLeftDisplay.innerHTML = `Time left: ${minutesLeft} : ${secondsLeft}`;
      if (timeLeft <= 0) {
        clearInterval(intervalId);
        timeLeftDisplay.remove();
      }
    }
    
    const intervalId = setInterval(updateDisplay, 1000);
  }

  runTimer();
  showHowMuchTimeLeft();

}

