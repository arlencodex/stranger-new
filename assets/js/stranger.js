// ══════════════════════════
// DATA
// ══════════════════════════

const STRANGER_POOL = [
  { name:'ghost_77',  color:'#d47a6a', flag:'🇰🇷', emoji:'👤' },
  { name:'echo_42',   color:'#6ab0d4', flag:'🇺🇸', emoji:'🌊' },
  { name:'void_x',    color:'#9b6ad4', flag:'🇯🇵', emoji:'🌀' },
  { name:'neon_55',   color:'#d46aa8', flag:'🇬🇧', emoji:'💡' },
  { name:'drift_7',   color:'#6ad4b8', flag:'🇩🇪', emoji:'🌿' },
  { name:'pixel_0',   color:'#d4d46a', flag:'🇧🇷', emoji:'🔲' },
  { name:'wave_13',   color:'#6bcf7f', flag:'🇦🇺', emoji:'🌊' },
  { name:'anon_99',   color:'#d4a96a', flag:'🇮🇳', emoji:'🎭' },
  { name:'static_4',  color:'#a06ab4', flag:'🇫🇷', emoji:'📡' },
  { name:'blur_21',   color:'#6ab4d4', flag:'🇸🇬', emoji:'🌫' },
  { name:'spark_66',  color:'#d4c46a', flag:'🇨🇦', emoji:'⚡' },
  { name:'nova_3',    color:'#e87d6e', flag:'🇲🇽', emoji:'🌟' },
];

const STRANGER_REPLIES = [
  ["hey there 👋", "what's up?", "so... who are you?"],
  ["i've been on here for like an hour lol", "no one interesting until now maybe"],
  ["where are you from?", "i'm trying to guess your timezone"],
  ["do you ever feel like you know someone you've never met?", "weird thought i know"],
  ["honestly this is better than talking to people i know 😭"],
  ["so what brings you here?", "boredom? curiosity?"],
  ["i like that nobody knows who i am here", "it's freeing"],
  ["ok real question", "cats or dogs?"],
  ["i was literally about to skip you", "glad i didn't"],
  ["what are you doing at this hour lol"],
  ["you seem different", "most people just say hi and disappear"],
  ["this is oddly calming", "the anonymity thing"],
  ["do you think we'd be friends irl?"],
  ["i've had 3 coffees today and i feel nothing 😂"],
];

// ══════════════════════════
// STATE
// ══════════════════════════

let myName       = '';
let myColor      = '#d4a96a';
let chatCount    = 0;
let currentStranger = null;
let replyIdx     = 0;
let timerInterval = null;
let sessionSecs  = 0;
let replyTimeout = null;
let disconnectTimeout = null;

// ══════════════════════════
// SCREENS
// ══════════════════════════

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goHome() {
  clearTimers();
  showScreen('screen-waiting');
  document.getElementById('start-state').style.display = '';
  document.getElementById('searching-state').classList.remove('active');
}

// ══════════════════════════
// INTEREST CHIPS
// ══════════════════════════

function toggleChip(el) {
  el.classList.toggle('on');
}

// ══════════════════════════
// SEARCH / MATCH
// ══════════════════════════

function startSearch() {
  const nameEl = document.getElementById('my-name');
  myName = nameEl ? (nameEl.value.trim() || 'You') : 'You';

  showScreen('screen-waiting');
  document.getElementById('start-state').style.display = 'none';
  document.getElementById('searching-state').classList.add('active');
  document.getElementById('search-text').textContent = 'Looking for a stranger…';

  updateWaitingCount();

  // simulate match delay 1.5–3.5s
  const delay = 1500 + Math.random() * 2000;
  setTimeout(connectToStranger, delay);
}

function cancelSearch() {
  document.getElementById('start-state').style.display = '';
  document.getElementById('searching-state').classList.remove('active');
}

