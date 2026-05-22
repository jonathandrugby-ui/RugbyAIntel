/* RugbyAI mid-fi — Player Workload & Fatigue Risk */

const WORKLOAD_DATA = [
  { n:  5, fn: 'Luthando',    ln: 'Bulana',        pos: 'Prop',            mins: 320, load: 88, rest: 1, status: 'RED',   trend: [55,62,68,76,82,88], risk: 'Tighthead scrum stress — above safe ceiling' },
  { n: 20, fn: 'Sipho',       ln: 'Nkosi',         pos: 'Prop',            mins: 280, load: 82, rest: 2, status: 'RED',   trend: [48,56,64,72,78,82], risk: 'High scrum minutes — consecutive 80-min stints' },
  { n: 16, fn: 'Pierre',      ln: 'Petersen',      pos: '8th Man',         mins: 340, load: 79, rest: 1, status: 'AMBER', trend: [58,63,68,72,76,79], risk: 'Consecutive 80-min finishes — 4 in a row' },
  { n: 10, fn: 'Siyasanga',   ln: 'Mkiva',         pos: 'Hooker',          mins: 290, load: 74, rest: 2, status: 'AMBER', trend: [52,58,63,67,71,74], risk: 'Lineout jumping + scrum double load' },
  { n:  8, fn: 'Ethan',       ln: 'Coetzee',       pos: 'Utility Forward', mins: 265, load: 68, rest: 3, status: 'AMBER', trend: [44,50,56,60,64,68], risk: 'Bench impact — training load spike' },
  { n:  7, fn: 'Richwen',     ln: 'Codee-Waries',  pos: 'Utility Forward', mins: 0,   load: 10, rest: 7, status: 'REST',  trend: [80,82,84,10,10,10], risk: 'Injured — not in training' },
  { n: 19, fn: 'Tafadzwa',    ln: 'Moyo',          pos: 'Lock',            mins: 40,  load: 28, rest: 5, status: 'REST',  trend: [60,65,70,28,28,28], risk: 'Recovering — light running only' },
  { n: 12, fn: 'Khaya',       ln: 'Mathebula',     pos: 'Scrumhalf',       mins: 220, load: 62, rest: 3, status: 'GREEN', trend: [42,48,52,56,59,62], risk: null },
  { n: 13, fn: 'Marius',      ln: 'Naidoo',        pos: 'Flyhalf',         mins: 230, load: 60, rest: 3, status: 'GREEN', trend: [40,46,50,54,57,60], risk: null },
  { n: 14, fn: 'Bongani',     ln: 'Davids',        pos: 'Blindside Flank', mins: 240, load: 58, rest: 4, status: 'GREEN', trend: [38,43,47,51,55,58], risk: null },
  { n: 11, fn: 'Thabo',       ln: 'Jacobs',        pos: 'Lock',            mins: 200, load: 55, rest: 4, status: 'GREEN', trend: [36,41,45,48,52,55], risk: null },
  { n: 21, fn: 'Jordy',       ln: 'van Wyk',       pos: 'Fullback',        mins: 210, load: 55, rest: 4, status: 'GREEN', trend: [38,42,46,50,52,55], risk: null },
  { n:  1, fn: 'Adon',        ln: 'Blaaws',        pos: 'Utility Back',    mins: 180, load: 52, rest: 5, status: 'GREEN', trend: [36,40,43,46,49,52], risk: null },
  { n:  3, fn: 'Jesse-Lee',   ln: 'Barnier',       pos: 'Wing',            mins: 190, load: 50, rest: 5, status: 'GREEN', trend: [34,38,41,44,47,50], risk: null },
  { n: 15, fn: 'Lwazi',       ln: 'Ngubane',       pos: 'Openside Flank',  mins: 200, load: 54, rest: 4, status: 'GREEN', trend: [36,40,44,48,51,54], risk: null },
];

