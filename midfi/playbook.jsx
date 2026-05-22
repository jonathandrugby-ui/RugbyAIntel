/* RugbyAI mid-fi — Playbook: team calls + coaching frameworks + phase play */

/* ── Team Calls ── */
const TEAM_CALLS = {
  'General attack': [
    ['BLACK',      'Backs ball / quick hands wide'],
    ['BRUMBY',     'Ball played behind player or forward pod (dummy pod)'],
    ['PLUS / ZIP', 'Short pass to outside support'],
    ['MINUS',      'Short pass to inside cleaner'],
    ['RIO',        'Attack right side of field'],
    ['LONDON',     'Attack left side of field'],
    ['TAXI',       'Shape off 9 — Taxi, Big Taxi, Inside Cleaner, Stormers'],
    ['BUS',        'Shape off 10 — Bus, Big Bus, Inside Cleaner, Stormers'],
    ['BULLS',      'Forwards pick and drive'],
    ['STORMERS',   'Back pass to 10 or 12; outside Plus runs blocker'],
  ],
  'General defence': [
    ['PILLAR / POST / OBS', '1st, 2nd, 3rd defender arriving at the ruck'],
    ['JACKLE',    'Brace over tackle to steal the ball'],
    ['DOUBLES',   'Double-hit tackles on ball carrier'],
    ['CHOP',      'Chop tackle on legs'],
    ['VOETE',     'Give referee the offside line'],
    ['CRUSADER',  'Everyone out the ruck; numbers on feet'],
    ['FIRE',      'Counter ruck and drive through'],
    ['CHOKE',     'Hold player up in tackle (form maul)'],
    ['CATCH-UP',  'Defender on inside of hitter / tackler'],
    ['BLITZ',     'Pressing defence'],
  ],
  'Zones': [
    ['RUGBY ZONE', 'Field between 22 metre lines'],
    ['GREEN ZONE', 'Attacking half — build phases here'],
    ['RED ZONE',   'Own 22 — exit territory'],
    ['BMW',        'Field division — B = LEFT, M = MIDDLE, W = RIGHT'],
  ],
};

/* ── Priority Allocation Model ── */
const FACETS_DATA = [
  { rank: 1,  facet: 'Defensive Systems and Tackling',       pct: 22, min: 26, tier: 'CRITICAL',
    sub: 'Line speed · Tackle technique · Defensive shape · Spacing · Dominant collision · Chop tackle · Blitz/drift · Communication',
    notes: 'Missed tackles and spacing errors lose games faster than poor attack. Must drill daily. Non-negotiable.' },
  { rank: 2,  facet: 'Attack Shape and Phase Play',           pct: 18, min: 22, tier: 'CRITICAL',
    sub: 'Forward pod structure · Backline alignment · Strike plays · Phase continuity · Edge attack · Middle-field manipulation · Shape transitions',
    notes: 'Teams spend 60-70% of possession time in phase organisation. Shape fluency reduces hesitation under fatigue.' },
  { rank: 3,  facet: 'Breakdown and Ruck Speed',              pct: 15, min: 18, tier: 'CRITICAL',
    sub: 'Arrival timing · Cleanout technique · Ball presentation · Ruck spacing · Jackal systems · Counter-ruck · Fast-ball generation',
    notes: 'Breakdown dictates tempo, momentum, possession quality, and fatigue accumulation. Non-negotiable weekly focus.' },
  { rank: 4,  facet: 'Set Piece — Scrum and Lineout',         pct: 14, min: 17, tier: 'CRITICAL',
    sub: 'Scrum shape and binding · Engagement timing · Throwing accuracy · Jump/lift mechanics · Calling systems · Maul setup and defence · Defensive lineout',
    notes: 'Set piece determines launch quality, territory, penalties, and psychological control. Dominance here wins field position.' },
  { rank: 5,  facet: 'Tactical Kicking and Exit Systems',     pct: 10, min: 12, tier: 'IMPORTANT',
    sub: 'Exit structure · Box kick systems · Touch finding · Grubber/chip · Kick receipt · Restart kicks · Territorial chess · 50/22 trigger recognition',
    notes: 'Rugby is territory-driven. Poor exits destroy defensive energy and invite sustained pressure phases.' },
  { rank: 6,  facet: 'Conditioning and Collision Fitness',    pct: 6,  min: 7,  tier: 'IMPORTANT',
    sub: 'Aerobic base · Repeat sprint ability · Contact conditioning · Match fitness · Collision volume under fatigue · Recovery capacity',
    notes: 'Must be maintained weekly in-season but not overloaded. Integrate within contact drills where possible.' },
  { rank: 7,  facet: 'Restarts and Aerial Systems',           pct: 4,  min: 5,  tier: 'SUPPORTING',
    sub: 'Kickoff receipt structures · Aerial contest · Contestable restarts · Deep territorial restarts · Exit shape · Chase pod organisation',
    notes: 'Restart ownership creates momentum swings and territorial pressure. 4-5 restarts per match — each one matters.' },
  { rank: 8,  facet: 'Game Management and Scenario Training', pct: 4,  min: 5,  tier: 'SUPPORTING',
    sub: 'Playing with a lead · Chasing game · 14-man rugby · Wet weather · Final five minutes · Clock manipulation · One-score scenarios',
    notes: 'Clutch moments decide elite matches. Teams must rehearse pressure scenarios weekly to reduce decision hesitation.' },
  { rank: 9,  facet: 'Position-Specific Micro Skills',        pct: 3,  min: 4,  tier: 'SUPPLEMENTARY',
    sub: 'Scrumhalf service · Flyhalf kicking game · Lineout calling · Back-three aerial · Front-row mobility · Loosie breakdown roles',
    notes: 'Small refinements maintain technical sharpness. Best integrated into unit sessions within set piece and attack blocks.' },
  { rank: 10, facet: 'Transition and Broken Play',            pct: 2,  min: 2,  tier: 'SUPPLEMENTARY',
    sub: 'Turnover attack launch · Counterattack structure · Scramble defence · Broken field scanning · Reconnection speed',
    notes: 'Broken-field chaos creates high-value tries and catastrophic defensive risks. Drill recognition, not systems.' },
  { rank: 11, facet: 'Discipline and Referee Adaptation',     pct: 1,  min: 1,  tier: 'SUPPLEMENTARY',
    sub: 'Penalty reduction · High tackle prevention · Referee picture management · Captain communication · Emotional discipline',
    notes: 'Integrated throughout all training. Address patterns early in the week based on referee tendency and last match data.' },
  { rank: 12, facet: 'Psychological Prep and Leadership',     pct: 1,  min: 1,  tier: 'SUPPLEMENTARY',
    sub: 'Pressure handling · Resilience · Team talks · Accountability · Emotional regulation · Confidence · Leadership group activation',
    notes: 'Present daily in culture and expectation. Rarely dominates field session time. Embedded in standards and rituals.' },
];

