/* RugbyAI mid-fi — Collision & Breakdown Efficiency */

const BD_MATCHES = [
  { match: 'False Bay',   date: 'Feb 16', result: 'L',
    tackles: { made: 44, total: 60, pct: 73 },
    rucks: { won: 26, total: 36, fast: 9,  slow: 18 },
    jackals: { won: 0, opp: 6, opp_at: 4 } },
  { match: 'Rocklands',   date: 'Feb 24', result: 'W',
    tackles: { made: 60, total: 68, pct: 88 },
    rucks: { won: 37, total: 41, fast: 23, slow: 7 },
    jackals: { won: 3, opp: 1, opp_at: 6 } },
  { match: 'UCT',         date: 'Mar 9',  result: 'L',
    tackles: { made: 53, total: 66, pct: 80 },
    rucks: { won: 30, total: 39, fast: 14, slow: 13 },
    jackals: { won: 2, opp: 4, opp_at: 5 } },
  { match: 'Tygerberg',   date: 'Mar 16', result: 'L',
    tackles: { made: 42, total: 62, pct: 68 },
    rucks: { won: 22, total: 34, fast: 7,  slow: 20 },
    jackals: { won: 0, opp: 8, opp_at: 3 } },
  { match: 'Goodwood',    date: 'Mar 23', result: 'L',
    tackles: { made: 46, total: 60, pct: 77 },
    rucks: { won: 27, total: 37, fast: 11, slow: 16 },
    jackals: { won: 1, opp: 5, opp_at: 4 } },
  { match: 'Stellenberg', date: 'Mar 30', result: 'L',
    tackles: { made: 52, total: 66, pct: 79 },
    rucks: { won: 30, total: 40, fast: 13, slow: 15 },
    jackals: { won: 1, opp: 4, opp_at: 5 } },
  { match: 'Brackenfell', date: 'Apr 6',  result: 'W',
    tackles: { made: 60, total: 69, pct: 87 },
    rucks: { won: 36, total: 41, fast: 22, slow: 9 },
    jackals: { won: 4, opp: 1, opp_at: 7 } },
  { match: 'Helderberg',  date: 'Apr 13', result: 'L',
    tackles: { made: 44, total: 66, pct: 67 },
    rucks: { won: 25, total: 36, fast: 9,  slow: 18 },
    jackals: { won: 0, opp: 6, opp_at: 3 } },
  { match: 'Villager',    date: 'Apr 20', result: 'L',
    tackles: { made: 52, total: 68, pct: 76 },
    rucks: { won: 29, total: 38, fast: 13, slow: 15 },
    jackals: { won: 1, opp: 4, opp_at: 5 } },
  { match: 'Hamiltons',   date: 'May 4',  result: 'L',
    tackles: { made: 55, total: 70, pct: 79 },
    rucks: { won: 31, total: 39, fast: 15, slow: 14 },
    jackals: { won: 2, opp: 3, opp_at: 6 } },
  { match: 'False Bay',   date: 'May 11', result: 'L',
    tackles: { made: 51, total: 69, pct: 74 },
    rucks: { won: 28, total: 38, fast: 12, slow: 16 },
    jackals: { won: 1, opp: 5, opp_at: 4 } },
  { match: 'Rocklands',   date: 'May 25', result: 'W',
    tackles: { made: 62, total: 70, pct: 89 },
    rucks: { won: 38, total: 42, fast: 24, slow: 8 },
    jackals: { won: 3, opp: 1, opp_at: 7 } },
];

const BD_LEADERS = [
  { fn: 'Richwen',   ln: 'Codee-Waries', pos: 'Utility Forward', n:  7, jackals: 8,  tackles: 92, clearouts: 88, note: 'Injured' },
  { fn: 'Bongani',   ln: 'Davids',       pos: 'Blindside Flank', n: 14, jackals: 6,  tackles: 88, clearouts: 81, note: null },
  { fn: 'Pierre',    ln: 'Petersen',     pos: '8th Man',         n: 16, jackals: 4,  tackles: 85, clearouts: 90, note: null },
  { fn: 'Lwazi',     ln: 'Ngubane',      pos: 'Openside Flank',  n: 15, jackals: 5,  tackles: 80, clearouts: 79, note: null },
  { fn: 'Ethan',     ln: 'Coetzee',      pos: 'Utility Forward', n:  8, jackals: 3,  tackles: 82, clearouts: 86, note: null },
];

const avg = arr => Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);

