/* RugbyAI mid-fi — Set Piece Trend Detection */

const SP_MATCHES = [
  { match: 'False Bay',   date: 'Feb 16', result: 'L', lo_won: 6,  lo_total: 11, lo_steal: 0, sc_won: 3, sc_total: 5,  sc_tight: 0 },
  { match: 'Rocklands',   date: 'Feb 24', result: 'W', lo_won: 7,  lo_total: 10, lo_steal: 1, sc_won: 3, sc_total: 4,  sc_tight: 1 },
  { match: 'UCT',         date: 'Mar 9',  result: 'L', lo_won: 7,  lo_total: 12, lo_steal: 2, sc_won: 5, sc_total: 8,  sc_tight: 0 },
  { match: 'Tygerberg',   date: 'Mar 16', result: 'L', lo_won: 5,  lo_total: 11, lo_steal: 3, sc_won: 3, sc_total: 6,  sc_tight: 0 },
  { match: 'Goodwood',    date: 'Mar 23', result: 'L', lo_won: 6,  lo_total: 12, lo_steal: 2, sc_won: 4, sc_total: 7,  sc_tight: 0 },
  { match: 'Stellenberg', date: 'Mar 30', result: 'L', lo_won: 8,  lo_total: 13, lo_steal: 1, sc_won: 4, sc_total: 7,  sc_tight: 1 },
  { match: 'Brackenfell', date: 'Apr 6',  result: 'W', lo_won: 7,  lo_total: 9,  lo_steal: 0, sc_won: 8, sc_total: 9,  sc_tight: 2 },
  { match: 'Helderberg',  date: 'Apr 13', result: 'L', lo_won: 6,  lo_total: 10, lo_steal: 1, sc_won: 4, sc_total: 6,  sc_tight: 0 },
  { match: 'Villager',    date: 'Apr 20', result: 'L', lo_won: 7,  lo_total: 11, lo_steal: 1, sc_won: 4, sc_total: 6,  sc_tight: 1 },
  { match: 'Hamiltons',   date: 'May 4',  result: 'L', lo_won: 5,  lo_total: 10, lo_steal: 2, sc_won: 5, sc_total: 8,  sc_tight: 0 },
  { match: 'False Bay',   date: 'May 11', result: 'L', lo_won: 4,  lo_total: 9,  lo_steal: 3, sc_won: 3, sc_total: 6,  sc_tight: 0 },
  { match: 'Rocklands',   date: 'May 25', result: 'W', lo_won: 5,  lo_total: 6,  lo_steal: 0, sc_won: 4, sc_total: 4,  sc_tight: 1 },
];

/* Derived percentages */
const withPct = SP_MATCHES.map(m => ({
  ...m,
  lo_pct: Math.round((m.lo_won / m.lo_total) * 100),
  sc_pct: Math.round((m.sc_won / m.sc_total) * 100),
}));

