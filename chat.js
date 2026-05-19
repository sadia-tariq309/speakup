// =============================================
// SPEAKUP — AI CONVERSATION ENGINE (chat.js)
// Emma: Your AI English Coach
// =============================================

const SCENARIOS = {
  cafe: {
    id: 'cafe', name: 'Coffee Shop', cn: '咖啡厅点单', emoji: '☕',
    opening: `Hi! Welcome to Blue Bottle Coffee. What can I get for you today? 😊`,
    systemPrompt: `You are Emma, a warm encouraging English coach helping a Chinese learner practice English.
SCENARIO: You are a barista at a coffee shop. The user is the customer.
RULES:
1. Have a natural realistic conversation as a barista. Keep responses SHORT (1-3 sentences).
2. After EVERY user message, at the very end add a JSON feedback block on its own line EXACTLY like:
{"ok":true,"errors":[],"tip":""}
OR if issues found:
{"ok":false,"errors":[{"wrong":"their exact words","fix":"the correction","explain":"中文解释原因"}],"tip":"一个实用英语贴士（中文）"}
3. NEVER break character. Correct only through the JSON.
4. Be encouraging and natural. Ask follow-up questions a real barista would ask.
5. Leave tip as "" if nothing useful to add.`
  },
  job: {
    id: 'job', name: 'Job Interview', cn: '工作面试', emoji: '💼',
    opening: `Good morning! Please have a seat. I'm Sarah, the hiring manager. Thanks for coming in — could you start by telling me a bit about yourself?`,
    systemPrompt: `You are Emma, acting as interviewer Sarah at a tech company. User is a Chinese candidate practicing English interviews.
RULES:
1. Ask ONE question at a time. Keep responses SHORT and professional.
2. After EVERY user message, add JSON feedback on its own line:
{"ok":true,"errors":[],"tip":""}
OR: {"ok":false,"errors":[{"wrong":"mistake","fix":"correction","explain":"中文说明"}],"tip":"面试英语技巧（中文）"}
3. Ask real interview questions. If answer is weak, encourage: "That's a good start — can you give a specific example?"
4. NEVER break character.`
  },
  travel: {
    id: 'travel', name: 'Asking Directions', cn: '旅行问路', emoji: '✈️',
    opening: `Excuse me! You look a bit lost — can I help you find somewhere? I know this neighborhood really well! 🗺️`,
    systemPrompt: `You are Emma, a friendly local helping a Chinese tourist navigate in London.
RULES:
1. Give realistic directions. Keep responses SHORT.
2. After EVERY user message add JSON on its own line:
{"ok":true,"errors":[],"tip":""}
OR: {"ok":false,"errors":[{"wrong":"mistake","fix":"fix","explain":"中文说明"}],"tip":"旅行英语贴士（中文）"}
3. Use natural phrases: "Take the tube", "10-minute walk", "You can't miss it."
4. NEVER break character.`
  },
  shopping: {
    id: 'shopping', name: 'Shopping', cn: '购物英语', emoji: '🛍',
    opening: `Hi there! Looking for anything specific today? We've got 30% off everything! 🛍️`,
    systemPrompt: `You are Emma, a friendly shop assistant in a clothing store in London.
RULES:
1. Be helpful and natural. Keep responses SHORT.
2. After EVERY user message add JSON on its own line:
{"ok":true,"errors":[],"tip":""}
OR: {"ok":false,"errors":[{"wrong":"mistake","fix":"correction","explain":"中文说明"}],"tip":"购物英语贴士（中文）"}
3. Use natural shopping phrases: "What size are you?", "Would you like to try it on?", "The fitting rooms are over there."
4. NEVER break character.`
  },
  doctor: {
    id: 'doctor', name: 'Doctor Visit', cn: '看医生', emoji: '🏥',
    opening: `Hello, come in! I'm Dr. Chen. What brings you in today? How are you feeling? 🩺`,
    systemPrompt: `You are Emma, a friendly English-speaking doctor. User is a Chinese patient practicing medical English.
RULES:
1. Be professional but warm. Ask about symptoms. Keep responses SHORT.
2. After EVERY user message add JSON on its own line:
{"ok":true,"errors":[],"tip":""}
OR: {"ok":false,"errors":[{"wrong":"mistake","fix":"correction","explain":"中文说明"}],"tip":"医疗英语贴士（中文）"}
3. Use natural phrases: "How long have you had this?", "On a scale of 1 to 10?", "Take these twice a day."
4. NEVER give real medical advice. Language practice only.`
  },
  free: {
    id: 'free', name: 'Free Chat', cn: '自由对话', emoji: '💬',
    opening: `Hey! I'm Emma 😊 We can talk about ANYTHING — your hobbies, your day, your goals, movies, food — you name it! What's on your mind?`,
    systemPrompt: `You are Emma, a friendly encouraging English conversation partner for Chinese learners.
RULES:
1. Be genuinely interested. Ask follow-up questions. Keep responses SHORT (2-4 sentences).
2. After EVERY user message add JSON on its own line:
{"ok":true,"errors":[],"tip":""}
OR: {"ok":false,"errors":[{"wrong":"their exact words","fix":"natural correction","explain":"中文解释"}],"tip":"实用英语贴士（中文）"}
3. Any topic is fine. Be warm, real, encouraging.
4. If their English is good, say so naturally.`
  }
};

