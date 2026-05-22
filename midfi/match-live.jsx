/* RugbyAI mid-fi — Live mode + Sideline (tablet) view */

const KPI_GROUPS = {
  Lineouts: [
    { k: 'lo_total', l: 'Total' },
    { k: 'lo_won',   l: 'Won' },
    { k: 'lo_scrap', l: 'Won scrappy' },
    { k: 'lo_lost',  l: 'Lost' },
    { k: 'lo_steal', l: 'Opp steal' },
  ],
  Scrums: [
    { k: 'sc_total', l: 'Total' },
    { k: 'sc_won',   l: 'Won' },
    { k: 'sc_lost',  l: 'Lost' },
    { k: 'sc_tight', l: 'Tighthead' },
  ],
  Discipline: [
    { k: 'pen_us',   l: 'Penalties (us)' },
    { k: 'pen_them', l: 'Penalties (opp)' },
    { k: 'yc',       l: 'Yellow cards' },
    { k: 'rc',       l: 'Red cards' },
  ],
  Territory: [
    { k: 'turn_won',  l: 'Turnovers won' },
    { k: 'turn_lost', l: 'Turnovers lost' },
    { k: 'kicks',     l: 'Box kicks' },
    { k: 'tries_us',  l: 'Tries (us)' },
    { k: 'tries_them',l: 'Tries (opp)' },
  ],
};

const INITIAL_KPI = {
  lo_total: 6, lo_won: 5, lo_scrap: 1, lo_lost: 1, lo_steal: 0,
  sc_total: 4, sc_won: 4, sc_lost: 0, sc_tight: 1,
  pen_us: 3, pen_them: 5, yc: 0, rc: 0,
  turn_won: 2, turn_lost: 4, kicks: 3,
  tries_us: 2, tries_them: 1,
};

const INITIAL_TRIES = [
  { min: 8,  team: 'us',   scorer: 'Barnier',  type: 'wing finish' },
  { min: 19, team: 'them', scorer: 'UCT #13',  type: 'centre break' },
  { min: 26, team: 'us',   scorer: 'Petersen', type: '#8 pick & go' },
];

const Tally = ({ label, value, onChange }) => (
  <div className="tally">
    <span className="lbl">{label}</span>
    <div className="ctrls">
      <button onClick={() => onChange(Math.max(0, value - 1))} aria-label="decrement">−</button>
      <span className="val">{value}</span>
      <button className="plus" onClick={() => onChange(value + 1)} aria-label="increment">+</button>
    </div>
  </div>
);

const LiveScore = ({ us, them, time, half }) => (
  <div className="live-banner">
    <div className="row gap-3">
      <span className="live-dot" />
      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '.08em' }}>LIVE</span>
    </div>
    <div className="row gap-8" style={{ justifyContent: 'center' }}>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,.6)' }}>WARWICK PUMAS</div>
        <div className="score">{us}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'rgba(255,255,255,.4)', alignSelf: 'center' }}>·</div>
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,.6)' }}>UCT</div>
        <div className="score">{them}</div>
      </div>
    </div>
    <div className="col tight" style={{ alignItems: 'flex-end', gap: 6 }}>
      <div className="clock">{half} · {time}'</div>
      <div className="row gap-2">
        <button className="btn sm" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--paper)', borderColor: 'transparent' }}>Pause</button>
        <button className="btn accent sm">+ Try</button>
      </div>
    </div>
  </div>
);

/* ============================================================
   Live Match View — desktop
   ============================================================ */
