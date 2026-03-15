// ══════════════════════════
// CONFIG & CONSTANTS
// ══════════════════════════

const AVATAR_COLORS = [
  '#d4a96a', '#6bcf7f', '#6ab0d4',
  '#d46aa8', '#9b6ad4', '#6ad4b8',
  '#d4d46a', '#d47a6a'
];

const EMOJIS = [
  '😊','😂','❤️','🔥','👀','😮',
  '💀','🙏','✨','🤔','😭','💯',
  '🌍','👋','🎉','😎'
];

const COUNTRIES = [
  { flag:'🇺🇸', city:'New York'      },
  { flag:'🇬🇧', city:'London'        },
  { flag:'🇯🇵', city:'Tokyo'         },
  { flag:'🇩🇪', city:'Berlin'        },
  { flag:'🇧🇷', city:'São Paulo'     },
  { flag:'🇮🇳', city:'Mumbai'        },
  { flag:'🇫🇷', city:'Paris'         },
  { flag:'🇨🇦', city:'Toronto'       },
  { flag:'🇦🇺', city:'Sydney'        },
  { flag:'🇰🇷', city:'Seoul'         },
  { flag:'🇲🇽', city:'Mexico City'   },
  { flag:'🇿🇦', city:'Cape Town'     },
  { flag:'🇸🇬', city:'Singapore'     },
  { flag:'🇦🇷', city:'Buenos Aires'  },
  { flag:'🇳🇬', city:'Lagos'         },
  { flag:'🇷🇺', city:'Moscow'        },
  { flag:'🇮🇩', city:'Jakarta'       },
  { flag:'🇪🇬', city:'Cairo'         },
  { flag:'🇹🇷', city:'Istanbul'      },
  { flag:'🇵🇭', city:'Manila'        },
  { flag:'🇺🇦', city:'Kyiv'          },
  { flag:'🇨🇱', city:'Santiago'      },
  { flag:'🇵🇰', city:'Karachi'       },
  { flag:'🇸🇪', city:'Stockholm'     },
];

const STRANGER_NAMES = [
  'ghost_77','echo_42','void_x','anon_99',
  'wave_13','pixel_0','drift_7','neon_55'
];

const STRANGER_MSGS = [
  { name:'ghost_77', color:'#d47a6a', flag:'🇰🇷', text:'hello from seoul 🌃'              },
  { name:'wave_13',  color:'#6ad4b8', flag:'🇦🇺', text:'gday from sydney ☀️'              },
  { name:'anon_99',  color:'#9b6ad4', flag:'🇮🇳', text:'this wall is different'           },
  { name:'echo_42',  color:'#6ab0d4', flag:'🇺🇸', text:'anyone else just vibe here?'      },
  { name:'void_x',   color:'#d46aa8', flag:'🇫🇷', text:'bonsoir 🌙'                       },
  { name:'drift_7',  color:'#6bcf7f', flag:'🇧🇷', text:'olá mundo 🌎'                     },
  { name:'pixel_0',  color:'#d4d46a', flag:'🇸🇬', text:'the wall never sleeps'            },
  { name:'neon_55',  color:'#6ab0d4', flag:'🇩🇪', text:'guten nacht everyone'             },
  { name:'ghost_77', color:'#d47a6a', flag:'🇯🇵', text:'still here 👀'                    },
  { name:'anon_99',  color:'#9b6ad4', flag:'🇿🇦', text:'cape town checking in 🌍'         },
  { name:'wave_13',  color:'#6ad4b8', flag:'🇨🇦', text:'canada represent 🍁'              },
  { name:'pixel_0',  color:'#d4d46a', flag:'🇲🇽', text:'hola a todos 👋'                  },
  { name:'echo_42',  color:'#6ab0d4', flag:'🇬🇧', text:'anyone from london?'              },
  { name:'neon_55',  color:'#6ab0d4', flag:'🇮🇩', text:'salam from jakarta 🌴'            },
  { name:'void_x',   color:'#d46aa8', flag:'🇳🇬', text:'lagos in the wall 🔥'             },
  { name:'drift_7',  color:'#6bcf7f', flag:'🇹🇷', text:'merhaba from istanbul 🌉'         },
];

const SEED_MESSAGES = [
  { name:'echo_42',  color:'#6ab0d4', flag:'🇺🇸', text:'gm world 🌅',                          time:'8m ago' },
  { name:'void_x',   color:'#9b6ad4', flag:'🇯🇵', text:'anyone else awake rn?',                time:'6m ago' },
  { name:'pixel_0',  color:'#6bcf7f', flag:'🇧🇷', text:'this wall is oddly comforting',        time:'4m ago' },
  { name:'neon_55',  color:'#d46aa8', flag:'🇬🇧', text:'hello from london 👋',                 time:'3m ago' },
  { name:'drift_7',  color:'#6ad4b8', flag:'🇩🇪', text:'i feel less alone here',               time:'1m ago' },
];


// ══════════════════════════
// STATE
// ══════════════════════════

