/* RugbyAI mid-fi — Season Calendar */

const SeasonCalendar = ({ practices, jumpToPractice, addPractice }) => {
  const [view, setView] = React.useState('season'); // season | month | list
  const [monthIdx, setMonthIdx] = React.useState(() => Math.min(new Date().getMonth(), MONTHS.length - 1));
  const [showMatches, setShowMatches] = React.useState(true);
  const [showPractices, setShowPractices] = React.useState(true);

  /* Build a quick map of date → events */
  const eventsByDate = React.useMemo(() => {
    const map = {};
    FIXTURES.forEach(f => {
      const iso = dateStrToISO(f.date) || FIXTURE_DATES[f.date];
      if (!iso) return;
      (map[iso] ||= []).push({ kind: 'match', f });
    });
    practices.forEach(p => {
      (map[p.date] ||= []).push({ kind: 'practice', p });
    });
    return map;
  }, [practices]);

  /* Count per month */
  const monthStats = React.useMemo(() => {
    const stats = MONTHS.map(() => ({ matches: 0, practices: 0 }));
    Object.entries(eventsByDate).forEach(([iso, events]) => {
      const { m } = parseISO(iso);
      if (m >= MONTHS.length) return;
      events.forEach(e => {
        if (e.kind === 'match' && showMatches) stats[m].matches++;
        if (e.kind === 'practice' && showPractices) stats[m].practices++;
      });
    });
    return stats;
  }, [eventsByDate, showMatches, showPractices]);

  const totalMatches = monthStats.reduce((a, m) => a + m.matches, 0);
  const totalPractices = monthStats.reduce((a, m) => a + m.practices, 0);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">{SEASON_YEAR} Season · {MONTHS[0].slice(0,3)} – {MONTHS[MONTHS.length-1].slice(0,3)}</div>
          <h1>Season calendar</h1>
          <div className="meta">{totalMatches} fixtures · {totalPractices} practices · {MONTHS.length} months in view</div>
        </div>
        <div className="row gap-3">
          <button className="btn">Export to .ics</button>
          <button className="btn">Print month</button>
          <button className="btn primary"><span className="ico">+</span> New event</button>
        </div>
      </div>

      <div className="toolbar">
        <div className="view-toggle">
          <button className={view === 'season' ? 'active' : ''} onClick={() => setView('season')}>Season grid</button>
          <button className={view === 'month'  ? 'active' : ''} onClick={() => setView('month')}>Month</button>
          <button className={view === 'list'   ? 'active' : ''} onClick={() => setView('list')}>List</button>
        </div>
        <div style={{ flex: 1 }} />
        <button
          className={`chip ${showMatches ? 'active' : ''}`}
          onClick={() => setShowMatches(v => !v)}
        >
          <span className="dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
          Matches <span className="count">{totalMatches}</span>
        </button>
        <button
          className={`chip ${showPractices ? 'active' : ''}`}
          onClick={() => setShowPractices(v => !v)}
        >
          <span className="dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ink)' }} />
          Practices <span className="count">{totalPractices}</span>
        </button>
        {view === 'month' && (
          <div className="row gap-2">
            <button className="btn sm" onClick={() => setMonthIdx(m => Math.max(0, m - 1))}>←</button>
            <span className="mono" style={{ minWidth: 90, textAlign: 'center' }}>{MONTHS[monthIdx]}</span>
            <button className="btn sm" onClick={() => setMonthIdx(m => Math.min(MONTHS.length - 1, m + 1))}>→</button>
          </div>
        )}
      </div>

      {view === 'season' && (
        <SeasonGridView
          eventsByDate={eventsByDate}
          showMatches={showMatches}
          showPractices={showPractices}
          monthStats={monthStats}
          onMonthClick={(m) => { setMonthIdx(m); setView('month'); }}
        />
      )}
      {view === 'month' && (
        <MonthView
          monthIdx={monthIdx}
          eventsByDate={eventsByDate}
          showMatches={showMatches}
          showPractices={showPractices}
          jumpToPractice={jumpToPractice}
          addPractice={addPractice}
        />
      )}
      {view === 'list' && (
        <ListView
          eventsByDate={eventsByDate}
          showMatches={showMatches}
          showPractices={showPractices}
        />
      )}

      {/* AI nudge */}
      <div className="ai-card" style={{ marginTop: 18 }}>
        <div className="ai-glyph">AI</div>
        <div className="body">
          You have <em>1 practice</em> queued for the week before UCT (Jun 14). Last 4 wins involved 3 sessions in the lead-up. Want me to add a Wednesday video review?
        </div>
        <button className="btn accent">Add Wednesday session</button>
        <button className="btn">Show data</button>
      </div>
    </div>
  );
};

