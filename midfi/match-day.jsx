/* RugbyAI mid-fi — Match Day container with Pre/Live/Sideline/Post modes */

/* Default XV — picks players from SQUAD by position. We assign by jersey 1-15. */
const DEFAULT_XV = [
  { jersey: 1,  pos: 'Loosehead Prop',  squadId: 5  },  // Bulana
  { jersey: 2,  pos: 'Hooker',          squadId: 10 },  // Mkiva
  { jersey: 3,  pos: 'Tighthead Prop',  squadId: 20 },  // Nkosi
  { jersey: 4,  pos: 'Lock',            squadId: 11 },  // Jacobs
  { jersey: 5,  pos: 'Lock',            squadId: 19 },  // Moyo (recovering — vacant)
  { jersey: 6,  pos: 'Blindside Flank', squadId: 14 },  // Davids
  { jersey: 7,  pos: 'Openside Flank',  squadId: 15 },  // Ngubane
  { jersey: 8,  pos: '8th Man',         squadId: 16 },  // Petersen
  { jersey: 9,  pos: 'Scrumhalf',       squadId: 12 },  // Mathebula
  { jersey: 10, pos: 'Flyhalf',         squadId: 13 },  // Naidoo
  { jersey: 11, pos: 'Left Wing',       squadId: 3  },  // Barnier
  { jersey: 12, pos: 'Inside Centre',   squadId: 18 },  // Adams
  { jersey: 13, pos: 'Outside Centre',  squadId: 17 },  // Mtawana
  { jersey: 14, pos: 'Right Wing',      squadId: 6  },  // Bunu
  { jersey: 15, pos: 'Fullback',        squadId: 21 },  // van Wyk
];

const DEFAULT_BENCH = [
  { jersey: 16, pos: 'Hooker',   squadId: 23 },
  { jersey: 17, pos: 'Prop',     squadId: null },
  { jersey: 18, pos: 'Prop',     squadId: null },
  { jersey: 19, pos: 'Lock',     squadId: 24 },
  { jersey: 20, pos: 'Flanker',  squadId: 8 },
  { jersey: 21, pos: 'Scrumhalf',squadId: 25 },
  { jersey: 22, pos: 'Flyhalf',  squadId: 26 },
  { jersey: 23, pos: 'Utility',  squadId: 1 },
];

const PITCH_POS = {
  1:  { x: 18, y: 38 }, 2: { x: 18, y: 50 }, 3: { x: 18, y: 62 },
  4:  { x: 26, y: 42 }, 5: { x: 26, y: 58 },
  6:  { x: 33, y: 34 }, 7: { x: 33, y: 66 }, 8: { x: 36, y: 50 },
  9:  { x: 46, y: 50 }, 10: { x: 54, y: 50 },
  12: { x: 62, y: 42 }, 13: { x: 68, y: 36 },
  11: { x: 76, y: 22 }, 14: { x: 76, y: 78 },
  15: { x: 84, y: 50 },
};

/* ---- Container ---- */
const MatchDay = () => {
  const [mode, setMode] = React.useState('pre');
  const [xv, setXv] = React.useState(DEFAULT_XV);
  const [bench, setBench] = React.useState(DEFAULT_BENCH);
  const next = FIXTURES.find(f => f.upcoming);
  const getPlayer = id => SQUAD.find(p => p.n === id);

  return (
    <div className="page" style={{ paddingBottom: mode === 'sideline' ? 0 : 60 }}>
      <div className="page-head">
        <div>
          <div className="eyebrow">Match Day · Saturday 14 Jun · 15:00</div>
          <h1>Pumas <span className="muted">vs</span> {next.opp}</h1>
          <div className="meta">{next.venue} · Round 8 League · Sportground 1</div>
        </div>
        <div className="modebar">
          <button className={mode === 'pre' ? 'active' : ''} onClick={() => setMode('pre')}>Pre-match</button>
          <button className={`live ${mode === 'live' ? 'active' : ''}`} onClick={() => setMode('live')}>
            {mode === 'live' && <span className="pulse" />}
            Live
          </button>
          <button className={mode === 'sideline' ? 'active' : ''} onClick={() => setMode('sideline')}>
            📱 Sideline
          </button>
          <button className={mode === 'post' ? 'active' : ''} onClick={() => setMode('post')}>Post-match</button>
        </div>
      </div>

      {mode === 'pre'      && <PreMatchView xv={xv} setXv={setXv} bench={bench} setBench={setBench} getPlayer={getPlayer} next={next} />}
      {mode === 'live'     && <LiveMatchView xv={xv} bench={bench} getPlayer={getPlayer} next={next} onLeave={() => setMode('post')} />}
      {mode === 'sideline' && <SidelineView xv={xv} getPlayer={getPlayer} next={next} />}
      {mode === 'post'     && <PostMatchView next={next} />}
    </div>
  );
};