const SetPieceTrends = () => {
  const [view, setView] = React.useState('lineout'); // 'lineout' | 'scrum'

  const loPcts = withPct.map(m => m.lo_pct);
  const scPcts = withPct.map(m => m.sc_pct);
  const activeData = view === 'lineout' ? loPcts : scPcts;

  const avg = arr => Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);
  const avgLo = avg(loPcts);
  const avgSc = avg(scPcts);
  const activeAvg = view === 'lineout' ? avgLo : avgSc;

  /* Last 4 vs previous 4 trend */
  const lo_last4 = avg(loPcts.slice(-4));
  const lo_prev4 = avg(loPcts.slice(-8, -4));
  const sc_last4 = avg(scPcts.slice(-4));
  const sc_prev4 = avg(scPcts.slice(-8, -4));
  const loTrend = lo_last4 - lo_prev4;
  const scTrend = sc_last4 - sc_prev4;
  const activeTrend = view === 'lineout' ? loTrend : scTrend;

  const activeColor = view === 'lineout' ? 'var(--primary)' : 'var(--accent-2)';

  /* SVG trend chart */
  const W = 1000;
  const H = 90;
  const n = activeData.length;

  const pts = activeData.map((v, i) => {
    const x = n > 1 ? (i / (n - 1)) * W : W / 2;
    const y = H - (v / 100) * H;
    return [x, y];
  });
  const polyPts = pts.map(p => `${p[0]},${p[1]}`).join(' ');
  const fillPts = [`0,${H}`, ...pts.map(p => `${p[0]},${p[1]}`), `${W},${H}`].join(' ');
  const avgY = H - (activeAvg / 100) * H;

  return (
    <div className="page" style={{ paddingBottom: 60 }}>
      <div className="page-head">
        <div>
          <div className="eyebrow">Performance Analytics · {SEASON_YEAR} Season</div>
          <h1>Set Piece Trends</h1>
          <div className="meta">
            {withPct.length} matches · lineout avg {avgLo}% · scrum avg {avgSc}%
          </div>
        </div>
        <div className="row gap-3">
          <button className="btn accent sm">✦ AI insight</button>
          <button className="btn">Export</button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 14 }}>
        <div className="stat" style={{ background: loTrend < -5 ? 'rgba(220,38,38,.06)' : 'rgba(22,163,74,.06)' }}>
          <span className="label">Lineout avg</span>
          <span className="value" style={{ color: avgLo >= 70 ? 'var(--ok)' : 'var(--warn)' }}>{avgLo}%</span>
          <span className="sub" style={{ color: loTrend < 0 ? 'var(--warn)' : 'var(--ok)' }}>
            {loTrend > 0 ? '↑' : '↓'} {Math.abs(loTrend)}pts last 4 matches
          </span>
        </div>
        <div className="stat" style={{ background: scTrend < -5 ? 'rgba(220,38,38,.06)' : 'rgba(22,163,74,.06)' }}>
          <span className="label">Scrum avg</span>
          <span className="value" style={{ color: avgSc >= 70 ? 'var(--ok)' : 'var(--warn)' }}>{avgSc}%</span>
          <span className="sub" style={{ color: scTrend < 0 ? 'var(--warn)' : 'var(--ok)' }}>
            {scTrend > 0 ? '↑' : '↓'} {Math.abs(scTrend)}pts last 4 matches
          </span>
        </div>
        <div className="stat">
          <span className="label">Total steals conceded</span>
          <span className="value warn">{withPct.reduce((s, m) => s + m.lo_steal, 0)}</span>
          <span className="sub">lineout steals this season</span>
        </div>
        <div className="stat dark ring-accent">
          <span className="label" style={{ color: 'var(--accent)' }}>Next: UCT</span>
          <span className="value">UCT LO 74%</span>
          <span className="sub">Their scrum: 69% · lineout jump disruptor: #6</span>
        </div>
      </div>

      {/* Trend chart */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="card-head">
          <div className="card-title">Set piece success rate — season trend</div>
          <div className="row gap-2">
            <button className={`chip ${view === 'lineout' ? 'active' : ''}`} onClick={() => setView('lineout')}>Lineout</button>
            <button className={`chip ${view === 'scrum' ? 'active' : ''}`} onClick={() => setView('scrum')}>Scrum</button>
          </div>
        </div>

        <div style={{ position: 'relative', paddingRight: 32 }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            style={{ width: '100%', height: H + 8 }}
            preserveAspectRatio="none"
          >
            {/* Fill area */}
            <polygon points={fillPts} fill={`${activeColor}20`} />
            {/* Line */}
            <polyline
              points={polyPts} fill="none"
              stroke={activeColor} strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Avg dashed line */}
            <line
              x1="0" y1={avgY} x2={W} y2={avgY}
              stroke={activeColor} strokeWidth="1.5"
              strokeDasharray="8 5" opacity=".35"
            />
            {/* Match dots */}
            {pts.map((p, i) => (
              <circle
                key={i} cx={p[0]} cy={p[1]} r="5"
                fill={withPct[i].result === 'W' ? 'var(--ok)' : 'var(--warn)'}
                stroke="var(--paper)" strokeWidth="2"
              />
            ))}
          </svg>

          {/* Y-axis labels */}
          <div style={{ position: 'absolute', top: 4, right: 0, fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>100%</div>
          <div style={{ position: 'absolute', top: H / 2 - 6, right: 0, fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>50%</div>
          <div style={{ position: 'absolute', bottom: 12, right: 0, fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>0%</div>
        </div>

        {/* X-axis match labels */}
        <div style={{ display: 'flex', paddingRight: 32 }}>
          {withPct.map((m, i) => (
            <div key={i} style={{ flex: 1, fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textAlign: 'center' }}>
              {m.match.slice(0, 4)}
            </div>
          ))}
        </div>

        <div className="row gap-6" style={{ marginTop: 10 }}>
          <div className="row gap-2">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ok)', display: 'inline-block' }} />
            <span className="mono">Win</span>
          </div>
          <div className="row gap-2">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warn)', display: 'inline-block' }} />
            <span className="mono">Loss</span>
          </div>
          <div className="row gap-2">
            <svg width={24} height={10}><line x1="0" y1="5" x2="24" y2="5" stroke={activeColor} strokeWidth="1.5" strokeDasharray="5 3" /></svg>
            <span className="mono">Season avg ({activeAvg}%)</span>
          </div>
          {activeTrend !== 0 && (
            <Badge variant={activeTrend > 0 ? 'ok' : 'warn'}>
              {activeTrend > 0 ? '↑' : '↓'} {Math.abs(activeTrend)}pts vs prev 4
            </Badge>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

        {/* Lineout match log */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Lineout — match log</div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Match</th>
                <th className="num">Won</th>
                <th className="num">Total</th>
                <th className="num">%</th>
                <th className="num">Stolen</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {withPct.map((m, i) => (
                <tr key={i}>
                  <td className="player-name">{m.match}</td>
                  <td className="num mono">{m.lo_won}</td>
                  <td className="num mono">{m.lo_total}</td>
                  <td className="num">
                    <span style={{ fontWeight: 600, color: m.lo_pct >= 70 ? 'var(--ok)' : m.lo_pct >= 55 ? 'var(--ink)' : 'var(--warn)' }}>
                      {m.lo_pct}%
                    </span>
                  </td>
                  <td className="num">
                    <span style={{ color: m.lo_steal > 1 ? 'var(--warn)' : 'var(--ink)', fontWeight: m.lo_steal > 1 ? 700 : 400 }}>
                      {m.lo_steal}
                    </span>
                  </td>
                  <td><Badge variant={m.result === 'W' ? 'ok' : 'warn'}>{m.result}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Scrum match log */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Scrum — match log</div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Match</th>
                <th className="num">Won</th>
                <th className="num">Total</th>
                <th className="num">%</th>
                <th className="num">Tightheads</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {withPct.map((m, i) => (
                <tr key={i}>
                  <td className="player-name">{m.match}</td>
                  <td className="num mono">{m.sc_won}</td>
                  <td className="num mono">{m.sc_total}</td>
                  <td className="num">
                    <span style={{ fontWeight: 600, color: m.sc_pct >= 70 ? 'var(--ok)' : m.sc_pct >= 55 ? 'var(--ink)' : 'var(--warn)' }}>
                      {m.sc_pct}%
                    </span>
                  </td>
                  <td className="num">
                    <span style={{ color: m.sc_tight > 0 ? 'var(--ok)' : 'var(--muted)', fontWeight: m.sc_tight > 0 ? 700 : 400 }}>
                      {m.sc_tight}
                    </span>
                  </td>
                  <td><Badge variant={m.result === 'W' ? 'ok' : 'warn'}>{m.result}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UCT preview card */}
      <div className="card" style={{ marginBottom: 14, background: 'rgba(24,43,84,.03)', border: '1.5px solid var(--primary)' }}>
        <div className="card-head">
          <div className="card-title">Set piece preview — UCT (Jun 14)</div>
          <Badge variant="accent"><span className="dot" />3 days</Badge>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <div className="mono" style={{ marginBottom: 6 }}>Their lineout</div>
            <div style={{ fontSize: 13, lineHeight: 1.65 }}>
              <div className="row between" style={{ marginBottom: 4 }}>
                <span>Season win rate</span><span style={{ fontWeight: 700, color: 'var(--warn)' }}>74%</span>
              </div>
              <div className="row between" style={{ marginBottom: 4 }}>
                <span>Primary jumper</span><span className="mono">#4 — tall &amp; timed</span>
              </div>
              <div className="row between">
                <span>Disruptor</span><span className="mono">#6 — aggressive on tail</span>
              </div>
            </div>
          </div>
          <div>
            <div className="mono" style={{ marginBottom: 6 }}>Their scrum</div>
            <div style={{ fontSize: 13, lineHeight: 1.65 }}>
              <div className="row between" style={{ marginBottom: 4 }}>
                <span>Season win rate</span><span style={{ fontWeight: 700 }}>69%</span>
              </div>
              <div className="row between" style={{ marginBottom: 4 }}>
                <span>Loosehead prop</span><span className="mono">Strong — slips bind</span>
              </div>
              <div className="row between">
                <span>Weakness</span><span className="mono">Collapses under pressure</span>
              </div>
            </div>
          </div>
        </div>
        <hr className="hr dashed" />
        <div className="row gap-3">
          <button className="btn">View full UCT profile</button>
          <button className="btn accent">Build set piece plan for UCT</button>
        </div>
      </div>

      {/* AI insight */}
      <div className="ai-card">
        <div className="ai-glyph">AI</div>
        <div className="body">
          <b>Lineout dropped −{Math.abs(loTrend)}pts over the last 4</b> — correlates with UCT &amp; Hamiltons jump disruption.
          Scrum improving (+{Math.abs(scTrend)}pts). For UCT: recommend calling to the tail with Jacobs as primary jumper — their #6 cheats early on middle calls.
        </div>
        <button className="btn accent">Build lineout session</button>
        <button className="btn">Full UCT set piece breakdown</button>
      </div>
    </div>
  );
};

Object.assign(window, { SetPieceTrends });
