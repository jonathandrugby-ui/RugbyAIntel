/* RugbyAI mid-fi — Predictive Tactical Recommendations */

/* ---- Model data ---- */

const WIN_PROB_BASE = 34; // base before factors

const WIN_FACTORS = [
  { label: 'Home advantage',              delta: +7,  positive: true,  source: 'Historical',   weight: 'high' },
  { label: 'UCT away record (2W / 5)',    delta: +5,  positive: true,  source: 'Fixture data', weight: 'med'  },
  { label: 'Bench impact +60% since R5',  delta: +4,  positive: true,  source: 'Season trend', weight: 'med'  },
  { label: 'Scrum improving +8pts',       delta: +3,  positive: true,  source: 'Set Piece',    weight: 'low'  },
  { label: 'Discipline — 11 pen / game',  delta: -9,  positive: false, source: 'Season avg',   weight: 'high' },
  { label: 'Lineout ↓ −14pts last 4',    delta: -8,  positive: false, source: 'Set Piece',    weight: 'high' },
  { label: 'Points diff −ve all season',  delta: -4,  positive: false, source: 'Season',       weight: 'med'  },
  { label: 'H2H record 2W – 5L vs UCT',  delta: -3,  positive: false, source: 'H2H',          weight: 'med'  },
];

const WIN_PROB = Math.max(5, Math.min(95, WIN_PROB_BASE + WIN_FACTORS.reduce((s, f) => s + f.delta, 0)));

const OPP_TENDENCIES = [
  {
    pattern: 'Box kick from own half — first 20 min',
    confidence: 88,
    seen: '5 of 5 home games this season',
    counter: 'Chase #14 wide — UCT box kicks land outside 15m mark.',
    counterCall: 'FIRE',
  },
  {
    pattern: 'Bus off 10 on their right after lineout win',
    confidence: 82,
    seen: '4 of 5 recent matches',
    counter: 'Blitz early — pillar must shift right before the set.',
    counterCall: 'BLITZ',
  },
  {
    pattern: 'Blitz defence when we receive in our own 22',
    confidence: 76,
    seen: '3 of 4 head-to-head meetings',
    counter: 'Stormers call — back-pass to 10 beats the oncoming blitz.',
    counterCall: 'STORMERS',
  },
  {
    pattern: 'Loose tighthead bind — penalty conceded',
    confidence: 71,
    seen: '4 of 6 matches this season',
    counter: 'Drive through — ref rewards patience. Target 58–65 min window.',
    counterCall: 'BULLS',
  },
  {
    pattern: 'Loosehead prop substituted at 55–62 min',
    confidence: 65,
    seen: '4 of 4 last matches',
    counter: 'Bank scrums for that window — their new loosehead takes 10 min to settle.',
    counterCall: null,
  },
  {
    pattern: '#6 cheats forward on lineout tail calls',
    confidence: 60,
    seen: '3 of 4 vs us',
    counter: 'Move Jacobs to tail — isolates their #6. Middle call as decoy first.',
    counterCall: 'LINEOUT',
  },
];

