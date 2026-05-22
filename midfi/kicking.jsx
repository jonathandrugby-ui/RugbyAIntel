/* RugbyAI mid-fi — Territory & Kicking Analytics */

const KICK_MATCHES = [
  { match: 'False Bay',   date: 'Feb 16', result: 'L',
    zones: [12, 38, 22, 16, 9, 3],
    kicks: { box: 7, grubber: 1, crossfield: 0, tactical: 5, restart: 3 },
    exitPct: 44, entryPct: 38, chaseWon: 2, chaseLost: 5 },
  { match: 'Rocklands',   date: 'Feb 24', result: 'W',
    zones: [5, 22, 18, 28, 19, 8],
    kicks: { box: 4, grubber: 3, crossfield: 1, tactical: 3, restart: 2 },
    exitPct: 78, entryPct: 67, chaseWon: 3, chaseLost: 1 },
  { match: 'UCT',         date: 'Mar 9',  result: 'L',
    zones: [9, 28, 26, 22, 12, 3],
    kicks: { box: 5, grubber: 2, crossfield: 1, tactical: 4, restart: 2 },
    exitPct: 58, entryPct: 52, chaseWon: 3, chaseLost: 3 },
  { match: 'Tygerberg',   date: 'Mar 16', result: 'L',
    zones: [18, 45, 18, 12, 6, 1],
    kicks: { box: 10, grubber: 0, crossfield: 0, tactical: 8, restart: 5 },
    exitPct: 28, entryPct: 22, chaseWon: 1, chaseLost: 8 },
  { match: 'Goodwood',    date: 'Mar 23', result: 'L',
    zones: [14, 40, 20, 16, 8, 2],
    kicks: { box: 8, grubber: 1, crossfield: 0, tactical: 6, restart: 4 },
    exitPct: 36, entryPct: 30, chaseWon: 1, chaseLost: 6 },
  { match: 'Stellenberg', date: 'Mar 30', result: 'L',
    zones: [11, 35, 24, 17, 10, 3],
    kicks: { box: 6, grubber: 1, crossfield: 0, tactical: 6, restart: 3 },
    exitPct: 42, entryPct: 36, chaseWon: 1, chaseLost: 5 },
  { match: 'Brackenfell', date: 'Apr 6',  result: 'W',
    zones: [4, 20, 21, 30, 19, 6],
    kicks: { box: 3, grubber: 3, crossfield: 2, tactical: 3, restart: 2 },
    exitPct: 75, entryPct: 71, chaseWon: 4, chaseLost: 1 },
  { match: 'Helderberg',  date: 'Apr 13', result: 'L',
    zones: [15, 42, 20, 14, 7, 2],
    kicks: { box: 9, grubber: 0, crossfield: 0, tactical: 7, restart: 4 },
    exitPct: 35, entryPct: 30, chaseWon: 1, chaseLost: 6 },
  { match: 'Villager',    date: 'Apr 20', result: 'L',
    zones: [10, 32, 23, 19, 12, 4],
    kicks: { box: 6, grubber: 1, crossfield: 1, tactical: 5, restart: 3 },
    exitPct: 50, entryPct: 44, chaseWon: 2, chaseLost: 4 },
  { match: 'Hamiltons',   date: 'May 4',  result: 'L',
    zones: [8, 30, 25, 22, 11, 4],
    kicks: { box: 5, grubber: 2, crossfield: 1, tactical: 4, restart: 3 },
    exitPct: 53, entryPct: 48, chaseWon: 2, chaseLost: 3 },
  { match: 'False Bay',   date: 'May 11', result: 'L',
    zones: [12, 38, 22, 16, 8, 4],
    kicks: { box: 7, grubber: 1, crossfield: 0, tactical: 5, restart: 3 },
    exitPct: 44, entryPct: 38, chaseWon: 2, chaseLost: 5 },
  { match: 'Rocklands',   date: 'May 25', result: 'W',
    zones: [5, 22, 18, 27, 19, 9],
    kicks: { box: 4, grubber: 2, crossfield: 1, tactical: 3, restart: 2 },
    exitPct: 78, entryPct: 67, chaseWon: 3, chaseLost: 1 },
];

const ZONE_META = [
  { label: 'Own\nTry',  type: 'danger' },
  { label: 'Own\n22',   type: 'warning' },
  { label: 'Own\nHalf', type: 'neutral' },
  { label: 'Opp\nHalf', type: 'good' },
  { label: 'Opp\n22',   type: 'great' },
  { label: 'Opp\nTry',  type: 'great' },
];

const ZONE_COLORS = {
  danger:  { bg: 'rgba(220,38,38,.16)',  text: '#b91c1c', bar: '#ef4444' },
  warning: { bg: 'rgba(234,179,8,.14)',  text: '#92400e', bar: '#f59e0b' },
  neutral: { bg: 'rgba(100,116,139,.1)', text: '#475569', bar: '#64748b' },
  good:    { bg: 'rgba(22,163,74,.12)',  text: '#15803d', bar: '#22c55e' },
  great:   { bg: 'rgba(22,163,74,.22)', text: '#14532d', bar: '#16a34a' },
};

