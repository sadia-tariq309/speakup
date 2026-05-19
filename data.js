// =============================================
// SPEAKUP - COMPLETE LEARNING DATA
// =============================================

const ROADMAP_STAGES = [
  {
    id: 'foundation',
    label: '第一阶段 · 基础',
    nodes: [
      {
        id: 'n1',
        emoji: '🔤',
        title: 'Sounds & Phonics',
        cn: '26个字母 · 发音规则',
        tag: 'pronunciation',
        tagLabel: '发音',
        xp: 30,
        lessons: [
          {
            title: 'The English Alphabet',
            cnTitle: '英语字母表 — 你以为你懂，但你不懂',
            concepts: [
              {
                en: 'Vowels: A, E, I, O, U',
                cn: '元音字母。英语每个单词都必须有元音。这和中文完全不同。',
                example: '"Apple" starts with A. "Egg" starts with E.',
                exampleCn: '"苹果" 以 A 开头。"鸡蛋" 以 E 开头。'
              },
              {
                en: 'Silent letters',
                cn: '英语有很多不发音的字母！这是中国人最容易犯错的地方。',
                example: '"Know" = /noʊ/  · "Write" = /raɪt/  · "Knife" = /naɪf/',
                exampleCn: 'K、W、K 完全不发音！'
              },
              {
                en: 'Long vs Short vowels',
                cn: '同一个字母，发音完全不同。上下文决定读法。',
                example: '"bit" /ɪ/ vs "bite" /aɪ/  · "hop" /ɒ/ vs "hope" /oʊ/',
                exampleCn: '加了"e"，整个发音变了。'
              }
            ],
            quiz: {
              question: 'Which word has a silent letter?',
              cnQuestion: '哪个单词有不发音的字母？',
              options: ['cat', 'knife', 'big', 'run'],
              correct: 1,
              explanation: '"Knife" — K is completely silent. /naɪf/',
              explanationCn: '"Knife" 中的 K 完全不发音，直接读 /naɪf/'
            }
          }
        ]
      },
      {
        id: 'n2',
        emoji: '👋',
        title: 'First Words',
        cn: '最重要的100个词',
        tag: 'vocab',
        tagLabel: '词汇',
        xp: 25,
        lessons: [
          {
            title: 'Survival English: 100 Words',
            cnTitle: '生存英语：这100个词让你开口',
            concepts: [
              {
                en: '"I" — The most powerful word',
                cn: '"I" 永远大写！这是英语中唯一一个必须大写的代词。中文的"我"可以小写，但英语的"I"不行。',
                example: 'I am here. I want food. I don\'t understand.',
                exampleCn: '我在这里。我想要食物。我不明白。'
              },
              {
                en: 'Yes / No / Please / Thank you / Sorry',
                cn: '这5个词能解决80%的日常情况。在任何国家，礼貌用语最先学。',
                example: '"Yes, please." / "No, thank you." / "Sorry!"',
                exampleCn: '简单但威力巨大。'
              },
              {
                en: 'I don\'t understand / Can you repeat?',
                cn: '这是最被忽视的两个句子。中国学生害怕承认不懂，但外国人觉得这很正常。',
                example: '"Sorry, I don\'t understand. Can you say that again, slowly?"',
                exampleCn: '不用害怕说不懂。这反而显得你很诚实。'
              }
            ],
            quiz: {
              question: 'Which is correct?',
              cnQuestion: '哪个是正确的？',
              options: ['i am happy', 'I am happy', 'i Am happy', 'I Am Happy'],
              correct: 1,
              explanation: '"I" is always capitalized in English.',
              explanationCn: '在英语中，"I"（我）永远大写，这是唯一必须大写的代词。'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'grammar_core',
    label: '第二阶段 · 语法核心',
    nodes: [
      {
        id: 'n3',
        emoji: '⏰',
        title: 'Tenses Simplified',
        cn: '时态 — 中国人的噩梦，其实很简单',
        tag: 'grammar',
        tagLabel: '语法',
        xp: 40,
        lessons: [
          {
            title: 'Tenses: Why Chinese Speakers Struggle',
            cnTitle: '时态：为什么中国人觉得难（其实不难）',
            concepts: [
              {
                en: 'The Root Problem',
                cn: '中文没有时态变化！"我吃饭"可以是昨天、今天、明天。但英语必须说清楚时间。这不是规则，这是习惯。',
                example: 'I eat (habit) · I ate (past) · I am eating (now) · I will eat (future)',
                exampleCn: '同一个动作，英语用4种不同形式表达。'
              },
              {
                en: 'Simple Past: just add -ed',
                cn: '最简单的时态。规则动词只需加 -ed。不规则动词需要记，但最常用的就那几十个。',
                example: 'walk → walked · talk → talked · eat → ate · go → went',
                exampleCn: '前两个是规则的，后两个是不规则的（需要记）。'
              },
              {
                en: 'Present Continuous: am/is/are + -ing',
                cn: '表示"正在发生"的事。这是英语最有用的时态之一，中文里没有直接对应。',
                example: 'I am studying English right now.',
                exampleCn: '我现在正在学英语。（强调"此刻正在做"）'
              }
            ],
            quiz: {
              question: 'Yesterday, I ___ to the store.',
              cnQuestion: '昨天，我去了商店。（选正确形式）',
              options: ['go', 'went', 'going', 'goes'],
              correct: 1,
              explanation: '"Went" is the past tense of "go". Irregular verb!',
              explanationCn: '"go"的过去式是"went"，这是不规则动词，需要记住。'
            }
          }
        ]
      },
      {
        id: 'n4',
        emoji: '🔗',
        title: 'Sentence Structure',
        cn: '语序 — 主谓宾，颠覆你的中文思维',
        tag: 'grammar',
        tagLabel: '语法',
        xp: 35,
        lessons: [
          {
            title: 'How to Build Any English Sentence',
            cnTitle: '如何造出任何英语句子（公式）',
            concepts: [
              {
                en: 'The Golden Formula: S + V + O',
                cn: '英语句子的核心公式：主语 + 动词 + 宾语。中文有时可以省略主语，英语几乎不行。',
                example: 'I (S) love (V) English (O).',
                exampleCn: '我 (主语) 爱 (动词) 英语 (宾语)。'
              },
              {
                en: 'Adjectives BEFORE the noun',
                cn: '这和中文相反！英语的形容词放在名词前面。"一个苹果红"在英语里完全错误。',
                example: 'A red apple ✓ · A apple red ✗',
                exampleCn: '正确: 一个红苹果 ✓ · 错误语序 ✗'
              },
              {
                en: 'Questions: flip the subject and verb',
                cn: '中文问句和陈述句语序一样，只是语气变化。英语必须把助动词移到主语前面。',
                example: 'You are happy. → Are you happy?',
                exampleCn: '你很开心。→ 你开心吗？（动词移到前面）'
              }
            ],
            quiz: {
              question: 'Which is correct?',
              cnQuestion: '哪个句子语序正确？',
              options: ['A car fast red', 'A fast red car', 'A red fast car', 'Car fast red a'],
              correct: 1,
              explanation: 'Multiple adjectives: opinion → size → color → noun.',
              explanationCn: '多个形容词的顺序：感觉→大小→颜色→名词。"fast red car"是正确语序。'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'speaking',
    label: '第三阶段 · 开口说话',
    nodes: [
      {
        id: 'n5',
        emoji: '💬',
        title: 'Real Conversations',
        cn: '真实对话 — 不是课本，是街头英语',
        tag: 'speaking',
        tagLabel: '口语',
        xp: 50,
        lessons: [
          {
            title: 'Street English vs Textbook English',
            cnTitle: '真实英语 vs 课本英语（差距巨大）',
            concepts: [
              {
                en: '"Gonna" / "Wanna" / "Gotta"',
                cn: '这是"going to" / "want to" / "got to"的口语缩写。所有英语母语者都这样说，但中国课本从来不教。',
                example: '"I\'m gonna eat." · "I wanna go." · "I gotta work."',
                exampleCn: '我要去吃饭。/ 我想去。/ 我必须工作。'
              },
              {
                en: 'Filler words: "like", "you know", "actually"',
                cn: '母语者说话时会用填充词来"买时间"思考。学会这些，你听起来更自然。',
                example: '"So, like, I was thinking... you know what I mean?"',
                exampleCn: '这些词让你的英语听起来真实，而不是在背课文。'
              },
              {
                en: 'Contractions are NOT lazy English',
                cn: '外国人认为"I am"和"I\'m"都正确，但"I am"在口语中听起来很机械。母语者几乎总是用缩写。',
                example: 'I\'m, you\'re, he\'s, we\'re, they\'re, don\'t, can\'t, won\'t',
                exampleCn: '缩写不是偷懒，而是正常口语。'
              }
            ],
            quiz: {
              question: 'What does "I\'m gonna call you later" mean?',
              cnQuestion: '"I\'m gonna call you later" 是什么意思？',
              options: ['I called you late', 'I will call you later', 'Call me later', 'I can\'t call you'],
              correct: 1,
              explanation: '"Gonna" = "going to" — future tense in spoken English.',
              explanationCn: '"gonna" 是 "going to" 的口语形式，表示将来时。意思是"我一会儿给你打电话"。'
            }
          }
        ]
      },
      {
        id: 'n6',
        emoji: '🎯',
        title: 'Pronunciation Mastery',
        cn: '发音攻破 — 说对了才有人听你讲',
        tag: 'pronunciation',
        tagLabel: '发音',
        xp: 45,
        lessons: [
          {
            title: 'The 5 Sounds Chinese Speakers Always Get Wrong',
            cnTitle: '中国人最常发错的5个音（及纠正方法）',
            concepts: [
              {
                en: 'TH sound: /θ/ and /ð/',
                cn: '中文里完全没有这个音。舌尖必须轻放在上下牙齿之间。很多中国人用"s"或"d"代替，外国人会听不懂。',
                example: '"Think" /θɪŋk/ — not "sink" · "The" /ðə/ — not "de"',
                exampleCn: '舌头要放在牙齿之间！不能用"s"或"d"代替。'
              },
              {
                en: 'R vs L: the classic confusion',
                cn: '"right"和"light"是两个完全不同的单词。R音：嘴唇向前，舌头不碰任何地方。L音：舌尖放在上齿龈。',
                example: '"Road" vs "Load" · "Right" vs "Light" · "Fry" vs "Fly"',
                exampleCn: '练习：说R时，想象嘴里含着热汤，舌头向后卷。'
              },
              {
                en: 'Word stress changes meaning',
                cn: '英语重音放错，意思可能完全不同。PRE-sent（名词）vs pre-SENT（动词）。中文没有这个概念。',
                example: '"I NEED to go" (urgent) vs "I need to GO" (where)',
                exampleCn: '重音不同，强调的意思也不同。'
              }
            ],
            quiz: {
              question: 'How do you pronounce the TH in "think"?',
              cnQuestion: '"think" 中的 TH 怎么发音？',
              options: ['Like "s" in "sink"', 'Tongue between teeth', 'Like "t" in "tank"', 'Like "d" in "drink"'],
              correct: 1,
              explanation: 'Put your tongue BETWEEN your teeth to make the TH sound.',
              explanationCn: '舌尖放在上下牙齿之间，轻轻吹气，这才是正确的TH音。'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'fluency',
    label: '第四阶段 · 流利表达',
    nodes: [
      {
        id: 'n7',
        emoji: '🧠',
        title: 'Thinking in English',
        cn: '用英语思维思考，不翻译',
        tag: 'speaking',
        tagLabel: '思维',
        xp: 60,
        lessons: [
          {
            title: 'Stop Translating in Your Head',
            cnTitle: '停止在脑子里翻译（这是流利的最大障碍）',
            concepts: [
              {
                en: 'The Translation Trap',
                cn: '如果你先想中文再翻成英文，你永远无法流利。母语者不翻译，他们直接用英语思考。这需要练习，但可以学会。',
                example: 'Don\'t think: 我想要水 → I want water. Just think: "water...want...I want water."',
                exampleCn: '直接想英文概念，不要经过中文这个中转站。'
              },
              {
                en: 'Think in English: start small',
                cn: '每天10分钟，用英语描述你看到的东西。不需要完整句子。"Red car. Big car. Fast car. Going left."',
                example: 'Look at objects around you and describe them in English.',
                exampleCn: '现在看看你周围，用英语描述5件东西。'
              }
            ],
            quiz: {
              question: 'What\'s the fastest way to improve fluency?',
              cnQuestion: '提高流利度最快的方法是什么？',
              options: ['Memorize grammar rules', 'Think directly in English', 'Read the dictionary', 'Translate every sentence'],
              correct: 1,
              explanation: 'Thinking directly in English bypasses the slow translation process.',
              explanationCn: '直接用英语思考，绕过翻译过程，才能真正流利。'
            }
          }
        ]
      },
      {
        id: 'n8',
        emoji: '🌟',
        title: 'Fluency Milestone',
        cn: '流利里程碑 · 你做到了',
        tag: 'speaking',
        tagLabel: '达成',
        xp: 100,
        locked: true,
        lessons: []
      }
    ]
  }
];

const PRONUNCIATION_WORDS = [
  { word: 'Think', phonetic: '/θɪŋk/', cn: '思考', tip: '舌头放在牙齿之间', category: 'TH音' },
  { word: 'Right', phonetic: '/raɪt/', cn: '对的', tip: '舌头向后卷，不碰任何地方', category: 'R音' },
  { word: 'World', phonetic: '/wɜːrld/', cn: '世界', tip: 'W + 卷舌R音', category: 'R音' },
  { word: 'Clothes', phonetic: '/kloʊðz/', cn: '衣服', tip: 'TH发/ð/音，末尾有Z音', category: 'TH音' },
  { word: 'Three', phonetic: '/θriː/', cn: '三', tip: 'TH + R 组合，很难但很常用', category: 'TH音' },
  { word: 'Light', phonetic: '/laɪt/', cn: '光', tip: '舌尖放在上牙龈，不是R音', category: 'L音' },
  { word: 'Comfortable', phonetic: '/ˈkʌmftəbl/', cn: '舒适的', tip: '实际只有3个音节！', category: '压缩' },
  { word: 'Vegetable', phonetic: '/ˈvedʒtəbl/', cn: '蔬菜', tip: '只有3个音节，不是5个', category: '压缩' },
];
