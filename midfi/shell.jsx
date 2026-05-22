/* RugbyAI mid-fi — Shell components and shared data */

/* ---- Real Pumas RFC data extracted from the spreadsheet ---- */
const SQUAD = [
  { n: 1,  fn: 'Adon',     ln: 'Blaaws',         pos: 'Utility Back',    status: 'Committed', fit: 'Good',    contract: false, caps: 187, phone: true },
  { n: 2,  fn: 'Luca',     ln: 'Ambrosi',        pos: 'Utility Forward', status: '—',         fit: 'Good',    contract: false, caps: 64,  phone: true },
  { n: 3,  fn: 'Jesse-Lee',ln: 'Barnier',        pos: 'Wing',            status: '—',         fit: 'Good',    contract: false, caps: 41,  phone: true },
  { n: 4,  fn: 'Vuyo',     ln: 'Bistoli',        pos: 'Utility Forward', status: 'Unknown',   fit: 'Good',    contract: false, caps: 28,  phone: true },
  { n: 5,  fn: 'Luthando', ln: 'Bulana',         pos: 'Prop',            status: 'Committed', fit: 'Good',    contract: true,  caps: 155, phone: true },
  { n: 6,  fn: 'Arnold',   ln: 'Bunu',           pos: 'Wing',            status: '—',         fit: 'Good',    contract: false, caps: 32,  phone: true },
  { n: 7,  fn: 'Richwen',  ln: 'Codee-Waries',   pos: 'Utility Forward', status: 'Committed', fit: 'Injured', contract: false, caps: 98,  phone: true },
  { n: 8,  fn: 'Ethan',    ln: 'Coetzee',        pos: 'Utility Forward', status: 'Committed', fit: 'Good',    contract: true,  caps: 141, phone: true },
  { n: 9,  fn: 'Reginald', ln: 'Fulla',          pos: 'Utility Forward', status: 'Committed', fit: 'Good',    contract: true,  caps: 128, phone: true },
  { n: 10, fn: 'Siyasanga',ln: 'Mkiva',          pos: 'Hooker',          status: 'Committed', fit: 'Good',    contract: true,  caps: 224, phone: true },
  { n: 11, fn: 'Thabo',    ln: 'Jacobs',         pos: 'Lock',            status: 'Committed', fit: 'Good',    contract: false, caps: 87,  phone: true },
  { n: 12, fn: 'Khaya',    ln: 'Mathebula',      pos: 'Scrumhalf',       status: 'Committed', fit: 'Good',    contract: true,  caps: 95,  phone: true },
  { n: 13, fn: 'Marius',   ln: 'Naidoo',         pos: 'Flyhalf',         status: 'Committed', fit: 'Good',    contract: true,  caps: 102, phone: true },
  { n: 14, fn: 'Bongani',  ln: 'Davids',         pos: 'Blindside Flank', status: 'Committed', fit: 'Good',    contract: false, caps: 73,  phone: true },
  { n: 15, fn: 'Lwazi',    ln: 'Ngubane',        pos: 'Openside Flank',  status: '—',         fit: 'Good',    contract: false, caps: 56,  phone: true },
  { n: 16, fn: 'Pierre',   ln: 'Petersen',       pos: '8th Man',         status: 'Committed', fit: 'Good',    contract: true,  caps: 119, phone: true },
  { n: 17, fn: 'Stefan',   ln: 'Mtawana',        pos: 'Outside Centre',  status: 'Committed', fit: 'Good',    contract: false, caps: 78,  phone: true },
  { n: 18, fn: 'Devon',    ln: 'Adams',          pos: 'Inside Centre',   status: 'Committed', fit: 'Good',    contract: true,  caps: 81,  phone: true },
  { n: 19, fn: 'Tafadzwa', ln: 'Moyo',           pos: 'Lock',            status: 'Unknown',   fit: 'Recovering', contract: false, caps: 38,  phone: false },
  { n: 20, fn: 'Sipho',    ln: 'Nkosi',          pos: 'Prop',            status: 'Committed', fit: 'Good',    contract: false, caps: 67,  phone: true },
  { n: 21, fn: 'Jordy',    ln: 'van Wyk',        pos: 'Fullback',        status: 'Committed', fit: 'Good',    contract: true,  caps: 91,  phone: true },
  { n: 22, fn: 'Tinashe',  ln: 'Chideya',        pos: 'Wing',            status: 'Committed', fit: 'Good',    contract: false, caps: 44,  phone: true },
  { n: 23, fn: 'Rashid',   ln: 'Cassiem',        pos: 'Hooker',          status: '—',         fit: 'Good',    contract: false, caps: 22,  phone: false },
  { n: 24, fn: 'Conrad',   ln: 'le Roux',        pos: 'Lock',            status: 'Committed', fit: 'Injured', contract: false, caps: 51,  phone: true },
  { n: 25, fn: 'Mthuthuzeli',ln:'Khumalo',       pos: 'Scrumhalf',       status: '—',         fit: 'Good',    contract: false, caps: 19,  phone: false },
  { n: 26, fn: 'Wesley',   ln: 'Daniels',        pos: 'Flyhalf',         status: 'Committed', fit: 'Good',    contract: false, caps: 33,  phone: true },
  { n: 27, fn: 'Sibusiso', ln: 'Mbuyazi',        pos: 'Inside Centre',   status: '—',         fit: 'Good',    contract: false, caps: 14,  phone: false },
];