const LiveMatchView = ({ next, onLeave }) => {
  const [kpi, setKpi] = React.useState(INITIAL_KPI);
  const [tries, setTries] = React.useState(INITIAL_TRIES);
  const setK = (k, v) => setKpi(prev => ({ ...prev, [k]: v }));

  const usScore = kpi.tries_us * 5 + 2; // rough — tries + conversions
  const themScore = kpi.tries_them * 5 + 2;
  const loPct = kpi.lo_total ? Math.round((kpi.lo_won / kpi.lo_total) * 100) : 0;
  const scPct = kpi.sc_total ? Math.round((kpi.sc_won / kpi.sc_total) * 100) : 0;

  return (
    <>
      <LiveScore us={usScore} them={themScore} time={28} half="1H" />

      <div className="split match" style={{ marginTop: 14 }}>
        {/* Quick stats */}
        <div className="col">
          <div className="card">
            <div className="card-head">
              <div className="card-title">At a glance</div>
              <span className="mono">1H · 28'</span>
            </div>
            <div className="col" style={{ gap: 14 }}>
              <div>
                <div className="row between">
                  <span className="mono">Lineout</span>
                  <span style={{ fontWeight: 600, color: loPct >= 80 ? 'var(--ok)' : 'var(--warn)' }}>{loPct}%</span>
                </div>
                <div className="meter ok"><div style={{ width: `${loPct}%` }} /></div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>{kpi.lo_won} of {kpi.lo_total} won</div>
              </div>
              <div>
                <div className="row between">
                  <span className="mono">Scrum</span>
                  <span style={{ fontWeight: 600 }}>{scPct}%</span>
                </div>
                <div className="meter"><div style={{ width: `${scPct}%` }} /></div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>{kpi.sc_won} of {kpi.sc_total} · {kpi.sc_tight} tighthead</div>
              </div>
              <div>
                <div className="row between">
                  <span className="mono">Penalties</span>
                  <span style={{ fontWeight: 600, color: kpi.pen_us >= 5 ? 'var(--warn)' : 'var(--ink)' }}>
                    {kpi.pen_us} <span className="muted">vs</span> {kpi.pen_them}
                  </span>
                </div>
                <div className="row gap-2" style={{ marginTop: 4 }}>
                  <div style={{ height: 6, flex: kpi.pen_us, background: 'var(--warn)', borderRadius: 3, minWidth: 8 }} />
                  <div style={{ height: 6, flex: kpi.pen_them, background: 'var(--ok)', borderRadius: 3, minWidth: 8 }} />
                </div>
              </div>
              <div>
                <div className="row between">
                  <span className="mono">Cards</span>
                  <span style={{ fontWeight: 600 }}>{kpi.yc} YC · {kpi.rc} RC</span>
                </div>
              </div>
              <div>
                <div className="row between">
                  <span className="mono">Tries</span>
                  <span style={{ fontWeight: 600 }}>{kpi.tries_us} <span className="muted">vs</span> {kpi.tries_them}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card paper">
            <div className="card-head">
              <div className="card-title">Try log</div>
              <button className="btn sm primary" onClick={() => setTries(t => [...t, { min: 30, team: 'us', scorer: 'TBD', type: '—' }])}>+ Log try</button>
            </div>
            <div className="try-log">
              <div className="row-strip" style={{ borderBottom: '1px solid var(--line)' }}>
                <span className="mono">Min</span>
                <span className="mono">Team</span>
                <span className="mono">Scorer · type</span>
                <span className="mono">⋯</span>
              </div>
              {tries.map((t, i) => (
                <div key={i} className={`row-strip ${t.team}`}>
                  <span className="mono-num">{t.min}'</span>
                  <span className="team">{t.team === 'us' ? 'PUM' : 'UCT'}</span>
                  <span>{t.scorer} <span className="muted">· {t.type}</span></span>
                  <button className="btn ghost sm">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KPI tally counters */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Tap to log — KPIs</div>
            <span className="mono">auto-saves</span>
          </div>
          {Object.entries(KPI_GROUPS).map(([group, items]) => (
            <div key={group} className="kpi-grid" style={{ marginBottom: 10 }}>
              <h4>{group}</h4>
              {items.map(item => (
                <Tally
                  key={item.k}
                  label={item.l}
                  value={kpi[item.k] || 0}
                  onChange={v => setK(item.k, v)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* AI Brief + Calls */}
        <div className="col">
          <div className="card dark">
            <div className="card-head">
              <div className="card-title" style={{ color: 'var(--accent)' }}>✦ Half-time brief</div>
              <Badge variant="accent">12' to HT</Badge>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,.9)' }}>
              Lineout <em style={{ color: 'var(--accent)', fontStyle: 'normal', fontWeight: 600 }}>{loPct}%</em> — best vs UCT-style sides.
              Penalty count <em style={{ color: 'var(--warn)', fontStyle: 'normal', fontWeight: 600 }}>{kpi.pen_us}</em> trending dangerous.
              Suggest call <em style={{ color: 'var(--accent)', fontStyle: 'normal', fontWeight: 600 }}>Brumby</em> off 9 — attack their 13 channel.
            </div>
            <hr className="hr" style={{ background: 'rgba(255,255,255,.1)' }} />
            <div className="row gap-2">
              <button className="btn accent sm">Draft talk</button>
              <button className="btn sm" style={{ background: 'rgba(255,255,255,.06)', color: 'var(--paper)', borderColor: 'transparent' }}>Show data</button>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">Quick call</div>
              <span className="mono">tap to send to bench</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {['Brumby','Bus','Bulls','Stormers','Blitz','Choke','Doubles','Crusader'].map(c => (
                <button key={c} className="chip" style={{ justifyContent: 'center' }}>{c}</button>
              ))}
            </div>
          </div>

          <div className="card paper">
            <div className="card-head">
              <div className="card-title">Subs queued</div>
              <Badge variant="outline">0 / 8</Badge>
            </div>
            <div className="empty-zone" style={{ padding: 18 }}>
              No substitutions yet
            </div>
            <button className="btn sm" style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}>+ Plan substitution</button>
          </div>

          <div className="row gap-3">
            <button className="btn" style={{ flex: 1, justifyContent: 'center' }}>End first half</button>
            <button className="btn primary" style={{ flex: 1, justifyContent: 'center' }} onClick={onLeave}>End match →</button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ============================================================
   Sideline View — tablet-framed companion of Live mode
   ============================================================ */
const SidelineView = ({ next }) => {
  const [kpi, setKpi] = React.useState(INITIAL_KPI);
  const setK = (k, v) => setKpi(prev => ({ ...prev, [k]: v }));
  const usScore = kpi.tries_us * 5 + 2;
  const themScore = kpi.tries_them * 5 + 2;
  const loPct = kpi.lo_total ? Math.round((kpi.lo_won / kpi.lo_total) * 100) : 0;
  const scPct = kpi.sc_total ? Math.round((kpi.sc_won / kpi.sc_total) * 100) : 0;

  return (
    <>
      <div className="card" style={{ padding: '12px 16px', marginBottom: 12 }}>
        <div className="row between wrap">
          <div className="row gap-6">
            <span className="mono">Sideline preview</span>
            <span style={{ fontSize: 13 }}>How the live view feels on a 10-inch tablet, optimised for big taps in bright sun.</span>
          </div>
          <div className="row gap-3">
            <button className="btn sm">Send to assistant's iPad</button>
            <button className="btn sm">Print one-pager</button>
          </div>
        </div>
      </div>

      <div className="tablet-shell">
        <div className="tablet">
          <div className="tablet-screen">
            <div className="tablet-bar">
              <div className="ind">
                <span style={{ background: 'var(--warn)', width: 6, height: 6, borderRadius: 3, display: 'inline-block' }} />
                <span style={{ color: 'var(--accent)' }}>LIVE</span>
                <span style={{ color: 'rgba(255,255,255,.5)', marginLeft: 8 }}>RugbyAI · sideline</span>
              </div>
              <div className="ind">
                <span>14:42</span>
                <span style={{ color: 'rgba(255,255,255,.5)' }}>·</span>
                <span>🔋 84%</span>
                <span style={{ color: 'rgba(255,255,255,.5)' }}>·</span>
                <span>📶</span>
              </div>
            </div>

            {/* Score header */}
            <div style={{
              background: 'var(--ink)', color: 'var(--paper)',
              padding: '20px 26px', display: 'grid',
              gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'center',
            }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: '.1em' }}>WARWICK PUMAS</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 700, lineHeight: 1 }}>{usScore}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'rgba(255,255,255,.5)' }}>1H · 28'</div>
                <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,.2)', margin: '6px auto' }} />
                <button className="btn accent sm">+ Try</button>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,.5)', letterSpacing: '.1em' }}>{next.opp.toUpperCase()}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 700, lineHeight: 1 }}>{themScore}</div>
              </div>
            </div>

            <div className="sideline-grid sideline-controls">
              {/* Main KPI counters - large */}
              <div className="col">
                <div className="card">
                  <div className="card-head">
                    <div className="card-title" style={{ fontSize: 18 }}>Lineout</div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, color: loPct >= 80 ? 'var(--ok)' : 'var(--warn)' }}>{loPct}%</span>
                  </div>
                  <div className="col" style={{ gap: 8 }}>
                    {KPI_GROUPS.Lineouts.map(item => (
                      <Tally key={item.k} label={item.l} value={kpi[item.k] || 0} onChange={v => setK(item.k, v)} />
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-head">
                    <div className="card-title" style={{ fontSize: 18 }}>Scrum</div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600 }}>{scPct}%</span>
                  </div>
                  <div className="col" style={{ gap: 8 }}>
                    {KPI_GROUPS.Scrums.map(item => (
                      <Tally key={item.k} label={item.l} value={kpi[item.k] || 0} onChange={v => setK(item.k, v)} />
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-head">
                    <div className="card-title" style={{ fontSize: 18 }}>Discipline</div>
                    <Badge variant={kpi.pen_us >= 5 ? 'warn' : 'outline'}>{kpi.pen_us} pen.</Badge>
                  </div>
                  <div className="col" style={{ gap: 8 }}>
                    {KPI_GROUPS.Discipline.map(item => (
                      <Tally key={item.k} label={item.l} value={kpi[item.k] || 0} onChange={v => setK(item.k, v)} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column — quick actions + half-time */}
              <div className="col">
                <div className="card dark">
                  <div className="mono" style={{ color: 'var(--accent)', marginBottom: 6 }}>✦ COACH'S EAR</div>
                  <div style={{ fontSize: 14, lineHeight: 1.5, color: 'rgba(255,255,255,.9)' }}>
                    {kpi.pen_us >= 5
                      ? `Penalties stacking (${kpi.pen_us}). Reset discipline at next stoppage.`
                      : `Lineout strong. Maintain Bulls + Stormers off the lift.`}
                  </div>
                </div>

                <div className="card">
                  <div className="card-title" style={{ fontSize: 16, marginBottom: 10 }}>Quick call</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {['Brumby','Bus','Bulls','Stormers','Blitz','Choke','Doubles','Fire'].map(c => (
                      <button key={c} className="chip" style={{ justifyContent: 'center', padding: '8px 4px', fontSize: 13 }}>{c}</button>
                    ))}
                  </div>
                </div>

                <div className="card paper">
                  <div className="card-title" style={{ fontSize: 16, marginBottom: 8 }}>Try log</div>
                  <div className="try-log" style={{ fontSize: 12 }}>
                    {INITIAL_TRIES.map((t, i) => (
                      <div key={i} className={`row-strip ${t.team}`}>
                        <span className="mono-num">{t.min}'</span>
                        <span className="team">{t.team === 'us' ? 'PUM' : 'UCT'}</span>
                        <span style={{ fontSize: 12 }}>{t.scorer}</span>
                        <span></span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="btn primary lg" style={{ width: '100%', justifyContent: 'center' }}>End first half</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { LiveMatchView, SidelineView, Tally, KPI_GROUPS, INITIAL_KPI });