const KickingAnalytics = () => {
  const [selectedIdx, setSelectedIdx] = React.useState(11); // Rocklands (last match)

  const m = KICK_MATCHES[selectedIdx];

  /* season averages per zone */
  const avgZones = ZONE_META.map((_, zi) =>
    Math.round(KICK_MATCHES.reduce((s, km) => s + km.zones[zi], 0) / KICK_MATCHES.length)
  );

  const totalKicks = Object.values(m.kicks).reduce((s, v) => s + v, 0);

  /* trend arrays (oldest→newest) */
  const exitTrend  = KICK_MATCHES.map(x => x.exitPct);
  const entryTrend = KICK_MATCHES.map(x => x.entryPct);

  /* season averages */
  const avgExit  = Math.round(exitTrend.reduce((s, v) => s + v, 0) / exitTrend.length);
  const avgEntry = Math.round(entryTrend.reduce((s, v) => s + v, 0) / entryTrend.length);

  const KICK_TYPES = [
    { key: 'box',        label: 'Box kick',       col: 'var(--primary)' },
    { key: 'tactical',   label: 'Tactical / pen', col: 'var(--accent-2)' },
    { key: 'restart',    label: 'Restart',         col: '#64748b' },
    { key: 'grubber',    label: 'Grubber',         col: 'var(--ok)' },
    { key: 'crossfield', label: 'Crossfield',      col: 'var(--accent)' },
  ];

  return (
    <div className="page" style={{ paddingBottom: 60 }}>
      <div className="page-head">
        <div>
          <div className="eyebrow">Performance Analytics · 2024 Season</div>
          <h1>Territory &amp; Kicking</h1>
          <div className="meta">
            {KICK_MATCHES.length} matches · exit avg {avgExit}% · entry avg {avgEntry}%
          </div>
        </div>
        <div className="row gap-3">
          <button className="btn">Export PDF</button>
          <button className="btn accent sm">✦ AI insight</button>
        </div>
      </div>

      {/* Season territory strip */}
      <div className="card" style={{ padding: '14px 16px', marginBottom: 14 }}>
        <div className="card-head" style={{ marginBottom: 10 }}>
          <div className="card-title">Season territory — where we play the game</div>
          <span className="mono">avg across {KICK_MATCHES.length} matches</span>
        </div>
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--line)', marginBottom: 8 }}>
          {avgZones.map((pct, i) => {
            const col = ZONE_COLORS[ZONE_META[i].type];
            return (
              <div key={i} style={{
                flex: pct, background: col.bg,
                borderRight: i < 5 ? '1px solid rgba(0,0,0,.08)' : 'none',
                padding: '12px 4px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minWidth: 0,
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 8, color: col.text,
                  letterSpacing: '.06em', textAlign: 'center',
                  whiteSpace: 'pre-line', marginBottom: 2,
                }}>{ZONE_META[i].label}</span>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: col.text,
                }}>{pct}%</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="mono" style={{ fontSize: 9 }}>← Our try line</span>
          <span className="mono" style={{ fontSize: 9 }}>Their try line →</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

        {/* Exit / entry effectiveness */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Exit &amp; entry effectiveness</div>
            <div className="col tight" style={{ alignItems: 'flex-end' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: m.exitPct >= 65 ? 'var(--ok)' : 'var(--warn)' }}>{m.exitPct}%</span>
              <span className="mono">exit rate</span>
            </div>
          </div>

          {[
            { label: 'Exit cleared 22', val: m.exitPct, threshold: 65 },
            { label: 'Entry gained opp 22', val: m.entryPct, threshold: 60 },
          ].map(({ label, val, threshold }) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div className="row between" style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 13 }}>{label}</span>
                <span style={{ fontWeight: 700, color: val >= threshold ? 'var(--ok)' : 'var(--warn)' }}>{val}%</span>
              </div>
              <div className="meter" style={{ height: 8 }}>
                <div style={{ width: `${val}%`, background: val >= threshold ? 'var(--ok)' : 'var(--warn)', height: '100%', borderRadius: 4 }} />
              </div>
            </div>
          ))}

          <div className="row between" style={{ padding: '10px 12px', background: 'var(--paper-2)', borderRadius: 8, marginBottom: 10 }}>
            <div className="col tight" style={{ alignItems: 'center' }}>
              <span className="mono">Chase won</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--ok)' }}>{m.chaseWon}</span>
            </div>
            <div style={{ width: 1, height: 36, background: 'var(--line)' }} />
            <div className="col tight" style={{ alignItems: 'center' }}>
              <span className="mono">Chase lost</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--warn)' }}>{m.chaseLost}</span>
            </div>
            <div style={{ width: 1, height: 36, background: 'var(--line)' }} />
            <div className="col tight" style={{ alignItems: 'center' }}>
              <span className="mono">Chase win %</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700 }}>
                {m.chaseWon + m.chaseLost ? Math.round((m.chaseWon / (m.chaseWon + m.chaseLost)) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="col tight">
            <div className="mono" style={{ marginBottom: 4 }}>Exit % trend — season</div>
            <Sparkline data={exitTrend} color="var(--primary)" width={260} height={40} />
          </div>
        </div>

        {/* Kick type breakdown */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Kick breakdown — selected match</div>
            <span className="mono">{totalKicks} kicks total</span>
          </div>

          {KICK_TYPES.map(({ key, label, col }) => {
            const val = m.kicks[key] || 0;
            const pct = totalKicks ? Math.round((val / totalKicks) * 100) : 0;
            return (
              <div key={key} style={{ marginBottom: 10 }}>
                <div className="row between" style={{ marginBottom: 3 }}>
                  <span style={{ fontSize: 13 }}>{label}</span>
                  <div className="row gap-3">
                    <span className="mono">{val} kick{val !== 1 ? 's' : ''}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: col, minWidth: 34, textAlign: 'right' }}>{pct}%</span>
                  </div>
                </div>
                <div className="meter" style={{ height: 7 }}>
                  <div style={{ width: `${pct}%`, background: col, height: '100%', borderRadius: 4 }} />
                </div>
              </div>
            );
          })}

          <hr className="hr dashed" style={{ margin: '12px 0' }} />

          {/* Season box kick vs grubber comparison */}
          <div className="mono" style={{ marginBottom: 8 }}>Season: box kick vs grubber</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Box kicks', key: 'box', col: 'var(--primary)' },
              { label: 'Grubbers', key: 'grubber', col: 'var(--ok)' },
            ].map(({ label, key, col }) => {
              const seasonTotal = KICK_MATCHES.reduce((s, km) => s + km.kicks[key], 0);
              const allKicks = KICK_MATCHES.reduce((s, km) => s + Object.values(km.kicks).reduce((a, v) => a + v, 0), 0);
              return (
                <div key={key} style={{ padding: '10px 12px', background: 'var(--paper-2)', borderRadius: 8, border: `1.5px solid ${col}30` }}>
                  <div className="mono" style={{ marginBottom: 2 }}>{label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: col }}>
                    {allKicks ? Math.round((seasonTotal / allKicks) * 100) : 0}%
                  </div>
                  <div className="mono">{seasonTotal} season total</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Match-by-match table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 14, marginBottom: 14 }}>
        <div className="card">
          <div className="card-head">
            <div className="card-title">Match-by-match — click to inspect</div>
            <span className="mono">selected: {m.match} · {m.date}</span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Match</th>
                <th>Date</th>
                <th className="num">Exit %</th>
                <th className="num">Entry %</th>
                <th className="num">Chase W–L</th>
                <th className="num">Box kicks</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {KICK_MATCHES.map((km, i) => (
                <tr
                  key={i}
                  onClick={() => setSelectedIdx(i)}
                  style={{
                    cursor: 'pointer',
                    background: selectedIdx === i ? 'var(--primary-soft)' : 'transparent',
                    outline: selectedIdx === i ? '1px solid var(--primary)' : 'none',
                  }}
                >
                  <td className="player-name">{km.match}</td>
                  <td className="mono">{km.date}</td>
                  <td className="num">
                    <span style={{ color: km.exitPct >= 65 ? 'var(--ok)' : 'var(--warn)', fontWeight: 600 }}>{km.exitPct}%</span>
                  </td>
                  <td className="num">
                    <span style={{ color: km.entryPct >= 60 ? 'var(--ok)' : 'var(--warn)', fontWeight: 600 }}>{km.entryPct}%</span>
                  </td>
                  <td className="num mono">{km.chaseWon}–{km.chaseLost}</td>
                  <td className="num mono">{km.kicks.box}</td>
                  <td><Badge variant={km.result === 'W' ? 'ok' : 'warn'}><span className="dot" />{km.result}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right rail */}
        <div className="col">
          <div className="card paper">
            <div className="card-head">
              <div className="card-title">Entry % trend</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--ok)' }}>
                {entryTrend[entryTrend.length - 1]}%
              </span>
            </div>
            <Sparkline data={entryTrend} color="var(--ok)" width={220} height={44} />
            <div className="mono" style={{ marginTop: 6 }}>Season avg: {avgEntry}%</div>
          </div>

          <div className="card paper">
            <div className="card-head">
              <div className="card-title">Chase win % trend</div>
            </div>
            <Sparkline
              data={KICK_MATCHES.map(km => km.chaseWon + km.chaseLost ? Math.round((km.chaseWon / (km.chaseWon + km.chaseLost)) * 100) : 0)}
              color="var(--accent-2)"
              width={220}
              height={44}
            />
          </div>

          <div className="ai-card">
            <div className="ai-glyph">AI</div>
            <div className="body">
              <b>Box kicks dominating</b> but return rate trails grubbers 3:1. Wins correlate with &gt;70% exit rate and chase win rate &gt;60%.
            </div>
            <button className="btn accent sm">Build kicking practice</button>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { KickingAnalytics });
