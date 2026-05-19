// =============================================
// SPEAKUP — MAIN APP ENGINE
// =============================================

// --- STATE ---
let state = {
  xp: 0,
  streak: 0,
  lastVisit: null,
  completedNodes: [],
  completedLessons: [],
  currentPage: 'roadmap',
  selectedPronWord: null
};

// --- PERSISTENCE ---
function saveState() {
  localStorage.setItem('speakup_state', JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem('speakup_state');
  if (raw) {
    try { state = { ...state, ...JSON.parse(raw) }; } catch(e) {}
  }
}

function updateStreak() {
  const today = new Date().toDateString();
  if (state.lastVisit === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (state.lastVisit === yesterday) {
    state.streak += 1;
  } else if (!state.lastVisit) {
    state.streak = 1;
  } else {
    state.streak = 1;
  }
  state.lastVisit = today;
  saveState();
}

// --- INIT ---
window.addEventListener('DOMContentLoaded', () => {
  loadState();
  updateStreak();

  // Splash → App
  setTimeout(() => {
    document.getElementById('splash').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('splash').style.display = 'none';
      document.getElementById('app').classList.remove('hidden');
      updateTopStats();
      renderRoadmap();
      renderPronPage();
      renderProfilePage();
      if (typeof initChat === 'function') initChat();
    }, 500);
  }, 1600);
});

// --- TOP STATS ---
function updateTopStats() {
  document.getElementById('streakCount').textContent = state.streak;
  document.getElementById('xpCount').textContent = state.xp;
}

// --- PAGE NAVIGATION ---
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + name);
  if (target) target.classList.add('active');
  state.currentPage = name;
}

function navTo(name) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const btn = document.getElementById('nav-' + name);
  if (btn) btn.classList.add('active');
  if (name === 'pronunciation') {
    showPage('pronunciation');
  } else if (name === 'profile') {
    renderProfilePage();
    showPage('profile');
  } else if (name === 'chat') {
    showPage('chat');
    if (typeof onChatPageOpen === 'function') onChatPageOpen();
  } else {
    showPage('roadmap');
  }
}

// --- ROADMAP RENDER ---
function renderRoadmap() {
  const container = document.getElementById('roadmapContainer');
  container.innerHTML = '';

  ROADMAP_STAGES.forEach((stage, si) => {
    const group = document.createElement('div');
    group.className = 'stage-group';

    const label = document.createElement('div');
    label.className = 'stage-label';
    label.textContent = stage.label;
    group.appendChild(label);

    stage.nodes.forEach((node, ni) => {
      const isDone = state.completedNodes.includes(node.id);
      const isLocked = node.locked && !canUnlock(node, si, ni);
      const isActive = !isDone && !isLocked;

      const nodeEl = document.createElement('div');
      nodeEl.className = 'roadmap-node' + (isLocked ? ' locked-node' : '');
      nodeEl.innerHTML = buildNodeHTML(node, isDone, isActive, isLocked);

      if (!isLocked) {
        nodeEl.addEventListener('click', () => openLesson(node));
      }

      group.appendChild(nodeEl);
    });

    container.appendChild(group);
  });
}

function canUnlock(node, stageIdx, nodeIdx) {
  if (stageIdx === 0) return true;
  const prevStage = ROADMAP_STAGES[stageIdx - 1];
  return prevStage.nodes.every(n => state.completedNodes.includes(n.id));
}

