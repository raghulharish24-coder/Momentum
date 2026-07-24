var habits = [];
var schedule = [];

var chatWindow = document.getElementById('chat-window');
var chatInput = document.getElementById('chat-input');
var sendBtn = document.getElementById('send-btn');
var habitList = document.getElementById('habit-list');
var scheduleList = document.getElementById('schedule-list');

function addMessage(text, sender) {
  var msg = document.createElement('div');
  msg.className = sender === 'user' ? 'user-message' : 'bot-message';
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function renderDashboard() {
  habitList.innerHTML = '';
  for (var i = 0; i < habits.length; i++) {
    var li = document.createElement('li');
    li.textContent = habits[i].name + ' - streak: ' + habits[i].streak;
    habitList.appendChild(li);
  }

  scheduleList.innerHTML = '';
  for (var j = 0; j < schedule.length; j++) {
    var li2 = document.createElement('li');
    li2.textContent = schedule[j].time + ' - ' + schedule[j].task;
    scheduleList.appendChild(li2);
  }
}

function addHabit(name) {
  habits.push({ name: name, streak: 0, doneToday: false });
  renderDashboard();
  return 'Added habit: ' + name + '. Type done ' + name + ' when you complete it today.';
}

function markHabitDone(name) {
  var habit = null;
  for (var i = 0; i < habits.length; i++) {
    if (habits[i].name.toLowerCase() === name.toLowerCase()) {
      habit = habits[i];
      break;
    }
  }
  if (!habit) return 'I could not find a habit called ' + name + '. Try add habit ' + name + ' first.';
  if (habit.doneToday) return 'You already marked ' + name + ' as done today. Keep it up!';
  habit.doneToday = true;
  habit.streak = habit.streak + 1;
  renderDashboard();
  return 'Nice work! ' + name + ' streak is now ' + habit.streak;
}

function addScheduleItem(time, task) {
  schedule.push({ time: time, task: task });
  schedule.sort(function(a, b) {
    return a.time.localeCompare(b.time);
  });
  renderDashboard();
  return 'Scheduled ' + task + ' at ' + time + '.';
}

function showSchedule() {
  if (schedule.length === 0) return 'You have nothing scheduled yet. Try schedule 6pm gym.';
  var text = 'Todays plan: ';
  for (var i = 0; i < schedule.length; i++) {
    text += schedule[i].time + ' - ' + schedule[i].task + '. ';
  }
  return text;
}

function handleMessage(rawText) {
  var text = rawText.toLowerCase();

  if (text.indexOf('add habit') === 0) {
    var name1 = rawText.substring(10).trim();
    if (name1 === '') return 'What habit do you want to add? Try add habit reading.';
    return addHabit(name1);
  }

  if (text.indexOf('done') === 0) {
    var name2 = rawText.substring(4).trim();
    if (name2 === '') return 'Which habit is done? Try done reading.';
    return markHabitDone(name2);
  }

  if (text.indexOf('schedule') === 0) {
    var rest = rawText.substring(9).trim();
    var parts = rest.split(' ');
    var time = parts[0];
    var task = parts.slice(1).join(' ');
    if (!time || !task) return 'Try the format: schedule 6pm gym.';
    return addScheduleItem(time, task);
  }

  if (text.indexOf('today') !== -1 || text.indexOf('my day') !== -1) {
    return showSchedule();
  }

  return 'I can: add habit name, done name, schedule time task, or ask what is my day.';
}

function sendMessage() {
  var text = chatInput.value.trim();
  if (text === '') return;
  addMessage(text, 'user');
  chatInput.value = '';

  setTimeout(function() {
    var reply = handleMessage(text);
    addMessage(reply, 'bot');
  }, 300);
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') sendMessage();
});