const STATUS_CONFIG = {
  RED:   { bg: 'rgba(220,38,38,.10)',  border: '#ef4444', text: '#b91c1c', label: 'RED ZONE', dot: '#ef4444' },
  AMBER: { bg: 'rgba(234,179,8,.10)',  border: '#f59e0b', text: '#92400e', label: 'MONITOR',  dot: '#f59e0b' },
  GREEN: { bg: 'rgba(22,163,74,.07)',  border: '#22c55e', text: '#15803d', label: 'FIT',      dot: '#22c55e' },
  REST:  { bg: 'rgba(100,116,139,.08)',border: '#94a3b8', text: '#475569', label: 'RESTING',  dot: '#64748b' },
};

const LoadBar = ({ val, col }) => (
  <div style={{ height: 6, background: 'rgba(0,0,0,.08)', borderRadius: 4 }}>
    <div style={{ width: `${val}%`, background: col, height: '100%', borderRadius: 4, transition: 'width .35s' }} />
  </div>
);

const WorkloadCard = ({ p }) => {
  const cfg = STATUS_CONFIG[p.status];
  return (
    <div style={{
      borderRadius: 10, border: `1.5px solid ${cfg.border}`,
      background: cfg.bg, padding: '12px 14px',
    }}>
      {/* Header */}
      <div className="row between" style={{ marginBottom: 10 }}>
        <div className="row gap-3">
          <Head p={p} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{p.fn} {p.ln}</div>
            <div className="mono">{p.pos}</div>
          </div>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
          letterSpacing: '.08em', padding: '2px 7px', borderRadius: 4,
          background: cfg.border, color: '#fff',
        }}>{cfg.label}</span>
      </div>

      {/* Load score */}
      <div style={{ marginBottom: 8 }}>
        <div className="row between" style={{ marginBottom: 4 }}>
          <span className="mono">Cumulative load</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 16, color: cfg.text,
          }}>{p.load}<span style={{ fontSize: 11, fontWeight: 500 }}>/100</span></span>
        </div>
        <LoadBar val={p.load} col={cfg.dot} />
      </div>

      {/* Stats row */}
      <div className="row between" style={{ fontSize: 11, marginBottom: 8 }}>
        <span className="mono">{p.mins} min this cycle</span>
        <span className="mono">{p.rest}d since last full session</span>
      </div>

      {/* Risk note */}
      {p.risk && (
        <div style={{
          fontSize: 11, color: cfg.text,
          padding: '5px 8px', background: 'rgba(0,0,0,.05)',
          borderRadius: 6, marginBottom: 8,
          borderLeft: `2px solid ${cfg.border}`,
        }}>
          ⚠ {p.risk}
        </div>
      )}

      {/* Sparkline trend */}
      <Sparkline data={p.trend} color={cfg.dot} width={220} height={26} />
    </div>
  );
};

