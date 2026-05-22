/* RugbyAI mid-fi — shared data: drill library + practice store */

const DRILL_LIBRARY = [
  {
    id: 'd1',  name: 'Warm-up · movement grids',  cat: 'Skills',    min: 15, group: 'all',
    intensity: 'Low',  focus: 'Activation',
    desc: 'Dynamic movement patterns — high knees, lateral shuffle, box drills. Sets tempo and gets bodies loose before contact work.',
    calls: [],
  },
  {
    id: 'd2',  name: 'Lineout — 4v3 lift drill',   cat: 'Set Piece', min: 25, group: 'forwards',
    intensity: 'Med',  focus: 'Lift timing',
    desc: 'Jumper A vs B decision under pressure. Work call disguise, timing, and hold position while defending jumper challenges.',
    calls: ['LINEOUT'],
  },
  {
    id: 'd3',  name: 'Maul attack — Bulls call',   cat: 'Set Piece', min: 20, group: 'forwards',
    intensity: 'High', focus: 'Driving power',
    desc: 'Lineout won — bind and drive. Low body height, second man wraps the ball carrier tight. Drive for 5 seconds minimum.',
    calls: ['BULLS', 'MAUL'],
  },
  {
    id: 'd4',  name: 'Backs shapes — Bus + Plus',  cat: 'Attack',    min: 20, group: 'backs',
    intensity: 'Med',  focus: 'Alignment',
    desc: 'Work Bus shape from 10 and the Plus variation. 10, 12, 13 call the trigger early — outside runners must read the switch.',
    calls: ['BUS', 'PLUS'],
  },
  {
    id: 'd5',  name: 'Pillar / Post / OBS reset',  cat: 'Defence',   min: 20, group: 'all',
    intensity: 'Med',  focus: 'Body positioning',
    desc: 'Drill 1st, 2nd, 3rd defenders arriving at the ruck. Urgency, correct body angles, and a full reset between each rep.',
    calls: ['PILLAR'],
  },
  {
    id: 'd6',  name: 'Blitz lines vs UCT shape',   cat: 'Defence',   min: 25, group: 'all',
    intensity: 'High', focus: 'Line speed',
    desc: 'UCT runs Bus off 10 — Blitz triggers on the fly-half receiving. Watch the inside centre cut-back. Doubles on ball carrier.',
    calls: ['BLITZ', 'DOUBLES'],
  },
  {
    id: 'd7',  name: 'Kick chase — Naidoo box',    cat: 'Skills',    min: 15, group: 'all',
    intensity: 'Med',  focus: 'Contest height',
    desc: 'Naidoo kicks long box kick. Two chasers compete for the catch. Focus on communication under the ball and landing safely.',
    calls: [],
  },
  {
    id: 'd8',  name: 'Team run — 5-phase build',   cat: 'Game Sim',  min: 10, group: 'all',
    intensity: 'Low',  focus: 'Call clarity',
    desc: 'Walk-through pace from own half. Offence calls 5 phases, no contact. Pure communication — players confirm every call aloud.',
    calls: ['BLACK', 'BUS', 'BRUMBY'],
  },
  {
    id: 'd9',  name: "Captain's run — calls only", cat: 'Game Sim',  min: 18, group: 'all',
    intensity: 'Low',  focus: 'Confidence',
    desc: 'Match-day morning run. Reinforce set plays at half speed, no physicality. Skippers lead each call — no coaching interruptions.',
    calls: [],
  },
  {
    id: 'd10', name: 'Tackle technique',           cat: 'Skills',    min: 15, group: 'all',
    intensity: 'High', focus: 'Body height',
    desc: 'Cheek-to-cheek form tackle. Pair up — one static carrier, one hitter. Progress to moving carrier, then live breakdown.',
    calls: ['CHOP', 'DOUBLES'],
  },
  {
    id: 'd11', name: '1v1 grids',                  cat: 'Skills',    min: 12, group: 'all',
    intensity: 'High', focus: 'Footwork',
    desc: 'Small 5×5m grid. Carrier attacks the line — defender must stay on feet and make the stop. Rotate carriers every 3 reps.',
    calls: [],
  },
  {
    id: 'd12', name: 'Conditioning · 5×4min',      cat: 'Fitness',   min: 25, group: 'all',
    intensity: 'High', focus: 'Game fitness',
    desc: '5 x 4-minute high-intensity intervals with 2-minute active recovery. Shuttle format mimics work-to-rest ratio in a real match.',
    calls: [],
  },
  {
    id: 'd13', name: 'Gym · pillars',              cat: 'Fitness',   min: 45, group: 'all',
    intensity: 'High', focus: 'Strength',
    desc: 'Squat, deadlift, bench, pull — 4 pillar movements. S&C supervised. Progressive overload programme, logged per player.',
    calls: [],
  },
  {
    id: 'd14', name: 'Lineout — calls walk-through', cat: 'Set Piece', min: 15, group: 'forwards',
    intensity: 'Low',  focus: 'Communication',
    desc: 'Walk through all lineout calls at the posts. Confirm lift order, jumper choice A/B/C, and disguise timing. No physicality.',
    calls: ['LINEOUT'],
  },
  {
    id: 'd15', name: 'Recovery · pool',            cat: 'Recovery',  min: 30, group: 'all',
    intensity: 'Low',  focus: 'Flush',
    desc: 'Warm-water contrast recovery session. No structured swim — flush legs, calf massage, and static stretching in the water.',
    calls: [],
  },
  {
    id: 'd16', name: 'Scrum machine session',      cat: 'Set Piece', min: 30, group: 'forwards',
    intensity: 'High', focus: 'Binding & drive',
    desc: 'Tight five on the machine. Bind quality, low hips — maintain a driving position for 5 seconds before the 8 calls it.',
    calls: ['SCRUM', 'BULLS'],
  },
  {
    id: 'd17', name: 'Brumby + Stormers — shape',  cat: 'Attack',    min: 18, group: 'backs',
    intensity: 'Med',  focus: 'Timing run',
    desc: 'Brumby off 9 creates dummy pod, then Stormers back pass to 10. Width and timing are the key cues — outside runners must hold.',
    calls: ['BRUMBY', 'STORMERS'],
  },
  {
    id: 'd18', name: 'Choke tackle / maul defence',cat: 'Defence',   min: 15, group: 'forwards',
    intensity: 'High', focus: 'Hold up',
    desc: 'Two-man hold-up drill. First man lowers, second wraps high. Simulates maul defence near the 22 — focus on not letting them recycle.',
    calls: ['CHOKE'],
  },
  {
    id: 'd19', name: 'Ruck technique — clear-out speed', cat: 'Defence', min: 15, group: 'all',
    intensity: 'High', focus: 'Clear-out speed',
    desc: 'One-man clear-out drill. Carrier goes to ground — first player cleans out the threat. Rotate every 4 reps. Low entry, timing is everything.',
    calls: ['PILLAR', 'FIRE'],
  },
  {
    id: 'd20', name: 'Contact pods — abrasion conditioning', cat: 'Fitness', min: 20, group: 'all',
    intensity: 'High', focus: 'Contact fitness',
    desc: 'Repeated contact cycles: hit pad, go to ground, get up, hit again. 20-second rounds, 10-second rest. Builds match-specific endurance.',
    calls: [],
  },
  {
    id: 'd21', name: 'Backs — Rio / London attack shapes', cat: 'Attack', min: 20, group: 'backs',
    intensity: 'Med', focus: 'Width & timing',
    desc: 'Alternate RIO (right) and LONDON (left) attack. 10 works the line, 12 sets depth. Emphasis on ball speed and flat alignment from 13.',
    calls: ['RIO', 'LONDON', 'BLACK'],
  },
  {
    id: 'd22', name: 'Kick receipt — high ball contest', cat: 'Skills', min: 15, group: 'all',
    intensity: 'Med', focus: 'Safe hands',
    desc: 'High ball from 40m. Catcher calls "mine" and two support arrive. Practise catching, landing safely, and setting up the ruck immediately.',
    calls: [],
  },
  {
    id: 'd23', name: 'Breakdown — jackle & turnover', cat: 'Defence', min: 15, group: 'all',
    intensity: 'High', focus: 'Turnover rate',
    desc: 'Two-phase drill: carrier goes to ground, defender arrives over the ball. Correct body height and binding over — not just hands on the ball.',
    calls: ['JACKLE', 'FIRE'],
  },
  {
    id: 'd24', name: 'Opposition calls — video analysis', cat: 'Game Sim', min: 20, group: 'all',
    intensity: 'Low', focus: 'Recognition',
    desc: 'Tablet session: coach plays 4-6 opponent clips, players call the shape and response. Active discussion, no passive watching.',
    calls: [],
  },
  {
    id: 'd25', name: 'Counter-attack off kick receipt', cat: 'Attack', min: 20, group: 'all',
    intensity: 'Med', focus: 'Decision speed',
    desc: 'Fullback or winger receives a box kick — decide in 1.5 seconds: carry, recycle, or return kick. Team reads and supports immediately.',
    calls: ['BRUMBY', 'BLACK'],
  },
  {
    id: 'd26', name: 'Beep test / aerobic baseline', cat: 'Fitness', min: 25, group: 'all',
    intensity: 'High', focus: 'VO2 benchmark',
    desc: 'Full squad beep test. Results logged per player against pre-season baseline. Minimum standard: Level 10. S&C coach supervises.',
    calls: [],
  },
];

