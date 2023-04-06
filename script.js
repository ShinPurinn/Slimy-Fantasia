var count = 0;
var countButton = document.getElementById("countButton");
var displayCount = document.getElementById("displayCount");
var resetButton = document.getElementById("resetButton");
var multiplier = 1;
var multiplierLevel = 0;
var slimeBox = document.getElementById("slimeBox");
var clickCounter = 0;
var slimesInBox = slimeBox.getElementsByClassName("slime").length;
var spellButton = document.getElementById("spellButton");
var fairyButton = document.getElementById("fairyButton");
var dryadButton = document.getElementById("dryadButton");
var spellLvl = document.getElementById("spellLvl");
var fairyLvl = document.getElementById("fairyLvl");
var dryadLvl = document.getElementById("dryadLvl");
var multiLvl = document.getElementById("multiLvl");
var multiprice = document.getElementById("multiprice");
var pinguAdded = false;
var mavkaAdded = false;
var upgrade1 = 0;
var upgrade2 = 0;
var upgrade3 = 0;
const bgm = document.getElementById("bgm");

bgm.volume = 0.4;

function getCurrentTime() {
  const now = new Date();
  return {
    hours: now.getHours(),
    minutes: now.getMinutes(),
  };
}

let { hours, minutes } = getCurrentTime();
let rainEndTime = null;
let thunderEndTime = null;
let eventCheckTimeout = null;
let isClockRunning = false;
let gameOverDisplayed = false;

function getGameTime() {
  let paddedHours = hours.toString().padStart(2, '0');
  return `${paddedHours}:${minutes.toString().padStart(2, '0')}`;
}

function changeBackground() {
  const gameTime = getGameTime();
  let backgroundImage;

  if (gameTime >= '06:00' && gameTime <= '06:59') {
    backgroundImage = 'dawn';
  } else if (gameTime >= '07:00' && gameTime <= '08:59') {
    backgroundImage = 'sunrise';
  } else if (gameTime >= '09:00' && gameTime <= '10:59') {
    backgroundImage = 'morning1';
  } else if (gameTime >= '11:00' && gameTime <= '11:59') {
    backgroundImage = 'morning2';
  } else if (gameTime >= '12:00' && gameTime <= '12:59') {
    backgroundImage = 'noon';
  } else if (gameTime >= '13:00' && gameTime <= '16:59') {
    backgroundImage = 'afternoon';
  } else if (gameTime >= '17:00' && gameTime <= '18:59') {
    backgroundImage = 'dusk';
  } else if (gameTime >= '19:00' && gameTime <= '20:59') {
    backgroundImage = 'night1';
  } else if (gameTime >= '21:00' && gameTime <= '23:59') {
    backgroundImage = 'night2';
  } else {
    backgroundImage = 'midnight';
  }

  if (!eventCheckTimeout) {
    const randomEvent = Math.random();
    const isRaining = randomEvent < 0.15;
    const isThunder = randomEvent >= 0.15 && randomEvent < 0.3;

    if (isRaining && !rainEndTime) {
      rainEndTime = gameTime + (0.5 + Math.floor(Math.random() * 1)) * 60;
    }

    if (isThunder && !thunderEndTime) {
      thunderEndTime = gameTime + 15;
    }

    eventCheckTimeout = setTimeout(() => {
      eventCheckTimeout = null;
    }, 36000);
  }

  if (rainEndTime && gameTime >= rainEndTime) {
    rainEndTime = null;
  }

  if (thunderEndTime && gameTime >= thunderEndTime) {
    thunderEndTime = null;
  }

  if (rainEndTime && !thunderEndTime) {
    backgroundImage = 'rain';
  } else if (!rainEndTime && thunderEndTime) {
    backgroundImage = 'thunder';
  } else if (rainEndTime && thunderEndTime) {
    backgroundImage = 'rain2';
  }

  const bodyElement = document.querySelector('body');
  bodyElement.style.backgroundImage = `url(imgs/${backgroundImage}.jpg)`;

  const clockElement = document.querySelector('#clock');
  clockElement.textContent = gameTime;
}

function updateClock() {
  if (isClockRunning) {
    return;
  }

  isClockRunning = true;

  minutes += 1;

  if (minutes >= 60) {
    minutes = 0;
    hours++;
  }

  if (hours >= 24) {
    hours = 0;
  }

  changeBackground();

  const clockElement = document.querySelector('#clock');
  clockElement.textContent = getGameTime();

  setTimeout(function() {
    isClockRunning = false;
    updateClock();
  }, 1000);
}

function stopClock() {
  isClockRunning = false;
}