const FIXTURES = [
  { type: 'Warmup',  opp: 'False Bay',    venue: 'HOME', date: 'Feb 16',  result: 'L', f: 0,  a: 55,  tries: 0 },
  { type: 'Warmup',  opp: 'Rocklands',    venue: 'AWAY', date: 'Feb 24',  result: 'W', f: 19, a: 17,  tries: 3 },
  { type: 'Warmup',  opp: 'UCT',          venue: 'AWAY', date: 'Mar 9',   result: 'L', f: 19, a: 24,  tries: 3 },
  { type: 'Warmup',  opp: 'Tygerberg',    venue: 'AWAY', date: 'Mar 16',  result: 'L', f: 7,  a: 103, tries: 1 },
  { type: 'Warmup',  opp: 'Goodwood',     venue: 'AWAY', date: 'Mar 23',  result: 'L', f: 7,  a: 60,  tries: 1 },
  { type: 'League',  opp: 'Stellenberg',  venue: 'HOME', date: 'Mar 30',  result: 'L', f: 12, a: 38,  tries: 2 },
  { type: 'League',  opp: 'Brackenfell',  venue: 'AWAY', date: 'Apr 6',   result: 'W', f: 24, a: 21,  tries: 3 },
  { type: 'League',  opp: 'Helderberg',   venue: 'HOME', date: 'Apr 13',  result: 'L', f: 10, a: 42,  tries: 1 },
  { type: 'League',  opp: 'Villager',     venue: 'AWAY', date: 'Apr 20',  result: 'L', f: 14, a: 31,  tries: 2 },
  { type: 'League',  opp: 'Hamiltons',    venue: 'HOME', date: 'May 4',   result: 'L', f: 17, a: 22,  tries: 2 },
  { type: 'League',  opp: 'False Bay',    venue: 'AWAY', date: 'May 11',  result: 'L', f: 8,  a: 45,  tries: 1 },
  { type: 'League',  opp: 'Rocklands',    venue: 'HOME', date: 'May 25',  result: 'W', f: 26, a: 19,  tries: 4 },
  { type: 'League',  opp: 'UCT',          venue: 'HOME', date: 'Jun 14',  result: null, f: null, a: null, tries: null, upcoming: true },
  { type: 'League',  opp: 'Stellenberg',  venue: 'AWAY', date: 'Jun 21',  upcoming: true, result: null },
  { type: 'League',  opp: 'Tygerberg',    venue: 'HOME', date: 'Jun 28',  upcoming: true, result: null },
];

const ROUTES = [
  { id: 'dashboard', label: 'Season',     icon: '◆', section: 'main' },
  { id: 'squad',     label: 'Squad',      icon: '◇', section: 'main', count: 27 },
  { id: 'match',     label: 'Match Day',  icon: '▣', section: 'main' },
  { id: 'ratings',   label: 'Ratings',    icon: '★', section: 'main' },
  { id: 'calendar',  label: 'Calendar',   icon: '▦', section: 'main' },
  { id: 'practice',  label: 'Practice',   icon: '◔', section: 'main' },
  { id: 'opponent',  label: 'Opponent Intel', icon: '◉', section: 'main' },
  { id: 'video',     label: 'Video',      icon: '▶', section: 'main' },
  { id: 'playbook',  label: 'Playbook',   icon: '☰', section: 'main' },
  { id: 'analyst',   label: 'Analyst',    icon: '✦', section: 'ai', accent: true },
  { id: 'onboarding',label: 'Season setup', icon: '✚', section: 'admin' },
];

