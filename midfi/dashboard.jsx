/* RugbyAI mid-fi — Season Dashboard */

const Dashboard = () => {
  const playedFixtures = FIXTURES.filter(f => !f.upcoming);
  const wins = playedFixtures.filter(f => f.result === 'W').length;
  const losses = playedFixtures.filter(f => f.result === 'L').length;
  const totalF = playedFixtures.reduce((a, f) => a + (f.f || 0), 0);
  const totalA = playedFixtures.reduce((a, f) => a + (f.a || 0), 0);
  const totalTries = playedFixtures.reduce((a, f) => a + (f.tries || 0), 0);
  const next = FIXTURES.find(f => f.upcoming);
  const recent = playedFixtures.slice(-8);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">2024 Season  ·  Week 14 of 24</div>
          <h1>Season at a glance</h1>
          <div className="meta">5 warmup + 14 league fixtures · Western Cape Premier B</div>
        </div>
        <div className="row gap-3">
          <button className="btn">Export season report</button>
          <button className="btn primary"><span className="ico">+</span> Log result</button>
        </div>
      </div>

      {/* KPI row */}
      <div className="split three" style={{ marginBottom: 14 }}>
        <div className="stat">
          <span className="label">Record</span>
          <span className="value">{wins}<span style={{ color: 'var(--ink-soft)' }}>–{losses}–0</span></span>
          <span className="sub">Win rate <b style={{ color: 'var(--warn)' }}>15.8%</b> · league avg 47%</span>
        </div>
        <div className="stat">
          <span className="label">Points difference</span>
          <span className="value warn">−{totalA - totalF}</span>
          <span className="sub">{totalF} for · {totalA} against · {totalTries} tries</span>
        </div>
        <div className="stat dark ring-accent">
          <span className="label" style={{ color: 'var(--accent)' }}>Next match</span>
          <span className="value">vs {next.opp}</span>
          <span className="sub">Sat {next.date} · {next.venue} · 15:00 kickoff</span>
        </div>
      </div>

      <div className="split dash">
        {/* Left column */}
        <div className="col">
          <div className="card">
            <div className="card-head">
              <div className="card-title">Form — last 8 fixtures</div>
              <div className="row gap-2">
                <span className="badge ok"><span className="dot" />Win</span>
                <span className="badge warn"><span className="dot" />Loss</span>
                <span className="mono">Points scored</span>
              </div>
            </div>
            <FormChart matches={recent} />
            <hr className="hr dashed" style={{ marginTop: 28 }} />
            <div className="row between" style={{ marginTop: 12 }}>
              <div className="col tight">
                <span className="mono">Avg points scored</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600 }}>
                  {(totalF / playedFixtures.length).toFixed(1)}
                </span>
              </div>
              <div className="col tight">
                <span className="mono">Avg conceded</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--warn)' }}>
                  {(totalA / playedFixtures.length).toFixed(1)}
                </span>
              </div>
              <div className="col tight">
                <span className="mono">Tries / game</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600 }}>
                  {(totalTries / playedFixtures.length).toFixed(1)}
                </span>
              </div>
              <div className="col tight">
                <span className="mono">Best result</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--ok)' }}>
                  +7 vs Rocklands
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">Recent results</div>
              <div className="row gap-2">
                <button className="chip active">All</button>
                <button className="chip">League</button>
                <button className="chip">Warmup</button>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Opposition</th>
                  <th>H/A</th>
                  <th>Date</th>
                  <th className="num">F</th>
                  <th className="num">A</th>
                  <th className="num">Diff</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {playedFixtures.slice(-6).reverse().map((f, i) => (
                  <tr key={i}>
                    <td><Badge variant={f.type === 'League' ? 'ink' : 'outline'}>{f.type}</Badge></td>
                    <td className="player-name">{f.opp}</td>
                    <td><span className="mono">{f.venue}</span></td>
                    <td>{f.date}</td>
                    <td className="num">{f.f}</td>
                    <td className="num">{f.a}</td>
                    <td className="num" style={{ color: f.f >= f.a ? 'var(--ok)' : 'var(--warn)' }}>
                      {f.f - f.a > 0 ? '+' : ''}{f.f - f.a}
                    </td>
                    <td>
                      <Badge variant={f.result === 'W' ? 'ok' : 'warn'}>
                        <span className="dot" />{f.result === 'W' ? 'Win' : 'Loss'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="col">
          <div className="card ring-accent">
            <div className="card-head">
              <div className="card-title">Up next  ·  vs {next.opp}</div>
              <Badge variant="accent"><span className="dot" />3 days</Badge>
            </div>
            <div className="row gap-6" style={{ marginBottom: 14 }}>
              <div style={{
                width: 64, height: 64, background: 'var(--paper-2)', borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: 'var(--primary)',
                border: '1px solid var(--line)',
              }}>
                vs
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600 }}>{next.opp}</div>
                <div className="muted" style={{ fontSize: 13 }}>Sat {next.date} 2024 · 15:00 · {next.venue} · Round 8</div>
              </div>
            </div>
            <hr className="hr" />
            <div className="row between">
              <div className="col tight">
                <span className="mono">H2H — career</span>
                <span style={{ fontWeight: 600 }}>2W · 5L · 0D</span>
              </div>
              <div className="col tight">
                <span className="mono">Last meeting</span>
                <span style={{ fontWeight: 600 }}>19–24 L · 9 Mar</span>
              </div>
              <div className="col tight">
                <span className="mono">Avg margin</span>
                <span style={{ fontWeight: 600 }}>−8.4 pts</span>
              </div>
            </div>
            <hr className="hr dashed" />
            <div className="row gap-3">
              <button className="btn">View opponent</button>
              <button className="btn accent">Open team sheet →</button>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">On the radar</div>
              <button className="btn ghost sm">View all</button>
            </div>
            <div className="col" style={{ gap: 10 }}>
              {[
                { type: 'warn', tag: 'Fitness',     msg: '3 props in red zone — only 2 fit for UCT', meta: 'Squad' },
                { type: 'warn', tag: 'Discipline',  msg: 'Avg 11 penalties/game vs league avg 7',     meta: 'Last 5' },
                { type: 'ok',   tag: 'Bright spot', msg: 'Bench tries up 60% since round 5',          meta: 'Trend' },
                { type: 'accent', tag: 'Set piece', msg: 'Scrum dominance vs Brackenfell (8/8 won)',  meta: 'Hist.' },
              ].map((r, i) => (
                <div key={i} style={{ padding: '10px 12px', background: 'var(--paper-2)', borderRadius: 10, border: '1px solid var(--line)' }}>
                  <div className="row between" style={{ marginBottom: 4 }}>
                    <Badge variant={r.type}><span className="dot" />{r.tag}</Badge>
                    <span className="mono">{r.meta}</span>
                  </div>
                  <div style={{ fontSize: 13 }}>{r.msg}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card paper">
            <div className="card-head">
              <div className="card-title">Top caps — 1st XV</div>
              <button className="btn ghost sm">Full list →</button>
            </div>
            <table className="table" style={{ fontSize: 13 }}>
              <tbody>
                {SQUAD.sort((a, b) => b.caps - a.caps).slice(0, 5).map((p, i) => (
                  <tr key={p.n}>
                    <td style={{ width: 28 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-soft)' }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                      </span>
                    </td>
                    <td>
                      <div className="row gap-3">
                        <Head p={p} />
                        <div>
                          <div className="player-name">{p.fn} {p.ln}</div>
                          <div className="player-pos">{p.pos}</div>
                        </div>
                      </div>
                    </td>
                    <td className="num" style={{ fontWeight: 600 }}>{p.caps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI banner */}
      <div className="ai-card" style={{ marginTop: 14 }}>
        <div className="ai-glyph">AI</div>
        <div className="body">
          <b>Analyst noticed</b> your lineout win % dropped <em>−14pts</em> over the last 4 — and UCT have one of the league's stronger jumping pods.
          Want me to draft a 2-week practice plan focused on lifts &amp; jumper timing?
        </div>
        <button className="btn accent">Generate plan</button>
        <button className="btn">Show me the data</button>
      </div>

      <div className="page-foot">
        <span>Last sync · 14 Jun 09:42 · pulled from match-day entries</span>
        <span>Pumas RFC 2024 · Western Cape Rugby Union</span>
      </div>
    </div>
  );
};

Object.assign(window, { Dashboard });