const GAME_PLAN = [
  {
    phase: 'Attack',
    phaseCol: 'rgba(22,163,74,.14)',
    phaseText: '#15803d',
    phaseBorder: '#22c55e',
    primary: 'Brumby off 9',
    detail: 'UCT #7 drifts wide — 9 channel opens in phases 2–4. Mathebula\'s pass-speed is top quartile vs blitz defence.',
    confidence: 78,
    alt: 'London (left) if Brumby is defended twice in a row',
    rank: 1,
  },
  {
    phase: 'Set Piece',
    phaseCol: 'rgba(201,148,30,.14)',
    phaseText: '#92650a',
    phaseBorder: '#c9941e',
    primary: 'Lineout to tail — Jacobs as jumper',
    detail: '#6 cheats middle consistently. 3 of our last 4 lineout steals were tail calls. Move Jacobs, use middle as decoy.',
    confidence: 74,
    alt: 'Middle call first, then tail — forces their #6 to commit',
    rank: 2,
  },
  {
    phase: 'Defence',
    phaseCol: 'rgba(24,43,84,.10)',
    phaseText: '#182b54',
    phaseBorder: '#3b82f6',
    primary: 'Blitz their Bus — pillar shifts right',
    detail: 'UCT runs Bus 82% after a lineout win on the right. Cut the #12 angle before they receive.',
    confidence: 72,
    alt: 'Choke if Bus converts to pick-and-drive near our 22',
    rank: 3,
  },
  {
    phase: 'Kicking',
    phaseCol: 'rgba(99,102,241,.10)',
    phaseText: '#4338ca',
    phaseBorder: '#6366f1',
    primary: 'Grubber into corners — not box kick',
    detail: 'Box kick exit only 44% vs UCT (chased effectively). Grubber to their corners: won 3/3 chases this season.',
    confidence: 68,
    alt: 'Box kick only under pressure in own 22',
    rank: 4,
  },
  {
    phase: 'Discipline',
    phaseCol: 'rgba(220,38,38,.10)',
    phaseText: '#b91c1c',
    phaseBorder: '#ef4444',
    primary: 'Cap penalties at 7 or fewer',
    detail: 'UCT converts 7/10 penalty kicks. Avg 11 pens/game costs us ~7 pts. Reset at every breakdown stoppage.',
    confidence: 91,
    alt: null,
    rank: 5,
  },
];

const SCENARIOS = [
  {
    condition: 'Score first — any try',
    outcome: 'Win probability',
    delta: '+22%',
    positive: true,
    likelihood: 42,
    note: 'UCT 0W from 4 when trailing at half time — momentum critical.',
  },
  {
    condition: 'Penalty count ≤ 7',
    outcome: 'Win probability',
    delta: '+13%',
    positive: true,
    likelihood: 38,
    note: 'Single biggest swing factor. Happened in both of our wins vs UCT.',
  },
  {
    condition: 'Lineout win rate ≥ 75%',
    outcome: 'Win probability',
    delta: '+18%',
    positive: true,
    likelihood: 35,
    note: 'Requires Jacobs on tail and 2-week lift drill work paying off.',
  },
  {
    condition: 'Scrum win rate ≥ 80%',
    outcome: 'Win probability',
    delta: '+9%',
    positive: true,
    likelihood: 55,
    note: 'Scrum is improving — target the 58–65 min prop fatigue window.',
  },
  {
    condition: 'Penalty count ≥ 12',
    outcome: 'Win probability',
    delta: '−21%',
    positive: false,
    likelihood: 55,
    note: 'Occurred in 3 of last 4 losses. Yellow card risk becomes critical above 10.',
  },
  {
    condition: 'Concede try in first 15 min',
    outcome: 'Win probability',
    delta: '−17%',
    positive: false,
    likelihood: 38,
    note: 'UCT\'s kick chase is dangerous off restarts. Exit discipline critical early.',
  },
];

const HISTORICAL_MATCH = {
  match: 'vs Rocklands, May 25 (W 26–19)',
  similarity: 84,
  conditions: ['Home', 'Opponent avg pen 8.8 (similar)', 'Our scrum 100%', 'Lineout 83%'],
  what_worked: ['Brumby off 9 produced 2 try assists', 'Grubber kick won 3 chases', 'Scrum dominance — 4/4, 1 tighthead', 'Sub impact: +3 tries after bench on at 55 min'],
};

/* ---- Components ---- */

const ConfidenceBar = ({ value, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{ flex: 1, height: 6, background: 'rgba(0,0,0,.08)', borderRadius: 4 }}>
      <div style={{ width: `${value}%`, background: color, height: '100%', borderRadius: 4 }} />
    </div>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color, minWidth: 34, textAlign: 'right' }}>{value}%</span>
  </div>
);

/* ---- Main screen ---- */