const TIER_CFG = {
  CRITICAL:      { bg: 'rgba(184,65,45,.13)', fg: 'var(--warn)',      bar: '#b8413d', label: 'CRITICAL  >13%' },
  IMPORTANT:     { bg: 'rgba(201,148,30,.16)', fg: 'var(--accent-2)', bar: '#c9941e', label: 'IMPORTANT  6-12%' },
  SUPPORTING:    { bg: 'rgba(24,43,84,.10)',   fg: 'var(--primary)',  bar: '#2b4a7a', label: 'SUPPORTING  3-5%' },
  SUPPLEMENTARY: { bg: 'rgba(0,0,0,.05)',      fg: 'var(--ink-soft)', bar: '#9ca3af', label: 'SUPPLEMENTARY  <3%' },
};

/* ── Full Framework ── */
const FRAMEWORK_DATA = [
  { section: 'Core Game Understanding', subsections: [
    { name: 'Laws of the Game',  facets: 'World Rugby laws · Competition regulations · Advantage law · Offside laws · High tackle framework · Breakdown entry laws · Scrum sequence laws · Foul play interpretations · Discipline management · Referee etiquette' },
    { name: 'Game Philosophy',   facets: 'Team identity · Playing style · Risk tolerance · Territory vs possession · Physical dominance philosophy · Tempo strategy · Counterattack philosophy · Defensive identity · Win conditions · Game model development' },
  ]},
  { section: 'Physical Preparation', subsections: [
    { name: 'Strength Development',    facets: 'Absolute strength · Relative strength · Functional strength · Scrum-specific strength · Core stability · Posterior chain · Neck strength · Grip strength · Rotational strength · Contact strength' },
    { name: 'Conditioning',            facets: 'Aerobic base · Anaerobic conditioning · Repeat sprint ability · Match fitness · Recovery capacity · Work rate endurance · Position-specific conditioning · Fatigue resistance' },
    { name: 'Speed and Power',         facets: 'Acceleration · Max velocity · Change of direction · Agility · Explosive power · Reactive speed · Contact acceleration · First-step explosiveness' },
    { name: 'Mobility and Injury Prev',facets: 'Joint mobility · Hip mobility · Thoracic mobility · Dynamic warmups · Prehab systems · Load management · Return-to-play protocols · Concussion management · Recovery protocols' },
  ]},
  { section: 'Technical Skills', subsections: [
    { name: 'Passing',           facets: 'Spin pass · Pop pass · Short pass · Long pass · Offload · Skip pass · Passing under pressure · Both hands · Scrum-half service · Flat pass · Pull-back' },
    { name: 'Catching',          facets: 'High ball · Contested catch · Low ball pickup · Catch-pass fluency · Aerial contesting · Wet-weather handling' },
    { name: 'Kicking',           facets: 'Tactical kick · Box kick · Up-and-under · Spiral · Grubber · Chip · Goal kick · Touch finding · Exit kick · Restart kick · Kick chase · Pressure kicking' },
    { name: 'Running & Carrying',facets: 'Footwork · Evasion · Side step · Power running · Support lines · Decoy run · Change of pace · Dominant carry · Carry presentation · Post-contact metres' },
    { name: 'Contact Skills',    facets: 'Dominant tackle · Chop tackle · Smother tackle · Ball stripping · Jackaling · Clearouts · Counter-ruck · Body height · Collision dominance · Fend technique · Leg drive · Ball protection' },
  ]},
  { section: 'Set Piece', subsections: [
    { name: 'Scrum',    facets: 'Scrum shape · Binding technique · Body height · Engagement timing · Pressure generation · Hooking · Channel control · Stability · Loosehead/tighthead technique · Lock drive · Flanker roles · No.8 control · Scrum exits · Wheel control · Scrum analysis' },
    { name: 'Lineout',  facets: 'Throwing accuracy · Jump timing · Lift timing · Lift mechanics · Calling systems · Movement patterns · Defensive lineouts · Maul setup · Maul defence · Front/middle/tail options · Quick throws · Transition attack' },
    { name: 'Restarts', facets: 'Kickoff strategy · Kick receipt formations · Contestable restarts · Exit restarts · Recovery structures · Chase lines · Defensive restarts · Aerial contest' },
  ]},
  { section: 'Attack Systems', subsections: [
    { name: 'Shape and Structure', facets: 'Forward pod systems · Backline alignment · Width creation · Depth management · Layered attack · Strike plays · Phase structures · Multi-phase attack · Edge attack · Middle-field attack · Launch plays' },
    { name: 'Decision Making',     facets: 'Reading defensive pictures · Identifying mismatches · Tempo recognition · Space recognition · Numbers advantage · Advantage line recognition · Pressure management' },
    { name: 'Continuity',          facets: 'Quick ball · Ruck speed · Support play · Ball retention · Recycle efficiency · Offload systems · Phase count management' },
    { name: 'Red Zone Attack',     facets: '5m attack · Goal line attack · Pick-and-go · Power play · Short-side exploitation · Penalty advantage attack' },
  ]},
  { section: 'Defensive Systems', subsections: [
    { name: 'Defensive Shape',   facets: 'Drift · Blitz · Umbrella · Fold systems · Backfield coverage · Edge defence · Midfield organisation · Goal line defence · Transition defence · Phase defence' },
    { name: 'Technique',         facets: 'Line speed · Spacing · Communication · Dominant collisions · Inside-out defence · Chop-and-jackal · Tackle reload · Defensive scanning' },
    { name: 'Kick Defence',      facets: 'Chase organisation · Backfield positioning · Kick pressure · Counterattack containment · Aerial contests' },
    { name: 'Breakdown Defence', facets: 'Counter-rucking · Slowing ball · Spoiling techniques · Post-tackle reactions · Penalty avoidance' },
  ]},
  { section: 'Breakdown and Transition', subsections: [
    { name: 'Attack Breakdown',   facets: 'Arrival timing · Cleanout technique · Body position · Seal effectiveness · Ruck spacing · Ball presentation · Latch systems · Pillar roles' },
    { name: 'Defensive Breakdown',facets: 'Jackal timing · Counter-ruck entries · Spoiling body position · Turnover systems · Penalty avoidance' },
    { name: 'Transition Play',    facets: 'Attack-to-defence · Defence-to-attack · Kick transition · Turnover attack · Turnover defence · Broken play reactions' },
  ]},
  { section: 'Tactical Management', subsections: [
    { name: 'Territory',          facets: 'Field position strategy · Exit systems · Territorial kicking · Pressure zones · Corner kicking · Weather adaptation' },
    { name: 'Match Tempo',        facets: 'Fast tempo · Slow control · Momentum shifts · Fatigue exploitation · Clock management · Tactical stoppages' },
    { name: 'Opposition Analysis',facets: 'Pattern recognition · Weakness targeting · Key player identification · Set-piece tendencies · Defensive trends · Bench impact' },
    { name: 'Scenario Planning',  facets: 'Playing with lead · Chasing game · 14-man rugby · Wet weather · Knockout rugby · Final quarter · Golden point' },
  ]},
  { section: 'Position Specific', subsections: [
    { name: 'Front Row',     facets: 'Scrummaging · Carrying · Breakdown roles · Defensive responsibilities · Lineout lifting · Mobility' },
    { name: 'Locks',         facets: 'Scrum drive · Lineout calling · Maul management · Carry dominance · Work rate' },
    { name: 'Loose Forwards',facets: 'Breakdown contests · Linking play · Defensive coverage · Carry lines · Support play · Leadership' },
    { name: 'Backs',         facets: 'Scrumhalf service/box kick · Flyhalf tactical control · Centre defensive org · Back-three aerial/counterattack · Backfield coverage' },
  ]},
  { section: 'Communication and Leadership', subsections: [
    { name: 'On-Field Comms', facets: 'Defensive calls · Attack calls · Set-piece calls · Transition communication · Non-verbal' },
    { name: 'Leadership Dev', facets: 'Captaincy development · Leadership groups · Accountability systems · Emotional regulation · Composure under pressure · Standards enforcement' },
    { name: 'Team Culture',   facets: 'Shared values · Team standards · Trust building · Brotherhood and cohesion · Resilience culture · Accountability' },
  ]},
  { section: 'Psychological Coaching', subsections: [
    { name: 'Mental Toughness',facets: 'Pressure handling · Emotional control · Resilience · Confidence building · Recovery from mistakes · Focus training · Aggression control' },
    { name: 'Motivation',      facets: 'Goal setting · Identity development · Role clarity · Buy-in creation · Intrinsic motivation' },
    { name: 'Team Psychology', facets: 'Group cohesion · Conflict management · Momentum psychology · Crowd management · Pressure moments' },
  ]},
  { section: 'Match Day Management', subsections: [
    { name: 'Pre-Match',  facets: 'Team talks · Warmup management · Mental preparation · Tactical reminders · Emotional control' },
    { name: 'In-Match',   facets: 'Tactical adjustments · Substitution timing · Referee management · Momentum intervention · Real-time analysis' },
    { name: 'Half-Time',  facets: 'Performance review · Tactical correction · Emotional reset · Re-motivation · Re-organisation' },
    { name: 'Post-Match', facets: 'Debriefing · Recovery management · Performance review · Video review preparation' },
  ]},
  { section: 'Analysis and Data', subsections: [
    { name: 'Video Analysis',        facets: 'Individual review · Unit review · Team review · Opposition review · Skill breakdowns · Decision analysis' },
    { name: 'Performance Metrics',   facets: 'Tackle completion · Gain line success · Ruck speed · Set-piece percentages · Kick retention · Work rate' },
    { name: 'GPS and Sports Science', facets: 'Player load · Sprint counts · Distance covered · Collision counts · Fatigue monitoring' },
  ]},
  { section: 'Training Design', subsections: [
    { name: 'Session Planning', facets: 'Weekly periodization · Seasonal planning · Skill blocks · Unit sessions · Conditioning integration · Intensity management' },
    { name: 'Drill Design',     facets: 'Game-realistic drills · Constraint-based games · Pressure drills · Contact conditioning · Decision-making drills' },
    { name: 'Learning Method',  facets: 'Demonstration · Guided discovery · Feedback systems · Video learning · Peer coaching · Error correction' },
  ]},
  { section: 'Discipline and Standards', subsections: [
    { name: 'Discipline Mgmt', facets: 'Penalty reduction · Referee respect · Emotional discipline · High tackle prevention · Professional standards' },
    { name: 'Accountability',  facets: 'Attendance standards · Effort standards · Behavioural standards · Team-first mentality · Leadership accountability' },
  ]},
];

