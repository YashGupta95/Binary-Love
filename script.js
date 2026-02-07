const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const modal = document.getElementById("modal");
const confirmBtn = document.getElementById("confirmBtn");
const title = document.getElementById("title");
const mainScreen = document.getElementById("mainScreen");
const finalScreen = document.getElementById("finalScreen");
const music = document.getElementById("bgMusic");
const heartsContainer = document.getElementById("hearts-container");
const finalTitle = finalScreen.querySelector("h1");
const finalText = finalScreen.querySelector("p");

const finalTitleText = finalTitle.innerHTML;
const finalTextContent = finalText.innerHTML;

/* HEARTS */
const heartEmojis = ["💖","💕","💘","💓","💗"];
for (let i = 0; i < 25; i++) {
  const h = document.createElement("div");
  h.className = "heart";
  h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 20 + Math.random() * 20 + "px";
  h.style.animationDuration = 10 + Math.random() * 10 + "s";
  heartsContainer.appendChild(h);
}

/* TEASE TEXT */
const tease = document.createElement("div");
tease.className = "tease";
tease.style.display = "none";
document.body.appendChild(tease);

const messages = [
  "Not happening, baby! 😈",
  "Almost clicked 'Yes' 👀",
  "Just click it already! 😘",
  "This button is shy 🙈",
  "You know you want to.. 😜",
  "Playing hard to get, girl? 😌",
  "Nice try, hot stuff! 😉",
  "I promise I'm fun! 😎",
  "Nice reflexes. Wrong choice 😄",
  "That button moves faster than your excuses 😏",
  "Some stories don't have a 'No' ending 💞",
  "You're closer than you think 🥰",
  "Love called. It says 'try again' ☺️",
  "Even your fingers know the truth 💕",
  "Resistance is… adorable 😌",
  "You're smiling, I know it 😌",
  "One click away from destiny 😉",
  "Don't fight the butterflies 🦋",
  "Oops… missed it by a heartbeat 💓"
];

/* NO BUTTON — SAFE POSITIONING */
noBtn.addEventListener("click", () => {
  const titleRect = title.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();

  // Protected zone = title + Yes button area
  const protectedArea = {
    left: Math.min(titleRect.left, yesRect.left) - 20,
    right: Math.max(titleRect.right, yesRect.right) + 20,
    top: Math.min(titleRect.top, yesRect.top) - 20,
    bottom: Math.max(titleRect.bottom, yesRect.bottom) + 20
  };

  let x, y, safe = false;

  while (!safe) {
    x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    y = Math.random() * (window.innerHeight - noBtn.offsetHeight);

    const overlapsProtectedArea =
      x < protectedArea.right &&
      x + noBtn.offsetWidth > protectedArea.left &&
      y < protectedArea.bottom &&
      y + noBtn.offsetHeight > protectedArea.top;

    if (!overlapsProtectedArea) safe = true;
  }

  noBtn.style.position = "fixed";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  tease.textContent = messages[Math.floor(Math.random() * messages.length)];
  tease.style.display = "block";
  tease.style.visibility = "hidden"; // allow measurement without flashing

  // Force browser layout
  requestAnimationFrame(() => {
    const teaseWidth = tease.offsetWidth;
    const btnCenterX = x + noBtn.offsetWidth / 2;

    // Center above No button
    let teaseLeft = btnCenterX - teaseWidth / 2;

    // Clamp inside viewport (8px padding)
    const minLeft = 8;
    const maxLeft = window.innerWidth - teaseWidth - 8;
    teaseLeft = Math.max(minLeft, Math.min(teaseLeft, maxLeft));

    tease.style.left = teaseLeft + "px";

    const teaseHeight = tease.offsetHeight;
    // Preferred position: above button
    let teaseTop = y - teaseHeight - 10;

    // Check if above is unsafe
    const overlapsProtectedArea =
      teaseTop < protectedArea.bottom &&
      teaseTop + teaseHeight > protectedArea.top;

    const outOfViewportTop = teaseTop < 8;

    // If unsafe above → place below button
    if (overlapsProtectedArea || outOfViewportTop) {
      teaseTop = y + noBtn.offsetHeight + 10;
    }

    tease.style.top = teaseTop + "px";

    tease.style.visibility = "visible";
  });
});

/* YES BUTTON */
yesBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
  music.play().catch(() => {});
});

/* CONFIRM RESERVATION */
confirmBtn.addEventListener("click", () => {
  heartBurstEffect(confirmBtn);
  modal.classList.add("hidden");

  tease.textContent = "";
  tease.style.display = "none";

  mainScreen.remove();
  finalScreen.classList.remove("hidden");

  // Clear before typing
  finalTitle.innerHTML = "";
  finalText.innerHTML = "";

  // Sequential typing
  typeWriter(finalTitle, finalTitleText, 90, () => {
    typeWriter(finalText, finalTextContent, 60);
  });
});

function heartBurstEffect(container) {
  const heartCount = 12;
  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.classList.add("heart-burst");
    heart.textContent = "💖";

    // random direction
    const dx = (Math.random() - 0.5) * 160 + "px";
    const dy = -Math.random() * 160 + "px";
    const rot = (Math.random() * 90 - 45) + "deg";

    heart.style.setProperty("--dx", dx);
    heart.style.setProperty("--dy", dy);
    heart.style.setProperty("--rot", rot);

    // position at center of button
    const rect = container.getBoundingClientRect();
    const heartSize = 85; // must match CSS font-size
    heart.style.left = rect.left + rect.width / 2 - heartSize / 2 + "px";
    heart.style.top = rect.top + rect.height / 2 - heartSize / 2 + "px";

    document.body.appendChild(heart);

    // auto remove
    setTimeout(() => {
      document.body.removeChild(heart);
    }, 1600);
  }
}

function typeWriter(element, content, speed = 70, onComplete) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (content.substring(i, i + 4) === "<br>") {
      element.innerHTML += "<br>";
      i += 4;
    } else if (content.substring(i, i + 5) === "<br/>") {
      element.innerHTML += "<br/>";
      i += 5;
    } else {
      element.innerHTML += content.charAt(i);
      i++;
    }

    if (i < content.length) {
      setTimeout(type, speed);
    } else if (typeof onComplete === "function") {
      onComplete();
    }
  }

  type();
}