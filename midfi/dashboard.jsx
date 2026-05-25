/* RugbyAI mid-fi — Season Dashboard */

const Dashboard = () => {
  const playedFixtures = FIXTURES.filter(f => !f.upcoming);
  const upcomingFixtures = FIXTURES.filter(f => f.upcoming);
  const wins       = playedFixtures.filter(f => f.result === 'W').length;
  const losses     = playedFixtures.filter(f => f.result === 'L').length;
  const totalF     = playedFixtures.reduce((a, f) => a + (f.f || 0), 0);
  const totalA     = playedFixtures.reduce((a, f) => a + (f.a || 0), 0);
  const totalTries = playedFixtures.reduce((a, f) => a + (f.tries || 0), 0);
  const next       = upcomingFixtures[0] || null;
  const recent     = playedFixtures.slice(-8);
  const n          = playedFixtures.length || 1; /* guard div-by-zero */
  const hasData    = FIXTURES.length > 0;
  const hasSquad   = SQUAD.length > 0;

  /* ── Fresh season empty state ── */
  if (!hasData && !hasSquad) {
    return (
      <div className="page">
        <div className="page-head">
          <div>
            <div className="eyebrow">Fresh season</div>
            <h1>Season at a glance</h1>
            <div className="meta">No fixtures or squad data yet</div>
          </div>
          <div className="row gap-3">
            <button className="btn primary"><span className="ico">+</span> Log result</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 8 }}>
          {[
            { icon: '◇', label: 'Add your squad',    hint: 'Import players from the Squad screen', route: 'squad' },
            { icon: '▦', label: 'Add fixtures',       hint: 'Build the season calendar',            route: 'calendar' },
            { icon: '◔', label: 'Plan first practice', hint: 'Drop drills onto the practice planner', route: 'practice' },
          ].map(c => (
            <div key={c.route} className="card paper" style={{ padding: '24px 20px' }}>
              <div style={{ fontSize: 28, marginBottom: 10, color: 'var(--primary)' }}>{c.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, marginBottom: 6 }}>{c.label}</div>
              <div className="muted" style={{ fontSize: 13, marginBottom: 16 }}>{c.hint}</div>
            </div>
          ))}
        </div>
        <div className="ai-card" style={{ marginTop: 14 }}>
          <div className="ai-glyph">AI</div>
          <div className="body">
            <b>Ready when you are.</b> Add fixtures, log some results, and the analyst will start surfacing trends — form patterns, injury flags, and set-piece reads.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">{new Date().getFullYear()} Season</div>
          <h1>Season at a glance</h1>
          <div className="meta">{FIXTURES.length} fixtures · {playedFixtures.length} played · {upcomingFixtures.length} remaining</div>
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
          <span className="sub">
            {playedFixtures.length > 0
              ? <>Win rate <b style={{ color: wins / playedFixtures.length >= 0.5 ? 'var(--ok)' : 'var(--warn)' }}>{Math.round(wins / playedFixtures.length * 100)}%</b></>
              : 'No results yet'}
          </span>
        </div>
        <div className="stat">
          <span className="label">Points difference</span>
          {playedFixtures.length > 0 ? (
            <>
              <span className={`value ${totalF >= totalA ? 'ok' : 'warn'}`}>{totalF >= totalA ? '+' : '−'}{Math.abs(totalF - totalA)}</span>
              <span className="sub">{totalF} for · {totalA} against · {totalTries} tries</span>
            </>
          ) : (
            <>
              <span className="value" style={{ color: 'var(--ink-soft)' }}>—</span>
              <span className="sub">No results logged yet</span>
            </>
          )}
        </div>
        {next ? (
          <div className="stat dark ring-accent">
            <span className="label" style={{ color: 'var(--accent)' }}>Next match</span>
            <span className="value">vs {next.opp}</span>
            <span className="sub">{next.date} · {next.venue} · {next.kickoff || '15:00'} KO</span>
          </div>
        ) : (
          <div className="stat">
            <span className="label">Next match</span>
            <span className="value" style={{ color: 'var(--ink-soft)' }}>—</span>
            <span className="sub">No upcoming fixtures</span>
          </div>
        )}
      </div>

      <div className="split dash">
        {/* Left column */}
        <div className="col">
          {recent.length > 0 ? (
            <div className="card">
              <div className="card-head">
                <div className="card-title">Form — last {recent.length} fixture{recent.length !== 1 ? 's' : ''}</div>
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
                  <span className="mono">Avg scored</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600 }}>
                    {(totalF / n).toFixed(1)}
                  </span>
                </div>
                <div className="col tight">
                  <span className="mono">Avg conceded</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--warn)' }}>
                    {(totalA / n).toFixed(1)}
                  </span>
                </div>
                <div className="col tight">
                  <span className="mono">Tries / game</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600 }}>
                    {(totalTries / n).toFixed(1)}
                  </span>
                </div>
                <div className="col tight">
                  <span className="mono">Best result</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--ok)' }}>
                    {playedFixtures.length > 0
                      ? (() => { const best = playedFixtures.reduce((b, f) => (f.f||0)-(f.a||0) > (b.f||0)-(b.a||0) ? f : b); return `${best.f >= best.a ? '+' : ''}${(best.f||0)-(best.a||0)} vs ${best.opp}`; })()
                      : '—'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>▦</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 6 }}>No results yet</div>
              <div className="muted" style={{ fontSize: 13 }}>Log your first result to start tracking form.</div>
            </div>
          )}

          <div className="card">
            <div className="card-head">
              <div className="card-title">Recent results</div>
              <div className="row gap-2">
                <button className="chip active">All</button>
                <button className="chip">League</button>
                <button className="chip">Warmup</button>
              </div>
            </div>
            {playedFixtures.length > 0 ? (
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
                      <td className="num">{f.f ?? '—'}</td>
                      <td className="num">{f.a ?? '—'}</td>
                      <td className="num" style={{ color: (f.f||0) >= (f.a||0) ? 'var(--ok)' : 'var(--warn)' }}>
                        {f.f != null ? `${f.f - f.a > 0 ? '+' : ''}${f.f - f.a}` : '—'}
                      </td>
                      <td>
                        {f.result ? (
                          <Badge variant={f.result === 'W' ? 'ok' : 'warn'}>
                            <span className="dot" />{f.result === 'W' ? 'Win' : 'Loss'}
                          </Badge>
                        ) : <span className="muted">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--ink-soft)', fontSize: 14 }}>
                No results logged yet
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="col">
          {next ? (
            <div className="card ring-accent">
              <div className="card-head">
                <div className="card-title">Up next · vs {next.opp}</div>
                <Badge variant="accent"><span className="dot" />Upcoming</Badge>
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
                  <div className="muted" style={{ fontSize: 13 }}>{next.date} · {next.kickoff || '15:00'} KO · {next.venue}</div>
                </div>
              </div>
              <hr className="hr dashed" />
              <div className="row gap-3">
                <button className="btn">View opponent</button>
                <button className="btn accent">Open team sheet →</button>
              </div>
            </div>
          ) : upcomingFixtures.length === 0 && FIXTURES.length > 0 ? (
            <div className="card" style={{ padding: '28px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Season complete</div>
              <div className="muted" style={{ fontSize: 13 }}>All fixtures played.</div>
            </div>
          ) : null}

          <div className="card">
            <div className="card-head">
              <div className="card-title">On the radar</div>
              <button className="btn ghost sm">View all</button>
            </div>
            <div className="col" style={{ gap: 10 }}>
              {SQUAD.length === 0 && FIXTURES.length === 0 ? (
                <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--ink-soft)', fontSize: 14 }}>
                  Add squad and results to surface insights
                </div>
              ) : [
                { type: 'accent', tag: 'AI ready', msg: 'Log match data and the analyst will surface form trends, injury risks, and set-piece reads automatically.', meta: 'Analyst' },
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

          {hasSquad && (
            <div className="card paper">
              <div className="card-head">
                <div className="card-title">Top caps — squad</div>
                <button className="btn ghost sm">Full list →</button>
              </div>
              <table className="table" style={{ fontSize: 13 }}>
                <tbody>
                  {[...SQUAD].sort((a, b) => b.caps - a.caps).slice(0, 5).map((p, i) => (
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
          )}
        </div>
      </div>

      {/* AI banner */}
      <div className="ai-card" style={{ marginTop: 14 }}>
        <div className="ai-glyph">AI</div>
        <div className="body">
          <b>Analyst ready.</b> As you log results and practice sessions, the analyst will surface trends — form patterns, discipline risks, set-piece reads, and workload alerts.
        </div>
        <button className="btn accent">Open analyst</button>
      </div>

      <div className="page-foot">
        <span>Last sync · {new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</span>
        <span>RugbyAI · {new Date().getFullYear()} season</span>
      </div>
    </div>
  );
};

Object.assign(window, { Dashboard });