let myName        = '';
let myColor       = AVATAR_COLORS[0];
let myFlag        = '🌍';
let msgCount      = 0;
let selectedColor = 0;
let emojiOpen     = false;
let strangerIdx   = 0;
let seeded        = false;


// ══════════════════════════
// DOM REFERENCES
// ══════════════════════════

const messagesEl  = document.getElementById('messages');
const messagesWrap = document.getElementById('messages-wrap');
const msgInput    = document.getElementById('msg-input');
const charLeftEl  = document.getElementById('char-left');
const onlineEl    = document.getElementById('online-count');
const msgCountEl  = document.getElementById('msg-count');
const scrollBtn   = document.getElementById('scroll-btn');
const emojiBarEl  = document.getElementById('emoji-bar');
const colorRowEl  = document.getElementById('color-row');
const tickerEl    = document.getElementById('ticker');


// ══════════════════════════
// INIT — BUILD UI PIECES
// ══════════════════════════

function init() {
  buildColorSwatches();
  buildEmojiBar();
  buildTicker();
  bindInputEvents();
  bindScrollEvents();
}


// ── Color swatches in modal ──
function buildColorSwatches() {
  AVATAR_COLORS.forEach((color, i) => {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch' + (i === 0 ? ' selected' : '');
    swatch.style.background = color;
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch')
              .forEach(s => s.classList.remove('selected'));
      swatch.classList.add('selected');
      selectedColor = i;
      myColor = color;
    });
    colorRowEl.appendChild(swatch);
  });
}


// ── Emoji buttons ──
function buildEmojiBar() {
  EMOJIS.forEach(em => {
    const btn = document.createElement('button');
    btn.className = 'emoji-btn';
    btn.textContent = em;
    btn.addEventListener('click', () => {
      msgInput.value += em;
      msgInput.focus();
      updateCharCount();
    });
    emojiBarEl.appendChild(btn);
  });
}


// ── World ticker ──
function buildTicker() {
  // double the list for seamless infinite scroll
  [...COUNTRIES, ...COUNTRIES].forEach(c => {
    const item = document.createElement('div');
    item.className = 'ticker-item';
    item.innerHTML = `<span>${c.flag}</span>${c.city}`;
    tickerEl.appendChild(item);
  });
}


// ══════════════════════════
// JOIN
// ══════════════════════════

function joinWall() {
  const nameInput = document.getElementById('name-input');
  const val = nameInput.value.trim();

  // use typed name or pick a random stranger name
  myName  = val || STRANGER_NAMES[Math.floor(Math.random() * STRANGER_NAMES.length)];
  myColor = AVATAR_COLORS[selectedColor];
  myFlag  = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)].flag;

  // hide modal
  document.getElementById('modal').style.display = 'none';
  msgInput.focus();

  // stagger: join message → seed → simulations
  setTimeout(() => {
    addJoinMsg(`${myName} joined the wall`);
    if (!seeded) {
      seeded = true;
      seedWall();
    }
  }, 300);

  startOnlineFluctuation();
  startStrangerActivity();
}


// ══════════════════════════
// SEED MESSAGES
// ══════════════════════════

function seedWall() {
  const es = document.getElementById('empty-state');
  if (es) es.remove();

  addDateDivider('Today');

  SEED_MESSAGES.forEach((m, i) => {
    setTimeout(() => {
      addBubble({
        name:      m.name,
        color:     m.color,
        flag:      m.flag,
        text:      m.text,
        own:       false,
        timeLabel: m.time,
      });
    }, i * 150);
  });
}


// ══════════════════════════
// DOM HELPERS
// ══════════════════════════

function addDateDivider(label) {
  const div = document.createElement('div');
  div.className = 'date-divider';
  div.innerHTML = `<span>${label}</span>`;
  messagesEl.appendChild(div);
}

function addJoinMsg(text) {
  const div = document.createElement('div');
  div.className = 'join-msg';
  div.textContent = `✦ ${text} ✦`;
  messagesEl.appendChild(div);
}

// ── Core bubble builder ──
function addBubble({ name, color, flag, text, own, timeLabel }) {
  // remove empty state if still showing
  const es = document.getElementById('empty-state');
  if (es) es.remove();

  const time    = timeLabel || getTime();
  const initial = name.charAt(0).toUpperCase();

  const row = document.createElement('div');
  row.className = 'msg-row' + (own ? ' own' : '');

  row.innerHTML = `
    <div class="avatar" style="background:${color}">${initial}</div>
    <div class="msg-col">
      <div class="msg-meta">
        <span class="sender-name" style="color:${color}">${own ? 'You' : name}</span>
        <span class="flag">${flag}</span>
      </div>
      <div class="bubble ${own ? 'bubble-own' : 'bubble-other'}">${escHtml(text)}</div>
      <div class="msg-time">${time}</div>
    </div>
  `;

  messagesEl.appendChild(row);
  msgCount++;
  updateMsgCount();
  autoScroll();
}


// ══════════════════════════
// SEND MESSAGE
// ══════════════════════════