const TacticalIntelligence = () => {
  const [expandedTendency, setExpandedTendency] = React.useState(null);
  const [scenarioHover, setScenarioHover] = React.useState(null);
  const [planExpanded, setPlanExpanded] = React.useState(null);

  const positiveFactors = WIN_FACTORS.filter(f => f.positive);
  const negativeFactors = WIN_FACTORS.filter(f => !f.positive);

  const probColor = WIN_PROB >= 50 ? 'var(--ok)' : WIN_PROB >= 35 ? 'var(--accent-2)' : 'var(--warn)';

  const next = FIXTURES.find(f => !f.result);

  return (
    <div className="page" style={{ paddingBottom: 60 }}>

      {/* Header */}
      <div className="page-head">
        <div>
          <div className="eyebrow">Predictive Intelligence · Match Briefing</div>
          <h1>Tactical Recommendations</h1>
          <div className="meta">vs {next?.opp} · {next?.date} · {next?.venue} · 15:00 kickoff</div>
        </div>
        <div className="row gap-3">
          <button className="btn">Export briefing</button>
          <button className="btn primary">Send to coaching staff</button>
        </div>
      </div>

      {/* AI briefing + win probability — dark card */}
      <div style={{
        background: 'var(--ink)', color: 'var(--paper)',
        borderRadius: 12, padding: '20px 22px', marginBottom: 14,
        display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '.1em', marginBottom: 8 }}>
            ✦ AI MATCH INTELLIGENCE · {new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,.9)', maxWidth: 680 }}>
            UCT are favourites at home but their away record is beatable. The two biggest levers are{' '}
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>discipline</span> and{' '}
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>lineout</span> — fix both and win probability jumps from{' '}
            <span style={{ color: 'var(--warn)', fontWeight: 700 }}>{WIN_PROB}%</span> to{' '}
            <span style={{ color: 'var(--ok)', fontWeight: 700 }}>~{WIN_PROB + 21}%</span>.{' '}
            Their Bus call off 10 is predictable — Blitz early and target the {' '}
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>55–62 min scrum window</span> when their loosehead fatigues.
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Brumby off 9', 'Jacobs to tail', 'Blitz their Bus', 'Grubber exit', '≤7 penalties'].map(tag => (
              <span key={tag} style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                padding: '3px 9px', borderRadius: 4,
                background: 'rgba(201,148,30,.25)', color: 'var(--accent)',
                letterSpacing: '.05em',
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Win probability dial */}
        <div style={{
          textAlign: 'center', minWidth: 130,
          padding: '16px 20px',
          background: 'rgba(255,255,255,.05)',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,.1)',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,.5)', letterSpacing: '.1em', marginBottom: 6 }}>WIN PROBABILITY</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 700,
            lineHeight: 1, color: probColor,
          }}>{WIN_PROB}%</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,.4)', marginTop: 4 }}>model-based estimate</div>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,.1)', margin: '10px 0' }} />
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.55)', lineHeight: 1.5 }}>
            {positiveFactors.length} factors <span style={{ color: 'var(--ok)' }}>↑</span><br />
            {negativeFactors.length} factors <span style={{ color: 'var(--warn)' }}>↓</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

        {/* Win probability factors */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Probability factors</div>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: probColor,
            }}>{WIN_PROB}%</span>
          </div>

          <div className="mono" style={{ marginBottom: 6 }}>Working in our favour</div>
          {positiveFactors.map((f, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div className="row between" style={{ marginBottom: 3 }}>
                <span style={{ fontSize: 12 }}>{f.label}</span>
                <div className="row gap-2">
                  <span className="mono" style={{ fontSize: 10 }}>{f.source}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--ok)', minWidth: 32, textAlign: 'right' }}>+{f.delta}%</span>
                </div>
              </div>
              <div style={{ height: 5, background: 'rgba(0,0,0,.06)', borderRadius: 4 }}>
                <div style={{ width: `${(f.delta / 10) * 100}%`, background: 'var(--ok)', height: '100%', borderRadius: 4 }} />
              </div>
            </div>
          ))}

          <hr className="hr dashed" style={{ margin: '10px 0' }} />

          <div className="mono" style={{ marginBottom: 6 }}>Working against us</div>
          {negativeFactors.map((f, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div className="row between" style={{ marginBottom: 3 }}>
                <span style={{ fontSize: 12 }}>{f.label}</span>
                <div className="row gap-2">
                  <span className="mono" style={{ fontSize: 10 }}>{f.source}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--warn)', minWidth: 32, textAlign: 'right' }}>{f.delta}%</span>
                </div>
              </div>
              <div style={{ height: 5, background: 'rgba(0,0,0,.06)', borderRadius: 4 }}>
                <div style={{ width: `${(Math.abs(f.delta) / 10) * 100}%`, background: 'var(--warn)', height: '100%', borderRadius: 4 }} />
              </div>
            </div>
          ))}

          <div style={{
            marginTop: 12, padding: '8px 10px',
            background: 'var(--paper-2)', borderRadius: 8,
            fontSize: 12, color: 'var(--ink-soft)',
          }}>
            Model uses season stats, H2H record, set piece trends, and workload data.
          </div>
        </div>

        {/* Opponent tendency predictions */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">UCT — predicted patterns</div>
            <span className="mono">{OPP_TENDENCIES.length} patterns detected</span>
          </div>
          <div className="col" style={{ gap: 0 }}>
            {OPP_TENDENCIES.map((t, i) => {
              const open = expandedTendency === i;
              const confColor = t.confidence >= 80 ? 'var(--warn)' : t.confidence >= 65 ? 'var(--accent-2)' : 'var(--muted)';
              return (
                <div
                  key={i}
                  style={{
                    borderBottom: '1px dashed var(--line)',
                    padding: '10px 0',
                    cursor: 'pointer',
                  }}
                  onClick={() => setExpandedTendency(open ? null : i)}
                >
                  <div className="row between" style={{ marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, flex: 1, paddingRight: 8 }}>{t.pattern}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,.0)' }}>▾</span>
                  </div>
                  <div className="row gap-3" style={{ marginBottom: open ? 8 : 0 }}>
                    <ConfidenceBar value={t.confidence} color={confColor} />
                    <span className="mono" style={{ fontSize: 9, whiteSpace: 'nowrap' }}>{t.seen}</span>
                  </div>
                  {open && (
                    <div style={{
                      marginTop: 8, padding: '8px 10px',
                      background: 'rgba(22,163,74,.07)',
                      borderLeft: '3px solid var(--ok)',
                      borderRadius: '0 6px 6px 0',
                      fontSize: 12, lineHeight: 1.55,
                    }}>
                      <span style={{ fontWeight: 600, color: 'var(--ok)' }}>Counter: </span>
                      {t.counter}
                      {t.counterCall && (
                        <span style={{
                          marginLeft: 8, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                          padding: '1px 6px', borderRadius: 3,
                          background: 'rgba(22,163,74,.15)', color: 'var(--ok)',
                        }}>→ {t.counterCall}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mono" style={{ marginTop: 6, fontSize: 9 }}>Tap a pattern to see the counter-play</div>
        </div>
      </div>

      {/* Game plan — phase by phase */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="card-head">
          <div className="card-title">Recommended game plan — vs UCT</div>
          <span className="mono">ranked by confidence</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
          {GAME_PLAN.map((plan, i) => {
            const open = planExpanded === i;
            return (
              <div
                key={i}
                onClick={() => setPlanExpanded(open ? null : i)}
                style={{
                  borderRadius: 10,
                  border: `1.5px solid ${plan.phaseBorder}`,
                  background: plan.phaseCol,
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'opacity .12s',
                }}
              >
                <div className="row between" style={{ marginBottom: 6 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
                    letterSpacing: '.08em', color: plan.phaseText,
                    padding: '1px 6px', borderRadius: 3,
                    background: `${plan.phaseBorder}20`,
                  }}>{plan.phase.toUpperCase()}</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                    color: plan.confidence >= 75 ? 'var(--ok)' : plan.confidence >= 60 ? 'var(--accent-2)' : 'var(--muted)',
                  }}>{plan.confidence}% conf.</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>
                  {plan.primary}
                </div>
                {open && (
                  <>
                    <div style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--ink-soft)', marginBottom: 8 }}>
                      {plan.detail}
                    </div>
                    {plan.alt && (
                      <div style={{ fontSize: 11, color: plan.phaseText, padding: '5px 8px', background: 'rgba(0,0,0,.05)', borderRadius: 6 }}>
                        <span style={{ fontWeight: 600 }}>Alt: </span>{plan.alt}
                      </div>
                    )}
                  </>
                )}
                {!open && (
                  <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.4 }}>
                    {plan.detail.slice(0, 72)}…
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mono" style={{ marginTop: 8, fontSize: 9 }}>Tap a card to expand the full rationale and alternative call</div>
      </div>

      {/* Scenario engine */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="card-head">
          <div className="card-title">Scenario engine — win probability shifts</div>
          <span className="mono">if / then modelling</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
          {SCENARIOS.map((s, i) => (
            <div
              key={i}
              onMouseEnter={() => setScenarioHover(i)}
              onMouseLeave={() => setScenarioHover(null)}
              style={{
                borderRadius: 10,
                border: `1.5px solid ${s.positive ? 'var(--ok)' : 'var(--warn)'}40`,
                background: s.positive ? 'rgba(22,163,74,.07)' : 'rgba(220,38,38,.07)',
                padding: '12px 14px',
                transition: 'border-color .12s',
                borderColor: scenarioHover === i ? (s.positive ? 'var(--ok)' : 'var(--warn)') : undefined,
              }}
            >
              {/* Condition */}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', marginBottom: 4, letterSpacing: '.04em' }}>
                IF
              </div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, lineHeight: 1.3 }}>{s.condition}</div>

              {/* Outcome */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '.04em' }}>THEN</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: s.positive ? 'var(--ok)' : 'var(--warn)' }}>
                  {s.delta}
                </span>
                <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{s.outcome}</span>
              </div>

              {/* Likelihood */}
              <div style={{ marginBottom: 8 }}>
                <div className="row between" style={{ marginBottom: 3 }}>
                  <span className="mono">Likelihood of scenario</span>
                  <span className="mono">{s.likelihood}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(0,0,0,.08)', borderRadius: 4 }}>
                  <div style={{
                    width: `${s.likelihood}%`,
                    background: s.positive ? 'var(--ok)' : 'var(--warn)',
                    height: '100%', borderRadius: 4,
                  }} />
                </div>
              </div>

              {/* Note */}
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{s.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical match nearest-neighbour */}
      <div className="card paper" style={{ marginBottom: 14 }}>
        <div className="card-head">
          <div className="card-title">Nearest historical match</div>
          <div className="row gap-2">
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
              padding: '2px 8px', borderRadius: 4,
              background: 'rgba(22,163,74,.15)', color: 'var(--ok)',
            }}>{HISTORICAL_MATCH.similarity}% similar</span>
            <Badge variant="ok"><span className="dot" />WIN</Badge>
          </div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{HISTORICAL_MATCH.match}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <div className="mono" style={{ marginBottom: 6 }}>Matching conditions</div>
            <div className="col" style={{ gap: 5 }}>
              {HISTORICAL_MATCH.conditions.map((c, i) => (
                <div key={i} className="row gap-3" style={{ fontSize: 13 }}>
                  <span style={{ color: 'var(--ok)' }}>✓</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mono" style={{ marginBottom: 6 }}>What worked that day</div>
            <div className="col" style={{ gap: 5 }}>
              {HISTORICAL_MATCH.what_worked.map((w, i) => (
                <div key={i} className="row gap-3" style={{ fontSize: 13 }}>
                  <span style={{ color: 'var(--accent-2)' }}>★</span>
                  <span>{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <hr className="hr dashed" style={{ marginTop: 12 }} />
        <div className="row gap-3">
          <button className="btn">View Rocklands match clips</button>
          <button className="btn accent">Replicate this game plan</button>
        </div>
      </div>

      {/* AI insight */}
      <div className="ai-card">
        <div className="ai-glyph">AI</div>
        <div className="body">
          <b>Priority actions before Jun 14</b> — (1) 2 lineout sessions focused on Jacobs to tail, (2) contact discipline reset in Tuesday session,
          (3) Bulana &amp; Nkosi load management this week, (4) review UCT Bus clip from Mar 9 with defensive group.
        </div>
        <button className="btn accent">Generate match week plan</button>
        <button className="btn">View UCT video clips</button>
      </div>
    </div>
  );
};

Object.assign(window, { TacticalIntelligence });