const DRILL_BY_ID = Object.fromEntries(DRILL_LIBRARY.map(d => [d.id, d]));

/* Categories used for filtering + chip colours */
const DRILL_CATS = ['Skills', 'Set Piece', 'Attack', 'Defence', 'Game Sim', 'Fitness', 'Recovery'];
const CAT_COLOR = {
  'Skills':   { bg: 'rgba(99,102,241,.09)',  fg: '#4338ca', border: '#6366f1' },
  'Set Piece':{ bg: 'rgba(201,148,30,.16)',  fg: '#92650a', border: '#c9941e' },
  'Attack':   { bg: 'rgba(22,163,74,.13)',   fg: '#15803d', border: '#22c55e' },
  'Defence':  { bg: 'rgba(24,43,84,.11)',    fg: '#182b54', border: '#3b82f6' },
  'Game Sim': { bg: 'rgba(220,38,38,.11)',   fg: '#b91c1c', border: '#ef4444' },
  'Fitness':  { bg: 'rgba(217,119,6,.12)',   fg: '#92400e', border: '#f59e0b' },
  'Recovery': { bg: 'rgba(14,165,233,.11)',  fg: '#0369a1', border: '#38bdf8' },
};

/* ---- Seed practices ---- */
/* Date format: YYYY-MM-DD. Season runs Feb–Jul 2024. */
const SEED_PRACTICES = [
  // March
  { id: 'p_m1', date: '2024-03-05', start: '18:30', end: '20:00', focus: 'Pre-season fitness', drills: ['d1','d12','d11','d10'] },
  { id: 'p_m2', date: '2024-03-07', start: '18:30', end: '20:00', focus: 'Set piece foundations', drills: ['d1','d14','d16','d8'] },
  { id: 'p_m3', date: '2024-03-12', start: '18:30', end: '20:00', focus: 'Skills + grids', drills: ['d1','d11','d10','d7'] },
  { id: 'p_m4', date: '2024-03-14', start: '18:30', end: '20:00', focus: 'Lineout + maul', drills: ['d1','d2','d3','d12'] },
  // April
  { id: 'p_a1', date: '2024-04-02', start: '18:30', end: '20:00', focus: 'Defence pressure', drills: ['d1','d5','d6','d18'] },
  { id: 'p_a2', date: '2024-04-04', start: '18:30', end: '20:00', focus: 'Attack shapes', drills: ['d1','d4','d17','d8'] },
  { id: 'p_a3', date: '2024-04-09', start: '18:30', end: '20:00', focus: 'Set piece tune', drills: ['d1','d2','d16','d12'] },
  { id: 'p_a4', date: '2024-04-11', start: '18:30', end: '20:00', focus: "Captain's run prep", drills: ['d1','d9','d7'] },
  // May
  { id: 'p_y1', date: '2024-05-07', start: '18:30', end: '20:00', focus: 'Recovery + skills', drills: ['d15','d11','d10'] },
  { id: 'p_y2', date: '2024-05-09', start: '18:30', end: '20:00', focus: 'Defence systems', drills: ['d1','d5','d6'] },
  { id: 'p_y3', date: '2024-05-14', start: '18:30', end: '20:00', focus: 'Game sim', drills: ['d1','d8','d9'] },
  { id: 'p_y4', date: '2024-05-21', start: '18:30', end: '20:00', focus: 'Maul attack', drills: ['d1','d3','d16'] },
  { id: 'p_y5', date: '2024-05-23', start: '18:30', end: '20:00', focus: 'Backs unit', drills: ['d1','d4','d17'] },
  // Current week (June 17-23, vs UCT Sat)
  { id: 'p_j1', date: '2024-06-17', start: '18:30', end: '20:00', focus: 'Lineouts & breakdown', drills: ['d1','d2','d3','d4','d8'] },
  { id: 'p_j2', date: '2024-06-19', start: '18:30', end: '20:00', focus: 'Defence + kick chase', drills: ['d1','d5','d6','d7','d9'] },
  // Earlier June
  { id: 'p_j3', date: '2024-06-03', start: '18:30', end: '20:00', focus: 'Set piece', drills: ['d1','d2','d14','d16'] },
  { id: 'p_j4', date: '2024-06-05', start: '18:30', end: '20:00', focus: 'Attack shapes', drills: ['d1','d4','d8'] },
  { id: 'p_j5', date: '2024-06-10', start: '18:30', end: '20:00', focus: 'Recovery + skills', drills: ['d1','d10','d11','d15'] },
  { id: 'p_j6', date: '2024-06-12', start: '18:30', end: '20:00', focus: 'Scrum + maul', drills: ['d1','d16','d3','d12'] },
];

