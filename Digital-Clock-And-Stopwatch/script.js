document.addEventListener("DOMContentLoaded", () => {
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const ampmEl = document.getElementById("ampm");
  const dayEl = document.getElementById("day");
  const dateEl = document.getElementById("date");

  const swHoursEl = document.getElementById("swHours");
  const swMinutesEl = document.getElementById("swMinutes");
  const swSecondsEl = document.getElementById("swSeconds");
  const swMillisecondsEl = document.getElementById("swMilliseconds");

  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.querySelector(".theme-icon");

  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");
  const lapBtn = document.getElementById("lapBtn");
  const clearLapsBtn = document.getElementById("clearLapsBtn");
  const lapList = document.getElementById("lapList");

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let stopwatchInterval = null;
  let stopwatchStartTime = 0;
  let elapsedTime = 0;
  let isRunning = false;
  let lapRecords = [];

  function formatTime(value) {
    return String(value).padStart(2, "0");
  }

  function formatMilliseconds(value) {
    return String(value).padStart(3, "0");
  }

  function createLapTimeString(time) {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = time % 1000;

    return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}:${formatMilliseconds(milliseconds)}`;
  }

  function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const dayName = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    hoursEl.textContent = formatTime(hours);
    minutesEl.textContent = formatTime(minutes);
    secondsEl.textContent = formatTime(seconds);
    ampmEl.textContent = ampm;

    dayEl.textContent = dayName;
    dateEl.textContent = `${date} ${month} ${year}`;
  }

  function applyTheme(theme) {
    if (theme === "light") {
      document.body.classList.add("light-theme");
      themeIcon.textContent = "☀️";
    } else {
      document.body.classList.remove("light-theme");
      themeIcon.textContent = "🌙";
    }
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem("clockTheme");
    applyTheme(savedTheme || "dark");
  }

  function toggleTheme() {
    const isLight = document.body.classList.contains("light-theme");
    const newTheme = isLight ? "dark" : "light";

    applyTheme(newTheme);
    localStorage.setItem("clockTheme", newTheme);
  }

  function updateStopwatchDisplay(time) {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = time % 1000;

    swHoursEl.textContent = formatTime(hours);
    swMinutesEl.textContent = formatTime(minutes);
    swSecondsEl.textContent = formatTime(seconds);
    swMillisecondsEl.textContent = formatMilliseconds(milliseconds);
  }

  function updateButtonStates() {
    startBtn.disabled = isRunning;
    pauseBtn.disabled = !isRunning;
    lapBtn.disabled = elapsedTime === 0;
    clearLapsBtn.disabled = lapRecords.length === 0;

    startBtn.style.opacity = isRunning ? "0.6" : "1";
    pauseBtn.style.opacity = !isRunning ? "0.6" : "1";
    lapBtn.style.opacity = elapsedTime === 0 ? "0.6" : "1";
    clearLapsBtn.style.opacity = lapRecords.length === 0 ? "0.6" : "1";
  }

  function runStopwatch() {
    elapsedTime = Date.now() - stopwatchStartTime;
    updateStopwatchDisplay(elapsedTime);
    updateButtonStates();
  }

  function startStopwatch() {
    if (isRunning) return;

    stopwatchStartTime = Date.now() - elapsedTime;
    stopwatchInterval = setInterval(runStopwatch, 10);
    isRunning = true;

    updateButtonStates();
  }

  function pauseStopwatch() {
    if (!isRunning) return;

    clearInterval(stopwatchInterval);
    isRunning = false;

    updateButtonStates();
  }

  function resetStopwatch() {
    clearInterval(stopwatchInterval);

    stopwatchInterval = null;
    stopwatchStartTime = 0;
    elapsedTime = 0;
    isRunning = false;
    lapRecords = [];

    updateStopwatchDisplay(0);
    renderLaps();
    updateButtonStates();
  }

  function renderLaps() {
    if (lapRecords.length === 0) {
      lapList.innerHTML = `
        <li class="empty-lap-message">
          No lap records yet
        </li>
      `;
      return;
    }

    lapList.innerHTML = "";

    [...lapRecords].reverse().forEach((lap, index) => {
      const lapItem = document.createElement("li");
      lapItem.className = "lap-item";

      lapItem.innerHTML = `
          <span class="lap-number">Lap ${lapRecords.length - index}</span>
          <span class="lap-time">${lap}</span>
        `;

      lapList.appendChild(lapItem);
    });
  }

  function addLap() {
    if (elapsedTime === 0) return;

    lapRecords.push(createLapTimeString(elapsedTime));
    renderLaps();
    updateButtonStates();
  }

  function clearLaps() {
    lapRecords = [];
    renderLaps();
    updateButtonStates();
  }

  function handleKeyboardShortcuts(event) {
    const key = event.key.toLowerCase();

    if (key === "s") startStopwatch();
    if (key === "p") pauseStopwatch();
    if (key === "r") resetStopwatch();
    if (key === "l") addLap();
    if (key === "t") toggleTheme();
  }

  themeToggle.addEventListener("click", toggleTheme);
  startBtn.addEventListener("click", startStopwatch);
  pauseBtn.addEventListener("click", pauseStopwatch);
  resetBtn.addEventListener("click", resetStopwatch);
  lapBtn.addEventListener("click", addLap);
  clearLapsBtn.addEventListener("click", clearLaps);
  document.addEventListener("keydown", handleKeyboardShortcuts);

  loadTheme();
  updateClock();
  updateStopwatchDisplay(0);
  renderLaps();
  updateButtonStates();

  setInterval(updateClock, 1000);
});
