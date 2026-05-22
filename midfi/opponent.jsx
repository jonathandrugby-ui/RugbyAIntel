/* RugbyAI mid-fi — Opponent Intel screen */

const OPPONENTS = [
  {
    name: 'UCT',
    fixture: 'Jun 14 · HOME · 15:00',
    type: 'League · Round 8',
    h2h: { w: 2, l: 5, d: 0 },
    lastMeeting: { date: 'Mar 9', score: '19–24', result: 'L', tries: 3, note: 'Lost lineout battle 60%; conceded 3 tries off kicks' },
    avgMargin: -8.4,
    stats: [
      { label: 'Lineout (own ball)',  value: 78,  pct: true,  dir: 'warn', note: '3rd in league' },
      { label: 'Scrum dominance',     value: 82,  pct: true,  dir: 'warn', note: 'Strong loosehead' },
      { label: 'Penalties / game',    value: 9.1, pct: false, dir: 'ok',   note: 'vs our 11.4' },
      { label: 'Tries / game',        value: 3.4, pct: false, dir: 'warn', note: 'League leading' },
      { label: 'Lineout steal rate',  value: 18,  pct: true,  dir: 'warn', note: 'Active jumpers' },
      { label: 'Kick chase success',  value: 61,  pct: true,  dir: 'warn', note: 'Box kick threat' },
      { label: 'Turnover rate (won)', value: 44,  pct: true,  dir: 'ok',   note: 'Jackle heavy' },
      { label: 'Conversion rate',     value: 71,  pct: true,  dir: 'warn', note: 'Accurate kicker' },
    ],
    calls: [
      { call: 'BUS',     freq: 'High', note: 'Off 10 — their primary attack shape' },
      { call: 'BULLS',   freq: 'High', note: 'Pick & go from 8 in red zone' },
      { call: 'BLITZ',   freq: 'Med',  note: 'Press defence — triggers on our box kick' },
      { call: 'DOUBLES', freq: 'High', note: 'Double-hit on our ball carrier; watch wrap-around' },
      { call: 'JACKLE',  freq: 'High', note: '#7 specialist — 4 steals last 3 matches' },
      { call: 'CHOKE',   freq: 'Med',  note: 'Maul defence near their 22 — very disciplined' },
    ],
    weaknesses: [
      { tag: 'ok',     label: 'Lineout variance',    note: 'Their lift timing breaks down under pressure — Brumby call from 9 exploits the fringe' },
      { tag: 'ok',     label: 'Transition speed',     note: 'Slow to reset after a scrum win — London attack (left side) opens up immediately' },
      { tag: 'ok',     label: 'Pillar width',         note: "#6 drifts — there's a Taxi gap off the back of the ruck at 5–6m" },
      { tag: 'accent', label: 'Box kick defence',     note: 'Shallow chasers — our kick-chase (Naidoo) won territory 4/6 in last meeting' },
    ],
    keyPlayers: [
      { jersey: 8,  name: 'D. Engelbrecht', pos: '8th Man',  threat: 'Pick-and-go master — 6 tries from base this season. Nullify with PILLAR early.', caps: 102 },
      { jersey: 7,  name: 'R. Fortuin',     pos: 'Openside', threat: 'Jackle specialist. 4.1 turnovers/game. Must clear rucks fast — no lying on.', caps: 87 },
      { jersey: 10, name: 'C. Malherbe',    pos: 'Flyhalf',  threat: 'Accurate boot, 71% conversion. Kicks long to left corner under pressure.', caps: 134 },
      { jersey: 13, name: 'J. van Zyl',     pos: 'Centre',   threat: 'Line-break machine — 3 in last match. Watch the Bus call off him.', caps: 56 },
    ],
    matchHistory: [
      { date: 'Mar 9 2024',  venue: 'AWAY', f: 19, a: 24, result: 'L', note: 'Lineout 60%, too many penalties' },
      { date: 'Sep 14 2023', venue: 'HOME', f: 14, a: 31, result: 'L', note: 'Conceded 5 tries' },
      { date: 'Jun 10 2023', venue: 'AWAY', f: 22, a: 19, result: 'W', note: 'Won scrum battle, Petersen MOTM' },
      { date: 'Mar 5 2023',  venue: 'HOME', f: 17, a: 29, result: 'L', note: 'Ball in hand — UCT dominant' },
      { date: 'Oct 1 2022',  venue: 'AWAY', f: 10, a: 24, result: 'L', note: 'Yellow cards cost us' },
      { date: 'Jun 4 2022',  venue: 'HOME', f: 28, a: 21, result: 'W', note: 'Best H2H result — try blitz in 2H' },
      { date: 'Mar 12 2022', venue: 'AWAY', f: 7,  a: 35, result: 'L', note: 'Heavy loss — away strip' },
    ],
  },
  {
    name: 'Stellenberg',
    fixture: 'Jun 21 · AWAY',
    type: 'League · Round 9',
    h2h: { w: 1, l: 2, d: 0 },
    lastMeeting: { date: 'Mar 30', score: '12–38', result: 'L', tries: 2, note: 'Scrum dominated; conceded 6 tries' },
    avgMargin: -14.3,
    stats: [
      { label: 'Lineout (own ball)',  value: 84,  pct: true,  dir: 'warn', note: 'Strong jumpers' },
      { label: 'Scrum dominance',     value: 76,  pct: true,  dir: 'warn', note: 'Physical tighthead' },
      { label: 'Penalties / game',    value: 10.2,pct: false, dir: 'ok',   note: 'Similar to ours' },
      { label: 'Tries / game',        value: 4.1, pct: false, dir: 'warn', note: 'High scorers' },
      { label: 'Lineout steal rate',  value: 12,  pct: true,  dir: 'ok',   note: 'Manageable' },
      { label: 'Kick chase success',  value: 48,  pct: true,  dir: 'ok',   note: 'Weaker in this area' },
      { label: 'Turnover rate (won)', value: 38,  pct: true,  dir: 'ok',   note: 'Average' },
      { label: 'Conversion rate',     value: 65,  pct: true,  dir: 'ok',   note: 'Inconsistent kicker' },
    ],
    calls: [
      { call: 'STORMERS', freq: 'High', note: 'Back pass to 10, outside runner — their go-to wide play' },
      { call: 'BULLS',    freq: 'High', note: 'Dominant maul from lineout' },
      { call: 'BLITZ',    freq: 'Low',  note: 'Only in their 22' },
      { call: 'CRUSADER', freq: 'Med',  note: 'Numbers on feet after turnover' },
    ],
    weaknesses: [
      { tag: 'ok',     label: 'Short-side defence', note: 'Pillar drifts wide — blindside off ruck is exposed' },
      { tag: 'ok',     label: 'Kick-chase depth',   note: 'Shallow kick chase — box kick down left creates pressure' },
      { tag: 'accent', label: 'Scrum reset',        note: 'Slow to reset after a Tighthead loss — quick tap opportunity' },
    ],
    keyPlayers: [
      { jersey: 4,  name: 'P. Botha',   pos: 'Lock',    threat: 'Lineout general — 91% own ball. Must disrupt his timing.', caps: 118 },
      { jersey: 10, name: 'M. Lourens', pos: 'Flyhalf', threat: 'Organises Stormers shape — cut off his distribution.', caps: 77 },
    ],
    matchHistory: [
      { date: 'Mar 30 2024', venue: 'HOME', f: 12, a: 38, result: 'L', note: 'Scrum dominated from early' },
      { date: 'Sep 2023',    venue: 'AWAY', f: 21, a: 28, result: 'L', note: 'Close until 60 min' },
      { date: 'Jun 2023',    venue: 'HOME', f: 24, a: 17, result: 'W', note: 'Strong lineout day' },
    ],
  },
  {
    name: 'Tygerberg',
    fixture: 'Jun 28 · HOME',
    type: 'League · Round 10',
    h2h: { w: 0, l: 2, d: 0 },
    lastMeeting: { date: 'Mar 16', score: '7–103', result: 'L', tries: 1, note: 'Heaviest loss of the season' },
    avgMargin: -49.5,
    stats: [
      { label: 'Lineout (own ball)', value: 91,  pct: true,  dir: 'warn', note: 'League best' },
      { label: 'Scrum dominance',    value: 88,  pct: true,  dir: 'warn', note: 'Dominant pack' },
      { label: 'Penalties / game',   value: 7.2, pct: false, dir: 'warn', note: 'Very disciplined' },
      { label: 'Tries / game',       value: 6.8, pct: false, dir: 'warn', note: 'Top of league' },
    ],
    calls: [
      { call: 'BRUMBY', freq: 'High', note: 'Behind-pod dummy — creates space for backs wide' },
      { call: 'BUS',    freq: 'High', note: 'Multiple Bus calls — 10/12/13 all play it' },
    ],
    weaknesses: [
      { tag: 'accent', label: 'Complacency risk', note: 'Home advantage — they tend to coast once ahead. Stay in the contest.' },
    ],
    keyPlayers: [
      { jersey: 10, name: 'B. Hendricks', pos: 'Flyhalf', threat: 'Controls tempo. Dominant kicker. Focus discipline around him.', caps: 198 },
    ],
    matchHistory: [
      { date: 'Mar 16 2024', venue: 'AWAY', f: 7,  a: 103, result: 'L', note: 'Must recover mentally' },
      { date: 'Sep 2023',    venue: 'HOME', f: 10, a: 48,  result: 'L', note: 'Never in the contest' },
    ],
  },
];