// --- CHAT STATE ---
let chatState = {
  apiKey: '',
  scenario: 'cafe',
  messages: [],
  isLoading: false,
  voiceActive: false
};

// --- INIT ---
function initChat() {
  const saved = localStorage.getItem('speakup_apikey');
  if (saved) {
    chatState.apiKey = saved;
    showChatInterface();
  } else {
    showApiGate();
  }
}

function showApiGate() {
  document.getElementById('apiGate').style.display = 'flex';
  document.getElementById('chatMessages').style.display = 'none';
  document.getElementById('chatInputArea').style.display = 'none';
}

function showChatInterface() {
  document.getElementById('apiGate').style.display = 'none';
  document.getElementById('chatMessages').style.display = 'flex';
  document.getElementById('chatInputArea').style.display = 'block';
  if (chatState.messages.length === 0) {
    startScenario(chatState.scenario);
  }
}

function saveApiKey() {
  const input = document.getElementById('apiKeyInput');
  const key = (input.value || '').trim();
  if (!key.startsWith('sk-ant')) {
    input.style.borderColor = 'var(--red)';
    input.placeholder = '格式不对，应该以 sk-ant 开头';
    setTimeout(() => { input.style.borderColor = ''; input.placeholder = 'sk-ant-api03-...'; }, 2500);
    return;
  }
  chatState.apiKey = key;
  localStorage.setItem('speakup_apikey', key);
  showChatInterface();
}

function clearApiKey() {
  localStorage.removeItem('speakup_apikey');
  chatState.apiKey = '';
  chatState.messages = [];
  showApiGate();
}

// --- SCENARIO ---
function selectScenario(id, btn) {
  chatState.scenario = id;
  document.querySelectorAll('.scenario-pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const s = SCENARIOS[id];
  const statusEl = document.getElementById('aiStatus');
  if (statusEl && s) statusEl.textContent = s.emoji + ' ' + s.cn;
  if (chatState.apiKey && chatState.messages.length >= 0) {
    startScenario(id);
  }
}

function startScenario(id) {
  chatState.messages = [];
  chatState.scenario = id;
  const s = SCENARIOS[id];
  const container = document.getElementById('chatMessages');
  if (!container) return;
  container.innerHTML = '';

  const badge = document.createElement('div');
  badge.className = 'scenario-badge';
  badge.innerHTML = '<span>' + s.emoji + '</span> <span>' + s.name + '</span> <span class="scenario-badge-cn">' + s.cn + '</span>';
  container.appendChild(badge);

  appendMessage('assistant', s.opening, null);
  chatState.messages.push({ role: 'assistant', content: s.opening });
  scrollChatBottom();
}

function resetChat() {
  startScenario(chatState.scenario);
}

// --- SEND ---
async function sendMessage() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text || chatState.isLoading) return;

  input.value = '';
  autoResizeTextarea(input);
  appendMessage('user', text, null);
  chatState.messages.push({ role: 'user', content: text });
  await getAIResponse();
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResizeTextarea(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

// --- AI CALL ---
async function getAIResponse() {
  if (!chatState.apiKey) return;
  chatState.isLoading = true;
  setInputEnabled(false);
  showTypingIndicator(true);

  const scenario = SCENARIOS[chatState.scenario];

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': chatState.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        system: scenario.systemPrompt,
        messages: chatState.messages
      })
    });

    const data = await resp.json();
    if (data.error) throw new Error(data.error.message || 'API error');

    const raw = data.content[0].text;
    const { message, feedback } = parseResponse(raw);
    chatState.messages.push({ role: 'assistant', content: raw });
    appendMessage('assistant', message, feedback);

    // XP reward
    if (typeof state !== 'undefined' && typeof saveState === 'function') {
      const xpGain = (feedback && feedback.ok) ? 5 : 3;
      state.xp += xpGain;
      saveState();
      if (typeof updateTopStats === 'function') updateTopStats();
      if (typeof showXpPopup === 'function') showXpPopup('+' + xpGain + ' XP');
    }

  } catch (err) {
    showChatError(err.message);
  } finally {
    chatState.isLoading = false;
    setInputEnabled(true);
    showTypingIndicator(false);
    scrollChatBottom();
  }
}

function parseResponse(raw) {
  const match = raw.match(/(\{[\s\S]*?"ok"[\s\S]*?\})\s*$/);
  if (!match) return { message: raw, feedback: null };
  try {
    const feedback = JSON.parse(match[1]);
    const message = raw.slice(0, raw.lastIndexOf(match[1])).trim();
    return { message, feedback };
  } catch(e) {
    return { message: raw, feedback: null };
  }
}