/* ---- Date helpers ---- */
const MONTHS = ['January','February','March','April','May','June','July','August'];
const MONTH_NAMES_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_NAMES_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const SEASON_YEAR = 2024;
const TODAY_ISO = '2024-06-13'; /* simulate "today" for the wireframe */

/* Build YYYY-MM-DD without timezone surprises */
const toISO = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

/* Parse YYYY-MM-DD → {y, m, d, dow} */
const parseISO = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return { y, m: m - 1, d, dow: date.getUTCDay(), date };
};

const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const firstDayOfMonth = (y, m) => new Date(y, m, 1).getDay(); // 0=Sun

/* Match the season's fixtures with their date and ISO */
const FIXTURE_DATES = {
  'Feb 16': '2024-02-16', 'Feb 24': '2024-02-24',
  'Mar 9':  '2024-03-09', 'Mar 16': '2024-03-16', 'Mar 23': '2024-03-23', 'Mar 30': '2024-03-30',
  'Apr 6':  '2024-04-06', 'Apr 13': '2024-04-13', 'Apr 20': '2024-04-20',
  'May 4':  '2024-05-04', 'May 11': '2024-05-11', 'May 25': '2024-05-25',
  'Jun 14': '2024-06-14', 'Jun 21': '2024-06-21', 'Jun 28': '2024-06-28',
};