function connectToStranger() {
  chatCount++;
  document.getElementById('chat-num').textContent = chatCount;

  // pick random stranger (not last one)
  let pool = STRANGER_POOL;
  if (currentStranger) {
    pool = STRANGER_POOL.filter(s => s.name !== currentStranger.name);
  }
  currentStranger = pool[Math.floor(Math.random() * pool.length)];
  replyIdx = 0;

  // set up chat UI
  const av = document.getElementById('s-avatar');
  av.textContent = currentStranger.emoji;
  av.style.background = currentStranger.color;

  document.getElementById('s-name').textContent = currentStranger.name;

  // clear old messages
  document.getElementById('messages').innerHTML = '';
  document.getElementById('skip-overlay').classList.remove('show');

  // enable input
  setInputEnabled(true);

  // start session timer
  startTimer();

  // show screen
  showScreen('screen-chat');

  // add connected system msg
  addSys(`✦ You're now chatting with ${currentStranger.name} ${currentStranger.flag} ✦`, 'connected');

  // stranger says hi after short delay
  setTimeout(() => {
    showTyping();
    const greetings = ["hey 👋", "hi there", "hello stranger", "yo", "hey, what's up?"];
    const greet = greetings[Math.floor(Math.random() * greetings.length)];
    setTimeout(() => {
      removeTyping();
      addStrangerBubble(greet);
      scheduleNextReply();
    }, 900 + Math.random() * 600);
  }, 600);

  // random disconnect (stranger leaves) — 40–120 seconds
  scheduleRandomDisconnect();
}

// ══════════════════════════
// SKIP
// ══════════════════════════

function skipStranger() {
  clearTimers();
  removeTyping();

  // add skipped message
  addSys('You skipped. Finding next stranger…', 'skipped');
  setInputEnabled(false);

  // show overlay
  document.getElementById('skip-overlay').classList.add('show');

  // connect to new stranger after 1.5–2.5s
  const delay = 1500 + Math.random() * 1000;
  setTimeout(connectToStranger, delay);
}

// ══════════════════════════
// SEND MESSAGE
// ══════════════════════════

function sendMsg() {
  const inp = document.getElementById('chat-input');
  const text = inp.value.trim();
  if (!text) return;

  addMyBubble(text);
  inp.value = '';

  // trigger stranger reply
  triggerReply();
}

// ══════════════════════════
// STRANGER REPLIES
// ══════════════════════════

function triggerReply() {
  if (replyTimeout) clearTimeout(replyTimeout);
  const delay = 1200 + Math.random() * 1800;
  replyTimeout = setTimeout(() => {
    showTyping();
    setTimeout(() => {
      removeTyping();
      const set = STRANGER_REPLIES[replyIdx % STRANGER_REPLIES.length];
      replyIdx++;
      // send one or two messages from set
      set.forEach((msg, i) => {
        setTimeout(() => addStrangerBubble(msg), i * 700);
      });
    }, 800 + Math.random() * 700);
  }, delay);
}

function scheduleNextReply() {
  // stranger occasionally says something unprompted
  const delay = 6000 + Math.random() * 10000;
  replyTimeout = setTimeout(() => {
    if (!currentStranger) return;
    showTyping();
    setTimeout(() => {
      removeTyping();
      const extras = [
        "you still there?",
        "so tell me something interesting",
        "i wonder how many people are on here rn",
        "do you do this often?",
        "what's your vibe today",
        "i like the anonymity tbh",
      ];
      addStrangerBubble(extras[Math.floor(Math.random() * extras.length)]);
    }, 900 + Math.random() * 500);
  }, delay);
}

function scheduleRandomDisconnect() {
  const delay = 40000 + Math.random() * 80000; // 40–120s
  disconnectTimeout = setTimeout(() => {
    if (!currentStranger) return;
    strangerDisconnected();
  }, delay);
}

function strangerDisconnected() {
  clearTimers();
  removeTyping();
  setInputEnabled(false);
  addSys(`${currentStranger.name} has disconnected.`, 'skipped');
  currentStranger = null;

  setTimeout(() => showScreen('screen-disc'), 1200);
}

// ══════════════════════════
// DOM BUBBLE HELPERS
// ══════════════════════════

function addMyBubble(text) {
  const row = document.createElement('div');
  row.className = 'msg-row own';
  row.innerHTML = `
    <div class="bubble bubble-own">${escHtml(text)}<small>${getTime()}</small></div>
    <div class="msg-avatar" style="background:${myColor}">${myName.charAt(0).toUpperCase()}</div>
  `;
  document.getElementById('messages').appendChild(row);
  autoScroll();
}

