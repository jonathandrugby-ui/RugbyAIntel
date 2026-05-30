/* RugbyAI mid-fi — Shell components and shared data */

/* ---- Runtime data — populated after onboarding ---- */
let SQUAD    = [];
let FIXTURES = [];

/* ---- Team setup store (localStorage-backed) ---- */
const TEAM_KEY_V2 = 'rugbyai_team_v2';
const TEAM_DEFAULTS = { name: 'Your club', short: '—', primary: '#182b54', accent: '#c9941e', coachName: 'Head Coach' };

const useTeamSetup = () => {
  /* Hydrate globals synchronously before first render */
  const [hasSetup, setHasSetup] = React.useState(() => {
    try {
      const raw = localStorage.getItem(TEAM_KEY_V2);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.squad)    SQUAD    = data.squad;
        if (data.fixtures) FIXTURES = data.fixtures;
        return true;
      }
    } catch {}
    return false;
  });

  const [teamInfo, setTeamInfo] = React.useState(() => {
    try {
      const raw = localStorage.getItem(TEAM_KEY_V2);
      if (raw) { const d = JSON.parse(raw); const t = d.team || TEAM_DEFAULTS; window.teamInfo = t; return t; }
    } catch {}
    window.teamInfo = TEAM_DEFAULTS;
    return TEAM_DEFAULTS;
  });

  const commitSetup = (team, squad, fixtures) => {
    SQUAD    = squad    || [];
    FIXTURES = fixtures || [];
    /* Keep window globals in sync so other components see the update */
    window.SQUAD    = SQUAD;
    window.FIXTURES = FIXTURES;
    window.teamInfo = team;
    const data = { team, squad: SQUAD, fixtures: FIXTURES };
    try { localStorage.setItem(TEAM_KEY_V2, JSON.stringify(data)); } catch {}
    setTeamInfo(team);
    setHasSetup(true);
  };

  const resetSetup = () => {
    SQUAD    = [];
    FIXTURES = [];
    window.SQUAD    = SQUAD;
    window.FIXTURES = FIXTURES;
    try {
      localStorage.removeItem(TEAM_KEY_V2);
      localStorage.removeItem('rugbyai_practices_v1');
    } catch {}
    window.teamInfo = TEAM_DEFAULTS;
    setTeamInfo(TEAM_DEFAULTS);
    setHasSetup(false);
  };

  return { hasSetup, teamInfo, commitSetup, resetSetup };
};

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
  { id: 'tactical',  label: 'Tactical Intel',      icon: '◈', section: 'analytics', accent: true },
  { id: 'setpiece',  label: 'Set Piece Trends',   icon: '⬆', section: 'analytics' },
  { id: 'kicking',   label: 'Kicking & Territory', icon: '◎', section: 'analytics' },
  { id: 'workload',  label: 'Workload & Fatigue',  icon: '◑', section: 'analytics' },
  { id: 'breakdown', label: 'Breakdown',           icon: '⊕', section: 'analytics' },
  { id: 'analyst',   label: 'Analyst',    icon: '✦', section: 'ai', accent: true },
  { id: 'onboarding',label: 'Season setup', icon: '✚', section: 'admin' },
];

/* ---- Components ---- */
const Sidebar = ({ active, onNav, onCollapse, teamInfo, squadCount }) => {
  const ti = teamInfo || TEAM_DEFAULTS;
  const mark = ti.short && ti.short !== '—'
    ? ti.short.slice(0, 2)
    : ti.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'R';
  return (
  <aside className="sidebar">
    <div className="brand">
      <div className="brand-mark">{mark.slice(0, 1)}</div>
      <div>
        <div className="brand-name">RugbyAI</div>
        <div className="brand-sub">{ti.name}</div>
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
        {r.id === 'squad' && squadCount > 0 && <span className="nav-count">{squadCount}</span>}
      </div>
    ))}

    <div className="nav-section">Analytics</div>
    {ROUTES.filter(r => r.section === 'analytics').map(r => (
      <div
        key={r.id}
        className={`nav-item ${active === r.id ? 'active' : ''}`}
        onClick={() => onNav(r.id)}
      >
        <span className="nav-icon">{r.icon}</span>
        <span>{r.label}</span>
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
      <div className="avatar">{(ti.coachName || 'HC').split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500 }}>{ti.coachName || 'Head Coach'}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.55)' }}>Head Coach</div>
      </div>
    </div>

    <button className="sidebar-collapse-btn" onClick={onCollapse} title="Collapse sidebar">
      <span style={{ fontSize: 18, lineHeight: 1, marginLeft: -2 }}>‹</span>
      <span>Collapse</span>
    </button>
  </aside>
  );
};

