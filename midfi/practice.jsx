/* RugbyAI mid-fi — Practice Planner (week view, drag drills to days) */

const PracticePlanner = ({ practices, addDrill, removeDrill, removePractice, resetSeed, focusDate }) => {
  const [weekStart, setWeekStart] = React.useState(() => startOfWeek(focusDate || TODAY_ISO));
  React.useEffect(() => { if (focusDate) setWeekStart(startOfWeek(focusDate)); }, [focusDate]);

  const [drillFilter, setDrillFilter] = React.useState('all');
  const [drillQuery, setDrillQuery] = React.useState('');
  const [draggingDrill, setDraggingDrill] = React.useState(null);
  const [dropDate, setDropDate] = React.useState(null);

  /* ── Drill library visibility ── */
  const [libraryOpen, setLibraryOpen] = React.useState(false);

  /* ── Session-level overrides (start time etc.) ── */
  const [sessionOv, setSessionOv] = React.useState({});
  const [editSess, setEditSess] = React.useState(null); // { iso, field }
  const getSOv   = (iso, f, def) => sessionOv[iso]?.[f] ?? def;
  const setSOv   = (iso, f, v) => setSessionOv(p => ({ ...p, [iso]: { ...(p[iso] || {}), [f]: v } }));
  const isEdS    = (iso, f) => editSess?.iso === iso && editSess?.field === f;
  const startEdS = (iso, f) => setEditSess({ iso, field: f });
  const stopEdS  = () => setEditSess(null);

  /* ── Inline drill editing ── */
  const [drillOverrides, setDrillOverrides] = React.useState({});
  const [editCell, setEditCell] = React.useState(null); // { key: 'iso__idx', field }

  const ovKey   = (iso, idx) => `${iso}__${idx}`;
  const getOv   = (iso, idx, f, def) => drillOverrides[ovKey(iso, idx)]?.[f] ?? def;
  const setOv   = (iso, idx, f, v) => {
    const k = ovKey(iso, idx);
    setDrillOverrides(p => ({ ...p, [k]: { ...(p[k] || {}), [f]: v } }));
  };
  const isEd    = (iso, idx, f) => editCell?.key === ovKey(iso, idx) && editCell?.field === f;
  const startEd = (iso, idx, f) => setEditCell({ key: ovKey(iso, idx), field: f });
  const stopEd  = () => setEditCell(null);

  const PRIORITY_ORDER = ['KEY', 'IMPORT.', 'SUPP.'];
  const PRIORITY_CFG = {
    'KEY':     { label: 'KEY',     bg: 'rgba(184,65,45,.12)',  fg: 'var(--warn)' },
    'IMPORT.': { label: 'IMPORT.', bg: 'rgba(201,148,30,.14)', fg: 'var(--accent-2)' },
    'SUPP.':   { label: 'SUPP.',   bg: 'rgba(46,122,69,.10)',  fg: 'var(--ok)' },
  };
  const COACH_OPTIONS = ['Head Coach', 'Fwds Coach', 'Backs Coach', 'Asst Coach', 'Strength Coach', 'Analyst'];

  /* Shared inline-edit input style */
  const inlineInput = (extra = {}) => ({
    padding: '2px 5px', borderRadius: 4,
    border: '1px solid var(--primary)', outline: 'none',
    fontSize: 11, fontFamily: 'inherit', background: 'var(--chalk)',
    boxShadow: '0 0 0 2px rgba(24,43,84,.08)',
    ...extra,
  });

  /* Hoverable "click to edit" wrapper */
  const EditHint = ({ children, onClick, title, mono, style: s = {} }) => (
    <span
      onClick={onClick} title={title || 'Click to edit'}
      style={{ cursor: 'text', display: 'inline-block', borderRadius: 3, padding: '1px 2px', fontFamily: mono ? 'var(--font-mono)' : 'inherit', transition: 'background .1s', ...s }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--paper-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {children}
    </span>
  );

  /* Custom drills — localStorage-backed */
  const [customDrills, setCustomDrills] = React.useState(() => {
    try { const r = localStorage.getItem('rugbyai_custom_drills_v1'); if (r) return JSON.parse(r); } catch {}
    return [];
  });
  const [showCustomModal, setShowCustomModal] = React.useState(false);
  const [customForm, setCustomForm] = React.useState({
    name: '', cat: 'Skills', min: 15, group: 'all', intensity: 'Med', focus: '', desc: '', calls: '',
  });

  const saveCustomDrill = () => {
    if (!customForm.name.trim()) return;
    const drill = {
      ...customForm,
      id: `cx_${Date.now()}`,
      min: Number(customForm.min) || 15,
      calls: customForm.calls
        ? customForm.calls.split(',').map(c => c.trim().toUpperCase()).filter(Boolean)
        : [],
      custom: true,
    };
    const next = [...customDrills, drill];
    setCustomDrills(next);
    try { localStorage.setItem('rugbyai_custom_drills_v1', JSON.stringify(next)); } catch {}
    setShowCustomModal(false);
    setCustomForm({ name: '', cat: 'Skills', min: 15, group: 'all', intensity: 'Med', focus: '', desc: '', calls: '' });
  };

  const removeCustomDrill = (id) => {
    const next = customDrills.filter(d => d.id !== id);
    setCustomDrills(next);
    try { localStorage.setItem('rugbyai_custom_drills_v1', JSON.stringify(next)); } catch {}
  };

  /* Merged drill map & list */
  const drillById = React.useMemo(() => {
    const map = { ...DRILL_BY_ID };
    customDrills.forEach(d => { map[d.id] = d; });
    return map;
  }, [customDrills]);

  const allDrills = React.useMemo(() => [...DRILL_LIBRARY, ...customDrills], [customDrills]);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const byDate = React.useMemo(() => {
    const map = {};
    practices.forEach(p => { map[p.date] = p; });
    return map;
  }, [practices]);

  const filteredDrills = allDrills
    .filter(d => drillFilter === 'all' || d.cat === drillFilter)
    .filter(d => !drillQuery ||
      d.name.toLowerCase().includes(drillQuery.toLowerCase()) ||
      (d.desc || '').toLowerCase().includes(drillQuery.toLowerCase())
    );

  const weekPractices = days.map(d => byDate[d]).filter(Boolean);
  const totalMins = weekPractices.reduce((acc, p) =>
    acc + p.drills.reduce((a, did) => a + (drillById[did]?.min || 0), 0), 0);
  const setPieceMins = weekPractices.reduce((acc, p) =>
    acc + p.drills
      .filter(did => drillById[did]?.cat === 'Set Piece')
      .reduce((a, did) => a + (drillById[did]?.min || 0), 0), 0);
  const matchDay = days.find(d => !!fixtureFor(d));
  const matchFixture = matchDay && fixtureFor(matchDay);

  /* Drag — single drill uses bare id; template uses "TEMPLATE:id,id,..." */
  const onDrillDragStart = (drillId) => (e) => {
    setDraggingDrill(drillId);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', drillId);
  };
  const onDrillDragEnd = () => { setDraggingDrill(null); setDropDate(null); };

  const onTemplateDragStart = (drillIds) => (e) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', 'TEMPLATE:' + drillIds.join(','));
  };

  const onDayDragOver = (iso) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDropDate(iso);
  };
  const onDayDragLeave = () => setDropDate(null);
  const onDayDrop = (iso) => (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (data.startsWith('TEMPLATE:')) {
      data.slice('TEMPLATE:'.length).split(',').forEach(did => addDrill(iso, did));
    } else if (data) {
      addDrill(iso, data);
    }
    setDropDate(null);
    setDraggingDrill(null);
  };

  /* Helpers */
  const groupLabel = (g) => g === 'forwards' ? 'Fwds' : g === 'backs' ? 'Backs' : 'All';
  const intColors = (intensity) =>
    intensity === 'High' ? { bg: 'rgba(184,65,45,.12)', fg: 'var(--warn)' }
    : intensity === 'Med' ? { bg: 'rgba(201,148,30,.14)', fg: 'var(--accent-2)' }
    : { bg: 'rgba(46,122,69,.10)', fg: 'var(--ok)' };

  const TEMPLATES = [
    { name: 'Set-piece focus', drills: ['d1','d2','d3','d16'] },
    { name: 'Defence focus',   drills: ['d1','d5','d6','d19','d23'] },
    { name: 'Attack shapes',   drills: ['d1','d4','d17','d21','d8'] },
    { name: "Captain's run",   drills: ['d1','d9','d7'] },
    { name: 'Game sim day',    drills: ['d1','d8','d9','d24'] },
    { name: 'Recovery',        drills: ['d15','d11','d22'] },
  ];

  const fieldLabel = (label, note) => (
    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '.08em', color: 'var(--ink-soft)', marginBottom: 4 }}>
      {label}{note && <span style={{ color: 'var(--muted)', fontWeight: 400 }}> {note}</span>}
    </label>
  );

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Week of {formatWeekRange(weekStart)}</div>
          <h1>Practice planner</h1>
          <div className="meta">Drag drills or templates onto any day · {allDrills.length} drills in library</div>
        </div>
        <div className="row gap-3">
          <button className="btn sm" onClick={() => setWeekStart(addDays(weekStart, -7))}>← Prev</button>
          <button className="btn sm" onClick={() => setWeekStart(startOfWeek(TODAY_ISO))}>Today</button>
          <button className="btn sm" onClick={() => setWeekStart(addDays(weekStart, 7))}>Next →</button>
          <button className="btn" onClick={resetSeed}>Reset</button>
          <button className="btn primary" onClick={() => setShowCustomModal(true)}><span className="ico">+</span> Custom drill</button>
        </div>
      </div>

      {/* Week stats */}
      <div className="week-summary" style={{ marginBottom: 14 }}>
        <div className="stat-mini">
          <div className="lbl">Sessions this week</div>
          <div className="val">{weekPractices.length}</div>
        </div>
        <div className="stat-mini">
          <div className="lbl">Total minutes</div>
          <div className="val">{totalMins}<span style={{ fontSize: 14, color: 'var(--ink-soft)' }}> min</span></div>
        </div>
        <div className="stat-mini">
          <div className="lbl">Set-piece focus</div>
          <div className="val">{setPieceMins}<span style={{ fontSize: 14, color: 'var(--ink-soft)' }}> min</span></div>
        </div>
        <div className="stat-mini" style={matchFixture ? { background: 'var(--accent)', borderColor: 'var(--accent-2)' } : {}}>
          <div className="lbl">Match this week</div>
          <div className="val" style={{ fontSize: matchFixture ? 18 : 24 }}>
            {matchFixture ? `vs ${matchFixture.opp}` : '— none —'}
          </div>
        </div>
      </div>

      <div className="planner">
        {/* ── Drill library ── */}
        <div className="card" style={{ padding: 0, position: 'sticky', top: 'calc(var(--topbar-h) + 14px)', maxHeight: libraryOpen ? 'calc(100vh - var(--topbar-h) - 56px)' : 'auto', display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden' }}>

          {/* ── Library header — always visible, click to toggle ── */}
          <button
            onClick={() => setLibraryOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px',
              background: libraryOpen ? 'var(--primary)' : 'var(--paper)',
              border: 0, width: '100%', cursor: 'pointer', textAlign: 'left',
              borderBottom: libraryOpen ? '1px solid rgba(255,255,255,.08)' : 0,
              transition: 'background .15s',
            }}
          >
            <span style={{ fontSize: 15, color: libraryOpen ? 'var(--accent)' : 'var(--primary)', lineHeight: 1 }}>
              {libraryOpen ? '▾' : '▸'}
            </span>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
              color: libraryOpen ? 'var(--paper)' : 'var(--ink)',
              flex: 1,
            }}>Drill library</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: libraryOpen ? 'rgba(255,255,255,.5)' : 'var(--muted)', letterSpacing: '.04em' }}>
              {allDrills.length} drills{customDrills.length > 0 ? ` · ${customDrills.length} custom` : ''}
            </span>
            {/* Category colour swatches — visible when closed */}
            {!libraryOpen && (
              <div style={{ display: 'flex', gap: 3, marginLeft: 4 }}>
                {DRILL_CATS.map(c => (
                  <div key={c} style={{ width: 8, height: 8, borderRadius: 2, background: CAT_COLOR[c]?.border || '#ccc' }} />
                ))}
              </div>
            )}
          </button>

          {/* ── Library body — only when open ── */}
          {libraryOpen && (
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 0, flex: 1, overflow: 'hidden' }}>
              <input
                className="input"
                placeholder="Search name or description…"
                value={drillQuery}
                onChange={e => setDrillQuery(e.target.value)}
                style={{ width: '100%', marginBottom: 8 }}
              />
              {/* Category filter chips with colour dots */}
              <div className="row gap-2 wrap" style={{ marginBottom: 10 }}>
                <button className={`chip ${drillFilter === 'all' ? 'active' : ''}`} onClick={() => setDrillFilter('all')}>All</button>
                {DRILL_CATS.map(c => {
                  const cc = CAT_COLOR[c];
                  return (
                    <button
                      key={c}
                      className={`chip ${drillFilter === c ? 'active' : ''}`}
                      onClick={() => setDrillFilter(c)}
                      style={drillFilter === c ? { background: cc.border, color: '#fff', borderColor: cc.border } : {}}
                    >
                      <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: cc.border, marginRight: 4, verticalAlign: 'middle', flexShrink: 0 }} />
                      {c}
                    </button>
                  );
                })}
              </div>

              {/* Drill cards */}
              <div style={{ flex: 1, overflowY: 'auto', margin: '0 -4px', padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {filteredDrills.map(d => {
                  const col = CAT_COLOR[d.cat] || CAT_COLOR['Skills'];
                  const ic = intColors(d.intensity);
                  return (
                    <div
                      key={d.id}
                      className={`drill-card ${draggingDrill === d.id ? 'dragging' : ''}`}
                      draggable
                      onDragStart={onDrillDragStart(d.id)}
                      onDragEnd={onDrillDragEnd}
                      style={{
                        flexDirection: 'column', alignItems: 'flex-start', gap: 5,
                        padding: '9px 11px 9px 14px',
                        cursor: 'grab',
                        background: col.bg,
                        borderLeft: `3px solid ${col.border}`,
                        borderRadius: '0 7px 7px 0',
                        border: `1px solid rgba(0,0,0,.06)`,
                        borderLeftWidth: 3,
                        borderLeftColor: col.border,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 800,
                          letterSpacing: '.08em', padding: '2px 5px', borderRadius: 3,
                          background: col.border, color: '#fff', flexShrink: 0,
                        }}>{d.cat.split(' ')[0].toUpperCase()}</span>
                        <span style={{ flex: 1, fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>{d.name}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: col.fg, fontWeight: 700, flexShrink: 0 }}>{d.min}m</span>
                        {d.custom && (
                          <button
                            onClick={e => { e.stopPropagation(); removeCustomDrill(d.id); }}
                            style={{ background: 'transparent', border: 0, color: 'var(--muted)', cursor: 'pointer', fontSize: 14, padding: '0 2px', lineHeight: 1 }}
                            title="Remove custom drill"
                          >×</button>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '.06em', padding: '1px 5px', borderRadius: 3, background: 'rgba(255,255,255,.6)', color: 'var(--ink-soft)', border: '1px solid rgba(0,0,0,.08)' }}>{groupLabel(d.group)}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '.06em', padding: '1px 5px', borderRadius: 3, background: ic.bg, color: ic.fg }}>{d.intensity}</span>
                        {d.focus && <span style={{ fontSize: 10, color: 'var(--ink-soft)', fontStyle: 'italic' }}>· {d.focus}</span>}
                        {d.custom && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--accent-2)', fontWeight: 700, letterSpacing: '.06em', marginLeft: 2 }}>CUSTOM</span>}
                      </div>
                      {d.desc && <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.4 }}>{d.desc}</div>}
                      {d.calls && d.calls.length > 0 && (
                        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                          {d.calls.map(c => (
                            <span key={c} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '.06em', padding: '1px 5px', borderRadius: 3, background: 'rgba(255,255,255,.7)', color: col.fg, border: `1px solid ${col.border}40` }}>{c}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {filteredDrills.length === 0 && (
                  <div style={{ padding: 14, fontSize: 12, color: 'var(--muted)', textAlign: 'center', fontStyle: 'italic' }}>No drills match.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Right column ── */}
        <div>
          <div className="col" style={{ gap: 6 }}>
            {days.map((iso) => {
              const { d, dow, m } = parseISO(iso);
              const session = byDate[iso];
              const fixture = fixtureFor(iso);
              const isMatch = !!fixture;
              const isToday = iso === TODAY_ISO;
              const dropping = dropDate === iso;

              /* Build drill rows — overrides applied per slot */
              const drillRows = session ? session.drills.map((did, idx) => {
                const drill = drillById[did];
                if (!drill) return null;

                /* Start time uses overridden durations for preceding drills */
                const prevMins = session.drills.slice(0, idx).reduce((a, pid, pidx) =>
                  a + Number(getOv(iso, pidx, 'min', drillById[pid]?.min || 0)), 0);
                const [sh, sm] = getSOv(iso, 'start', session.start).split(':').map(Number);
                const tot = sh * 60 + sm + prevMins;
                const startTime = `${Math.floor(tot / 60)}:${String(tot % 60).padStart(2, '0')}`;

                const defaultLead        = drill.group === 'forwards' ? 'Fwds Coach' : drill.group === 'backs' ? 'Backs Coach' : 'Head Coach';
                const defaultAssist      = drill.group === 'all' ? 'Asst Coach' : 'Head Coach';
                const defaultPriorityLbl = drill.intensity === 'High' ? 'KEY' : drill.intensity === 'Med' ? 'IMPORT.' : 'SUPP.';

                const effMin         = Number(getOv(iso, idx, 'min',      drill.min));
                const effCat         = getOv(iso, idx, 'cat',      drill.cat);
                const effFocus       = getOv(iso, idx, 'focus',    drill.focus    || '');
                const effName        = getOv(iso, idx, 'name',     drill.name);
                const effDesc        = getOv(iso, idx, 'desc',     drill.desc     || '');
                const effLead        = getOv(iso, idx, 'lead',     defaultLead);
                const effAssist      = getOv(iso, idx, 'assist',   defaultAssist);
                const effPriorityLbl = getOv(iso, idx, 'priority', defaultPriorityLbl);
                const effPriority    = PRIORITY_CFG[effPriorityLbl] || PRIORITY_CFG['SUPP.'];
                const col            = CAT_COLOR[effCat] || CAT_COLOR[drill.cat];

                return { drill, idx, startTime, effMin, effCat, effFocus, effName, effDesc, effLead, effAssist, effPriority, effPriorityLbl, col };
              }).filter(Boolean) : [];

              const totalMinsDay = session
                ? session.drills.reduce((a, did, didx) =>
                    a + Number(getOv(iso, didx, 'min', drillById[did]?.min || 0)), 0)
                : 0;

              return (
                <div
                  key={iso}
                  style={{
                    border: dropping ? '2px solid var(--primary)' : `1px solid ${isToday ? 'var(--accent)' : 'var(--line)'}`,
                    borderRadius: 10,
                    background: isMatch && !session ? 'rgba(201,148,30,.07)' : 'var(--chalk)',
                    overflow: 'hidden',
                    transition: 'border-color .12s',
                  }}
                  onDragOver={onDayDragOver(iso)}
                  onDragLeave={onDayDragLeave}
                  onDrop={onDayDrop(iso)}
                >
                  {/* Day header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                    borderBottom: session || isMatch ? '1px solid var(--line)' : 'none',
                    background: session
                      ? 'var(--primary)'
                      : isMatch ? 'rgba(201,148,30,.08)' : undefined,
                  }}>
                    {/* Day stamp */}
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 12,
                      letterSpacing: '.1em', minWidth: 54,
                      color: session ? 'var(--accent)' : isMatch ? 'var(--accent)' : 'var(--primary)',
                    }}>
                      {DAY_NAMES_SHORT[dow].toUpperCase()} {d}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: session ? 'rgba(255,255,255,.45)' : 'var(--muted)', minWidth: 56 }}>
                      {MONTH_NAMES_SHORT[m]} {d}{isToday ? ' · TODAY' : ''}
                    </span>
                    <span style={{ width: 1, height: 16, background: session ? 'rgba(255,255,255,.14)' : 'var(--line)', flexShrink: 0 }} />

                    {session ? (
                      <>
                        {/* Session title — editable */}
                        <input
                          className="input"
                          defaultValue={session.focus.toUpperCase()}
                          style={{
                            padding: '2px 6px', fontSize: 13, fontWeight: 800,
                            letterSpacing: '.06em', border: 0,
                            background: 'rgba(255,255,255,.08)',
                            color: 'var(--paper)', borderRadius: 4, flex: 1,
                          }}
                        />
                        {/* Start time — click to edit */}
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,.65)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
                          {isEdS(iso, 'start') ? (
                            <input
                              autoFocus type="time"
                              defaultValue={getSOv(iso, 'start', session.start)}
                              style={{ ...inlineInput(), width: 82, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700 }}
                              onBlur={e => { setSOv(iso, 'start', e.target.value || session.start); stopEdS(); }}
                              onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') stopEdS(); }}
                            />
                          ) : (
                            <EditHint
                              mono onClick={() => startEdS(iso, 'start')}
                              title="Click to edit start time"
                              style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 11 }}
                            >
                              {getSOv(iso, 'start', session.start)}
                            </EditHint>
                          )}
                          <span style={{ color: 'rgba(255,255,255,.45)' }}>–{session.end} · </span>
                          <b style={{ color: 'var(--paper)' }}>{totalMinsDay}min</b>
                        </span>
                      </>
                    ) : isMatch ? (
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', letterSpacing: '.04em' }}>
                        MATCH — vs {fixture.opp} · {fixture.venue} · 15:00 KO
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>
                        {dropping ? 'Drop to create session' : 'Rest day'}
                      </span>
                    )}
                    {isMatch && session && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', whiteSpace: 'nowrap' }}>🏉 vs {fixture.opp}</span>
                    )}
                    <div style={{ flex: 1 }} />
                    {session && (
                      <button onClick={() => removePractice(iso)} style={{ background: 'rgba(255,255,255,.08)', border: 0, color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 14, padding: '1px 6px', lineHeight: 1, borderRadius: 4 }} title="Remove session">×</button>
                    )}
                  </div>

                  {/* ── Editable drill table ── */}
                  {session && drillRows.length > 0 && (
                    <table className="table" style={{ margin: 0, borderRadius: 0 }}>
                      <thead style={{ background: 'rgba(24,43,84,.06)' }}>
                        <tr>
                          <th style={{ width: 52, color: 'var(--primary)', fontWeight: 800 }}>Start</th>
                          <th style={{ width: 56, color: 'var(--primary)', fontWeight: 800 }}>Dur.</th>
                          <th style={{ width: 154, color: 'var(--primary)', fontWeight: 800 }}>Facet · Focus</th>
                          <th style={{ color: 'var(--primary)', fontWeight: 800 }}>Drill / Activity</th>
                          <th style={{ width: 102, color: 'var(--primary)', fontWeight: 800 }}>Lead</th>
                          <th style={{ width: 102, color: 'var(--primary)', fontWeight: 800 }}>Assist</th>
                          <th style={{ width: 72, color: 'var(--primary)', fontWeight: 800 }}>Priority</th>
                          <th style={{ width: 24 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {drillRows.map(({ drill, idx, startTime, effMin, effCat, effFocus, effName, effDesc, effLead, effAssist, effPriority, effPriorityLbl, col }) => (
                          <tr key={`${iso}-${idx}`}>

                            {/* START — read-only */}
                            <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-soft)' }}>
                              {startTime}
                            </td>

                            {/* DUR. — click to edit */}
                            <td>
                              {isEd(iso, idx, 'min') ? (
                                <input
                                  autoFocus type="number" min="5" max="120"
                                  defaultValue={effMin}
                                  style={{ ...inlineInput(), width: 46, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12 }}
                                  onBlur={e => { setOv(iso, idx, 'min', Math.max(5, Number(e.target.value) || effMin)); stopEd(); }}
                                  onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') stopEd(); }}
                                />
                              ) : (
                                <EditHint mono onClick={() => startEd(iso, idx, 'min')} title="Click to edit duration" style={{ fontWeight: 700, fontSize: 12 }}>
                                  {effMin}m
                                </EditHint>
                              )}
                            </td>

                            {/* FACET · FOCUS */}
                            <td>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                                <span
                                  className="cat-pill"
                                  onClick={() => startEd(iso, idx, 'cat')}
                                  title="Click to change category"
                                  style={{ background: col.bg, color: col.fg, fontSize: 8, flexShrink: 0, cursor: 'pointer', marginTop: 1 }}
                                >
                                  {effCat[0]}
                                </span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  {isEd(iso, idx, 'cat') ? (
                                    <select autoFocus defaultValue={effCat}
                                      style={{ ...inlineInput(), fontSize: 10, marginBottom: 3, maxWidth: 108 }}
                                      onChange={e => { setOv(iso, idx, 'cat', e.target.value); stopEd(); }}
                                      onBlur={stopEd}
                                    >
                                      {DRILL_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                  ) : (
                                    <EditHint onClick={() => startEd(iso, idx, 'cat')} title="Click to change category" style={{ fontSize: 10, fontWeight: 600, color: col.fg, display: 'block', marginBottom: 2 }}>
                                      {effCat}
                                    </EditHint>
                                  )}
                                  {isEd(iso, idx, 'focus') ? (
                                    <input autoFocus defaultValue={effFocus} placeholder="Focus cue…"
                                      style={{ ...inlineInput(), width: 100, fontSize: 10, fontStyle: 'italic' }}
                                      onBlur={e => { setOv(iso, idx, 'focus', e.target.value); stopEd(); }}
                                      onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') stopEd(); }}
                                    />
                                  ) : (
                                    <EditHint onClick={() => startEd(iso, idx, 'focus')} title="Click to edit focus cue" style={{ fontSize: 10, color: 'var(--ink-soft)', fontStyle: 'italic', display: 'block', minHeight: 14 }}>
                                      {effFocus || <span style={{ color: 'var(--muted)' }}>+ focus</span>}
                                    </EditHint>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* DRILL / ACTIVITY */}
                            <td>
                              {isEd(iso, idx, 'name') ? (
                                <input autoFocus defaultValue={effName}
                                  style={{ ...inlineInput(), width: '100%', fontWeight: 600, fontSize: 12, marginBottom: 3 }}
                                  onBlur={e => { setOv(iso, idx, 'name', e.target.value.trim() || effName); stopEd(); }}
                                  onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') stopEd(); }}
                                />
                              ) : (
                                <EditHint onClick={() => startEd(iso, idx, 'name')} title="Click to edit drill name" style={{ fontWeight: 600, fontSize: 12, marginBottom: 2, display: 'inline-block' }}>
                                  {effName}
                                  {drill.custom && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--accent-2)', fontWeight: 700, marginLeft: 5 }}>CUSTOM</span>}
                                </EditHint>
                              )}
                              {isEd(iso, idx, 'desc') ? (
                                <textarea autoFocus defaultValue={effDesc} placeholder="Describe this drill…" rows={3}
                                  style={{ ...inlineInput(), width: '100%', fontSize: 11, lineHeight: 1.4, resize: 'vertical', fontFamily: 'var(--font-body)', display: 'block', marginTop: 2 }}
                                  onBlur={e => { setOv(iso, idx, 'desc', e.target.value); stopEd(); }}
                                  onKeyDown={e => { if (e.key === 'Escape') stopEd(); }}
                                />
                              ) : (
                                <EditHint onClick={() => startEd(iso, idx, 'desc')} title="Click to edit description" style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.4, display: 'block', minHeight: 16 }}>
                                  {effDesc || <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>+ description</span>}
                                </EditHint>
                              )}
                              {drill.calls && drill.calls.length > 0 && (
                                <div style={{ display: 'flex', gap: 3, marginTop: 4, flexWrap: 'wrap' }}>
                                  {drill.calls.map(c => (
                                    <span key={c} style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700, letterSpacing: '.06em', padding: '1px 4px', borderRadius: 2, background: 'rgba(24,43,84,.08)', color: 'var(--primary)' }}>{c}</span>
                                  ))}
                                </div>
                              )}
                            </td>

                            {/* LEAD */}
                            <td style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)' }}>
                              {isEd(iso, idx, 'lead') ? (
                                <select autoFocus defaultValue={effLead}
                                  style={{ ...inlineInput(), fontSize: 11, fontFamily: 'var(--font-mono)', maxWidth: 108 }}
                                  onChange={e => { setOv(iso, idx, 'lead', e.target.value); stopEd(); }}
                                  onBlur={stopEd}
                                >
                                  {COACH_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                              ) : (
                                <EditHint mono onClick={() => startEd(iso, idx, 'lead')} title="Click to change lead coach" style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                                  {effLead}
                                </EditHint>
                              )}
                            </td>

                            {/* ASSIST */}
                            <td style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
                              {isEd(iso, idx, 'assist') ? (
                                <select autoFocus defaultValue={effAssist}
                                  style={{ ...inlineInput(), fontSize: 11, fontFamily: 'var(--font-mono)', maxWidth: 108 }}
                                  onChange={e => { setOv(iso, idx, 'assist', e.target.value); stopEd(); }}
                                  onBlur={stopEd}
                                >
                                  {COACH_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                              ) : (
                                <EditHint mono onClick={() => startEd(iso, idx, 'assist')} title="Click to change assist coach" style={{ fontSize: 11, color: 'var(--muted)' }}>
                                  {effAssist}
                                </EditHint>
                              )}
                            </td>

                            {/* PRIORITY — click cycles KEY → IMPORT. → SUPP. */}
                            <td>
                              <span
                                onClick={() => {
                                  const next = PRIORITY_ORDER[(PRIORITY_ORDER.indexOf(effPriorityLbl) + 1) % PRIORITY_ORDER.length];
                                  setOv(iso, idx, 'priority', next);
                                }}
                                title="Click to change priority"
                                style={{
                                  display: 'inline-block',
                                  fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 9,
                                  letterSpacing: '.05em', padding: '2px 7px', borderRadius: 4,
                                  background: effPriority.bg, color: effPriority.fg,
                                  cursor: 'pointer', userSelect: 'none', transition: 'opacity .1s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '.7'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                              >
                                {effPriority.label}
                              </span>
                            </td>

                            {/* REMOVE */}
                            <td>
                              <button onClick={() => removeDrill(iso, drill.id)} style={{ background: 'transparent', border: 0, color: 'var(--muted)', cursor: 'pointer', fontSize: 13, padding: 0, lineHeight: 1 }}>×</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* Drop footer */}
                  {(session || dropping) && (
                    <div style={{ padding: '6px 14px', fontSize: 11, textAlign: 'center', borderTop: '1px dashed var(--line)', color: dropping ? 'var(--primary)' : 'var(--muted)', background: dropping ? 'var(--primary-soft)' : undefined, fontStyle: 'italic' }}>
                      {dropping ? '↓ Drop to add drill' : '+ drop a drill here'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick templates */}
          <div className="card" style={{ marginTop: 14 }}>
            <div className="card-head">
              <div className="card-title">Quick templates</div>
              <span className="mono">drag onto a day to apply a full session</span>
            </div>
            <div className="row gap-3 wrap">
              {TEMPLATES.map(t => {
                const totalMin = t.drills.reduce((a, did) => a + (drillById[did]?.min || 0), 0);
                return (
                  <div
                    key={t.name}
                    draggable
                    onDragStart={onTemplateDragStart(t.drills)}
                    onDragEnd={onDrillDragEnd}
                    style={{ padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 8, background: 'var(--paper-2)', display: 'flex', flexDirection: 'column', gap: 4, cursor: 'grab', userSelect: 'none', minWidth: 148 }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{t.name}</span>
                    <span className="mono">{t.drills.length} DRILLS · {totalMin}M</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 2 }}>
                      {t.drills.map(did => {
                        const drill = drillById[did];
                        if (!drill) return null;
                        const col = CAT_COLOR[drill.cat];
                        return (
                          <span key={did} style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700, letterSpacing: '.04em', padding: '1px 4px', borderRadius: 2, background: col.bg, color: col.fg }}>
                            {drill.name.split('—')[0].split('·')[0].trim().slice(0, 9)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI review */}
          <div className="card dark" style={{ marginTop: 14 }}>
            <div className="card-head">
              <div className="card-title" style={{ color: 'var(--accent)' }}>✦ Analyst review of this week</div>
              <span className="mono" style={{ color: 'rgba(255,255,255,.6)' }}>{weekPractices.length} sessions</span>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,.9)' }}>
              {matchFixture
                ? <>You're playing <b style={{ color: 'var(--accent)' }}>{matchFixture.opp}</b> on {DAY_NAMES_SHORT[parseISO(matchDay).dow]} {parseISO(matchDay).d}. Last 4 matches with {weekPractices.length >= 3 ? 'three or more' : 'fewer than three'} sessions in the lead-up: <b>{weekPractices.length >= 3 ? '3W 1L' : '0W 4L'}</b>. Want me to add a session?</>
                : <>No fixture this week — a good window for fitness or recovery. The current plan is {setPieceMins}min set-piece, {totalMins - setPieceMins}min other. Balanced.</>}
            </div>
            <hr className="hr" style={{ background: 'rgba(255,255,255,.1)' }} />
            <div className="row gap-2">
              <button className="btn accent sm">Apply suggestion</button>
              <button className="btn sm" style={{ background: 'rgba(255,255,255,.06)', color: 'var(--paper)', borderColor: 'transparent' }}>Show alternatives</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Custom drill modal ── */}
      {showCustomModal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.48)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setShowCustomModal(false); }}
        >
          <div style={{ background: 'var(--paper)', borderRadius: 14, padding: '28px 28px 24px', width: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,.28)' }}>
            <div className="row between" style={{ marginBottom: 20 }}>
              <div>
                <div className="eyebrow">Practice library</div>
                <h2 style={{ margin: 0, fontSize: 20, fontFamily: 'var(--font-display)' }}>Add custom drill</h2>
              </div>
              <button onClick={() => setShowCustomModal(false)} style={{ background: 'transparent', border: 0, fontSize: 22, cursor: 'pointer', color: 'var(--ink-soft)', lineHeight: 1 }}>×</button>
            </div>

            <div className="col" style={{ gap: 14 }}>
              <div>
                {fieldLabel('DRILL NAME *')}
                <input className="input" style={{ width: '100%' }} placeholder="e.g. Box kick pressure drill" value={customForm.name} onChange={e => setCustomForm(f => ({ ...f, name: e.target.value }))} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div>
                  {fieldLabel('CATEGORY')}
                  <select className="input" style={{ width: '100%' }} value={customForm.cat} onChange={e => setCustomForm(f => ({ ...f, cat: e.target.value }))}>
                    {DRILL_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  {fieldLabel('DURATION (min)')}
                  <input className="input" type="number" min="5" max="120" style={{ width: '100%' }} value={customForm.min} onChange={e => setCustomForm(f => ({ ...f, min: e.target.value }))} />
                </div>
                <div>
                  {fieldLabel('INTENSITY')}
                  <select className="input" style={{ width: '100%' }} value={customForm.intensity} onChange={e => setCustomForm(f => ({ ...f, intensity: e.target.value }))}>
                    {['Low','Med','High'].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  {fieldLabel('GROUP')}
                  <select className="input" style={{ width: '100%' }} value={customForm.group} onChange={e => setCustomForm(f => ({ ...f, group: e.target.value }))}>
                    <option value="all">All</option>
                    <option value="forwards">Forwards</option>
                    <option value="backs">Backs</option>
                  </select>
                </div>
                <div>
                  {fieldLabel('FOCUS CUE')}
                  <input className="input" style={{ width: '100%' }} placeholder="e.g. Ball speed" value={customForm.focus} onChange={e => setCustomForm(f => ({ ...f, focus: e.target.value }))} />
                </div>
              </div>

              <div>
                {fieldLabel('DESCRIPTION')}
                <textarea
                  className="input" rows={3}
                  style={{ width: '100%', resize: 'vertical', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}
                  placeholder="What does this drill work on? Key coaching points…"
                  value={customForm.desc}
                  onChange={e => setCustomForm(f => ({ ...f, desc: e.target.value }))}
                />
              </div>

              <div>
                {fieldLabel('RELATED CALLS', '(comma-separated)')}
                <input className="input" style={{ width: '100%', fontFamily: 'var(--font-mono)' }} placeholder="BUS, BLITZ, JACKLE" value={customForm.calls} onChange={e => setCustomForm(f => ({ ...f, calls: e.target.value }))} />
              </div>

              {customForm.name.trim() && (
                <div style={{ padding: '10px 12px', background: 'var(--paper-2)', borderRadius: 8, border: '1px solid var(--line)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '.08em', color: 'var(--ink-soft)', marginBottom: 6 }}>PREVIEW</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="cat-pill" style={{ background: CAT_COLOR[customForm.cat]?.bg, color: CAT_COLOR[customForm.cat]?.fg }}>{customForm.cat[0]}</span>
                    <span style={{ fontWeight: 600, fontSize: 13, flex: 1 }}>{customForm.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600 }}>{customForm.min}m</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '.06em', padding: '1px 5px', borderRadius: 3, background: 'var(--paper-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)' }}>{groupLabel(customForm.group)}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '.06em', padding: '1px 5px', borderRadius: 3, ...intColors(customForm.intensity) }}>{customForm.intensity}</span>
                    {customForm.focus && <span style={{ fontSize: 10, color: 'var(--ink-soft)', fontStyle: 'italic' }}>· {customForm.focus}</span>}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--accent-2)', fontWeight: 700, letterSpacing: '.06em' }}>CUSTOM</span>
                  </div>
                </div>
              )}

              <div className="row gap-3" style={{ marginTop: 4 }}>
                <button
                  className="btn primary"
                  style={{ flex: 1, justifyContent: 'center', opacity: customForm.name.trim() ? 1 : 0.5 }}
                  onClick={saveCustomDrill}
                >
                  Save drill
                </button>
                <button className="btn" onClick={() => setShowCustomModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { PracticePlanner });