function sendMsg() {
  const text = msgInput.value.trim();
  if (!text || !myName) return;

  addBubble({ name: myName, color: myColor, flag: myFlag, text, own: true });

  // reset input
  msgInput.value = '';
  charLeftEl.textContent = '300';
  charLeftEl.classList.remove('warn');
  msgInput.focus();
}


// ══════════════════════════
// INPUT EVENT BINDING
// ══════════════════════════

function bindInputEvents() {
  // character counter
  msgInput.addEventListener('input', updateCharCount);

  // enter to send
  msgInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMsg();
    }
  });

  // enter in modal
  document.getElementById('name-input')
          .addEventListener('keydown', e => {
            if (e.key === 'Enter') joinWall();
          });
}

function updateCharCount() {
  const remaining = 300 - msgInput.value.length;
  charLeftEl.textContent = remaining;
  charLeftEl.classList.toggle('warn', remaining < 30);
}


// ══════════════════════════
// EMOJI TOGGLE
// ══════════════════════════

function toggleEmoji() {
  emojiOpen = !emojiOpen;
  emojiBarEl.classList.toggle('open', emojiOpen);
}


// ══════════════════════════
// SCROLL LOGIC
// ══════════════════════════

function bindScrollEvents() {
  messagesWrap.addEventListener('scroll', () => {
    const atBottom =
      messagesWrap.scrollHeight - messagesWrap.scrollTop - messagesWrap.clientHeight < 80;
    scrollBtn.classList.toggle('visible', !atBottom);
  });
}

// called after every new message — only scrolls if already near bottom
function autoScroll() {
  const atBottom =
    messagesWrap.scrollHeight - messagesWrap.scrollTop - messagesWrap.clientHeight < 120;
  if (atBottom) {
    scrollToBottom();
  } else {
    scrollBtn.classList.add('visible');
  }
}

function scrollToBottom() {
  messagesWrap.scrollTo({ top: messagesWrap.scrollHeight, behavior: 'smooth' });
  scrollBtn.classList.remove('visible');
}


// ══════════════════════════
// CLEAR WALL
// ══════════════════════════

function clearAll() {
  if (!confirm('Clear all messages from the wall?')) return;

  messagesEl.innerHTML = `
    <div class="empty-state" id="empty-state">
      <div class="empty-icon">🌍</div>
      <h3>The wall is empty.</h3>
      <p>Start a new conversation.</p>
    </div>
  `;

  msgCount = 0;
  updateMsgCount();
}


// ══════════════════════════
// ONLINE COUNTER SIMULATION
// ══════════════════════════

function startOnlineFluctuation() {
  setInterval(() => {
    let n = parseInt(onlineEl.textContent.replace(/,/g, ''));
    n += Math.floor(Math.random() * 7) - 3;
    n = Math.max(900, Math.min(2000, n));
    onlineEl.textContent = n.toLocaleString();
  }, 4000);
}


// ══════════════════════════
// STRANGER ACTIVITY
// ══════════════════════════

function startStrangerActivity() {
  function scheduleNext() {
    const delay = 8000 + Math.random() * 12000; // 8–20 seconds

    setTimeout(() => {
      if (!myName) { scheduleNext(); return; } // wait until joined

      const m = STRANGER_MSGS[strangerIdx % STRANGER_MSGS.length];
      strangerIdx++;

      showTyping(m.color);

      setTimeout(() => {
        removeTyping();
        addBubble({ ...m, own: false });
        scheduleNext(); // chain the next one
      }, 1400 + Math.random() * 800);

    }, delay);
  }

  scheduleNext();
}

function showTyping(color) {
  const row = document.createElement('div');
  row.className = 'typing-row';
  row.id = 'typing-row';
  row.innerHTML = `
    <div class="avatar" style="background:${color}">?</div>
    <div class="typing-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  messagesEl.appendChild(row);
  autoScroll();
}

function removeTyping() {
  const t = document.getElementById('typing-row');
  if (t) t.remove();
}


// ══════════════════════════
// UTILITY HELPERS
// ══════════════════════════

// current time as HH:MM
function getTime() {
  const d = new Date();
  return d.getHours().toString().padStart(2, '0')
       + ':'
       + d.getMinutes().toString().padStart(2, '0');
}

// update the message count pill in nav
function updateMsgCount() {
  msgCountEl.textContent = msgCount;
}

// basic HTML escape to prevent XSS

function escHtml(str) {
  return str.replace(/&/g,'&amp;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;');
}

function home() {
  window.location.href = "index.html";
}

// ══════════════════════════
// BOOT
// ══════════════════════════
document.getElementById("join-btn").addEventListener("click", joinWall);
document.getElementById("send-btn").addEventListener("click", sendMsg);
document.getElementById("emoji-toggle").addEventListener("click", toggleEmoji);
document.getElementById("scroll-btn").addEventListener("click", scrollToBottom);
document.getElementById("clear-btn").addEventListener("click", clearAll);
document.getElementById("home-btn").addEventListener("click", home);
init();