function startGame() {
	const bodyElement = document.querySelector('body');

	bodyElement.classList.add('game-background');

	// Reset the gameTime
	({ hours, minutes } = getCurrentTime());
  
	changeBackground();
	updateClock(); // Call the updateClock function here
}

updateClock();

countButton.onclick = function() {
  count += multiplier;
  displayCount.innerHTML = count;
  clickCounter++;
  
  if (clickCounter % 10 === 0) {
    addRandomSlime();
  }
};

resetButton.onclick = function() {
  count = 0;
  displayCount.innerHTML = count;

  while (slimeBox.firstChild) {
    slimeBox.removeChild(slimeBox.firstChild);
  }

  var centeredSlime = document.createElement("img");
  centeredSlime.src = "imgs/a1.gif";
  centeredSlime.classList.add("slime");
  centeredSlime.style.position = "absolute";
  centeredSlime.style.top = "50%";
  centeredSlime.style.left = "50%";
  centeredSlime.style.transform = "translate(-50%, -50%)";
  slimeBox.appendChild(centeredSlime);
};

setInterval(function() {
  count += upgrade1 * 1 + upgrade2 * 10 + upgrade3 * 1000;
  displayCount.innerHTML = count;
}, 1000);

spellButton.onclick = function() {
  if (count >= 150) {
    upgrade1++;
    count -= 150;
    spellLvl.innerHTML = upgrade1;
  } else {
    showNotification("Not enough slimes to buy this upgrade!");
  }
};

fairyButton.onclick = function() {
  if (count >= 1300) {
    upgrade2++;
    count -= 1300;
    fairyLvl.innerHTML = upgrade2;
    
    if (!pinguAdded) {
      var pingu = document.createElement("img");
      pingu.src = "imgs/pingu.gif";
      pingu.style.position = "absolute";
      pingu.style.right = "20%";
      pingu.style.top = "45%";
      document.body.appendChild(pingu);
      pinguAdded = true;
    }
  } else {
    showNotification("Not enough slimes to buy this upgrade!");
  }
};

dryadButton.onclick = function() {
  if (count >= 10000) {
    upgrade3++;
    count -= 10000;
    dryadLvl.innerHTML = upgrade3;

    if (!mavkaAdded) {
      var mavka = document.createElement("img");
      mavka.src = "imgs/mavka.gif";
      mavka.style.position = "absolute";
      mavka.style.right = "20%";
      mavka.style.top = "60%";
      document.body.appendChild(mavka);
      mavkaAdded = true;
    }
  } else {
    showNotification("Not enough slimes to buy this upgrade!");
  }
};

function addRandomSlime() {
  var slimeGifs = [
    "imgs/a1.gif",
    "imgs/a2.gif",
    "imgs/a3.gif",
    "imgs/a4.gif",
    "imgs/a5.gif",
    "imgs/a6.gif",
    "imgs/a7.gif",
    "imgs/a8.gif",
    "imgs/a9.gif",
    "imgs/a10.gif",
    "imgs/a11.gif",
    "imgs/a12.gif",
    "imgs/a13.gif",
    "imgs/a14.gif",
    "imgs/a15.gif",
    "imgs/a16.gif"
  ];
  
  if (slimesInBox < 100) {
  var img = document.createElement("img");
  img.src = slimeGifs[Math.floor(Math.random() * slimeGifs.length)];
  img.classList.add("slime");
  img.style.top = Math.random() * (slimeBox.clientHeight - img.height) + "px";
  img.style.left = Math.random() * (slimeBox.clientWidth - img.width) + "px";
  slimeBox.appendChild(img);
  }
}

function toggleBGM() {
  const bgm = document.getElementById("bgm");
  if (bgm.paused) {
    bgm.play();
  } else {
    bgm.pause();
  }
}

var multiplierButton = document.getElementById("multiplierButton");

multiplierButton.onclick = function() {
  if (count >= 250 * (multiplierLevel + 1)) {
    count -= 250 * (multiplierLevel + 1);
    multiplierLevel++;
    multiplier = 2 * multiplierLevel;
    multiprice.innerHTML = 250 * (multiplierLevel + 1);
    multiLvl.innerHTML = multiplierLevel;
  } else {
    showNotification("Not enough slimes to buy this upgrade!");
  }
};

function showNotification(message) {
  var notification = document.createElement("div");
  notification.innerHTML = message;
  notification.style.position = "absolute";
  notification.style.top = "35%";
  notification.style.left = "40%";
  notification.style.backgroundColor = "#580838";
  notification.style.color = "white";
  notification.style.padding = "10px";
  notification.style.borderRadius = "10px";
  document.body.appendChild(notification);

  setTimeout(function() {
    document.body.removeChild(notification);
  }, 3000);
}