/* ── Stat bar ── */
const StatBar = ({ value, dir }) => {
  const bg = dir === 'warn' ? 'var(--warn)' : dir === 'ok' ? 'var(--ok)' : 'var(--accent)';
  return (
    <div className="meter" style={{ height: 6 }}>
      <div style={{ width: `${Math.min(value, 100)}%`, background: bg, height: '100%', borderRadius: 4 }} />
    </div>
  );
};

/* ── Game plan generator ── */
const genPlan = (opp) => {
  const scrumStat    = opp.stats.find(s => s.label === 'Scrum dominance');
  const lineoutSteal = opp.stats.find(s => s.label === 'Lineout steal rate');
  const kickStat     = opp.stats.find(s => s.label === 'Kick chase success');
  const convStat     = opp.stats.find(s => s.label === 'Conversion rate');
  const penStat      = opp.stats.find(s => s.label === 'Penalties / game');
  const openside     = opp.keyPlayers.find(p => p.pos === 'Openside');
  const flyhalf      = opp.keyPlayers.find(p => p.pos === 'Flyhalf');
  const hiCalls      = opp.calls.filter(c => c.freq === 'High').map(c => c.call).join(', ');
  const w0           = opp.weaknesses[0];

  return {
    intro: `The game plan to face ${opp.name} (${opp.fixture}) will be one where we exploit their weaknesses and suffocate their strengths. We carry a ${opp.h2h.w}W–${opp.h2h.l}L H2H record and an average margin of ${opp.avgMargin} pts — this plan is built to change that.`,
    oppStrengths: opp.stats.filter(s => s.dir === 'warn').map(s => `${s.label} (${s.value}${s.pct ? '%' : ''}) — ${s.note}`),
    oppWeaknesses: opp.weaknesses.map(w => `${w.label} — ${w.note}`),
    sections: [
      {
        num: 1, title: 'Defensive Structure and Strategy',
        points: [
          { h: 'Solid Defensive Line',
            b: `Maintain a disciplined and connected line — minimise gaps and make ${opp.name} earn every metre. Don't give${hiCalls ? ' ' + hiCalls : ' their attack shapes'} any daylight.` },
          { h: 'High Line Speed',
            b: `Get off the line fast and pressure ${flyhalf ? flyhalf.name + ' (#' + flyhalf.jersey + ')' : 'their 10'} before they can execute. Disrupt their rhythm from phase one.` },
          { h: 'Effective Tackling and Plus Ones',
            b: `Low dominant tackles then PILLAR / FIRE immediately.${openside ? ' Alert: #' + openside.jersey + ' ' + openside.name + ' — ' + openside.threat : ' Clear rucks fast — no passengers.'}` },
        ],
      },
      {
        num: 2, title: 'Set Piece Dominance',
        points: [
          { h: 'Scrum',
            b: scrumStat?.dir === 'warn'
              ? `${opp.name} are strong in the scrum (${scrumStat.value}%). We must hold our ground, stay tight, and contest every feed — don't let them build a platform.`
              : 'Scrum is our target — dominate early and often. Build penalty pressure and launch attacks from a stable platform.' },
          { h: 'Lineout',
            b: lineoutSteal?.value >= 15
              ? `Their steal rate is ${lineoutSteal.value}% — vary our calls, use short and front options, protect our throw. Maul every clean lineout win.`
              : 'Secure our ball and maul every opportunity. Contest their throw aggressively — SMASH or SACK in their 22.' },
        ],
      },
      {
        num: 3, title: 'Kicking Game',
        points: [
          { h: 'Tactical Kicking',
            b: kickStat?.dir === 'warn'
              ? `Their kick chase is strong (${kickStat.value}%) — don't rush kicks. ICE (box kick) and COKE (up-and-under) only when we have chasers in place. No kicks to space.`
              : `Exploit their kick chase (${kickStat?.value ?? '?'}%) — ICE and COKE early to build territory. Chase hard and compete for every return.` },
          { h: 'Kicking for Territory',
            b: `Pin ${opp.name} deep in their half at every opportunity. Touch-finders from the 40–60m zone. Chase lines are non-negotiable — full team buy-in.` },
        ],
      },
      {
        num: 4, title: 'Breakdown and Rucks',
        points: [
          { h: 'Aggressive Cleanouts',
            b: `Commit to every ruck — quick ball is non-negotiable. FIRE call when contested. We have to sacrifice here — no half-measures.` },
          { h: 'On Their Ruck',
            b: `One plus into every ${opp.name} breakdown. Everyone else bails out. Slow their ball, disrupt their tempo.${openside ? ' ' + openside.name + ' will jackal — clear fast and present correctly.' : ''}` },
          { h: 'Counter-Rucking',
            b: 'Look for counter-ruck opportunities — especially near halfway and their 22. Win possession in critical areas and flip the momentum.' },
        ],
      },
      {
        num: 5, title: 'Attack Strategy',
        points: [
          { h: 'Exploit Their Weaknesses',
            b: opp.weaknesses.map(w => w.label + ': ' + w.note).join(' — ') || 'Attack their defensive reset speed and fringe width from early phases.' },
          { h: 'Direct Running Lines',
            b: 'No sideways ball. Hard, direct running at the gain line every phase. Use STORMERS and BUS to shift their defence, then commit with BULLS or BLACK when the line opens.' },
          { h: 'Ball Retention',
            b: `Quick recycles through multiple phases. BRUMBY off 9 to exploit fringe width.${w0 ? ' Primary target: ' + w0.label + '.' : ''} Tire them out before we strike.` },
        ],
      },
      {
        num: 6, title: 'Key Players to Neutralise',
        points: opp.keyPlayers.length
          ? opp.keyPlayers.map(p => ({ h: '#' + p.jersey + ' ' + p.name + ' (' + p.pos + ')', b: p.threat }))
          : [{ h: 'Scouting pending', b: 'Review footage and update this section before match week.' }],
      },
      {
        num: 7, title: 'Fitness and Conditioning',
        points: [
          { h: 'High Intensity',
            b: `Force ${opp.name} into a physical game from minute one — it will take a toll on both teams. Take crucial neck breaks (WELLS) to recover and receive info.` },
          { h: 'Bench Impact',
            b: 'Every bench player must amplify intensity when they arrive — not just maintain it. Fresh legs in the final 20 minutes is a weapon.' },
        ],
      },
      {
        num: 8, title: 'Mental Toughness and Discipline',
        points: [
          { h: 'Composure Under Pressure',
            b: `${convStat?.value >= 65 ? 'Their kicker converts at ' + convStat.value + '% — no gift penalties. ' : ''}Stay focused in key defensive moments. Slow the game down. Remain composed and trust the structure.` },
          { h: 'Discipline',
            b: `${penStat?.dir === 'ok' ? 'Their discipline is tighter than ours — we must close this gap immediately.' : 'Protect the breakdown and defensive line.'} No unnecessary penalties — maintain discipline especially in the breakdown and defensive 22.` },
        ],
      },
      {
        num: 9, title: 'In-Game Adaptability',
        points: [
          { h: 'Effective Communication',
            b: '9, 10 and 15 own the communication channels. Call early, call clearly. Coaches relay tactical adjustments at every opportunity — trust your leaders on the field.' },
          { h: 'Listening to Key-Role Players',
            b: `If the first 20 minutes are not going to plan, adapt early — don't panic. Identify what ${opp.name} are doing differently and counter it with composure.` },
        ],
      },
      {
        num: 10, title: 'Key Tactical Points',
        points: [
          { h: 'Targeting Weaknesses',
            b: opp.weaknesses.length
              ? opp.weaknesses.map(w => '• ' + w.label + ': ' + w.note).join('\n')
              : 'Attack their defensive reset speed and lineout variance — identify specifics during warmup.' },
          { h: 'Managing the Referee',
            b: "Captain builds rapport from minute one. Ask specific, process questions — not emotional ones. Accept decisions but bring up points that get the referee thinking about the opposition." },
        ],
      },
    ],
    conclusion: `Our game plan against ${opp.name} on ${opp.fixture.split('·')[0].trim()}must be characterised by a strong defensive structure, set-piece dominance, strategic kicking, and direct attack rugby. We exploit their weaknesses — ${opp.weaknesses.map(w => w.label).join(', ') || 'identified structural gaps'}. By adhering to these principles with physicality and discipline, we create the conditions to win.`,
  };
};