const WorkloadRisk = () => {
  const [filterStatus, setFilterStatus] = React.useState('ALL');

  const redZone   = WORKLOAD_DATA.filter(p => p.status === 'RED');
  const amberZone = WORKLOAD_DATA.filter(p => p.status === 'AMBER');
  const fitCount  = WORKLOAD_DATA.filter(p => p.status === 'GREEN').length;
  const avgLoad   = Math.round(
    WORKLOAD_DATA.filter(p => p.status !== 'REST')
      .reduce((s, p) => s + p.load, 0) /
    WORKLOAD_DATA.filter(p => p.status !== 'REST').length
  );

  const filteredPlayers = filterStatus === 'ALL'
    ? WORKLOAD_DATA
    : WORKLOAD_DATA.filter(p => p.status === filterStatus);

  const matchDaysAway = 3;

  return (
    <div className="page" style={{ paddingBottom: 60 }}>
      <div className="page-head">
        <div>
          <div className="eyebrow">Performance Analytics · Squad Management</div>
          <h1>Workload &amp; Fatigue Risk</h1>
          <div className="meta">
            {redZone.length} red zone · {amberZone.length} monitored · {fitCount} fit · match in {matchDaysAway} days
          </div>
        </div>
        <div className="row gap-3">
          <button className="btn">Load report</button>
          <button className="btn primary">Set thresholds</button>
        </div>
      </div>

      {/* Red zone alert banner */}
      {redZone.length > 0 && (
        <div style={{
          padding: '12px 16px', borderRadius: 10, marginBottom: 14,
          background: 'rgba(220,38,38,.07)', border: '1.5px solid #ef4444',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 26, flexShrink: 0 }}>⚠</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: '#b91c1c', marginBottom: 3 }}>
              {redZone.length} player{redZone.length > 1 ? 's' : ''} above safe threshold — match is {matchDaysAway} days away
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
              {redZone.map(p => `${p.fn} ${p.ln}`).join(' and ')} — reduce contact and high-load exercises until Thursday.
            </div>
          </div>
          <button className="btn accent sm">✦ Auto-adjust week plan</button>
        </div>
      )}

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 14 }}>
        <div className="stat">
          <span className="label">Red zone</span>
          <span className="value warn">{redZone.length}</span>
          <span className="sub">{redZone.map(p => p.ln).join(', ')}</span>
        </div>
        <div className="stat">
          <span className="label">Monitoring</span>
          <span className="value" style={{ color: 'var(--accent-2)' }}>{amberZone.length}</span>
          <span className="sub">{amberZone.map(p => p.ln).join(', ')}</span>
        </div>
        <div className="stat">
          <span className="label">Squad avg load</span>
          <span className="value">{avgLoad}<span style={{ fontSize: 14, color: 'var(--muted)' }}>/100</span></span>
          <span className="sub" style={{ color: avgLoad > 70 ? 'var(--warn)' : 'var(--ok)' }}>
            {avgLoad > 70 ? '↑ Above' : '✓ Within'} optimal range (45–65)
          </span>
        </div>
        <div className="stat">
          <span className="label">Fit &amp; available</span>
          <span className="value ok">{fitCount}</span>
          <span className="sub">Of {WORKLOAD_DATA.length} squad members</span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="card" style={{ padding: '10px 14px', marginBottom: 14 }}>
        <div className="row gap-3">
          <button className={`chip ${filterStatus === 'ALL' ? 'active' : ''}`} onClick={() => setFilterStatus('ALL')}>
            All players
          </button>
          {['RED','AMBER','GREEN','REST'].map(s => (
            <button
              key={s}
              className={`chip ${filterStatus === s ? 'active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: STATUS_CONFIG[s].dot,
                display: 'inline-block', marginRight: 4,
              }} />
              {STATUS_CONFIG[s].label}
              <span style={{ marginLeft: 4, opacity: .6 }}>
                {WORKLOAD_DATA.filter(p => p.status === s).length}
              </span>
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <span className="mono">{filteredPlayers.length} players shown</span>
        </div>
      </div>

      {/* Player cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginBottom: 14 }}>
        {filteredPlayers.map(p => <WorkloadCard key={p.n} p={p} />)}
      </div>

      {/* Load threshold guide */}
      <div className="card paper" style={{ marginBottom: 14 }}>
        <div className="card-head">
          <div className="card-title">Load threshold guide</div>
          <span className="mono">Warwick Pumas RFC · match week</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { range: '0–45',  label: 'Under-loaded', col: '#94a3b8', desc: 'May need more training stimulus' },
            { range: '45–65', label: 'Optimal',       col: '#22c55e', desc: 'Ready to train and play' },
            { range: '65–80', label: 'Monitor',       col: '#f59e0b', desc: 'Reduce high-impact volume' },
            { range: '80+',   label: 'Red zone',      col: '#ef4444', desc: 'Rest required — injury risk ↑' },
          ].map(({ range, label, col, desc }) => (
            <div key={range} style={{
              padding: '10px 12px', borderRadius: 8,
              borderLeft: `3px solid ${col}`,
              background: `${col}10`,
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: col, marginBottom: 2 }}>{range}</div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI prescription */}
      <div className="ai-card">
        <div className="ai-glyph">AI</div>
        <div className="body">
          <b>Match-week prescription</b> — Bulana &amp; Nkosi: no scrum contact Tuesday, full training only Thursday.
          Petersen: 60% load cap Wednesday. Mkiva: monitor lineout jumping volume Thursday session.
          Suggest Tuesday as recovery + skills day, Wednesday as team run (no contact for red-zone players).
        </div>
        <button className="btn accent">Apply to this week's plan</button>
        <button className="btn">Adjust thresholds</button>
      </div>
    </div>
  );
};

Object.assign(window, { WorkloadRisk });