/* ============================================================
   Season grid view — 8 month cards in a 4×2 (or 3×3) grid
   ============================================================ */
const SeasonGridView = ({ eventsByDate, showMatches, showPractices, monthStats, onMonthClick }) => {
  return (
    <div className="cal-season">
      {MONTHS.map((monthName, idx) => (
        <div key={idx} className="cal-month" onClick={() => onMonthClick(idx)}>
          <div className="cal-month-head">
            <h3>{monthName}</h3>
            <div className="cal-month-meta">
              {showMatches && monthStats[idx].matches > 0 && (
                <span style={{ background: 'var(--accent)', color: 'var(--ink)', padding: '1px 6px', borderRadius: 3, fontWeight: 600 }}>
                  {monthStats[idx].matches}M
                </span>
              )}
              {showPractices && monthStats[idx].practices > 0 && (
                <span style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '1px 6px', borderRadius: 3, fontWeight: 600 }}>
                  {monthStats[idx].practices}P
                </span>
              )}
            </div>
          </div>
          <div className="cal-dow">
            {DAY_NAMES_SHORT.map(d => <span key={d}>{d[0]}</span>)}
          </div>
          <MiniMonth
            year={SEASON_YEAR}
            month={idx}
            eventsByDate={eventsByDate}
            showMatches={showMatches}
            showPractices={showPractices}
          />
        </div>
      ))}
    </div>
  );
};