const TopBar = ({ crumb, right, sidebarOpen, onToggleSidebar, onHelp, onAlerts, onTour }) => (
  <header className="topbar">
    <button
      className="btn ghost sm topbar-toggle-btn"
      onClick={onToggleSidebar}
      title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      style={{ fontSize: 16, padding: '0 8px', letterSpacing: 0 }}
    >
      {sidebarOpen ? '‹' : '›'}
    </button>
    <div className="crumb">{crumb}</div>
    <div className="grow" />
    <div className="search">
      <span style={{ color: 'var(--muted)' }}>⌕</span>
      <input placeholder="Search players, fixtures, drills…" />
      <span className="kbd">⌘ K</span>
    </div>
    {right || (
      <>
        <button className="btn ghost sm" title="Upcoming matches & reminders" onClick={onAlerts}>⏰</button>
        <button className="btn sm" onClick={onHelp}>Help</button>
      </>
    )}
  </header>
);

/* ---- Mobile bottom tab navigation ---- */
const MOBILE_TABS = [
  { id: 'dashboard', icon: '◆', label: 'Season' },
  { id: 'squad',     icon: '◇', label: 'Squad' },
  { id: 'match',     icon: '▣', label: 'Match' },
  { id: 'analyst',   icon: '✦', label: 'Analyst', accent: true },
];

const MobileNav = ({ active, onNav }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const moreRoutes = ROUTES.filter(r => !MOBILE_TABS.find(t => t.id === r.id));
  const moreActive = moreRoutes.some(r => r.id === active);

  return (
    <>
      {/* Slide-up drawer for remaining routes */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 8000,
            background: 'rgba(0,0,0,.45)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute', bottom: 56, left: 0, right: 0,
              background: 'var(--primary)',
              borderRadius: '18px 18px 0 0',
              padding: '10px 0 12px',
              boxShadow: '0 -8px 30px rgba(0,0,0,.25)',
              animation: 'mob-drawer-rise .2s cubic-bezier(.22,.68,0,1.2) both',
            }}
          >
            {/* Drag handle */}
            <div style={{
              width: 36, height: 4, borderRadius: 2,
              background: 'rgba(255,255,255,.2)',
              margin: '0 auto 14px',
            }} />
            {moreRoutes.map(r => (
              <div
                key={r.id}
                className={`nav-item ${active === r.id ? 'active' : ''}`}
                style={{ margin: '0 10px', borderRadius: 8 }}
                onClick={() => { onNav(r.id); setDrawerOpen(false); }}
              >
                <span className="nav-icon">{r.icon}</span>
                <span>{r.label}</span>
              </div>
            ))}
            {/* Coach footer inside drawer */}
            <div style={{
              margin: '12px 12px 0',
              paddingTop: 12,
              borderTop: '1px solid rgba(255,255,255,.08)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>CL</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--paper)' }}>Coach Louw</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)' }}>Head Coach</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <nav className="mobile-nav">
        {MOBILE_TABS.map(tab => (
          <button
            key={tab.id}
            className={`mobile-tab ${active === tab.id ? 'active' : ''} ${tab.accent ? 'accent-tab' : ''}`}
            onClick={() => onNav(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
        <button
          className={`mobile-tab ${moreActive || drawerOpen ? 'active' : ''}`}
          onClick={() => setDrawerOpen(s => !s)}
        >
          <span className="tab-icon">☰</span>
          <span>More</span>
        </button>
      </nav>

      <style>{`
        @keyframes mob-drawer-rise {
          from { transform: translateY(24px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
};

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
  TEAM_DEFAULTS, useTeamSetup,
  Sidebar, TopBar, MobileNav,
  Sparkline, FormChart, Badge, Status, Head, initials,
});