function buildNodeHTML(node, isDone, isActive, isLocked) {
  const iconClass = isDone ? 'done' : isActive ? 'active-node' : 'locked';
  const progress = isDone ? 100 : isActive ? getNodeProgress(node.id) : 0;
  const tagColors = {
    grammar: 'tag-grammar', speaking: 'tag-speaking', vocab: 'tag-vocab',
    listening: 'tag-listening', pronunciation: 'tag-pronunciation'
  };
  const tagClass = tagColors[node.tag] || 'tag-grammar';

  const checkMark = isDone ? `<div class="node-done-check">✓</div>` : '';

  return `
    <div class="node-icon-wrap ${iconClass}">
      ${node.emoji}
      ${checkMark}
    </div>
    <div class="node-body">
      <div class="node-title">${node.title}</div>
      <div class="node-cn">${node.cn}</div>
      <div class="node-meta">
        <span class="node-tag ${tagClass}">${node.tagLabel}</span>
        <span style="font-size:11px;color:var(--text3)">+${node.xp} XP</span>
        ${isDone ? '<span style="font-size:11px;color:var(--green);margin-left:auto">✓ 完成</span>' : ''}
        ${isLocked ? '<span style="font-size:11px;color:var(--text3);margin-left:auto">🔒 未解锁</span>' : ''}
      </div>
      ${!isLocked ? `
      <div class="node-progress-wrap">
        <div class="node-progress-bar" style="width:${progress}%"></div>
      </div>` : ''}
    </div>
  `;
}

function getNodeProgress(nodeId) {
  const node = findNode(nodeId);
  if (!node || !node.lessons.length) return 0;
  const done = node.lessons.filter((_, i) =>
    state.completedLessons.includes(nodeId + '_' + i)
  ).length;
  return Math.round((done / node.lessons.length) * 100);
}

function findNode(id) {
  for (const stage of ROADMAP_STAGES) {
    const found = stage.nodes.find(n => n.id === id);
    if (found) return found;
  }
  return null;
}

// --- OPEN LESSON ---
function openLesson(node) {
  if (!node.lessons || node.lessons.length === 0) return;
  const lesson = node.lessons[0];
  const lessonIdx = 0;
  const lessonKey = node.id + '_' + lessonIdx;
  const isCompleted = state.completedLessons.includes(lessonKey);

  const content = document.getElementById('lessonContent');
  content.innerHTML = buildLessonHTML(node, lesson, lessonKey, isCompleted);

  // Scroll to top
  document.getElementById('page-lesson').querySelector('.page-scroll').scrollTop = 0;
  showPage('lesson');
}

function buildLessonHTML(node, lesson, lessonKey, isCompleted) {
  const conceptsHTML = lesson.concepts.map((c, i) => `
    <div class="concept-card">
      <div class="concept-en">${c.en}</div>
      <div class="concept-cn">${c.cn}</div>
      ${c.example ? `
      <div class="concept-example">${c.example}</div>
      <div class="concept-example-cn">${c.exampleCn}</div>
      ` : ''}
    </div>
  `).join('');

  const quizHTML = lesson.quiz ? `
    <div class="quiz-wrap">
      <div class="quiz-question">${lesson.quiz.question}</div>
      <div class="quiz-cn">${lesson.quiz.cnQuestion}</div>
      <div class="quiz-options" id="quizOptions">
        ${lesson.quiz.options.map((opt, i) => `
          <button class="quiz-option" onclick="answerQuiz(${i}, ${lesson.quiz.correct}, '${escStr(lesson.quiz.explanation)}', '${escStr(lesson.quiz.explanationCn)}', '${lessonKey}', '${node.id}', ${node.xp})">${opt}</button>
        `).join('')}
      </div>
      <div class="quiz-feedback" id="quizFeedback"></div>
    </div>
  ` : '';

  const btnHTML = isCompleted
    ? `<div style="text-align:center;padding:0 20px 20px;color:var(--green);font-size:14px;font-family:var(--font-cn)">✓ 已完成 · 继续其他课程</div>`
    : `<button class="complete-btn" id="completeBtn" disabled onclick="void(0)">完成测验后继续 →</button>`;

  return `
    <div class="lesson-header">
      <div class="lesson-title">${lesson.title}</div>
      <div class="lesson-cn-title">${lesson.cnTitle}</div>
    </div>
    <div class="lesson-section">
      <div class="lesson-section-header">核心概念</div>
      <div class="lesson-section-body">${conceptsHTML}</div>
    </div>
    ${lesson.quiz ? `
    <div class="lesson-section" style="margin-bottom:16px">
      <div class="lesson-section-header">测试一下</div>
      <div class="lesson-section-body" style="padding:16px 0 0">${quizHTML}</div>
    </div>
    ` : ''}
    ${btnHTML}
  `;
}