const MiniMonth = ({ year, month, eventsByDate, showMatches, showPractices }) => {
  const days = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push({ empty: true });
  for (let d = 1; d <= days; d++) {
    const iso = toISO(year, month, d);
    const events = eventsByDate[iso] || [];
    const match = showMatches ? events.find(e => e.kind === 'match') : null;
    const practice = showPractices ? events.find(e => e.kind === 'practice') : null;
    cells.push({
      d, iso,
      match,
      practice,
      today: iso === TODAY_ISO,
      dow: (firstDay + d - 1) % 7,
    });
  }
  while (cells.length < 35) cells.push({ empty: true });
  while (cells.length < 42 && cells.length % 7 !== 0) cells.push({ empty: true });

  return (
    <div className="cal-grid">
      {cells.map((c, i) => {
        if (c.empty) return <div key={i} className="cal-cell empty-month" />;
        const weekend = c.dow === 0 || c.dow === 6;
        const isHomeMatch = c.match && c.match.f.venue === 'HOME';
        const isAwayMatch = c.match && c.match.f.venue === 'AWAY';
        return (
          <div
            key={i}
            className={[
              'cal-cell',
              isHomeMatch ? 'has-match-home' : '',
              isAwayMatch ? 'has-match-away' : '',
              c.practice && !c.match ? 'has-practice' : '',
              c.today ? 'today' : '',
              weekend && !c.match ? 'weekend' : '',
            ].filter(Boolean).join(' ')}
            title={[
              c.match && `${c.match.f.opp} (${c.match.f.venue})`,
              c.practice && c.practice.p.focus,
            ].filter(Boolean).join(' · ') || c.iso}
          >
            <span className="cal-cell-num">{c.d}</span>
            {(c.match || c.practice) && (
              <div className="cal-cell-tags">
                {c.match && <span className="dot-tag" style={{ background: 'var(--ink)' }} />}
                {c.practice && !c.match && <span className="dot-tag" style={{ background: 'var(--accent-2)' }} />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ============================================================
   Month view — single big calendar
   ============================================================ */
const MonthView = ({ monthIdx, eventsByDate, showMatches, showPractices, jumpToPractice, addPractice }) => {
  const days = daysInMonth(SEASON_YEAR, monthIdx);
  const firstDay = firstDayOfMonth(SEASON_YEAR, monthIdx);

  /* Inline "add practice" state */
  const [addingDay, setAddingDay] = React.useState(null); // iso
  const [addFocus, setAddFocus]   = React.useState('');
  const [addStart, setAddStart]   = React.useState('18:30');
  const [hoveredDay, setHoveredDay] = React.useState(null);

  const openAdd = (iso) => {
    setAddingDay(iso);
    setAddFocus('');
    setAddStart('18:30');
  };
  const cancelAdd = (e) => { e && e.stopPropagation(); setAddingDay(null); };
  const confirmAdd = (iso, e) => {
    e && e.stopPropagation();
    if (addPractice) addPractice(iso, addFocus.trim() || 'Practice session', addStart);
    setAddingDay(null);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push({ empty: true });
  for (let d = 1; d <= days; d++) {
    const iso = toISO(SEASON_YEAR, monthIdx, d);
    const events = eventsByDate[iso] || [];
    cells.push({
      d, iso, events,
      today: iso === TODAY_ISO,
      dow: (firstDay + d - 1) % 7,
    });
  }
  while (cells.length % 7 !== 0) cells.push({ empty: true });

  return (
    <div className="cal-month-big">
      <div className="cal-month-big-head">
        <h2>{MONTHS[monthIdx]} {SEASON_YEAR}</h2>
        <span className="mono">Sunday-start week</span>
      </div>
      <div className="cal-dow" style={{ fontSize: 11, paddingBottom: 6 }}>
        {DAY_NAMES_SHORT.map(d => <span key={d} style={{ textAlign: 'left', padding: '0 8px' }}>{d}</span>)}
      </div>
      <div className="cal-grid-big">
        {cells.map((c, i) => {
          if (c.empty) return <div key={i} className="cal-cell-big empty-month" />;
          const match = showMatches ? c.events.find(e => e.kind === 'match') : null;
          const practice = showPractices ? c.events.find(e => e.kind === 'practice') : null;
          const weekend = c.dow === 0 || c.dow === 6;
          const isAdding = addingDay === c.iso;
          const canAdd = !match && !practice && addPractice;

          return (
            <div
              key={i}
              className={[
                'cal-cell-big',
                match ? 'has-match' : '',
                weekend && !match ? 'weekend' : '',
                c.today ? 'today' : '',
                isAdding ? 'adding-practice' : '',
              ].filter(Boolean).join(' ')}
              onMouseEnter={() => canAdd && setHoveredDay(c.iso)}
              onMouseLeave={() => setHoveredDay(null)}
              style={isAdding ? { outline: '2px solid var(--primary)', outlineOffset: -2, background: 'var(--primary-soft)' } : undefined}
            >
              <div className="row between">
                <span className="num">{c.d}</span>
                {canAdd && hoveredDay === c.iso && !isAdding ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); openAdd(c.iso); }}
                    title="Add practice session"
                    style={{
                      background: 'var(--primary)', color: '#fff', border: 'none',
                      borderRadius: 4, width: 18, height: 18, fontSize: 13, lineHeight: '18px',
                      cursor: 'pointer', padding: 0, fontWeight: 700, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >+</button>
                ) : (
                  <span className="day-label">{DAY_NAMES_SHORT[c.dow]}</span>
                )}
              </div>

              {match && (
                <div className="cal-event match">
                  <span>{match.f.venue === 'HOME' ? '🏟' : '✈'}</span>
                  <span>vs {match.f.opp}</span>
                </div>
              )}
              {practice && (
                <div
                  className="cal-event practice"
                  onClick={() => jumpToPractice && jumpToPractice(c.iso)}
                  style={{ cursor: 'pointer' }}
                  title="Open in Practice Planner"
                >
                  <span>•</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
                    {practice.p.focus}
                  </span>
                </div>
              )}

              {/* ── Inline add-practice form ── */}
              {isAdding && (
                <div
                  style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}
                  onClick={e => e.stopPropagation()}
                >
                  <input
                    autoFocus
                    placeholder="Session name…"
                    value={addFocus}
                    onChange={e => setAddFocus(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') confirmAdd(c.iso, e);
                      if (e.key === 'Escape') cancelAdd(e);
                    }}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '3px 6px', borderRadius: 4,
                      border: '1px solid var(--primary)', outline: 'none',
                      fontSize: 11, fontFamily: 'inherit', fontWeight: 600,
                      background: '#fff',
                    }}
                  />
                  <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    <input
                      type="time"
                      value={addStart}
                      onChange={e => setAddStart(e.target.value)}
                      style={{
                        flex: 1, padding: '2px 4px', borderRadius: 4,
                        border: '1px solid var(--line)', outline: 'none',
                        fontSize: 10, fontFamily: 'var(--font-mono)',
                        background: '#fff',
                      }}
                    />
                    <button
                      onClick={e => confirmAdd(c.iso, e)}
                      style={{
                        background: 'var(--primary)', color: '#fff',
                        border: 'none', borderRadius: 4,
                        padding: '2px 7px', fontSize: 10, fontWeight: 700,
                        cursor: 'pointer', whiteSpace: 'nowrap',
                      }}
                    >Add</button>
                    <button
                      onClick={cancelAdd}
                      style={{
                        background: 'transparent', color: 'var(--muted)',
                        border: '1px solid var(--line)', borderRadius: 4,
                        padding: '2px 5px', fontSize: 10, cursor: 'pointer',
                      }}
                    >×</button>
                  </div>
                </div>
              )}

              {c.today && <Badge variant="ink" style={{ position: 'absolute', bottom: 6, right: 6 }}>today</Badge>}
            </div>
          );
        })}
      </div>
      <div className="row between" style={{ marginTop: 14 }}>
        <div className="row gap-3">
          <Badge variant="accent"><span className="dot" />Match day</Badge>
          <Badge variant="outline"><span className="dot" style={{ background: 'var(--ink)' }} />Practice</Badge>
          <Badge><span className="dot" style={{ background: 'var(--primary)' }} />Today</Badge>
        </div>
        <span className="muted" style={{ fontSize: 12 }}>Click a practice to open · hover an empty day to add</span>
      </div>
    </div>
  );
};

/* ============================================================
   List view — chronological events
   ============================================================ */
const ListView = ({ eventsByDate, showMatches, showPractices }) => {
  const all = [];
  Object.entries(eventsByDate).forEach(([iso, events]) => {
    events.forEach(e => {
      if (e.kind === 'match' && !showMatches) return;
      if (e.kind === 'practice' && !showPractices) return;
      all.push({ iso, ...e });
    });
  });
  all.sort((a, b) => a.iso.localeCompare(b.iso));

  let lastMonth = null;
  return (
    <div>
      {all.map((e, i) => {
        const { m, d } = parseISO(e.iso);
        const showMonthHeader = m !== lastMonth;
        lastMonth = m;
        const isMatch = e.kind === 'match';
        return (
          <React.Fragment key={i}>
            {showMonthHeader && (
              <div className="mono" style={{ marginTop: i === 0 ? 0 : 18, marginBottom: 8 }}>
                {MONTHS[m]}
              </div>
            )}
            <div
              className={[
                'cal-list-item',
                isMatch ? 'match' : 'practice',
                e.iso === TODAY_ISO ? 'today' : '',
              ].filter(Boolean).join(' ')}
            >
              <div className="date-block">
                <div className="day">{d}</div>
                <div className="mo">{MONTH_NAMES_SHORT[m]}</div>
              </div>
              <div>
                <Badge variant={isMatch ? 'ink' : 'outline'}>{isMatch ? 'MATCH' : 'PRACTICE'}</Badge>
                {isMatch && (
                  <Badge variant={e.f.venue === 'HOME' ? 'accent' : 'outline'} style={{ marginLeft: 4 }}>
                    {e.f.venue}
                  </Badge>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>
                  {isMatch
                    ? <>vs {e.f.opp}</>
                    : e.p.focus}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                  {isMatch
                    ? `${e.f.type} · ${e.f ? 'upcoming' : `${e.f.f}–${e.f.a} ${e.f.result === 'W' ? 'win' : 'loss'}`}`
                    : `${e.p.start}–${e.p.end} · ${e.p.drills.length} drills`}
                </div>
              </div>
              <span className="mono">{isMatch ? '15:00 KO' : `${e.p.start}–${e.p.end}`}</span>
              <span className="row gap-2" style={{ justifyContent: 'flex-end' }}>
                <button className="btn ghost sm">⋯</button>
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

Object.assign(window, { SeasonCalendar });