/* ═══════════════════════════════════════════════════════
   PHASE PLAY FIELD EDITOR
   ═══════════════════════════════════════════════════════ */

const FIELD_W = 440;
const FIELD_H = 630;

/* Pre-loaded formations from PDF */
const PRESET_PLAYS = [
  {
    id: 'london-left',
    name: 'London / Left',
    call: 'LONDON',
    subtitle: 'Wide ruck — left channel. M0: Middle, Wide, Taxi, Bus, Wide & Repeat',
    ruck: { x: 17, y: 56 },
    players: [
      { id: 'p11', jersey: 11, x: 5,  y: 22 },
      { id: 'p13', jersey: 13, x: 14, y: 28 },
      { id: 'p15', jersey: 15, x: 10, y: 35 },
      { id: 'p9',  jersey: 9,  x: 18, y: 56 },
      { id: 'p10', jersey: 10, x: 28, y: 64 },
      { id: 'p4',  jersey: 4,  x: 22, y: 37 },
      { id: 'p6',  jersey: 6,  x: 21, y: 44 },
      { id: 'p5',  jersey: 5,  x: 29, y: 44 },
      { id: 'p2',  jersey: 2,  x: 51, y: 43 },
      { id: 'p3',  jersey: 3,  x: 55, y: 51 },
      { id: 'p1',  jersey: 1,  x: 61, y: 51 },
      { id: 'p12', jersey: 12, x: 65, y: 51 },
      { id: 'p7',  jersey: 7,  x: 62, y: 60 },
      { id: 'p8',  jersey: 8,  x: 70, y: 60 },
      { id: 'p14', jersey: 14, x: 94, y: 56 },
    ],
    arrows: [
      { id: 'a1', x1: 21, y1: 44, x2: 17, y2: 29, type: 'run' },
      { id: 'a2', x1: 29, y1: 44, x2: 24, y2: 31, type: 'run' },
      { id: 'a3', x1: 28, y1: 64, x2: 51, y2: 43, type: 'pass' },
    ],
    labels: [
      { x: 19, y: 41, text: 'LOCK POD + FLANK', align: 'start' },
      { x: 50, y: 39, text: 'FRONT ROW POD', align: 'middle' },
      { x: 67, y: 58, text: 'CENTER POD + FLANK, 8', align: 'start' },
      { x: 3,  y: 19, text: 'WING 13 & 15 — WIDE RUCK', align: 'start' },
      { x: 96, y: 53, text: 'KICK CHASE / WIDE', align: 'end' },
    ],
    structure: [
      { pod: 'LOCK POD (#4, 5, 6)', role: 'Primary carry — attack the gain line up the left channel' },
      { pod: 'FRONT ROW POD (#1, 2, 3)', role: '10 distributes wide; front row provides second option' },
      { pod: 'CENTER POD (#7, 8, 12)', role: 'Third option / clear-out body at breakdown' },
      { pod: 'BACKS (#11, 13, 15)', role: 'Provide width on attack side — strike option or reset' },
      { pod: '#14 (far wing)', role: 'Outwide for kick chase or wide strike option' },
    ],
    options10: ['TAXI', 'STORMERS', 'BRUMBY'],
  },
  {
    id: 'rio-right',
    name: 'Rio / Right',
    call: 'RIO',
    subtitle: 'Wide ruck — right channel. M0: Middle, Wide, Taxi, Bus, Wide & Repeat',
    ruck: { x: 83, y: 56 },
    players: [
      { id: 'p14', jersey: 14, x: 95, y: 22 },
      { id: 'p13', jersey: 13, x: 86, y: 28 },
      { id: 'p15', jersey: 15, x: 90, y: 35 },
      { id: 'p9',  jersey: 9,  x: 82, y: 56 },
      { id: 'p10', jersey: 10, x: 72, y: 64 },
      { id: 'p4',  jersey: 4,  x: 78, y: 37 },
      { id: 'p6',  jersey: 6,  x: 79, y: 44 },
      { id: 'p5',  jersey: 5,  x: 71, y: 44 },
      { id: 'p2',  jersey: 2,  x: 49, y: 43 },
      { id: 'p3',  jersey: 3,  x: 45, y: 51 },
      { id: 'p1',  jersey: 1,  x: 39, y: 51 },
      { id: 'p12', jersey: 12, x: 35, y: 51 },
      { id: 'p7',  jersey: 7,  x: 38, y: 60 },
      { id: 'p8',  jersey: 8,  x: 30, y: 60 },
      { id: 'p11', jersey: 11, x: 6,  y: 56 },
    ],
    arrows: [
      { id: 'a1', x1: 79, y1: 44, x2: 83, y2: 29, type: 'run' },
      { id: 'a2', x1: 71, y1: 44, x2: 76, y2: 31, type: 'run' },
      { id: 'a3', x1: 72, y1: 64, x2: 49, y2: 43, type: 'pass' },
    ],
    labels: [
      { x: 81, y: 41, text: 'LOCK POD + FLANK', align: 'end' },
      { x: 50, y: 39, text: 'FRONT ROW POD', align: 'middle' },
      { x: 33, y: 58, text: 'CENTER POD + FLANK, 8', align: 'end' },
      { x: 97, y: 19, text: 'WING 13 & 15 — WIDE RUCK', align: 'end' },
      { x: 4,  y: 53, text: 'KICK CHASE / WIDE', align: 'start' },
    ],
    structure: [
      { pod: 'LOCK POD (#4, 5, 6)', role: 'Primary carry — attack the gain line up the right channel' },
      { pod: 'FRONT ROW POD (#1, 2, 3)', role: '10 distributes wide; front row provides second option' },
      { pod: 'CENTER POD (#7, 8, 12)', role: 'Third option / clear-out body at breakdown' },
      { pod: 'BACKS (#13, 14, 15)', role: 'Provide width on attack side — strike option or reset' },
      { pod: '#11 (far wing)', role: 'Outwide for kick chase or wide strike option' },
    ],
    options10: ['TAXI', 'STORMERS', 'BRUMBY'],
  },
  {
    id: 'middle',
    name: 'Middle / Black',
    call: 'BLACK',
    subtitle: 'Centre-field attack — direct running, both pods active',
    ruck: { x: 50, y: 57 },
    players: [
      { id: 'p9',  jersey: 9,  x: 50, y: 57 },
      { id: 'p10', jersey: 10, x: 40, y: 65 },
      { id: 'p12', jersey: 12, x: 30, y: 63 },
      { id: 'p13', jersey: 13, x: 20, y: 61 },
      { id: 'p15', jersey: 15, x: 12, y: 56 },
      { id: 'p11', jersey: 11, x: 5,  y: 50 },
      { id: 'p14', jersey: 14, x: 95, y: 50 },
      { id: 'p4',  jersey: 4,  x: 36, y: 43 },
      { id: 'p6',  jersey: 6,  x: 43, y: 50 },
      { id: 'p5',  jersey: 5,  x: 29, y: 43 },
      { id: 'p2',  jersey: 2,  x: 52, y: 43 },
      { id: 'p3',  jersey: 3,  x: 57, y: 50 },
      { id: 'p1',  jersey: 1,  x: 63, y: 50 },
      { id: 'p7',  jersey: 7,  x: 67, y: 56 },
      { id: 'p8',  jersey: 8,  x: 72, y: 50 },
    ],
    arrows: [
      { id: 'a1', x1: 36, y1: 43, x2: 32, y2: 28, type: 'run' },
      { id: 'a2', x1: 63, y1: 50, x2: 67, y2: 35, type: 'run' },
      { id: 'a3', x1: 40, y1: 65, x2: 52, y2: 43, type: 'pass' },
    ],
    labels: [
      { x: 33, y: 40, text: 'LEFT POD', align: 'start' },
      { x: 52, y: 40, text: 'HOOKER', align: 'middle' },
      { x: 73, y: 53, text: 'RIGHT POD / 8', align: 'start' },
    ],
    structure: [
      { pod: 'LEFT POD (#4, 5, 6)', role: 'Attack the left-centre gain line — direct carry' },
      { pod: 'HOOKER (#2)', role: 'Middle option off 9 — draws the defence in' },
      { pod: 'RIGHT POD (#3, 1, 7, 8)', role: 'Exploit space opened on the right after left-pod carry' },
      { pod: 'BACKS (wide)', role: 'Provide width both sides for strike when line breaks' },
    ],
    options10: ['BLACK BALL', 'SNAP PLAY'],
  },
  {
    id: 'snap',
    name: 'Snap / Reset',
    call: 'SNAP',
    subtitle: 'Return to wide ruck shape after snap play is used',
    ruck: { x: 38, y: 48 },
    players: [
      { id: 'p9',  jersey: 9,  x: 38, y: 48 },
      { id: 'p10', jersey: 10, x: 55, y: 55 },
      { id: 'p2',  jersey: 2,  x: 35, y: 40 },
      { id: 'p3',  jersey: 3,  x: 41, y: 44 },
      { id: 'p1',  jersey: 1,  x: 47, y: 44 },
      { id: 'p4',  jersey: 4,  x: 28, y: 36 },
      { id: 'p6',  jersey: 6,  x: 30, y: 43 },
      { id: 'p5',  jersey: 5,  x: 36, y: 36 },
      { id: 'p12', jersey: 12, x: 72, y: 50 },
      { id: 'p7',  jersey: 7,  x: 68, y: 58 },
      { id: 'p8',  jersey: 8,  x: 75, y: 58 },
      { id: 'p13', jersey: 13, x: 28, y: 55 },
      { id: 'p15', jersey: 15, x: 20, y: 48 },
      { id: 'p11', jersey: 11, x: 6,  y: 58 },
      { id: 'p14', jersey: 14, x: 94, y: 48 },
    ],
    arrows: [
      { id: 'a1', x1: 55, y1: 55, x2: 72, y2: 50, type: 'pass' },
      { id: 'a2', x1: 38, y1: 48, x2: 28, y2: 33, type: 'pass' },
      { id: 'a3', x1: 72, y1: 50, x2: 76, y2: 35, type: 'run' },
    ],
    labels: [
      { x: 25, y: 33, text: 'LOCK POD + FLANK', align: 'start' },
      { x: 42, y: 41, text: 'FRONT ROW POD', align: 'start' },
      { x: 73, y: 56, text: 'CENTER POD + 8', align: 'start' },
      { x: 38, y: 25, text: 'IF SNAP PLAY: RETURN TO WIDE RUCK SHAPE', align: 'middle' },
    ],
    structure: [
      { pod: '#10 OPTIONS', role: 'BLACK BALL — quick wide ball / SNAP PLAY — return shape' },
      { pod: '#12 OPTIONS', role: 'STORMERS / BRUMBY off the center pod' },
      { pod: 'WINGS #13 & 15', role: 'Return to provide width and snap play is active' },
    ],
    options10: ['BLACK BALL', 'SNAP PLAY'],
  },
];