function escStr(s) {
  return (s || '').replace(/'/g, "&#39;").replace(/"/g, '&quot;');
}

function answerQuiz(chosen, correct, explanation, explanationCn, lessonKey, nodeId, xpAmt) {
  const options = document.querySelectorAll('.quiz-option');
  const feedback = document.getElementById('quizFeedback');
  const completeBtn = document.getElementById('completeBtn');

  options.forEach(o => o.disabled = true);

  options[correct].classList.add('correct');
  if (chosen !== correct) {
    options[chosen].classList.add('wrong');
    feedback.className = 'quiz-feedback wrong-fb show';
    feedback.innerHTML = `❌ <strong>解析：</strong>${explanation}<br><span style="opacity:.8">${explanationCn}</span>`;
    if (completeBtn) {
      completeBtn.disabled = false;
      completeBtn.textContent = '继续 →';
      completeBtn.onclick = () => completeLesson(lessonKey, nodeId, Math.round(xpAmt * 0.5));
    }
  } else {
    feedback.className = 'quiz-feedback correct-fb show';
    feedback.innerHTML = `✅ <strong>正确！</strong> ${explanation}<br><span style="opacity:.8">${explanationCn}</span>`;
    if (completeBtn) {
      completeBtn.disabled = false;
      completeBtn.textContent = `完成并获得 +${xpAmt} XP →`;
      completeBtn.onclick = () => completeLesson(lessonKey, nodeId, xpAmt);
    }
  }
}

function completeLesson(lessonKey, nodeId, xpEarned) {
  if (!state.completedLessons.includes(lessonKey)) {
    state.completedLessons.push(lessonKey);
    state.xp += xpEarned;
    showXpPopup('+' + xpEarned + ' XP');
  }

  // Check if all lessons in node are done
  const node = findNode(nodeId);
  if (node && node.lessons.every((_, i) =>
    state.completedLessons.includes(nodeId + '_' + i)
  )) {
    if (!state.completedNodes.includes(nodeId)) {
      state.completedNodes.push(nodeId);
    }
  }

  saveState();
  updateTopStats();

  // Show completion screen
  showCompletionScreen(xpEarned);
}

function showCompletionScreen(xpEarned) {
  const content = document.getElementById('lessonContent');
  content.innerHTML = `
    <div class="lesson-complete">
      <div class="complete-trophy">🏆</div>
      <div class="complete-title">太棒了！</div>
      <div class="complete-cn">你完成了这节课<br>继续保持这个势头！</div>
      <div class="complete-xp">⭐ +${xpEarned} XP 已获得</div>
      <button class="complete-btn" style="margin:0" onclick="goBackToRoadmap()">返回路线图 →</button>
    </div>
  `;
}

function goBackToRoadmap() {
  renderRoadmap();
  showPage('roadmap');
  navTo('roadmap');
}

// --- XP POPUP ---
function showXpPopup(text) {
  const el = document.createElement('div');
  el.className = 'xp-popup';
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2100);
}

// --- PRONUNCIATION PAGE ---
let recognition = null;
let isRecording = false;