/* ---- Pre-match view (XV builder with drag-and-drop + list/pitch toggle) ---- */
const PreMatchView = ({ xv, setXv, bench, setBench, getPlayer, next }) => {
  const [view, setView] = React.useState('pitch'); // pitch | list
  const [draggingId, setDraggingId] = React.useState(null);
  const [dragOverJersey, setDragOverJersey] = React.useState(null);
  const [trayQuery, setTrayQuery] = React.useState('');
  const [trayFilter, setTrayFilter] = React.useState('all');

  const allSlots = [...xv, ...bench];
  const slotByPlayer = id => allSlots.find(s => s.squadId === id);

  const onDragStart = (squadId) => (e) => {
    setDraggingId(squadId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(squadId));
  };
  const onDragEnd = () => { setDraggingId(null); setDragOverJersey(null); };

  const onPinDragOver = (jersey) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverJersey(jersey);
  };
  const onPinDragLeave = () => setDragOverJersey(null);

  const assignToSlot = (jersey, squadId) => {
    /* If the player is already in another slot, swap */
    const current = allSlots.find(s => s.squadId === squadId);
    const updateList = (list) => list.map(slot => {
      if (slot.jersey === jersey) {
        const oldId = slot.squadId;
        if (current && current.jersey !== jersey) {
          return { ...slot, squadId };
        }
        return { ...slot, squadId };
      }
      // displaced slot — give it the old occupant of the target
      const targetSlot = allSlots.find(s => s.jersey === jersey);
      if (current && current.jersey === slot.jersey && current.jersey !== jersey) {
        return { ...slot, squadId: targetSlot.squadId };
      }
      return slot;
    });
    setXv(prev => updateList(prev));
    setBench(prev => updateList(prev));
  };

  const onPinDrop = (jersey) => (e) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('text/plain'));
    if (!isNaN(id)) assignToSlot(jersey, id);
    setDraggingId(null);
    setDragOverJersey(null);
  };

  const clearSlot = (jersey) => {
    setXv(prev => prev.map(s => s.jersey === jersey ? { ...s, squadId: null } : s));
    setBench(prev => prev.map(s => s.jersey === jersey ? { ...s, squadId: null } : s));
  };

  const trayPlayers = SQUAD
    .filter(p => {
      if (trayFilter === 'fw') return /Prop|Hooker|Lock|Flank|8th|Forward/i.test(p.pos);
      if (trayFilter === 'bk') return /Back|Wing|Centre|Flyhalf|Scrum|Fullback/i.test(p.pos);
      return true;
    })
    .filter(p => !trayQuery || `${p.fn} ${p.ln} ${p.pos}`.toLowerCase().includes(trayQuery.toLowerCase()));

  const filled = xv.filter(s => s.squadId).length;
  const benchFilled = bench.filter(s => s.squadId).length;

  return (
    <>
      {/* Status strip */}
      <div className="card" style={{ padding: '12px 16px', marginBottom: 14 }}>
        <div className="row between wrap" style={{ gap: 12 }}>
          <div className="row gap-6">
            <div className="col tight">
              <span className="mono">Confirmed</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--ok)' }}>22 / 23</span>
            </div>
            <div style={{ width: 1, height: 32, background: 'var(--line)' }} />
            <div className="col tight">
              <span className="mono">Unavailable</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--warn)' }}>3</span>
            </div>
            <div style={{ width: 1, height: 32, background: 'var(--line)' }} />
            <div className="col tight">
              <span className="mono">XV filled</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600 }}>{filled} / 15</span>
            </div>
            <div style={{ width: 1, height: 32, background: 'var(--line)' }} />
            <div className="col tight">
              <span className="mono">Bench filled</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600 }}>{benchFilled} / 8</span>
            </div>
          </div>
          <div className="row gap-3">
            <div className="view-toggle">
              <button className={view === 'pitch' ? 'active' : ''} onClick={() => setView('pitch')}>▣ Pitch</button>
              <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>≡ List</button>
            </div>
            <button className="btn sm">↶ Undo</button>
            <button className="btn sm accent">✦ Auto-fill</button>
            <button className="btn sm primary">✓ Confirm XV</button>
          </div>
        </div>
      </div>

      <div className="split match">
        {/* Tray */}
        <div className="card" style={{ padding: 14, alignSelf: 'flex-start' }}>
          <div className="row between" style={{ marginBottom: 10 }}>
            <div className="card-title">Squad tray</div>
            <span className="mono">drag → pin</span>
          </div>
          <input
            className="input"
            placeholder="Search…"
            value={trayQuery}
            onChange={e => setTrayQuery(e.target.value)}
            style={{ width: '100%', marginBottom: 8 }}
          />
          <div className="row gap-2 wrap" style={{ marginBottom: 10 }}>
            <button className={`chip ${trayFilter === 'all' ? 'active' : ''}`} onClick={() => setTrayFilter('all')}>All</button>
            <button className={`chip ${trayFilter === 'fw'  ? 'active' : ''}`} onClick={() => setTrayFilter('fw')}>FW</button>
            <button className={`chip ${trayFilter === 'bk'  ? 'active' : ''}`} onClick={() => setTrayFilter('bk')}>BK</button>
          </div>
          <div style={{ maxHeight: 480, overflowY: 'auto', margin: '0 -6px', padding: '0 6px' }}>
            {trayPlayers.map(p => {
              const onPitch = slotByPlayer(p.n);
              const unavail = p.fit === 'Injured';
              return (
                <div
                  key={p.n}
                  className={`tray-row ${draggingId === p.n ? 'dragging' : ''} ${unavail ? 'unavailable' : ''}`}
                  draggable={!unavail}
                  onDragStart={onDragStart(p.n)}
                  onDragEnd={onDragEnd}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 4px', borderRadius: 6,
                  }}
                >
                  <Head p={p} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.fn[0]}. {p.ln}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>
                      {p.pos.split(' ').map(s => s[0]).join('').slice(0,3)} · {p.caps}c
                    </div>
                  </div>
                  {unavail
                    ? <Badge variant="warn">INJ</Badge>
                    : onPitch
                      ? <Badge variant="accent">{onPitch.jersey}</Badge>
                      : <span style={{ color: 'var(--muted)', fontSize: 14 }}>⋮⋮</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main area — pitch or list */}
        <div className="col">
          {view === 'pitch' ? (
            <div className="card" style={{ padding: 16 }}>
              <div className="card-head">
                <div className="card-title">Starting XV  ·  pitch view</div>
                <div className="row gap-3">
                  <span className="mono">Drop players onto pins</span>
                </div>
              </div>
              <div className="pitch" style={{ height: 380, position: 'relative' }}>
                <div className="pitch-stripe" />
                <div className="pitch-v" style={{ left: '50%' }} />
                <div className="pitch-v dashed" style={{ left: '40%' }} />
                <div className="pitch-v dashed" style={{ left: '60%' }} />
                <div className="pitch-v" style={{ left: '22%', opacity: .7 }} />
                <div className="pitch-v" style={{ left: '78%', opacity: .7 }} />
                <div className="pitch-v" style={{ left: '6%' }} />
                <div className="pitch-v" style={{ left: '94%' }} />
                <div className="pitch-zone-label" style={{ left: '8%' }}>RED · OWN 22</div>
                <div className="pitch-zone-label" style={{ left: '30%' }}>RUGBY ZONE</div>
                <div className="pitch-zone-label" style={{ left: '52%' }}>GREEN</div>
                <div className="pitch-zone-label" style={{ left: '80%' }}>22 · STRIKE</div>

                {xv.map(slot => {
                  const p = slot.squadId ? getPlayer(slot.squadId) : null;
                  const pos = PITCH_POS[slot.jersey];
                  if (!pos) return null;
                  const missing = !p || p.fit === 'Injured' || p.fit === 'Recovering';
                  return (
                    <div
                      key={slot.jersey}
                      className={`player-pin ${missing ? 'empty' : ''} ${dragOverJersey === slot.jersey ? 'drag-over' : ''}`}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      onDragOver={onPinDragOver(slot.jersey)}
                      onDragLeave={onPinDragLeave}
                      onDrop={onPinDrop(slot.jersey)}
                      onDoubleClick={() => clearSlot(slot.jersey)}
                      title={p ? `${p.fn} ${p.ln} — double-click to clear` : `#${slot.jersey} ${slot.pos} — vacant`}
                    >
                      {slot.jersey}
                      {p && <span className="pin-name">{p.ln}</span>}
                      {missing && <span className="pin-name" style={{ background: 'var(--warn)' }}>{p ? 'unavailable' : 'vacant'}</span>}
                    </div>
                  );
                })}
              </div>
              <div className="row between" style={{ marginTop: 14 }}>
                <div className="row gap-6">
                  <span className="badge accent"><span className="dot" />Filled</span>
                  <span className="badge outline"><span className="dot" style={{ background: 'var(--muted)' }} />Vacant</span>
                  <span className="muted" style={{ fontSize: 12 }}>Double-click a pin to clear it</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: 16 }}>
              <div className="card-head">
                <div className="card-title">Starting XV  ·  list view</div>
                <div className="row gap-3">
                  <span className="mono">Drop into any row</span>
                </div>
              </div>
              <div className="xv-list">
                <div className="h">No</div>
                <div className="h">Position</div>
                <div className="h">Player</div>
                <div className="h">Caps · Form</div>
                <div className="h"></div>
                {xv.map(slot => {
                  const p = slot.squadId ? getPlayer(slot.squadId) : null;
                  const isOver = dragOverJersey === slot.jersey;
                  const cellStyle = isOver ? { background: 'var(--accent-soft)' } : {};
                  return (
                    <div
                      key={slot.jersey}
                      className="row-strip"
                      onDragOver={onPinDragOver(slot.jersey)}
                      onDragLeave={onPinDragLeave}
                      onDrop={onPinDrop(slot.jersey)}
                    >
                      <div className="c" style={cellStyle}><span className={`jersey ${p ? 'starter' : ''}`}>{slot.jersey}</span></div>
                      <div className="c" style={cellStyle}>{slot.pos}</div>
                      <div className="c" style={cellStyle}>
                        {p ? (
                          <>
                            <Head p={p} />
                            <span style={{ fontWeight: 500 }}>{p.fn} {p.ln}</span>
                            {p.fit !== 'Good' && <Badge variant="warn">{p.fit}</Badge>}
                          </>
                        ) : <span className="muted">— drop a player here —</span>}
                      </div>
                      <div className="c" style={cellStyle}>
                        {p && <>
                          <span className="mono-num">{p.caps}c</span>
                          <span className="delta up">↗ 7.4</span>
                        </>}
                      </div>
                      <div className="c" style={cellStyle}>
                        {p && <button className="btn ghost sm" onClick={() => clearSlot(slot.jersey)}>×</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bench */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">Bench  ·  16–23</div>
              <span className="mono">Drop here too</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {bench.map(b => {
                const p = b.squadId ? getPlayer(b.squadId) : null;
                const isOver = dragOverJersey === b.jersey;
                return (
                  <div
                    key={b.jersey}
                    onDragOver={onPinDragOver(b.jersey)}
                    onDragLeave={onPinDragLeave}
                    onDrop={onPinDrop(b.jersey)}
                    onDoubleClick={() => p && clearSlot(b.jersey)}
                    style={{
                      padding: 10,
                      border: '1px solid ' + (isOver ? 'var(--accent)' : 'var(--line)'),
                      borderRadius: 10,
                      background: isOver ? 'var(--accent-soft)' : (p ? 'var(--chalk)' : 'var(--paper-2)'),
                      borderStyle: p ? 'solid' : 'dashed',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}
                  >
                    <span className={`jersey ${p ? 'bench' : ''}`}>{b.jersey}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {p ? (
                        <>
                          <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.fn[0]}. {p.ln}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>{b.pos}</div>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: 13, color: 'var(--muted)' }}>— vacant —</div>
                          <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>{b.pos}</div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="col">
          <div className="card dark">
            <div className="card-head">
              <div className="card-title" style={{ color: 'var(--accent)' }}>✦ Analyst suggests</div>
              <button className="btn ghost sm" style={{ color: 'rgba(255,255,255,.6)' }}>Why?</button>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,.9)' }}>
              You have <b style={{ color: 'var(--accent)' }}>#5 vacant</b> (Moyo recovering). For a UCT-style scrum-heavy side, the analyst recommends <b style={{ color: 'var(--accent)' }}>Conrad le Roux</b> at lock — strongest scrum-engagement metric in current roster.
            </div>
            <hr className="hr" style={{ background: 'rgba(255,255,255,.1)' }} />
            <div className="row gap-2">
              <button className="btn accent sm" onClick={() => assignToSlot(5, 24)}>Apply ✓</button>
              <button className="btn sm" style={{ background: 'rgba(255,255,255,.06)', color: 'var(--paper)', borderColor: 'transparent' }}>Alternatives</button>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">Opponent — {next.opp}</div>
              <Badge variant="warn">5 of last 7</Badge>
            </div>
            <div className="col tight" style={{ gap: 10 }}>
              <div className="row between">
                <span className="mono">Lineout (own)</span>
                <span style={{ fontWeight: 600 }}>78%</span>
              </div>
              <div className="meter"><div style={{ width: '78%' }} /></div>
              <div className="row between">
                <span className="mono">Scrum dominance</span>
                <span style={{ fontWeight: 600, color: 'var(--warn)' }}>strong LH</span>
              </div>
              <div className="meter warn"><div style={{ width: '82%' }} /></div>
              <div className="row between">
                <span className="mono">Penalties / game</span>
                <span style={{ fontWeight: 600 }}>9.1</span>
              </div>
              <div className="meter ok"><div style={{ width: '55%' }} /></div>
            </div>
            <hr className="hr dashed" />
            <div className="mono">Calls likely to feature</div>
            <div className="row gap-2 wrap" style={{ marginTop: 6 }}>
              <Badge>Bus</Badge>
              <Badge>Bulls (pick&amp;go)</Badge>
              <Badge>Blitz def.</Badge>
              <Badge>Doubles</Badge>
            </div>
          </div>

          <div className="card paper">
            <div className="card-head">
              <div className="card-title">Unavailable</div>
              <Badge variant="warn">3</Badge>
            </div>
            {SQUAD.filter(p => p.fit === 'Injured' || p.fit === 'Recovering').map(p => (
              <div key={p.n} className="row between" style={{ padding: '6px 0', borderBottom: '1px dashed var(--line)' }}>
                <div className="row gap-3">
                  <Head p={p} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p.fn[0]}. {p.ln}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{p.pos}</div>
                  </div>
                </div>
                <Badge variant={p.fit === 'Injured' ? 'warn' : 'accent'}>{p.fit === 'Injured' ? 'INJ' : 'REC'}</Badge>
              </div>
            ))}
            <button className="btn sm" style={{ marginTop: 10 }}>+ Mark unavailable</button>
          </div>
        </div>
      </div>
    </>
  );
};

/* Post-match — quick handoff to Ratings */
const PostMatchView = ({ next }) => (
  <div className="empty-zone" style={{ marginTop: 14 }}>
    <h2 style={{ fontSize: 26, color: 'var(--ink)', marginBottom: 8 }}>Match complete — vs {next.opp}</h2>
    <div style={{ marginBottom: 16 }}>Final 24 – 18 · 3 tries · Lineout 88% · Scrum 6/7</div>
    <div className="row gap-3" style={{ justifyContent: 'center' }}>
      <button className="btn primary">→ Open player ratings</button>
      <button className="btn">View match summary</button>
      <button className="btn accent">✦ Draft post-match talk</button>
    </div>
  </div>
);

Object.assign(window, { MatchDay, DEFAULT_XV, DEFAULT_BENCH, BENCH: DEFAULT_BENCH, PITCH_POS });