/* Arrow type config */
const ARROW_CFG = {
  run:  { color: '#f0c040', dash: null,  label: 'Run line' },
  pass: { color: '#60ccff', dash: '7,4', label: 'Pass' },
  kick: { color: '#e8e8e8', dash: '3,5', label: 'Kick' },
};

/* Distance from point to line segment (pixels) */
const distToSeg = (px, py, ax, ay, bx, by) => {
  const dx = bx - ax, dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
};

const deepClone = (o) => JSON.parse(JSON.stringify(o));

/* ── Field Editor component ── */
const FieldEditor = () => {
  const [players,    setPlayers]    = React.useState(() => deepClone(PRESET_PLAYS[0].players));
  const [arrows,     setArrows]     = React.useState(() => deepClone(PRESET_PLAYS[0].arrows));
  const [ruck,       setRuck]       = React.useState(PRESET_PLAYS[0].ruck);
  const [fieldLabels,setFieldLabels]= React.useState(PRESET_PLAYS[0].labels);
  const [activePlay, setActivePlay] = React.useState('london-left');
  const [tool,       setTool]       = React.useState('move');
  const [arrowStart, setArrowStart] = React.useState(null);
  const [dragging,   setDragging]   = React.useState(null);
  const [mousePos,   setMousePos]   = React.useState({ x: 50, y: 50 });
  const [showLabels, setShowLabels] = React.useState(true);
  const fieldRef = React.useRef(null);

  const loadPlay = (play) => {
    setPlayers(deepClone(play.players));
    setArrows(deepClone(play.arrows));
    setRuck(play.ruck);
    setFieldLabels(play.labels);
    setActivePlay(play.id);
    setArrowStart(null);
    setDragging(null);
  };

  /* Document-level drag + mouse-track */
  React.useEffect(() => {
    const onMove = (e) => {
      const field = fieldRef.current;
      if (!field) return;
      const rect = field.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      setMousePos({ x, y });
      if (dragging) {
        setPlayers(prev => prev.map(p =>
          p.id === dragging
            ? { ...p, x: Math.max(1, Math.min(99, x)), y: Math.max(1, Math.min(99, y)) }
            : p
        ));
      }
    };
    const onUp = () => setDragging(null);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    };
  }, [dragging]);

  /* Escape cancels arrow draw */
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setArrowStart(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleArrowPoint = (x, y) => {
    if (!arrowStart) {
      setArrowStart({ x, y });
    } else {
      if (Math.hypot(x - arrowStart.x, y - arrowStart.y) > 2) {
        setArrows(prev => [...prev, {
          id: Date.now(),
          x1: arrowStart.x, y1: arrowStart.y,
          x2: x,            y2: y,
          type: tool,
        }]);
      }
      setArrowStart(null);
    }
  };

  const handleFieldClick = (e) => {
    const rect = fieldRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;

    if (tool === 'erase') {
      const fx = (x / 100) * FIELD_W;
      const fy = (y / 100) * FIELD_H;
      const hit = arrows.find(a =>
        distToSeg(fx, fy,
          (a.x1 / 100) * FIELD_W, (a.y1 / 100) * FIELD_H,
          (a.x2 / 100) * FIELD_W, (a.y2 / 100) * FIELD_H) < 12
      );
      if (hit) setArrows(prev => prev.filter(a => a.id !== hit.id));
      return;
    }
    if (tool === 'run' || tool === 'pass' || tool === 'kick') {
      handleArrowPoint(x, y);
    }
  };

  const handlePlayerDown = (e, pid) => {
    e.stopPropagation();
    if (tool === 'move') {
      e.preventDefault();
      setDragging(pid);
    } else if (tool === 'run' || tool === 'pass' || tool === 'kick') {
      const p = players.find(pl => pl.id === pid);
      if (p) handleArrowPoint(p.x, p.y);
    } else if (tool === 'erase') {
      setPlayers(prev => prev.filter(p => p.id !== pid));
    }
  };

  /* SVG coordinate helpers */
  const px = (x) => (x / 100) * FIELD_W;
  const py = (y) => (y / 100) * FIELD_H;

  const activePlan = PRESET_PLAYS.find(p => p.id === activePlay);

  const TOOLS = [
    { id: 'move', icon: '↖', label: 'Move' },
    { id: 'run',  icon: '→', label: 'Run' },
    { id: 'pass', icon: '⇢', label: 'Pass' },
    { id: 'kick', icon: '⤸', label: 'Kick' },
    { id: 'erase',icon: '✕', label: 'Erase' },
  ];

  return (
    <div className="col" style={{ gap: 14 }}>

      {/* ── Toolbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        {/* Tool buttons */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--paper-2)', borderRadius: 10, padding: 4, border: '1px solid var(--line)' }}>
          {TOOLS.map(t => (
            <button
              key={t.id}
              title={t.label}
              onClick={() => { setTool(t.id); setArrowStart(null); }}
              style={{
                padding: '6px 12px', borderRadius: 7,
                border: 'none',
                background: tool === t.id ? 'var(--primary)' : 'transparent',
                color:      tool === t.id ? 'var(--accent)'  : 'var(--ink-soft)',
                cursor: 'pointer', fontFamily: 'var(--font-mono)',
                fontWeight: 700, fontSize: 11, letterSpacing: '.04em',
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'background .1s, color .1s',
              }}
            >
              <span style={{ fontSize: 14 }}>{t.icon}</span>
              <span>{t.label.toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setShowLabels(l => !l)}
            style={{
              padding: '6px 12px', borderRadius: 8,
              border: '1px solid var(--line)',
              background: showLabels ? 'var(--paper-2)' : 'transparent',
              color: showLabels ? 'var(--ink)' : 'var(--muted)',
              cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
            }}
          >≡ LABELS</button>
          <button
            onClick={() => setArrows([])}
            style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--line)', background: 'transparent', color: 'var(--warn)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700 }}
          >✕ CLEAR LINES</button>
          <button
            onClick={() => activePlan && loadPlay(activePlan)}
            style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--line)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700 }}
          >↺ RESET</button>
        </div>
      </div>

      {/* ── Main board ── */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>

        {/* Play library */}
        <div style={{ width: 158, flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'var(--muted)', marginBottom: 8 }}>SAVED PLAYS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {PRESET_PLAYS.map(play => (
              <button
                key={play.id}
                onClick={() => loadPlay(play)}
                style={{
                  textAlign: 'left', padding: '10px 12px', borderRadius: 10,
                  border: `1px solid ${activePlay === play.id ? 'var(--primary)' : 'var(--line)'}`,
                  background: activePlay === play.id ? 'rgba(24,43,84,.1)' : 'var(--paper-2)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '.07em',
                    padding: '1px 6px', borderRadius: 4,
                    background: activePlay === play.id ? 'var(--primary)' : 'var(--paper)',
                    color: activePlay === play.id ? 'var(--accent)' : 'var(--muted)',
                    border: '1px solid var(--line)',
                  }}>{play.call}</span>
                  <span style={{ fontWeight: 700, fontSize: 12, color: activePlay === play.id ? 'var(--primary)' : 'var(--ink)' }}>{play.name}</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.4 }}>
                  {play.subtitle.split('—')[0].split('.')[0].trim()}
                </div>
              </button>
            ))}
          </div>

          {/* Arrow legend */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'var(--muted)', marginBottom: 10 }}>LINE TYPES</div>
            {Object.entries(ARROW_CFG).map(([type, cfg]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <svg width="36" height="12" style={{ flexShrink: 0, overflow: 'visible' }}>
                  <defs>
                    <marker id={`lg-${type}`} markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                      <polygon points="0 0, 6 2, 0 4" fill={cfg.color} />
                    </marker>
                  </defs>
                  <line x1="2" y1="6" x2="28" y2="6"
                    stroke={cfg.color} strokeWidth="2.5"
                    strokeDasharray={cfg.dash || undefined}
                    markerEnd={`url(#lg-${type})`}
                  />
                </svg>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-soft)' }}>{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Field ── */}
        <div
          ref={fieldRef}
          onClick={handleFieldClick}
          onMouseMove={(e) => {
            const rect = fieldRef.current.getBoundingClientRect();
            setMousePos({
              x: ((e.clientX - rect.left) / rect.width)  * 100,
              y: ((e.clientY - rect.top)  / rect.height) * 100,
            });
          }}
          style={{
            width: FIELD_W, height: FIELD_H, position: 'relative', flexShrink: 0,
            background: 'linear-gradient(180deg, #25521f 0%, #2d6127 35%, #2d6127 65%, #25521f 100%)',
            borderRadius: 10, overflow: 'hidden',
            cursor: tool === 'move' ? (dragging ? 'grabbing' : 'default') : 'crosshair',
            boxShadow: '0 10px 40px rgba(0,0,0,.4)',
            userSelect: 'none',
          }}
        >
          {/* ── SVG: field markings + arrows ── */}
          <svg
            width={FIELD_W} height={FIELD_H}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          >
            <defs>
              {/* Arrow markers per type */}
              {Object.entries(ARROW_CFG).map(([type, cfg]) => (
                <marker key={type} id={`ah-${type}`}
                  markerWidth="11" markerHeight="8"
                  refX="9" refY="4" orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <polygon points="0 0, 11 4, 0 8" fill={cfg.color} />
                </marker>
              ))}
              <marker id="ah-preview"
                markerWidth="9" markerHeight="7"
                refX="7" refY="3.5" orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <polygon points="0 0, 9 3.5, 0 7" fill="rgba(255,255,255,.55)" />
              </marker>

              {/* Grass stripe pattern */}
              <pattern id="grass" x="0" y="0" width={FIELD_W / 8} height={FIELD_H} patternUnits="userSpaceOnUse">
                <rect width={FIELD_W / 8} height={FIELD_H} fill="rgba(0,0,0,0)" />
                <rect width={FIELD_W / 16} height={FIELD_H} fill="rgba(0,0,0,.04)" />
              </pattern>
            </defs>

            {/* Grass stripes */}
            <rect width={FIELD_W} height={FIELD_H} fill="url(#grass)" />

            {/* Try line */}
            <rect x="0" y="0" width={FIELD_W} height="16" fill="rgba(255,255,255,.04)" />
            <line x1="0" y1="16" x2={FIELD_W} y2="16" stroke="rgba(255,255,255,.7)" strokeWidth="2.5" />
            <text x={FIELD_W / 2} y="11" textAnchor="middle"
              fill="rgba(255,255,255,.45)" fontSize="8.5"
              fontFamily="monospace" fontWeight="700" letterSpacing="0.08em">
              TRY LINE ↑ ATTACK
            </text>

            {/* 22m line */}
            <line x1="0" y1={FIELD_H * 0.24} x2={FIELD_W} y2={FIELD_H * 0.24}
              stroke="rgba(255,255,255,.22)" strokeWidth="1.2" strokeDasharray="10,7" />
            <text x="8" y={FIELD_H * 0.24 - 4}
              fill="rgba(255,255,255,.28)" fontSize="7.5" fontFamily="monospace">22m</text>

            {/* 10m line */}
            <line x1="0" y1={FIELD_H * 0.12} x2={FIELD_W} y2={FIELD_H * 0.12}
              stroke="rgba(255,255,255,.1)" strokeWidth="1" strokeDasharray="6,8" />

            {/* Halfway */}
            <line x1="0" y1={FIELD_H * 0.5} x2={FIELD_W} y2={FIELD_H * 0.5}
              stroke="rgba(255,255,255,.28)" strokeWidth="1.5" strokeDasharray="14,9" />
            <text x="8" y={FIELD_H * 0.5 - 4}
              fill="rgba(255,255,255,.32)" fontSize="7.5" fontFamily="monospace">50m</text>

            {/* Offside / gain line (dashed, just below ruck) */}
            <line x1="0" y1={py(ruck.y)} x2={FIELD_W} y2={py(ruck.y)}
              stroke="rgba(255,200,50,.25)" strokeWidth="1" strokeDasharray="4,6" />
            <text x={FIELD_W - 6} y={py(ruck.y) - 4} textAnchor="end"
              fill="rgba(255,200,50,.35)" fontSize="7" fontFamily="monospace">GAIN LINE</text>

            {/* Touchlines */}
            <line x1="3" y1="0" x2="3" y2={FIELD_H} stroke="rgba(255,255,255,.5)" strokeWidth="2" />
            <line x1={FIELD_W - 3} y1="0" x2={FIELD_W - 3} y2={FIELD_H} stroke="rgba(255,255,255,.5)" strokeWidth="2" />

            {/* Ruck marker */}
            <ellipse cx={px(ruck.x)} cy={py(ruck.y)} rx="18" ry="10"
              fill="#7a3a10" />
            <ellipse cx={px(ruck.x)} cy={py(ruck.y)} rx="18" ry="10"
              fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.2" />
            <text x={px(ruck.x)} y={py(ruck.y) + 3.5} textAnchor="middle"
              fill="white" fontSize="7.5" fontFamily="monospace" fontWeight="700"
              letterSpacing="0.06em">RUCK</text>

            {/* ── Drawn arrows ── */}
            {arrows.map(a => {
              const cfg = ARROW_CFG[a.type] || ARROW_CFG.run;
              return (
                <line key={a.id}
                  x1={px(a.x1)} y1={py(a.y1)}
                  x2={px(a.x2)} y2={py(a.y2)}
                  stroke={cfg.color} strokeWidth="2.8"
                  strokeDasharray={cfg.dash || undefined}
                  markerEnd={`url(#ah-${a.type})`}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Preview arrow */}
            {arrowStart && (
              <>
                <line
                  x1={px(arrowStart.x)} y1={py(arrowStart.y)}
                  x2={px(mousePos.x)}   y2={py(mousePos.y)}
                  stroke="rgba(255,255,255,.4)" strokeWidth="2"
                  strokeDasharray="5,4"
                  markerEnd="url(#ah-preview)"
                />
                <circle cx={px(arrowStart.x)} cy={py(arrowStart.y)} r="5"
                  fill="rgba(255,255,255,.65)" />
              </>
            )}

            {/* Pod labels */}
            {showLabels && fieldLabels.map((lbl, i) => (
              <text key={i}
                x={px(lbl.x)} y={py(lbl.y)}
                textAnchor={lbl.align}
                fill="rgba(255,255,255,.52)"
                fontSize="7.5" fontFamily="monospace"
                fontWeight="700" letterSpacing="0.06em"
              >{lbl.text}</text>
            ))}

            {/* Defensive end label */}
            <text x={FIELD_W / 2} y={FIELD_H - 7} textAnchor="middle"
              fill="rgba(255,255,255,.2)" fontSize="8" fontFamily="monospace">
              ▼ DEFENSIVE END
            </text>
          </svg>

          {/* ── Player tokens ── */}
          {players.map(p => {
            const isSource = arrowStart &&
              Math.abs(p.x - arrowStart.x) < 1.5 &&
              Math.abs(p.y - arrowStart.y) < 1.5;
            const isDragged = dragging === p.id;
            return (
              <div
                key={p.id}
                onMouseDown={e => handlePlayerDown(e, p.id)}
                style={{
                  position: 'absolute',
                  left: `${p.x}%`, top: `${p.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: 30, height: 30, borderRadius: '50%',
                  background: isSource ? '#f0c040' : '#d04a24',
                  color: isSource ? '#1a1200' : '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700, fontSize: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: tool === 'move' ? (isDragged ? 'grabbing' : 'grab') : 'crosshair',
                  zIndex: isDragged ? 20 : 4,
                  boxShadow: isDragged
                    ? '0 6px 20px rgba(0,0,0,.7)'
                    : '0 2px 8px rgba(0,0,0,.5)',
                  border: `2.5px solid ${isSource ? '#f0c040' : 'rgba(255,255,255,.55)'}`,
                  transform: `translate(-50%, -50%) scale(${isDragged ? 1.15 : 1})`,
                  transition: isDragged ? 'none' : 'transform .1s, box-shadow .1s',
                }}
              >
                {p.jersey}
              </div>
            );
          })}

          {/* Arrow-draw hint */}
          {arrowStart && (
            <div style={{
              position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,.72)', borderRadius: 7, padding: '5px 14px',
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.06em',
              color: 'rgba(255,255,255,.85)', pointerEvents: 'none', whiteSpace: 'nowrap',
            }}>
              Click to place end point · Esc to cancel
            </div>
          )}

          {/* Erase mode badge */}
          {tool === 'erase' && !arrowStart && (
            <div style={{
              position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(184,65,45,.88)', borderRadius: 7, padding: '4px 14px',
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.07em',
              color: 'white', pointerEvents: 'none', whiteSpace: 'nowrap',
            }}>
              ERASE — click a line or player to remove
            </div>
          )}
        </div>

        {/* ── Right info panel ── */}
        {activePlan && (
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Active play card */}
            <div className="card dark" style={{ padding: '16px 18px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.12em', color: 'rgba(255,255,255,.38)', marginBottom: 4 }}>
                ACTIVE PLAY
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 10, letterSpacing: '.08em',
                  color: 'var(--accent)', background: 'rgba(255,255,255,.07)',
                  padding: '2px 8px', borderRadius: 5,
                }}>{activePlan.call}</span>
                <span style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>{activePlan.name}</span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', lineHeight: 1.55 }}>
                {activePlan.subtitle}
              </div>
              {activePlan.options10 && (
                <div style={{ marginTop: 10, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,.4)', marginRight: 2 }}>10 OPTIONS:</span>
                  {activePlan.options10.map(o => (
                    <span key={o} style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '.06em',
                      color: 'var(--accent)', background: 'rgba(255,255,255,.06)',
                      padding: '2px 7px', borderRadius: 4, border: '1px solid rgba(255,255,255,.08)',
                    }}>{o}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Pod structure */}
            {activePlan.structure && (
              <div className="card" style={{ padding: '12px 14px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'var(--muted)', marginBottom: 10 }}>
                  STRUCTURE
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {activePlan.structure.map((s, i) => (
                    <div key={i} style={{ padding: '8px 10px', background: 'var(--paper-2)', borderRadius: 8, borderLeft: '3px solid var(--primary)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 10, letterSpacing: '.05em', color: 'var(--primary)', marginBottom: 2 }}>{s.pod}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.45 }}>{s.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Controls help */}
            <div className="card" style={{ padding: '12px 14px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'var(--muted)', marginBottom: 10 }}>
                HOW TO USE
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                  { icon: '↖', tip: 'MOVE — drag any player to reposition on the field' },
                  { icon: '→', tip: 'RUN — click start then end point to draw a run line' },
                  { icon: '⇢', tip: 'PASS — click two points to draw a pass arrow' },
                  { icon: '⤸', tip: 'KICK — draw a kick trajectory between two points' },
                  { icon: '✕', tip: 'ERASE — click a line or player token to remove it' },
                ].map((h, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13,
                      color: 'var(--primary)', width: 16, flexShrink: 0, lineHeight: 1.3,
                    }}>{h.icon}</span>
                    <span style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{h.tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   PLAYBOOK COMPONENT
   ══════════════════════════════════════════════════════════ */
const Playbook = () => {
  const [tab, setTab] = React.useState('calls');
  const [openSections, setOpenSections] = React.useState({});

  const toggleSection = (key) =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Team reference · attack, defence &amp; framework</div>
          <h1>Playbook</h1>
          <div className="meta">35 calls · Priority allocation model · Full coaching framework · Phase play board</div>
        </div>
        <div className="row gap-3">
          <button className="btn"><span className="ico">⤓</span> Print one-pager</button>
          <button className="btn primary"><span className="ico">+</span> Add call</button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="toolbar" style={{ marginBottom: 16 }}>
        {[
          { id: 'calls',     label: 'Team Calls' },
          { id: 'facets',    label: 'Session Allocations' },
          { id: 'framework', label: 'Full Framework' },
          { id: 'plays',     label: '◈ Phase Play' },
        ].map(t => (
          <button
            key={t.id}
            className={`chip ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >{t.label}</button>
        ))}
      </div>

      {/* ─── Tab: Team Calls ─── */}
      {tab === 'calls' && (
        <div className="split three">
          {Object.entries(TEAM_CALLS).map(([section, items]) => (
            <div key={section} className="card">
              <div className="card-title" style={{ marginBottom: 10 }}>{section}</div>
              <div className="col" style={{ gap: 6 }}>
                {items.map(([term, def]) => (
                  <div key={term} style={{ padding: '8px 10px', background: 'var(--paper-2)', borderRadius: 8 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, letterSpacing: '.06em' }}>{term}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{def}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Tab: Session Allocations ─── */}
      {tab === 'facets' && (
        <div className="col" style={{ gap: 14 }}>
          <div className="card dark">
            <div className="card-head" style={{ marginBottom: 10 }}>
              <div className="card-title" style={{ color: 'var(--accent)', fontSize: 15, letterSpacing: '.04em' }}>
                RUGBY COACHING FACETS FRAMEWORK — PRIORITY ALLOCATION MODEL
              </div>
              <span className="mono" style={{ color: 'rgba(255,255,255,.5)' }}>120-min field session</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', height: 14, borderRadius: 6, overflow: 'hidden', gap: 1 }}>
                {FACETS_DATA.map(f => (
                  <div key={f.rank}
                    style={{ width: `${f.pct}%`, background: TIER_CFG[f.tier].bar, flexShrink: 0 }}
                    title={`${f.facet} — ${f.pct}% (${f.min}min)`}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,.45)' }}>
                <span>0%</span><span>50%</span><span>100% · 120min field session</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {Object.entries(TIER_CFG).map(([tier, cfg]) => (
                <div key={tier} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 2, background: cfg.bar, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '.06em', color: 'rgba(255,255,255,.7)' }}>{cfg.label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,.55)', lineHeight: 1.5 }}>
              Excludes: warm-up (15 min) · touch rugby (10 min) · coach chat (5 min) — add 30 min overhead per field session
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="table" style={{ margin: 0, borderRadius: 0 }}>
              <thead>
                <tr>
                  <th style={{ width: 36 }}>#</th>
                  <th style={{ width: 220 }}>Coaching Facet</th>
                  <th style={{ width: 44 }} className="num">%</th>
                  <th style={{ width: 60 }} className="num">Min/120</th>
                  <th style={{ width: 110 }}>Tier</th>
                  <th>Key Sub-Facets</th>
                  <th style={{ width: 240 }}>Coaching Notes</th>
                </tr>
              </thead>
              <tbody>
                {FACETS_DATA.map(f => {
                  const cfg = TIER_CFG[f.tier];
                  return (
                    <tr key={f.rank}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--ink-soft)', textAlign: 'center' }}>{f.rank}</td>
                      <td style={{ fontWeight: 600, fontSize: 13 }}>{f.facet}</td>
                      <td className="num" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{f.pct}%</td>
                      <td className="num">
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--primary)' }}>{f.min}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)' }}>m</span>
                      </td>
                      <td>
                        <span style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 9, letterSpacing: '.06em', padding: '3px 8px', borderRadius: 4, background: cfg.bg, color: cfg.fg }}>{f.tier}</span>
                      </td>
                      <td style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{f.sub}</td>
                      <td style={{ fontSize: 11, color: 'var(--ink)', lineHeight: 1.55, borderLeft: `3px solid ${cfg.bar}`, paddingLeft: 10 }}>{f.notes}</td>
                    </tr>
                  );
                })}
                <tr style={{ background: 'var(--paper-2)', fontWeight: 700 }}>
                  <td />
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.04em', color: 'var(--ink-soft)' }}>TOTAL SESSION ALLOCATION</td>
                  <td className="num" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>100%</td>
                  <td className="num" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>120m</td>
                  <td /><td colSpan={2} style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>
                    Excludes: warm-up (15 min) · touch rugby (10 min) · coach chat (5 min) → add 30 min overhead per field session
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Tab: Full Framework ─── */}
      {tab === 'framework' && (
        <div className="col" style={{ gap: 8 }}>
          <div style={{ padding: '10px 14px', background: 'var(--paper-2)', borderRadius: 10, border: '1px solid var(--line)', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            Complete coaching framework — all facets across all domains. Click a section to expand.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {FRAMEWORK_DATA.map((sec) => {
              const isOpen = !!openSections[sec.section];
              return (
                <div key={sec.section} style={{ border: '1px solid var(--line)', borderRadius: 10, background: 'var(--chalk)', overflow: 'hidden' }}>
                  <button
                    onClick={() => toggleSection(sec.section)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '11px 16px', background: isOpen ? 'var(--primary)' : 'transparent',
                      border: 0, cursor: 'pointer', textAlign: 'left', gap: 8,
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11, letterSpacing: '.08em', color: isOpen ? 'var(--accent)' : 'var(--primary)', textTransform: 'uppercase' }}>{sec.section}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: isOpen ? 'rgba(255,255,255,.5)' : 'var(--muted)' }}>{sec.subsections.length} subsections</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: isOpen ? 'rgba(255,255,255,.7)' : 'var(--ink-soft)', display: 'inline-block', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform .12s' }}>›</span>
                    </div>
                  </button>
                  {isOpen && (
                    <div style={{ borderTop: '1px solid var(--line)' }}>
                      {sec.subsections.map((sub, i) => (
                        <div key={sub.name} style={{ padding: '10px 16px', borderBottom: i < sec.subsections.length - 1 ? '1px solid var(--line)' : 'none' }}>
                          <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 4, color: 'var(--ink)' }}>{sub.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                            {sub.facets.split(' · ').map((facet, fi) => (
                              <span key={fi} style={{ padding: '1px 5px', borderRadius: 3, background: 'var(--paper-2)', border: '1px solid var(--line)', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, color: 'var(--ink-soft)', display: 'inline-block', margin: '1px 2px' }}>{facet}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Tab: Phase Play ─── */}
      {tab === 'plays' && <FieldEditor />}
    </div>
  );
};

Object.assign(window, { Playbook });