function addStrangerBubble(text) {
  if (!currentStranger) return;
  const row = document.createElement('div');
  row.className = 'msg-row';
  row.innerHTML = `
    <div class="msg-avatar" style="background:${currentStranger.color}">${currentStranger.emoji}</div>
    <div class="bubble bubble-stranger">${escHtml(text)}<small>${getTime()}</small></div>
  `;
  document.getElementById('messages').appendChild(row);
  autoScroll();
}

function addSys(text, type = '') {
  const div = document.createElement('div');
  div.className = 'sys' + (type ? ' ' + type : '');
  div.textContent = text;
  document.getElementById('messages').appendChild(div);
  autoScroll();
}

function showTyping() {
  removeTyping();
  const row = document.createElement('div');
  row.className = 'typing-row';
  row.id = 'typing-row';
  const color = currentStranger ? currentStranger.color : '#888';
  const emoji = currentStranger ? currentStranger.emoji : '?';
  row.innerHTML = `
    <div class="msg-avatar" style="background:${color}">${emoji}</div>
    <div class="typing-bubble">
      <div class="td"></div><div class="td"></div><div class="td"></div>
    </div>
  `;
  document.getElementById('messages').appendChild(row);
  autoScroll();
}

function removeTyping() {
  const t = document.getElementById('typing-row');
  if (t) t.remove();
}

// ══════════════════════════
// SESSION TIMER
// ══════════════════════════

function startTimer() {
  sessionSecs = 0;
  updateTimer();
  timerInterval = setInterval(() => {
    sessionSecs++;
    updateTimer();
  }, 1000);
}

function updateTimer() {
  const m = Math.floor(sessionSecs / 60);
  const s = (sessionSecs % 60).toString().padStart(2, '0');
  document.getElementById('session-timer').textContent = `${m}:${s}`;
}

// ══════════════════════════
// UTILS
// ══════════════════════════

function setInputEnabled(enabled) {
  document.getElementById('chat-input').disabled = !enabled;
  document.getElementById('send-btn').disabled = !enabled;
}

function autoScroll() {
  const wrap = document.getElementById('messages-wrap');
  setTimeout(() => wrap.scrollTo({ top: wrap.scrollHeight, behavior: 'smooth' }), 30);
}

function clearTimers() {
  clearInterval(timerInterval);
  clearTimeout(replyTimeout);
  clearTimeout(disconnectTimeout);
  timerInterval = null;
  replyTimeout = null;
  disconnectTimeout = null;
}

function getTime() {
  const d = new Date();
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function updateWaitingCount() {
  const el = document.getElementById('waiting-count');
  setInterval(() => {
    let n = parseInt(el.textContent.replace(/,/g,''));
    n += Math.floor(Math.random() * 5) - 2;
    n = Math.max(1800, Math.min(4000, n));
    el.textContent = n.toLocaleString();
  }, 4000);
}

// ══════════════════════════
// INITIALIZATION
// ══════════════════════════

function init() {
  document.getElementById('start-btn').addEventListener('click', startSearch);
  document.getElementById('cancel-search-btn').addEventListener('click', cancelSearch);
  document.getElementById('skip-btn').addEventListener('click', skipStranger);
  document.getElementById('send-btn').addEventListener('click', sendMsg);
  document.getElementById('disc-next-btn').addEventListener('click', goHome);
  document.getElementById('disc-home-btn').addEventListener('click', () => window.location.href = 'index.html');
  document.getElementById('nav-home-btn').addEventListener('click', () => window.location.href = 'index.html');

  document.querySelectorAll('.interest-chip').forEach(el => {
    el.addEventListener('click', () => toggleChip(el));
  });

  document.addEventListener('keydown', e => {
    // Esc = skip
    if (e.key === 'Escape') {
      const chatActive = document.getElementById('screen-chat').classList.contains('active');
      if (chatActive) skipStranger();
    }
  });

  // Enter to send
  document.getElementById('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMsg();
    }
  });

  // Enter on name field
  document.getElementById('my-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') startSearch();
  });
}

document.addEventListener('DOMContentLoaded', init);