const BreakdownEfficiency = () => {
  const avgTackle  = avg(BD_MATCHES.map(m => m.tackles.pct));
  const avgRuckWin = avg(BD_MATCHES.map(m => Math.round((m.rucks.won / m.rucks.total) * 100)));
  const totFast    = BD_MATCHES.reduce((s, m) => s + m.rucks.fast, 0);
  const totSlow    = BD_MATCHES.reduce((s, m) => s + m.rucks.slow, 0);
  const totRucks   = BD_MATCHES.reduce((s, m) => s + m.rucks.total, 0);
  const fastPct    = Math.round((totFast / totRucks) * 100);
  const slowPct    = Math.round((totSlow / totRucks) * 100);
  const medPct     = 100 - fastPct - slowPct;
  const ourJackals = BD_MATCHES.reduce((s, m) => s + m.jackals.won, 0);
  const oppJackals = BD_MATCHES.reduce((s, m) => s + m.jackals.opp, 0);

  /* Tackle trend (oldest → newest) */
  const tackleTrend = BD_MATCHES.map(m => m.tackles.pct);

  /* Correlation insight: fast ruck % in wins vs losses */
  const wins   = BD_MATCHES.filter(m => m.result === 'W');
  const losses = BD_MATCHES.filter(m => m.result === 'L');
  const winFastPct  = wins.length  ? avg(wins.map(m => Math.round((m.rucks.fast / m.rucks.total) * 100))) : 0;
  const lossFastPct = losses.length ? avg(losses.map(m => Math.round((m.rucks.fast / m.rucks.total) * 100))) : 0;

  return (
    <div className="page" style={{ paddingBottom: 60 }}>
      <div className="page-head">
        <div>
          <div className="eyebrow">Performance Analytics · {SEASON_YEAR} Season</div>
          <h1>Collision &amp; Breakdown</h1>
          <div className="meta">
            {BD_MATCHES.length} matches · tackle {avgTackle}% · ruck win {avgRuckWin}% · fast ruck {fastPct}%
          </div>
        </div>
        <div className="row gap-3">
          <button className="btn accent sm">✦ AI insight</button>
          <button className="btn">Export</button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 14 }}>
        <div className="stat">
          <span className="label">Tackle completion</span>
          <span className="value" style={{ color: avgTackle >= 82 ? 'var(--ok)' : 'var(--warn)' }}>{avgTackle}%</span>
          <span className="sub">League avg ~81%</span>
        </div>
        <div className="stat">
          <span className="label">Ruck win rate</span>
          <span className="value" style={{ color: avgRuckWin >= 85 ? 'var(--ok)' : 'var(--warn)' }}>{avgRuckWin}%</span>
          <span className="sub">{fastPct}% won in under 3s</span>
        </div>
        <div className="stat">
          <span className="label">Our jackals</span>
          <span className="value ok">{ourJackals}</span>
          <span className="sub">Season steals</span>
        </div>
        <div className="stat">
          <span className="label">Conceded jackals</span>
          <span className="value warn">{oppJackals}</span>
          <span className="sub">Opp steals vs us</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

        {/* Ruck speed */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Ruck speed distribution</div>
            <span className="mono">season total · {totRucks} rucks</span>
          </div>
          {[
            { label: 'Fast — under 3s',    pct: fastPct, col: 'var(--ok)',      note: 'Winning breakdown' },
            { label: 'Medium — 3 to 5s',   pct: medPct,  col: 'var(--accent-2)',note: 'Contest risk zone' },
            { label: 'Slow — over 5s',     pct: slowPct, col: 'var(--warn)',    note: 'Turnover likely' },
          ].map(({ label, pct, col, note }) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div className="row between" style={{ marginBottom: 4 }}>
                <div>
                  <span style={{ fontSize: 13 }}>{label}</span>
                  <span className="mono" style={{ marginLeft: 6 }}>{note}</span>
                </div>
                <span style={{ fontWeight: 700, color: col }}>{pct}%</span>
              </div>
              <div className="meter" style={{ height: 8 }}>
                <div style={{ width: `${pct}%`, background: col, height: '100%', borderRadius: 4 }} />
              </div>
            </div>
          ))}

          {/* Win vs loss correlation */}
          <hr className="hr dashed" style={{ margin: '10px 0' }} />
          <div className="mono" style={{ marginBottom: 6 }}>Fast ruck % — wins vs losses</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'In wins',   val: winFastPct,  col: 'var(--ok)' },
              { label: 'In losses', val: lossFastPct, col: 'var(--warn)' },
            ].map(({ label, val, col }) => (
              <div key={label} style={{ padding: '8px 10px', background: 'var(--paper-2)', borderRadius: 8, borderLeft: `3px solid ${col}` }}>
                <div className="mono">{label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: col }}>{val}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tackle completion per match */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Tackle completion — match by match</div>
          </div>
          <div>
            {BD_MATCHES.map((m, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div className="row between" style={{ marginBottom: 3 }}>
                  <div className="row gap-3">
                    <Badge variant={m.result === 'W' ? 'ok' : 'warn'}>{m.result}</Badge>
                    <span style={{ fontSize: 12 }}>{m.match}</span>
                  </div>
                  <div className="row gap-3">
                    <span className="mono">{m.tackles.made}/{m.tackles.total}</span>
                    <span style={{ fontWeight: 700, minWidth: 38, textAlign: 'right', color: m.tackles.pct >= 82 ? 'var(--ok)' : 'var(--warn)' }}>
                      {m.tackles.pct}%
                    </span>
                  </div>
                </div>
                <div className="meter" style={{ height: 6 }}>
                  <div style={{ width: `${m.tackles.pct}%`, background: m.tackles.pct >= 82 ? 'var(--ok)' : 'var(--warn)', height: '100%', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
          <hr className="hr dashed" style={{ margin: '10px 0' }} />
          <div className="col tight">
            <div className="mono" style={{ marginBottom: 4 }}>Tackle % trend — season</div>
            <Sparkline data={tackleTrend} color="var(--primary)" width={260} height={44} />
          </div>
        </div>
      </div>

      {/* Jackals + ruck win per match */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="card-head">
          <div className="card-title">Jackal &amp; ruck data — match log</div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Match</th>
              <th className="num">Ruck win%</th>
              <th className="num">Fast rucks</th>
              <th className="num">Jackals won</th>
              <th className="num">Jackals conceded</th>
              <th className="num">Tackle %</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {BD_MATCHES.map((m, i) => {
              const ruckPct = Math.round((m.rucks.won / m.rucks.total) * 100);
              const sFast   = Math.round((m.rucks.fast / m.rucks.total) * 100);
              return (
                <tr key={i}>
                  <td className="player-name">{m.match}</td>
                  <td className="num"><span style={{ fontWeight: 600, color: ruckPct >= 85 ? 'var(--ok)' : 'var(--warn)' }}>{ruckPct}%</span></td>
                  <td className="num"><span style={{ color: sFast >= 50 ? 'var(--ok)' : 'var(--warn)' }}>{sFast}%</span></td>
                  <td className="num"><span style={{ color: 'var(--ok)', fontWeight: m.jackals.won > 2 ? 700 : 400 }}>{m.jackals.won}</span></td>
                  <td className="num"><span style={{ color: m.jackals.opp > 3 ? 'var(--warn)' : 'var(--ink)', fontWeight: m.jackals.opp > 3 ? 700 : 400 }}>{m.jackals.opp}</span></td>
                  <td className="num"><span style={{ color: m.tackles.pct >= 82 ? 'var(--ok)' : 'var(--warn)' }}>{m.tackles.pct}%</span></td>
                  <td><Badge variant={m.result === 'W' ? 'ok' : 'warn'}>{m.result}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Player breakdown leaders */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="card-head">
          <div className="card-title">Breakdown leaders — season</div>
          <span className="mono">personal stats</span>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Position</th>
              <th className="num">Jackals</th>
              <th className="num">Tackle %</th>
              <th className="num">Clearout %</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {BD_LEADERS.map((p, i) => (
              <tr key={i}>
                <td>
                  <div className="row gap-3">
                    <Head p={p} />
                    <span className="player-name">{p.fn} {p.ln}</span>
                  </div>
                </td>
                <td className="mono">{p.pos}</td>
                <td className="num">
                  <span style={{ fontWeight: 700, color: 'var(--ok)' }}>{p.jackals}</span>
                </td>
                <td className="num">
                  <span style={{ color: p.tackles >= 85 ? 'var(--ok)' : 'var(--warn)', fontWeight: 600 }}>{p.tackles}%</span>
                </td>
                <td className="num">
                  <span style={{ color: p.clearouts >= 85 ? 'var(--ok)' : 'var(--ink)', fontWeight: 600 }}>{p.clearouts}%</span>
                </td>
                <td>
                  {p.note && <Badge variant="warn">{p.note}</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI insight */}
      <div className="ai-card">
        <div className="ai-glyph">AI</div>
        <div className="body">
          <b>Ruck speed is the decisive variable</b> — fast rucks (&lt;3s) average {winFastPct}% in wins vs {lossFastPct}% in losses.
          UCT win 76% of ruck contests when clearout is late. Recommend Tuesday session focused on first-man-over
          timing and chest-to-chest clearout technique.
        </div>
        <button className="btn accent">Plan breakdown session</button>
        <button className="btn">UCT breakdown profile</button>
      </div>
    </div>
  );
};

Object.assign(window, { BreakdownEfficiency });
