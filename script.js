const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const modal = document.getElementById("modal");
const confirmBtn = document.getElementById("confirmBtn");
const title = document.getElementById("title");
const mainScreen = document.getElementById("mainScreen");
const finalScreen = document.getElementById("finalScreen");
const music = document.getElementById("bgMusic");
const heartsContainer = document.getElementById("hearts-container");

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
    tease.style.top = y - 35 + "px";

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
  modal.classList.add("hidden");

  tease.textContent = "";
  tease.style.display = "none";

  mainScreen.remove();
  finalScreen.classList.remove("hidden");
});