// --- RENDER ---
function appendMessage(role, text, feedback) {
  showTypingIndicator(false);
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const wrap = document.createElement('div');
  wrap.className = 'msg-wrapper ' + role;

  if (role === 'assistant') {
    wrap.innerHTML =
      '<div class="msg-avatar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="white" stroke-width="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" stroke-width="2" stroke-linecap="round"/></svg></div>' +
      '<div class="msg-col">' +
        '<div class="msg-bubble assistant">' + safeHtml(text) + '</div>' +
        (feedback ? renderFeedback(feedback) : '') +
      '</div>';
  } else {
    wrap.innerHTML = '<div class="msg-bubble user">' + esc(text) + '</div>';
  }

  container.appendChild(wrap);
  scrollChatBottom();
}

function renderFeedback(fb) {
  if (!fb) return '';
  const hasErrors = fb.errors && fb.errors.length > 0;
  const hasTip = fb.tip && fb.tip.length > 0;

  if (fb.ok && !hasErrors && !hasTip) {
    return '<div class="fb-perfect">✓ 完美！说得很好</div>';
  }

  let html = '';
  if (hasErrors) {
    html += '<div class="fb-errors">' +
      fb.errors.map(e =>
        '<div class="fb-error-item">' +
          '<div class="fb-wrong">❌ &ldquo;' + esc(e.wrong) + '&rdquo;</div>' +
          '<div class="fb-fix">✅ &ldquo;' + esc(e.fix) + '&rdquo;</div>' +
          '<div class="fb-explain">' + esc(e.explain) + '</div>' +
        '</div>'
      ).join('') +
    '</div>';
  }
  if (hasTip) {
    html += '<div class="fb-tip">💡 ' + esc(fb.tip) + '</div>';
  }
  return html ? '<div class="fb-card">' + html + '</div>' : '';
}

function esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function safeHtml(s) {
  return esc(s).replace(/\n/g,'<br>');
}

function showChatError(msg) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'chat-error';
  let hint = '';
  if (msg.includes('401') || msg.includes('invalid_api_key') || msg.includes('authentication')) {
    hint = '<div style="margin-top:6px;font-size:12px">API Key 无效。<button onclick="clearApiKey()" style="background:none;border:none;color:var(--accent);cursor:pointer;text-decoration:underline;font-size:12px;padding:0">重新输入 →</button></div>';
  } else if (msg.includes('429')) {
    hint = '<div style="margin-top:6px;font-size:12px">请求太频繁，等一下再试。</div>';
  }
  el.innerHTML = '⚠️ ' + esc(msg) + hint;
  container.appendChild(el);
  scrollChatBottom();
}

// --- VOICE INPUT ---
let voiceRec = null;

function toggleVoiceInput() {
  if (chatState.voiceActive) {
    stopVoice();
  } else {
    startVoice();
  }
}

function startVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { alert('请使用 Chrome 浏览器以支持语音输入'); return; }

  voiceRec = new SR();
  voiceRec.lang = 'en-US';
  voiceRec.continuous = false;
  voiceRec.interimResults = true;

  const btn = document.getElementById('voiceInputBtn');
  const input = document.getElementById('chatInput');
  if (btn) btn.classList.add('recording');
  chatState.voiceActive = true;

  voiceRec.onresult = (e) => {
    let t = '';
    for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript;
    if (input) { input.value = t; autoResizeTextarea(input); }
  };

  voiceRec.onend = () => {
    chatState.voiceActive = false;
    const btn = document.getElementById('voiceInputBtn');
    if (btn) btn.classList.remove('recording');
    const input = document.getElementById('chatInput');
    if (input && input.value.trim()) setTimeout(sendMessage, 300);
  };

  voiceRec.onerror = stopVoice;
  voiceRec.start();
}

function stopVoice() {
  if (voiceRec) { try { voiceRec.stop(); } catch(e){} }
  chatState.voiceActive = false;
  const btn = document.getElementById('voiceInputBtn');
  if (btn) btn.classList.remove('recording');
}

// --- HELPERS ---
function showTypingIndicator(show) {
  const el = document.getElementById('typingIndicator');
  if (el) el.classList.toggle('hidden', !show);
}

function setInputEnabled(on) {
  const inp = document.getElementById('chatInput');
  const btn = document.getElementById('sendBtn');
  if (inp) inp.disabled = !on;
  if (btn) btn.disabled = !on;
}

function scrollChatBottom() {
  const c = document.getElementById('chatMessages');
  if (c) setTimeout(() => { c.scrollTop = c.scrollHeight; }, 60);
}

function onChatPageOpen() {
  const saved = localStorage.getItem('speakup_apikey');
  if (saved && !chatState.apiKey) {
    chatState.apiKey = saved;
  }
  if (chatState.apiKey) {
    showChatInterface();
  } else {
    showApiGate();
  }
}