/* ---- Components ---- */
const Sidebar = ({ active, onNav }) => (
  <aside className="sidebar">
    <div className="brand">
      <div className="brand-mark">R</div>
      <div>
        <div className="brand-name">RugbyAI</div>
        <div className="brand-sub">Warwick Pumas RFC</div>
      </div>
    </div>

    <div className="nav-section">Workspace</div>
    {ROUTES.filter(r => r.section === 'main').map(r => (
      <div
        key={r.id}
        className={`nav-item ${active === r.id ? 'active' : ''}`}
        onClick={() => onNav(r.id)}
      >
        <span className="nav-icon">{r.icon}</span>
        <span>{r.label}</span>
        {r.count !== undefined && <span className="nav-count">{r.count}</span>}
      </div>
    ))}

    <div className="nav-section">Assistant</div>
    {ROUTES.filter(r => r.section === 'ai').map(r => (
      <div
        key={r.id}
        className={`nav-item ${r.accent ? 'accent' : ''} ${active === r.id ? 'active' : ''}`}
        onClick={() => onNav(r.id)}
      >
        <span className="nav-icon">{r.icon}</span>
        <span>{r.label}</span>
      </div>
    ))}

    <div className="nav-section">Admin</div>
    {ROUTES.filter(r => r.section === 'admin').map(r => (
      <div
        key={r.id}
        className={`nav-item ${active === r.id ? 'active' : ''}`}
        onClick={() => onNav(r.id)}
      >
        <span className="nav-icon">{r.icon}</span>
        <span>{r.label}</span>
      </div>
    ))}

    <div className="sidebar-foot">
      <div className="avatar">CL</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500 }}>Coach Louw</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.55)' }}>Head Coach</div>
      </div>
    </div>
  </aside>
);

const TopBar = ({ crumb, right }) => (
  <header className="topbar">
    <div className="crumb">{crumb}</div>
    <div className="grow" />
    <div className="search">
      <span style={{ color: 'var(--muted)' }}>⌕</span>
      <input placeholder="Search players, fixtures, drills…" />
      <span className="kbd">⌘ K</span>
    </div>
    {right || (
      <>
        <button className="btn ghost sm" title="Notifications">⏰</button>
        <button className="btn sm">Help</button>
      </>
    )}
  </header>
);

/* Initial of a player for the head avatar */
const initials = (p) => `${p.fn[0]}${p.ln[0]}`;

/* Sparkline SVG */
const Sparkline = ({ data, color, width = 80, height = 22 }) => {
  if (!data.length) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} className="spark">
      <polyline points={points} fill="none" stroke={color || 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* Bar chart for form */
const FormChart = ({ matches }) => {
  const max = Math.max(...matches.map(m => Math.max(m.f || 0, m.a || 0))) || 60;
  return (
    <div className="barchart-wrap">
      <div className="barchart">
        {matches.map((m, i) => {
          const h = ((m.f || 0) / max) * 100;
          return (
            <div
              key={i}
              className={`bar ${m.result === 'W' ? 'win' : m.result === 'L' ? 'loss' : 'draw'}`}
              style={{ height: `${h}%`, minHeight: 4 }}
            >
              <span className="lbl">{m.opp.slice(0, 4)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Badge = ({ children, variant = '' }) => (
  <span className={`badge ${variant}`}>{children}</span>
);

const Status = ({ value, label }) => {
  const cls = value === 'Good' ? 'ok' : value === 'Injured' ? 'warn' : value === 'Committed' ? 'ok' : 'accent';
  return (
    <span className={`status ${cls}`}>
      <span className="dot" />
      <span>{label || value}</span>
    </span>
  );
};

const Head = ({ p, size }) => (
  <span className={`head ${size === 'lg' ? 'lg' : ''}`}>{initials(p)}</span>
);

Object.assign(window, {
  SQUAD, FIXTURES, ROUTES,
  Sidebar, TopBar,
  Sparkline, FormChart, Badge, Status, Head, initials,
});