const toPlainText = (plan, overrides) => {
  let t = `GAME PLAN\n${'='.repeat(60)}\n\n${plan.intro}\n\n`;
  t += `THEIR STRENGTHS (neutralise):\n${plan.oppStrengths.map(s => '  - ' + s).join('\n')}\n\n`;
  t += `THEIR WEAKNESSES (exploit):\n${plan.oppWeaknesses.map(s => '  - ' + s).join('\n')}\n\n`;
  t += '='.repeat(60) + '\n';
  plan.sections.forEach(sec => {
    t += `\n${sec.num}. ${sec.title.toUpperCase()}\n${'-'.repeat(40)}\n`;
    const ov = overrides?.[sec.num];
    if (ov) { t += ov + '\n'; }
    else { sec.points.forEach(pt => { t += `• ${pt.h}:\n${pt.b}\n\n`; }); }
  });
  t += `\n${'='.repeat(60)}\nCONCLUSION\n${plan.conclusion}\n`;
  return t;
};

/* ── GamePlanDoc ── */
const GamePlanDoc = ({ opp }) => {
  const plan     = React.useMemo(() => genPlan(opp), [opp.name]);
  const [overrides, setOverrides] = React.useState({});
  const [editing,   setEditing]   = React.useState(null);
  const [draft,     setDraft]     = React.useState('');
  const [copied,    setCopied]    = React.useState(false);
  const [showSend,  setShowSend]  = React.useState(false);

  React.useEffect(() => { setOverrides({}); setEditing(null); }, [opp.name]);

  const startEdit = (sec) => {
    setDraft(overrides[sec.num] || sec.points.map(pt => '• ' + pt.h + ':\n' + pt.b).join('\n\n'));
    setEditing(sec.num);
  };
  const saveEdit   = () => { setOverrides(prev => ({ ...prev, [editing]: draft })); setEditing(null); };
  const cancelEdit = () => setEditing(null);

  const copyAll = () => {
    navigator.clipboard.writeText(toPlainText(plan, overrides)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="col" style={{ gap: 12 }}>

      {/* Action bar */}
      <div className="row between">
        <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          Auto-generated from scout report · {plan.sections.length} sections · edit any section inline
        </div>
        <div className="row gap-2">
          <button className="btn sm" onClick={() => setShowSend(true)}>
            <span className="ico">✉</span> Send to players
          </button>
          <button className="btn sm" onClick={copyAll} style={{ color: copied ? 'var(--ok)' : undefined }}>
            <span className="ico">{copied ? '✓' : '⎘'}</span> {copied ? 'Copied!' : 'Copy text'}
          </button>
          <button className="btn sm">
            <span className="ico">⤓</span> Export PDF
          </button>
        </div>
      </div>

      {/* ── Cover card ── */}
      <div className="card dark" style={{ padding: '22px 26px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.14em', color: 'rgba(255,255,255,.38)', marginBottom: 4 }}>
          GAME PLAN · {opp.name.toUpperCase()} · {opp.fixture.toUpperCase()}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 3 }}>
          vs {opp.name}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', marginBottom: 16 }}>{opp.type}</div>
        <p style={{ fontSize: 13, lineHeight: 1.72, color: 'rgba(255,255,255,.82)', marginBottom: 22, maxWidth: 640 }}>{plan.intro}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'var(--warn)', marginBottom: 10 }}>
              ▲ STRENGTHS TO NEUTRALISE
            </div>
            <div className="col" style={{ gap: 6 }}>
              {plan.oppStrengths.map((s, i) => (
                <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', lineHeight: 1.5, paddingLeft: 10, borderLeft: '2px solid rgba(201,148,30,.45)' }}>{s}</div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'var(--ok)', marginBottom: 10 }}>
              ▼ WEAKNESSES TO EXPLOIT
            </div>
            <div className="col" style={{ gap: 6 }}>
              {plan.oppWeaknesses.map((w, i) => (
                <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', lineHeight: 1.5, paddingLeft: 10, borderLeft: '2px solid rgba(74,168,96,.45)' }}>{w}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sections ── */}
      {plan.sections.map(sec => {
        const isEditing = editing === sec.num;
        const override  = overrides[sec.num];
        return (
          <div key={sec.num} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '9px 16px', background: 'var(--paper-2)', borderBottom: '1px solid var(--line)',
            }}>
              <div className="row gap-2">
                <span style={{
                  fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 10,
                  color: 'var(--chalk)', background: 'var(--primary)',
                  padding: '2px 8px', borderRadius: 4,
                }}>{sec.num}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11, letterSpacing: '.07em', color: 'var(--ink)' }}>
                  {sec.title.toUpperCase()}
                </span>
              </div>
              <div className="row gap-2">
                {override && !isEditing && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '.06em', color: 'var(--accent)' }}>EDITED</span>
                )}
                {isEditing ? (
                  <>
                    <button onClick={cancelEdit} style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>✕ Cancel</button>
                    <button onClick={saveEdit}   style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--ok)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>✓ Save</button>
                  </>
                ) : (
                  <button onClick={() => startEdit(sec)} style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>✎ Edit</button>
                )}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '14px 16px' }}>
              {isEditing ? (
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  style={{
                    width: '100%', minHeight: 130, boxSizing: 'border-box',
                    border: '1px solid var(--line)', borderRadius: 8,
                    padding: '10px 12px',
                    fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.6,
                    background: 'var(--paper-2)', color: 'var(--ink)', resize: 'vertical',
                  }}
                />
              ) : override ? (
                <pre style={{ margin: 0, fontFamily: 'inherit', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--ink)' }}>{override}</pre>
              ) : (
                <div className="col" style={{ gap: 10 }}>
                  {sec.points.map((pt, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 3, minHeight: 20, background: 'var(--primary)', opacity: .28, borderRadius: 2, flexShrink: 0, marginTop: 4 }} />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>{pt.h}: </span>
                        <span style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{pt.b}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* ── Conclusion ── */}
      <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 9, letterSpacing: '.12em', color: 'var(--primary)', marginBottom: 10 }}>CONCLUSION</div>
        <p style={{ fontSize: 13, lineHeight: 1.78, color: 'var(--ink)', margin: 0, fontStyle: 'italic' }}>{plan.conclusion}</p>
      </div>

      {/* ── Send to players modal ── */}
      {showSend && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowSend(false)}
        >
          <div
            style={{ background: 'var(--chalk)', borderRadius: 16, padding: 26, width: 580, boxShadow: '0 24px 60px rgba(0,0,0,.3)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, letterSpacing: '.07em', marginBottom: 4 }}>
              SEND GAME PLAN — VS {opp.name.toUpperCase()}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>
              Copy the text below and send via WhatsApp, email or your team comms channel.
            </div>
            <textarea
              defaultValue={toPlainText(plan, overrides)}
              style={{
                width: '100%', height: 320, boxSizing: 'border-box',
                border: '1px solid var(--line)', borderRadius: 10,
                padding: '12px', fontFamily: 'var(--font-mono)', fontSize: 11,
                lineHeight: 1.55, background: 'var(--paper-2)', color: 'var(--ink)', resize: 'vertical',
              }}
            />
            <div className="row gap-2" style={{ marginTop: 16, justifyContent: 'flex-end' }}>
              <button className="btn sm" onClick={() => setShowSend(false)}>Cancel</button>
              <button className="btn sm">✉ WhatsApp</button>
              <button className="btn sm">@ Email</button>
              <button className="btn primary sm" onClick={() => { copyAll(); setShowSend(false); }}>
                ⎘ Copy &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── OpponentIntel main ── */
const OpponentIntel = () => {
  const [oppIdx, setOppIdx] = React.useState(0);
  const [tab,    setTab]    = React.useState('intel');
  const opp = OPPONENTS[oppIdx];

  const switchOpp = (i) => { setOppIdx(i); setTab('intel'); };

  return (
    <div className="page">
      {/* Page head */}
      <div className="page-head">
        <div>
          <div className="eyebrow">Scout report · {opp.fixture}</div>
          <h1>Opponent Intel</h1>
          <div className="meta">{opp.type} · {opp.h2h.w}W {opp.h2h.l}L {opp.h2h.d}D career H2H</div>
        </div>
        <div className="row gap-3">
          <button className="btn"><span className="ico">⤓</span> Export PDF</button>
          <button className="btn primary" onClick={() => setTab('gameplan')}>
            <span className="ico">✦</span> Generate game plan
          </button>
        </div>
      </div>

      {/* Toolbar: opponent chips + tab switcher */}
      <div className="toolbar" style={{ marginBottom: 16 }}>
        <span className="mono">Fixtures</span>
        {OPPONENTS.map((o, i) => (
          <button
            key={o.name}
            className={`chip ${oppIdx === i ? 'active' : ''}`}
            onClick={() => switchOpp(i)}
          >
            {o.name}
            <span className="count" style={{ marginLeft: 4 }}>{o.fixture.split('·')[0].trim()}</span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className={`chip ${tab === 'intel' ? 'active' : ''}`} onClick={() => setTab('intel')}>◉ Scout Report</button>
        <button className={`chip ${tab === 'gameplan' ? 'active' : ''}`} onClick={() => setTab('gameplan')}>✦ Game Plan</button>
      </div>

      {/* ── Scout Report tab ── */}
      {tab === 'intel' && (
        <>
          {/* Hero stats */}
          <div className="split three" style={{ marginBottom: 14 }}>
            <div className="stat dark ring-accent">
              <span className="label" style={{ color: 'var(--accent)' }}>Next opponent</span>
              <span className="value" style={{ fontSize: 28 }}>{opp.name}</span>
              <span className="sub">{opp.fixture} · {opp.type}</span>
            </div>
            <div className="stat">
              <span className="label">H2H record</span>
              <span className="value">
                <span style={{ color: 'var(--ok)' }}>{opp.h2h.w}</span>
                <span style={{ color: 'var(--ink-soft)', fontSize: 24 }}>–{opp.h2h.l}–{opp.h2h.d}</span>
              </span>
              <span className="sub">Avg margin <b style={{ color: opp.avgMargin < 0 ? 'var(--warn)' : 'var(--ok)' }}>{opp.avgMargin > 0 ? '+' : ''}{opp.avgMargin} pts</b></span>
            </div>
            <div className="stat">
              <span className="label">Last meeting</span>
              <span className="value warn" style={{ fontSize: 26 }}>{opp.lastMeeting.score}</span>
              <span className="sub">{opp.lastMeeting.date} · {opp.lastMeeting.note}</span>
            </div>
          </div>

          {/* Two-column intel layout */}
          <div className="split" style={{ gridTemplateColumns: '1fr 340px', gap: 14 }}>

            {/* Left column */}
            <div className="col">

              {/* Season stats */}
              <div className="card">
                <div className="card-head">
                  <div className="card-title">Season stats — {opp.name}</div>
                  <span className="mono">vs league avg</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {opp.stats.map((s, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div className="row between">
                        <span className="mono">{s.label}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: s.dir === 'warn' ? 'var(--warn)' : 'var(--ok)' }}>
                          {s.value}{s.pct ? '%' : ''}
                        </span>
                      </div>
                      <StatBar value={s.value} dir={s.dir} />
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{s.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected calls */}
              <div className="card">
                <div className="card-head">
                  <div className="card-title">Calls they're likely to run</div>
                  <span className="mono">from video &amp; past matches</span>
                </div>
                <table className="table">
                  <thead>
                    <tr><th>Call</th><th>Frequency</th><th>Context</th></tr>
                  </thead>
                  <tbody>
                    {opp.calls.map((c, i) => (
                      <tr key={i}>
                        <td><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, letterSpacing: '.06em' }}>{c.call}</span></td>
                        <td><Badge variant={c.freq === 'High' ? 'warn' : c.freq === 'Med' ? 'accent' : 'outline'}>{c.freq}</Badge></td>
                        <td style={{ color: 'var(--ink-soft)', fontSize: 13 }}>{c.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Match history */}
              <div className="card">
                <div className="card-head">
                  <div className="card-title">Match history vs {opp.name}</div>
                  <Badge variant={opp.h2h.w > opp.h2h.l ? 'ok' : 'warn'}>{opp.h2h.w}W {opp.h2h.l}L career</Badge>
                </div>
                <table className="table">
                  <thead>
                    <tr><th>Date</th><th>H/A</th><th className="num">F</th><th className="num">A</th><th className="num">Diff</th><th>Result</th><th>Note</th></tr>
                  </thead>
                  <tbody>
                    {opp.matchHistory.map((m, i) => (
                      <tr key={i} style={{ background: m.result === 'W' ? 'var(--ok-soft)' : undefined }}>
                        <td style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{m.date}</td>
                        <td><span className="mono">{m.venue}</span></td>
                        <td className="num">{m.f}</td>
                        <td className="num">{m.a}</td>
                        <td className="num" style={{ color: m.f >= m.a ? 'var(--ok)' : 'var(--warn)', fontWeight: 600 }}>
                          {m.f - m.a > 0 ? '+' : ''}{m.f - m.a}
                        </td>
                        <td><Badge variant={m.result === 'W' ? 'ok' : 'warn'}><span className="dot" />{m.result === 'W' ? 'Win' : 'Loss'}</Badge></td>
                        <td style={{ fontSize: 12, color: 'var(--muted)' }}>{m.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right column */}
            <div className="col">

              {/* AI scout report */}
              <div className="card dark">
                <div className="card-head">
                  <div className="card-title" style={{ color: 'var(--accent)' }}>✦ AI scout report</div>
                  <span className="mono" style={{ color: 'rgba(255,255,255,.5)' }}>from 7 matches</span>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,.88)' }}>
                  {opp.name} play a <em style={{ color: 'var(--accent)', fontStyle: 'normal', fontWeight: 600 }}>high-tempo, kick-and-chase</em> game from 10. Their scrum is their platform — if we lose the early scrum battle, they dominate field position.
                  <br /><br />
                  Their <em style={{ color: 'var(--warn)', fontStyle: 'normal', fontWeight: 600 }}>jackle #7</em> ({opp.keyPlayers.find(p => p.pos === 'Openside')?.name || 'openside'}) is the biggest threat at the breakdown — clear fast, no passengers.
                  <br /><br />
                  Best path to a win: dominate lineout, get Naidoo's boot working, and run <em style={{ color: 'var(--accent)', fontStyle: 'normal', fontWeight: 600 }}>Brumby off 9</em> to exploit fringe width.
                </div>
                <hr className="hr" style={{ background: 'rgba(255,255,255,.1)' }} />
                <div className="row gap-2">
                  <button className="btn accent sm" onClick={() => setTab('gameplan')}>Draft game plan</button>
                  <button className="btn sm" style={{ background: 'rgba(255,255,255,.06)', color: 'var(--paper)', borderColor: 'transparent' }}>Show clips</button>
                </div>
              </div>

              {/* Weaknesses */}
              <div className="card">
                <div className="card-head">
                  <div className="card-title">Weaknesses to exploit</div>
                  <span className="mono">{opp.weaknesses.length} identified</span>
                </div>
                <div className="col" style={{ gap: 10 }}>
                  {opp.weaknesses.map((w, i) => (
                    <div key={i} style={{ padding: '10px 12px', background: 'var(--paper-2)', borderRadius: 10, border: '1px solid var(--line)' }}>
                      <Badge variant={w.tag} style={{ marginBottom: 6 }}><span className="dot" />{w.label}</Badge>
                      <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.5 }}>{w.note}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key players */}
              <div className="card">
                <div className="card-head">
                  <div className="card-title">Players to watch</div>
                  <span className="mono">{opp.keyPlayers.length} flagged</span>
                </div>
                <div className="col" style={{ gap: 10 }}>
                  {opp.keyPlayers.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px dashed var(--line)' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0, background: 'var(--warn-soft)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: 'var(--warn)' }}>{p.jersey}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="row between" style={{ marginBottom: 2 }}>
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</span>
                          <span className="mono">{p.caps}c</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{p.pos}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{p.threat}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prep actions */}
              <div className="card paper">
                <div className="card-title" style={{ marginBottom: 10 }}>Prep actions</div>
                <div className="col" style={{ gap: 8 }}>
                  {[
                    { done: true,  label: 'Watch last 2 matches vs UCT' },
                    { done: true,  label: 'Tag their lineout calls in Video' },
                    { done: false, label: 'Brief forwards on Jackle threat' },
                    { done: false, label: 'Set lineout calls for match day' },
                    { done: false, label: 'Send scout PDF to coaching staff' },
                  ].map((a, i) => (
                    <div key={i} className="row gap-3" style={{ fontSize: 13 }}>
                      <span style={{ color: a.done ? 'var(--ok)' : 'var(--muted)', fontWeight: 600, fontSize: 15, lineHeight: 1 }}>{a.done ? '✓' : '○'}</span>
                      <span style={{ color: a.done ? 'var(--ink-soft)' : 'var(--ink)', textDecoration: a.done ? 'line-through' : 'none' }}>{a.label}</span>
                    </div>
                  ))}
                  <button className="btn sm" style={{ marginTop: 4 }}>+ Add task</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Game Plan tab ── */}
      {tab === 'gameplan' && <GamePlanDoc opp={opp} />}
    </div>
  );
};

Object.assign(window, { OpponentIntel });