function renderPronPage() {
  const container = document.getElementById('pronContent');
  const selectedWord = PRONUNCIATION_WORDS[state.selectedPronWord || 0];

  const wordsGridHTML = PRONUNCIATION_WORDS.map((w, i) => `
    <div class="pron-word-card ${(state.selectedPronWord || 0) === i ? 'selected' : ''}"
         onclick="selectPronWord(${i})">
      <div class="pword-en">${w.word}</div>
      <div class="pword-phonetic">${w.phonetic}</div>
      <div class="pword-cn">${w.cn}</div>
    </div>
  `).join('');

  const speechSupported = ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  const micSection = speechSupported ? `
    <div class="pron-tip">💡 ${selectedWord.tip}</div>
    <div class="mic-btn-wrap">
      <button class="mic-btn" id="micBtn" onclick="toggleRecording('${selectedWord.word}')">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="white"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <line x1="12" y1="19" x2="12" y2="23" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <line x1="8" y1="23" x2="16" y2="23" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    <div style="text-align:center;font-size:12px;color:var(--text3);margin-top:-8px;margin-bottom:16px;font-family:var(--font-cn)">点击麦克风开始朗读</div>
    <div class="pron-result" id="pronResult">
      <div class="pron-result-label">朗读后这里会显示评分</div>
    </div>
  ` : `
    <div class="pron-tip" style="margin:0 20px">⚠️ 你的浏览器不支持语音识别。请使用 Chrome 或 Safari。</div>
  `;

  container.innerHTML = `
    <div class="pron-hero">
      <div class="pron-word-display">${selectedWord.word}</div>
      <div class="pron-phonetic">${selectedWord.phonetic}</div>
      <div class="pron-cn">${selectedWord.cn}</div>
    </div>
    ${micSection}
    <div class="pron-words" style="margin-top:20px">
      <div class="pron-words-title">练习词汇</div>
      <div class="pron-word-grid">${wordsGridHTML}</div>
    </div>
  `;
}

function selectPronWord(idx) {
  state.selectedPronWord = idx;
  renderPronPage();
  if (recognition) { try { recognition.stop(); } catch(e) {} }
  isRecording = false;
}

function toggleRecording(targetWord) {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording(targetWord);
  }
}

function startRecording(targetWord) {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) return;

  recognition = new SpeechRec();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 5;

  const micBtn = document.getElementById('micBtn');
  if (micBtn) micBtn.classList.add('recording');
  isRecording = true;

  const resultDiv = document.getElementById('pronResult');
  if (resultDiv) {
    resultDiv.innerHTML = `<div class="pron-result-label" style="color:var(--accent)">正在聆听...</div>`;
  }

  recognition.onresult = (event) => {
    const results = Array.from(event.results[0]);
    const spoken = results.map(r => r.transcript.trim().toLowerCase());
    const target = targetWord.toLowerCase();

    let score = calculatePronScore(spoken, target);
    showPronResult(spoken[0], target, score);
    stopRecording();
  };

  recognition.onerror = (event) => {
    const resultDiv = document.getElementById('pronResult');
    if (resultDiv) {
      resultDiv.innerHTML = `
        <div class="pron-result-label" style="color:var(--red)">无法识别 — 请重试</div>
        <div style="font-size:12px;color:var(--text3);font-family:var(--font-cn)">确保麦克风已授权，周围安静</div>
      `;
    }
    stopRecording();
  };

  recognition.onend = () => {
    isRecording = false;
    const micBtn = document.getElementById('micBtn');
    if (micBtn) micBtn.classList.remove('recording');
  };

  recognition.start();
}

function stopRecording() {
  if (recognition) {
    try { recognition.stop(); } catch(e) {}
  }
  isRecording = false;
  const micBtn = document.getElementById('micBtn');
  if (micBtn) micBtn.classList.remove('recording');
}

function calculatePronScore(spokenList, target) {
  if (spokenList.includes(target)) return 100;

  // Check any close match
  let best = 0;
  for (const spoken of spokenList) {
    const sim = similarity(spoken, target);
    if (sim > best) best = sim;
  }
  return Math.round(best * 100);
}

function similarity(a, b) {
  if (a === b) return 1;
  if (a.length === 0 || b.length === 0) return 0;
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  const longerLen = longer.length;
  if (longerLen === 0) return 1;
  return (longerLen - editDistance(longer, shorter)) / longerLen;
}

function editDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i-1] === a[j-1]) {
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i-1][j-1] + 1,
          Math.min(matrix[i][j-1] + 1, matrix[i-1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function showPronResult(spoken, target, score) {
  const resultDiv = document.getElementById('pronResult');
  if (!resultDiv) return;

  const scoreClass = score >= 80 ? 'great' : score >= 50 ? 'ok' : 'poor';
  const emoji = score >= 80 ? '🎉' : score >= 50 ? '👍' : '🔄';
  const msg = score >= 80
    ? '发音很准确！' : score >= 50
    ? '不错，继续练习' : '再试一次，慢慢说';
  const msgEn = score >= 80
    ? 'Excellent pronunciation!' : score >= 50
    ? 'Good effort, keep practicing!' : 'Try again — speak slowly';

  resultDiv.innerHTML = `
    <div class="pron-score ${scoreClass}">${emoji} ${score}%</div>
    <div class="pron-result-text">${msgEn}</div>
    <div class="pron-result-label">${msg}</div>
    ${spoken ? `<div style="font-size:12px;color:var(--text3);margin-top:4px">识别到: "${spoken}"</div>` : ''}
  `;

  if (score >= 80) {
    state.xp += 5;
    saveState();
    updateTopStats();
    showXpPopup('+5 XP');
  }
}

// --- PROFILE PAGE ---
function renderProfilePage() {
  const totalNodes = ROADMAP_STAGES.reduce((sum, s) => sum + s.nodes.length, 0);
  const doneNodes = state.completedNodes.length;
  const totalLessons = ROADMAP_STAGES.reduce((sum, s) =>
    sum + s.nodes.reduce((ns, n) => ns + n.lessons.length, 0), 0);
  const doneLessons = state.completedLessons.length;

  const achievements = [
    { icon: '🔥', name: '连续学习', desc: `${state.streak} 天连续学习`, earned: state.streak >= 1 },
    { icon: '⭐', name: '首次完成', desc: '完成第一节课', earned: state.completedLessons.length >= 1 },
    { icon: '🎯', name: '发音挑战', desc: '发音得分超过80%', earned: false },
    { icon: '🚀', name: '语法大师', desc: '完成所有语法课程', earned: false },
    { icon: '🌟', name: '英语达人', desc: '完成整个路线图', earned: state.completedNodes.length === totalNodes }
  ];

  const achHTML = achievements.map(a => `
    <div class="achievement-card">
      <div class="ach-icon ${a.earned ? 'earned' : 'locked'}">${a.icon}</div>
      <div class="ach-info">
        <div class="ach-name">${a.name}</div>
        <div class="ach-desc">${a.desc}</div>
      </div>
      ${a.earned ? '<span style="color:var(--green);font-size:18px">✓</span>' : '<span style="color:var(--text3);font-size:14px">🔒</span>'}
    </div>
  `).join('');

  document.getElementById('profileContent').innerHTML = `
    <div class="profile-stats">
      <div class="stat-card">
        <div class="stat-num">${state.xp}</div>
        <div class="stat-label">总经验值</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${state.streak}</div>
        <div class="stat-label">连续天数</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${doneNodes}<span style="font-size:16px;color:var(--text3)">/${totalNodes}</span></div>
        <div class="stat-label">完成阶段</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${doneLessons}<span style="font-size:16px;color:var(--text3)">/${totalLessons}</span></div>
        <div class="stat-label">完成课程</div>
      </div>
    </div>

    <div class="profile-section-title">成就徽章</div>
    <div class="achievement-list">${achHTML}</div>

    <div style="padding:0 20px 30px">
      <button onclick="resetProgress()" style="
        width:100%;padding:14px;
        background:none;border:1px solid rgba(239,68,68,0.3);
        color:var(--red);border-radius:var(--radius-sm);
        font-size:14px;cursor:pointer;
        font-family:var(--font-cn);
      ">重置所有进度</button>
    </div>
  `;
}

function resetProgress() {
  if (confirm('确定要重置所有进度吗？这无法撤销。')) {
    state = { xp: 0, streak: 1, lastVisit: new Date().toDateString(), completedNodes: [], completedLessons: [], selectedPronWord: 0 };
    saveState();
    updateTopStats();
    renderRoadmap();
    renderProfilePage();
    showPage('profile');
  }
}

// --- MODAL ---
function closeModal(e) {
  if (e.target.classList.contains('modal-overlay')) {
    document.getElementById('modal').classList.add('hidden');
  }
}
function closeModalDirect() {
  document.getElementById('modal').classList.add('hidden');
}

// --- SERVICE WORKER ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