const fixtureFor = (iso) =>
  FIXTURES.find(f => FIXTURE_DATES[f.date] === iso);

/* Sunday-anchored week start for any iso date */
const startOfWeek = (iso) => {
  const { y, m, d, dow } = parseISO(iso);
  const date = new Date(Date.UTC(y, m, d - dow));
  return toISO(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};
const addDays = (iso, n) => {
  const { y, m, d } = parseISO(iso);
  const date = new Date(Date.UTC(y, m, d + n));
  return toISO(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

const formatWeekRange = (sundayIso) => {
  const start = parseISO(sundayIso);
  const end = parseISO(addDays(sundayIso, 6));
  return `${MONTH_NAMES_SHORT[start.m]} ${start.d} – ${MONTH_NAMES_SHORT[end.m]} ${end.d}`;
};

/* Practice store backed by localStorage */
const PRACTICE_KEY = 'rugbyai_practices_v1';

const usePractices = () => {
  const [practices, setPracticesRaw] = React.useState(() => {
    try {
      const raw = localStorage.getItem(PRACTICE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return SEED_PRACTICES;
  });

  const setPractices = React.useCallback((next) => {
    setPracticesRaw(prev => {
      const value = typeof next === 'function' ? next(prev) : next;
      try { localStorage.setItem(PRACTICE_KEY, JSON.stringify(value)); } catch (e) {}
      return value;
    });
  }, []);

  /* Convenience helpers */
  const upsertPractice = (iso, patch) => {
    setPractices(prev => {
      const existing = prev.find(p => p.date === iso);
      if (existing) {
        return prev.map(p => p.date === iso ? { ...p, ...patch } : p);
      }
      return [...prev, {
        id: `p_${Date.now()}`,
        date: iso, start: '18:30', end: '20:00',
        focus: 'Untitled session', drills: [],
        ...patch,
      }];
    });
  };

  const addDrill = (iso, drillId) => {
    setPractices(prev => {
      const existing = prev.find(p => p.date === iso);
      if (existing) {
        if (existing.drills.includes(drillId)) return prev;
        return prev.map(p => p.date === iso ? { ...p, drills: [...p.drills, drillId] } : p);
      }
      return [...prev, {
        id: `p_${Date.now()}`,
        date: iso, start: '18:30', end: '20:00',
        focus: 'Untitled session', drills: [drillId],
      }];
    });
  };

  const removeDrill = (iso, drillId) => {
    setPractices(prev => prev.map(p =>
      p.date === iso ? { ...p, drills: p.drills.filter(d => d !== drillId) } : p
    ));
  };

  const removePractice = (iso) =>
    setPractices(prev => prev.filter(p => p.date !== iso));

  const resetSeed = () => setPractices(SEED_PRACTICES);

  return { practices, setPractices, upsertPractice, addDrill, removeDrill, removePractice, resetSeed };
};

Object.assign(window, {
  DRILL_LIBRARY, DRILL_BY_ID, DRILL_CATS, CAT_COLOR,
  SEED_PRACTICES, MONTHS, MONTH_NAMES_SHORT, DAY_NAMES_SHORT,
  SEASON_YEAR, TODAY_ISO,
  toISO, parseISO, daysInMonth, firstDayOfMonth,
  FIXTURE_DATES, fixtureFor, startOfWeek, addDays, formatWeekRange,
  usePractices,
});
