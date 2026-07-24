// ---- Data (in-memory for now) ----
let habits = [];
let schedule = [];

// ---- DOM references ----
const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const habitList = document.getElementById('habit-list');
const scheduleList = document.getElementById('schedule-list');

// ---- Chat helpers ----
function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = sender === 'user' ? 'user-message' : 'bot-message';
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// ---- Render dashboard ----
function renderDashboard() {
  habitList.innerHTML = '';
  habits.forEach(h => {
    const li = document.createElement('li');
    li.innerHTML = ${h.name} <span class="streak-badge">🔥 ${h.streak}</span>;
    habitList.appendChild(li);
  });

  scheduleList.innerHTML = '';
  schedule.forEach(s => {
    const li = document.createElement('li');
    li.textContent = ${s.time} — ${s.task};
    scheduleList.appendChild(li);
  });
}

// ---- Core actions ----
function addHabit(name) {
  habits.push({ name, streak: 0, doneToday: false });
  renderDashboard();
  return Added habit: "${name}". Type "done ${name}" when you complete it today.;
}

function markHabitDone(name) {
  const habit = habits.find(h => h.name.toLowerCase() === name.toLowerCase());
  if (!habit) return I couldn't find a habit called "${name}". Try "add habit ${name}" first.;
  if (habit.doneToday) return You already marked "${name}" as done today. Keep it up!;
  habit.doneToday = true;
  habit.streak += 1;
  renderDashboard();
  return Nice work! "${name}" streak is now ${habit.streak} 🔥;
}

function addScheduleItem(time, task) {
  schedule.push({ time, task });
  schedule.sort((a, b) => a.time.localeCompare(b.time));
  renderDashboard();
  return Scheduled "${task}" at ${time}.;
}

function showSchedule() {
  if (schedule.length === 0) return "You have nothing scheduled yet. Try 'schedule 6pm gym'.";
  return "Today's plan:\n" + schedule.map(s => ${s.time} — ${s.task}).join('\n');
}

// ---- Message parsing (the "chatbot" brain) ----
function handleMessage(rawText) {
  const text = rawText.toLowerCase().trim();

  if (text.startsWith('add habit')) {
    const name = rawText.slice(rawText.toLowerCase().indexOf('add habit') + 10).trim();
    if (!name) return "What habit do you want to add? Try 'add habit reading'.";
    return addHabit(name);
  }

  if (text.startsWith('done')) {
    const name = rawText.slice(4).trim();
    if (!name) return "Which habit is done? Try 'done reading'.";
    return markHabitDone(name);
  }

  if (text.startsWith('schedule')) {
    // expects: schedule 6pm gym
    const rest = rawText.slice(rawText.toLowerCase().indexOf('schedule') + 9).trim();
    const parts = rest.split(' ');
    const time = parts[0];
    const task = parts.slice(1).join(' ');
    if (!time || !task) return "Try the format: 'schedule 6pm gym'.";
    return addScheduleItem(time, task);
  }

  if (text.includes('today') || text.includes('my day')) {
    return showSchedule();
  }

  return "I can: add habit [name], done [name], schedule [time] [task], or ask 'what's my day look like'.";
}

// ---- Event listeners ----
function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  chatInput.value = '';

  setTimeout(() => {
    const reply = handleMessage(text);
    addMessage(reply, 'bot');
  }, 300);
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

console.log("App loaded");
