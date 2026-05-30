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

/* ---- Runsheet — group row colours ---- */
const GROUP_COLOR_RS = {
  'Individual': { bg: 'rgba(107,114,128,.07)', fg: '#4b5563',  border: '#9ca3af' },
  'Squad':      { bg: 'rgba(24,43,84,.08)',    fg: '#182b54',  border: '#3b82f6' },
  'Forwards':   { bg: 'rgba(201,148,30,.13)',  fg: '#92650a',  border: '#c9941e' },
  'Backs':      { bg: 'rgba(22,163,74,.10)',   fg: '#15803d',  border: '#22c55e' },
};

const RUNSHEET_COACH_OPT = ['', 'Head Coach', 'Fwds Coach', 'Backs Coach', 'Asst Coach', 'Captain', 'Team', 'S&C Coach', 'Physio/Doctor'];

const RUNSHEET_TEMPLATES = {
  away: {
    label: 'Away game',
    headerColor: '#c9941e',
    note: 'KO 16:00 · Sat 14 Jun',
    items: [
      { id: 'r1',  time: '14:00', alloc: '',    group: 'Individual', activity: 'Arrive at venue',                  lead: '',              assist: '' },
      { id: 'r2',  time: '14:30', alloc: '45m', group: 'Squad',      activity: 'Strapping supplied',               lead: 'Physio/Doctor', assist: '' },
      { id: 'r3',  time: '15:15', alloc: '5m',  group: 'Squad',      activity: 'Coaches chat & squad split',       lead: 'Head Coach',    assist: '' },
      { id: 'r4',  time: '15:20', alloc: '5m',  group: 'Squad',      activity: 'Passing — short & medium',         lead: 'Head Coach',    assist: '' },
      { id: 'r5',  time: '',      alloc: '5m',  group: 'Squad',      activity: 'Breakdown',                        lead: 'Head Coach',    assist: '' },
      { id: 'r6',  time: '15:30', alloc: '5m',  group: 'Squad',      activity: 'Defence — blitz lines',            lead: 'Head Coach',    assist: '' },
      { id: 'r7',  time: '15:35', alloc: '20m', group: 'Forwards',   activity: 'Lineouts and scrums',              lead: 'Fwds Coach',    assist: '' },
      { id: 'r8',  time: '',      alloc: '20m', group: 'Backs',      activity: 'Plays — shapes (Bus / Plus)',      lead: 'Backs Coach',   assist: '' },
      { id: 'r9',  time: '15:55', alloc: '',    group: 'Squad',      activity: 'Into change rooms — jerseys on',   lead: 'Captain',       assist: '' },
      { id: 'r10', time: '16:00', alloc: '',    group: 'Squad',      activity: 'Game time',                        lead: 'Team',          assist: '' },
    ],
  },
  home: {
    label: 'Home game',
    headerColor: '#182b54',
    note: 'KO 15:00 · Sat 14 Jun',
    items: [
      { id: 'r1',  time: '12:00', alloc: '',    group: 'Individual', activity: 'Arrive at home ground',            lead: '',              assist: '' },
      { id: 'r2',  time: '12:30', alloc: '30m', group: 'Squad',      activity: 'Strapping supplied',               lead: 'Physio/Doctor', assist: '' },
      { id: 'r3',  time: '13:00', alloc: '10m', group: 'Squad',      activity: 'Pre-match team talk',              lead: 'Head Coach',    assist: '' },
      { id: 'r4',  time: '13:10', alloc: '10m', group: 'Squad',      activity: 'Warm-up — movement grids',         lead: 'Head Coach',    assist: '' },
      { id: 'r5',  time: '13:20', alloc: '10m', group: 'Forwards',   activity: 'Lineout walk-through',             lead: 'Fwds Coach',    assist: '' },
      { id: 'r6',  time: '',      alloc: '10m', group: 'Backs',      activity: "Back shapes — captain's run",      lead: 'Backs Coach',   assist: '' },
      { id: 'r7',  time: '13:30', alloc: '10m', group: 'Squad',      activity: 'Final scrimmage — no contact',     lead: 'Head Coach',    assist: '' },
      { id: 'r8',  time: '13:40', alloc: '',    group: 'Squad',      activity: 'Into sheds — jerseys on',          lead: 'Captain',       assist: '' },
      { id: 'r9',  time: '14:50', alloc: '10m', group: 'Squad',      activity: 'Pre-match warm-up on field',       lead: 'Head Coach',    assist: '' },
      { id: 'r10', time: '15:00', alloc: '',    group: 'Squad',      activity: 'Kick-off',                         lead: 'Team',          assist: '' },
    ],
  },
  captains_run: {
    label: "Captain's run",
    headerColor: '#2e7a45',
    note: 'Day before match · Fri 13 Jun',
    items: [
      { id: 'r1', time: '10:00', alloc: '',    group: 'Squad',    activity: 'Arrive — light activation',       lead: '',            assist: '' },
      { id: 'r2', time: '10:10', alloc: '10m', group: 'Squad',    activity: 'Passing & handling',              lead: 'Head Coach',  assist: '' },
      { id: 'r3', time: '10:20', alloc: '15m', group: 'Forwards', activity: 'Lineout calls — walk-through',    lead: 'Fwds Coach',  assist: '' },
      { id: 'r4', time: '',      alloc: '15m', group: 'Backs',    activity: 'Set plays — half speed',          lead: 'Backs Coach', assist: '' },
      { id: 'r5', time: '10:35', alloc: '10m', group: 'Squad',    activity: '5-phase team run — no contact',   lead: 'Head Coach',  assist: '' },
      { id: 'r6', time: '10:45', alloc: '',    group: 'Squad',    activity: "Captain's address and dismiss",   lead: 'Captain',     assist: '' },
    ],
  },
};

/* ---- Runsheet view ---- */
const RunsheetView = ({ next }) => {
  const [tplKey, setTplKey] = React.useState('away');
  const [items, setItems]   = React.useState(() => RUNSHEET_TEMPLATES.away.items.map(i => ({ ...i })));
  const [editCell, setEditCell] = React.useState(null); // { id, field }

  const applyTemplate = (key) => {
    setTplKey(key);
    setItems(RUNSHEET_TEMPLATES[key].items.map(i => ({ ...i })));
    setEditCell(null);
  };
  const updateItem = (id, field, value) =>
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  const addRow    = () => setItems(prev => [...prev, { id: 'r_' + Date.now(), time: '', alloc: '', group: 'Squad', activity: '', lead: '', assist: '' }]);
  const removeRow = (id) => setItems(prev => prev.filter(item => item.id !== id));

  const isEd    = (id, f) => editCell?.id === id && editCell?.field === f;
  const startEd = (id, f) => setEditCell({ id, field: f });
  const stopEd  = () => setEditCell(null);

  const iInput = (extra = {}) => ({
    padding: '2px 5px', borderRadius: 4,
    border: '1px solid var(--primary)', outline: 'none',
    fontSize: 11, fontFamily: 'inherit', background: 'var(--chalk)',
    boxShadow: '0 0 0 2px rgba(24,43,84,.08)', ...extra,
  });
  const EH = ({ children, onClick, mono, style: s = {} }) => (
    <span onClick={onClick}
      style={{ cursor: 'text', display: 'inline-block', borderRadius: 3, padding: '1px 3px',
        fontFamily: mono ? 'var(--font-mono)' : 'inherit', transition: 'background .1s', ...s }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--paper-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >{children}</span>
  );

  const tpl = RUNSHEET_TEMPLATES[tplKey];

  return (
    <div>
      {/* Template strip */}
      <div className="toolbar" style={{ marginBottom: 14 }}>
        <span className="mono" style={{ fontSize: 11, marginRight: 4 }}>Template</span>
        {Object.entries(RUNSHEET_TEMPLATES).map(([key, t]) => (
          <button key={key} className={`chip ${tplKey === key ? 'active' : ''}`} onClick={() => applyTemplate(key)}>{t.label}</button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="btn sm">↓ Export PDF</button>
        <button className="btn sm">✉ Send to squad</button>
        <button className="btn sm primary">✓ Publish</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Coloured header */}
        <div style={{
          background: tpl.headerColor, color: '#fff',
          padding: '11px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontWeight: 800, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase',
        }}>
          <span>{tpl.label.toUpperCase()} · {next ? `vs ${next.opp}` : ''}</span>
          <span style={{ fontWeight: 500, fontSize: 11, opacity: .85, textTransform: 'none', letterSpacing: 0 }}>{tpl.note}</span>
        </div>

        <table className="table" style={{ margin: 0, borderRadius: 0 }}>
          <thead style={{ background: 'rgba(24,43,84,.06)' }}>
            <tr>
              <th style={{ width: 68,  color: 'var(--primary)', fontWeight: 800 }}>Time</th>
              <th style={{ width: 62,  color: 'var(--primary)', fontWeight: 800 }}>Alloc.</th>
              <th style={{ width: 116, color: 'var(--primary)', fontWeight: 800 }}>Unit / Group</th>
              <th style={{              color: 'var(--primary)', fontWeight: 800 }}>Work on / Challenge</th>
              <th style={{ width: 118, color: 'var(--primary)', fontWeight: 800 }}>Lead</th>
              <th style={{ width: 118, color: 'var(--primary)', fontWeight: 800 }}>Assist</th>
              <th style={{ width: 24 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const g = GROUP_COLOR_RS[item.group] || GROUP_COLOR_RS['Squad'];
              return (
                <tr key={item.id} style={{ background: g.bg }}>
                  {/* TIME */}
                  <td style={{ borderLeft: '3px solid ' + g.border, paddingLeft: 8 }}>
                    {isEd(item.id,'time') ? (
                      <input type="time" autoFocus defaultValue={item.time}
                        style={{ ...iInput(), width: 76, fontFamily: 'var(--font-mono)', fontWeight: 700 }}
                        onBlur={e => { updateItem(item.id,'time',e.target.value); stopEd(); }}
                        onKeyDown={e => { if(e.key==='Enter') e.target.blur(); if(e.key==='Escape') stopEd(); }}
                      />
                    ) : (
                      <EH mono onClick={() => startEd(item.id,'time')} style={{ fontWeight: 700, fontSize: 13, color: item.time ? 'var(--ink)' : 'var(--muted)' }}>
                        {item.time || '—'}
                      </EH>
                    )}
                  </td>
                  {/* ALLOC */}
                  <td>
                    {isEd(item.id,'alloc') ? (
                      <input autoFocus defaultValue={item.alloc} placeholder="e.g. 15m"
                        style={{ ...iInput(), width: 52, fontFamily: 'var(--font-mono)' }}
                        onBlur={e => { updateItem(item.id,'alloc',e.target.value); stopEd(); }}
                        onKeyDown={e => { if(e.key==='Enter') e.target.blur(); if(e.key==='Escape') stopEd(); }}
                      />
                    ) : (
                      <EH mono onClick={() => startEd(item.id,'alloc')} style={{ fontSize: 12, fontWeight: 600, color: item.alloc ? 'var(--ink-soft)' : 'var(--muted)' }}>
                        {item.alloc || '—'}
                      </EH>
                    )}
                  </td>
                  {/* GROUP */}
                  <td>
                    {isEd(item.id,'group') ? (
                      <select autoFocus defaultValue={item.group}
                        style={{ ...iInput(), fontSize: 11 }}
                        onChange={e => { updateItem(item.id,'group',e.target.value); stopEd(); }}
                        onBlur={stopEd}
                      >
                        {['Individual','Squad','Forwards','Backs'].map(g => <option key={g}>{g}</option>)}
                      </select>
                    ) : (
                      <span onClick={() => startEd(item.id,'group')} style={{
                        display: 'inline-block', background: g.bg, color: g.fg,
                        border: '1px solid ' + g.border, borderRadius: 4,
                        padding: '2px 8px', fontSize: 10, fontWeight: 700, cursor: 'pointer', letterSpacing: '.03em',
                      }}>{item.group}</span>
                    )}
                  </td>
                  {/* ACTIVITY */}
                  <td>
                    {isEd(item.id,'activity') ? (
                      <input autoFocus defaultValue={item.activity} placeholder="Describe this block…"
                        style={{ ...iInput(), width: '100%', fontWeight: 700, fontSize: 13 }}
                        onBlur={e => { updateItem(item.id,'activity',e.target.value.trim()||item.activity); stopEd(); }}
                        onKeyDown={e => { if(e.key==='Enter') e.target.blur(); if(e.key==='Escape') stopEd(); }}
                      />
                    ) : (
                      <EH onClick={() => startEd(item.id,'activity')} style={{ fontWeight: 700, fontSize: 13 }}>
                        {item.activity || <span style={{ fontWeight: 400, color: 'var(--muted)', fontStyle: 'italic' }}>+ activity</span>}
                      </EH>
                    )}
                  </td>
                  {/* LEAD */}
                  <td>
                    {isEd(item.id,'lead') ? (
                      <select autoFocus defaultValue={item.lead}
                        style={{ ...iInput(), fontSize: 11, fontFamily: 'var(--font-mono)', maxWidth: 108 }}
                        onChange={e => { updateItem(item.id,'lead',e.target.value); stopEd(); }}
                        onBlur={stopEd}
                      >
                        {RUNSHEET_COACH_OPT.map(c => <option key={c} value={c}>{c||'—'}</option>)}
                      </select>
                    ) : (
                      <EH mono onClick={() => startEd(item.id,'lead')} style={{ fontSize: 11, color: item.lead ? 'var(--ink-soft)' : 'var(--muted)' }}>
                        {item.lead || '—'}
                      </EH>
                    )}
                  </td>
                  {/* ASSIST */}
                  <td>
                    {isEd(item.id,'assist') ? (
                      <select autoFocus defaultValue={item.assist}
                        style={{ ...iInput(), fontSize: 11, fontFamily: 'var(--font-mono)', maxWidth: 108 }}
                        onChange={e => { updateItem(item.id,'assist',e.target.value); stopEd(); }}
                        onBlur={stopEd}
                      >
                        {RUNSHEET_COACH_OPT.map(c => <option key={c} value={c}>{c||'—'}</option>)}
                      </select>
                    ) : (
                      <EH mono onClick={() => startEd(item.id,'assist')} style={{ fontSize: 11, color: item.assist ? 'var(--ink-soft)' : 'var(--muted)' }}>
                        {item.assist || '—'}
                      </EH>
                    )}
                  </td>
                  {/* REMOVE */}
                  <td>
                    <button onClick={() => removeRow(item.id)} style={{ background:'transparent',border:0,color:'var(--muted)',cursor:'pointer',fontSize:13,padding:0,lineHeight:1 }}>×</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding: '8px 14px', borderTop: '1px dashed var(--line)' }}>
          <button className="btn sm" onClick={addRow}>+ Add row</button>
        </div>
      </div>

      <div className="ai-card" style={{ marginTop: 14 }}>
        <div className="ai-glyph">AI</div>
        <div className="body">
          Last 3 away wins included a <em>lineout walk-through</em> before jerseys on — current runsheet skips this. Add at 15:48?
        </div>
        <button className="btn accent">Add to runsheet</button>
        <button className="btn">Dismiss</button>
      </div>
    </div>
  );
};

/* ---- Match Day quick-links strip ---- */
const MatchDayQuickLinks = ({ onNav }) => (
  <div style={{
    position: 'sticky', bottom: 0, zIndex: 10,
    background: 'var(--paper)',
    borderTop: '2px solid var(--line)',
    padding: '10px 18px',
    display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
  }}>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: '.08em', marginRight: 6, whiteSpace: 'nowrap' }}>
      QUICK LINKS
    </span>
    {[
      { id: 'opponent',  icon: '◉', label: 'Opp Intel',   stat: '5 of 7 losses', sc: 'var(--warn)' },
      { id: 'tactical',  icon: '◈', label: 'Tactical',    stat: 'Win prob 29%',  sc: 'var(--warn)' },
      { id: 'setpiece',  icon: '⬆', label: 'Set Piece',   stat: 'LO win 73%',    sc: 'var(--ok)'   },
      { id: 'kicking',   icon: '◎', label: 'Kicking',     stat: 'Territory 38%', sc: 'var(--muted)' },
      { id: 'workload',  icon: '◑', label: 'Workload',    stat: '3 amber flags', sc: '#f59e0b'      },
      { id: 'breakdown', icon: '⊕', label: 'Breakdown',   stat: '34% win rate',  sc: 'var(--muted)' },
    ].map(link => (
      <button
        key={link.id}
        onClick={() => onNav && onNav(link.id)}
        style={{
          background: 'var(--chalk)', border: '1px solid var(--line)', borderRadius: 8,
          padding: '6px 12px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 7,
          fontFamily: 'inherit', transition: 'border-color .15s, background .15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-soft)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)';    e.currentTarget.style.background = 'var(--chalk)'; }}
      >
        <span style={{ fontSize: 15, color: 'var(--primary)' }}>{link.icon}</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>{link.label}</span>
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: link.sc, lineHeight: 1.2 }}>{link.stat}</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 2 }}>→</span>
      </button>
    ))}
  </div>
);

/* ---- Add Fixture modal (inline, no external dependencies) ---- */
const _md_inp = { width:'100%', padding:'8px 10px', border:'1px solid var(--border)', borderRadius:8, fontSize:14, fontFamily:'inherit', boxSizing:'border-box', background:'#fff' };

const AddFixtureModal = ({ onClose, onSaved }) => {
  const [tab, setTab] = React.useState('manual'); // manual | csv | paste
  const [rows, setRows] = React.useState([{ type:'League', opp:'', venue:'HOME', date:'', kickoff:'15:00' }]);
  const [csv, setCsv] = React.useState('');
  const [paste, setPaste] = React.useState('');
  const [saved, setSaved] = React.useState(false);

  const addRow = () => setRows(r => [...r, { type:'League', opp:'', venue:'HOME', date:'', kickoff:'15:00' }]);
  const upd = (i, k, v) => setRows(r => r.map((row,idx) => idx===i ? {...row,[k]:v} : row));

  const parseAndSave = (fixtures) => {
    const valid = fixtures.filter(f => f.opp && f.date);
    if (!valid.length) { alert('No valid fixtures found.'); return; }
    valid.forEach(f => FIXTURES.push(f));
    window.FIXTURES = FIXTURES;
    try {
      const raw = localStorage.getItem('rugbyai_team_v2');
      if (raw) { const d = JSON.parse(raw); d.fixtures = FIXTURES; localStorage.setItem('rugbyai_team_v2', JSON.stringify(d)); }
    } catch {}
    setSaved(true);
    setTimeout(() => { onSaved(); onClose(); }, 1200);
  };

  const saveManual = () => parseAndSave(rows);
  const saveCSV = () => {
    const lines = csv.trim().split('\n').filter(Boolean);
    const fixtures = lines.map(line => {
      const [opp='', venue='HOME', date='', kickoff='15:00', type='League'] = line.split(',').map(s=>s.trim().replace(/^"|"$/g,''));
      return { type, opp, venue: /away/i.test(venue)?'AWAY':'HOME', date, kickoff };
    });
    parseAndSave(fixtures);
  };
  const savePaste = () => {
    // Simple heuristic: find lines with a date-like pattern
    const lines = paste.trim().split('\n').filter(Boolean);
    const fixtures = lines.map(line => {
      const dateMatch = line.match(/\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\b/i);
      const venueMatch = /home/i.test(line) ? 'HOME' : /away/i.test(line) ? 'AWAY' : 'HOME';
      const opp = line.replace(dateMatch?.[0]:'', '').replace(/home|away|\d{1,2}:\d{2}/gi, '').replace(/[–\-|·vs\.]/g,' ').trim().replace(/\s+/g,' ');
      return { type:'League', opp: opp||'Unknown', venue: venueMatch, date: dateMatch?.[0]||line.slice(0,10), kickoff:'15:00' };
    }).filter(f => f.date);
    parseAndSave(fixtures);
  };

  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.45)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'var(--paper)',borderRadius:14,width:'100%',maxWidth:580,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,.3)' }}>
        <div style={{ padding:'22px 24px 0',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div style={{ fontFamily:'var(--font-display)',fontSize:20,fontWeight:700 }}>Add fixtures</div>
          <button onClick={onClose} style={{ background:'none',border:'none',fontSize:22,cursor:'pointer',color:'var(--muted)' }}>×</button>
        </div>

        {saved ? (
          <div style={{ padding:'32px 24px',textAlign:'center' }}>
            <div style={{ fontSize:40,marginBottom:8 }}>✓</div>
            <div style={{ fontFamily:'var(--font-display)',fontSize:18,fontWeight:700 }}>Fixtures added!</div>
          </div>
        ) : (
          <div style={{ padding:'16px 24px 24px' }}>
            {/* Tab bar */}
            <div style={{ display:'flex',gap:0,background:'var(--sand)',borderRadius:10,padding:3,marginBottom:16 }}>
              {[['manual','✎ Enter manually'],['csv','CSV upload'],['paste','Paste text']].map(([t,l]) => (
                <button key={t} onClick={()=>setTab(t)} style={{ flex:1,border:'none',borderRadius:8,padding:'7px 0',fontSize:13,fontWeight:600,cursor:'pointer',background:tab===t?'#fff':'transparent',boxShadow:tab===t?'0 1px 4px rgba(0,0,0,.12)':'none',color:tab===t?'var(--primary)':'var(--ink-soft)',transition:'.15s' }}>{l}</button>
              ))}
            </div>

            {tab === 'manual' && (
              <div>
                <div style={{ fontSize:12,color:'var(--muted)',marginBottom:10 }}>Enter each fixture. CSV format accepted on import.</div>
                {rows.map((row,i) => (
                  <div key={i} style={{ display:'grid',gridTemplateColumns:'1fr 80px 100px 80px',gap:8,marginBottom:8,alignItems:'center' }}>
                    <input style={_md_inp} placeholder="Opposition team" value={row.opp} onChange={e=>upd(i,'opp',e.target.value)} />
                    <select style={_md_inp} value={row.venue} onChange={e=>upd(i,'venue',e.target.value)}><option>HOME</option><option>AWAY</option></select>
                    <input style={_md_inp} placeholder="7 Jun" value={row.date} onChange={e=>upd(i,'date',e.target.value)} />
                    <input style={{..._md_inp,fontFamily:'var(--font-mono)'}} placeholder="15:00" value={row.kickoff} onChange={e=>upd(i,'kickoff',e.target.value)} />
                  </div>
                ))}
                <button className="btn sm" onClick={addRow} style={{ marginBottom:14 }}>+ Add row</button>
                <div style={{ display:'flex',gap:10 }}>
                  <button className="btn primary" onClick={saveManual} disabled={!rows.some(r=>r.opp&&r.date)} style={{ flex:1 }}>Save {rows.filter(r=>r.opp&&r.date).length} fixture(s)</button>
                  <button className="btn" onClick={onClose}>Cancel</button>
                </div>
              </div>
            )}

            {tab === 'csv' && (
              <div>
                <div style={{ fontSize:12,color:'var(--muted)',marginBottom:8 }}>CSV columns: <code>Opposition, Venue (HOME/AWAY), Date (7 Jun), Kickoff (15:00), Type</code></div>
                <textarea style={{ ..._md_inp, resize:'vertical', minHeight:160, fontFamily:'var(--font-mono)', fontSize:12 }}
                  placeholder={'Stellenbosch Stormers, HOME, 7 Jun, 15:00, League\nUCT, AWAY, 14 Jun, 15:00, League'}
                  value={csv} onChange={e=>setCsv(e.target.value)} />
                <div style={{ display:'flex',gap:10,marginTop:12 }}>
                  <button className="btn primary" onClick={saveCSV} disabled={!csv.trim()} style={{ flex:1 }}>Import CSV</button>
                  <button className="btn" onClick={onClose}>Cancel</button>
                </div>
              </div>
            )}

            {tab === 'paste' && (
              <div>
                <div style={{ fontSize:12,color:'var(--muted)',marginBottom:8 }}>Paste your fixture list from any document, spreadsheet, or message. The AI will extract dates and teams automatically.</div>
                <textarea style={{ ..._md_inp, resize:'vertical', minHeight:160, fontSize:13 }}
                  placeholder={'e.g.\n7 Jun vs Stellenbosch Stormers – Home – 3pm\n14 Jun UCT (Away)\nJun 21 – Goodwood (Home)'}
                  value={paste} onChange={e=>setPaste(e.target.value)} />
                <div style={{ display:'flex',gap:10,marginTop:12 }}>
                  <button className="btn primary" onClick={savePaste} disabled={!paste.trim()} style={{ flex:1 }}>Parse & import</button>
                  <button className="btn" onClick={onClose}>Cancel</button>
                </div>
              </div>
            )}

            <div style={{ borderTop:'1px solid var(--border)',marginTop:16,paddingTop:12,fontSize:12,color:'var(--muted)',display:'flex',gap:12 }}>
              <span>Or go to</span>
              <button className="btn sm" onClick={()=>{ onClose(); (window.navTo||onNav)?.('onboarding'); }}>Season Setup →</button>
              <button className="btn sm" onClick={()=>{ onClose(); (window.navTo||onNav)?.('calendar'); }}>Calendar →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---- Container ---- */
const MatchDay = ({ onNav }) => {
  const [mode, setMode] = React.useState('pre');
  const [xv, setXv] = React.useState(DEFAULT_XV);
  const [bench, setBench] = React.useState(DEFAULT_BENCH);
  const [showAddFixture, setShowAddFixture] = React.useState(false);
  const [version, setVersion] = React.useState(0);
  const next = FIXTURES.find(f => !f.result) || null;
  const getPlayer = id => SQUAD.find(p => p.n === id);
  const teamShort = (window.teamInfo?.short && window.teamInfo.short !== '—'
    ? window.teamInfo.short
    : (window.teamInfo?.name || 'Home').split(' ').map(w => w[0]).join('')
  ).slice(0, 4).toUpperCase();

  if (!next && FIXTURES.length === 0) {
    return (
      <div className="page">
        <div className="page-head"><div><div className="eyebrow">Match Day</div><h1>No fixtures yet</h1></div></div>
        <div className="card" style={{ padding: '40px 24px', textAlign: 'center', marginTop: 8 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>▣</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, marginBottom: 8 }}>No fixtures scheduled</div>
          <div className="muted" style={{ fontSize: 14, marginBottom: 20 }}>Add your fixtures to unlock Match Day.</div>
          <div style={{ display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap' }}>
            <button className="btn primary" onClick={() => setShowAddFixture(true)}>+ Add fixtures</button>
            <button className="btn" onClick={() => (onNav||window.navTo)?.('onboarding')}>Season setup →</button>
            <button className="btn" onClick={() => (onNav||window.navTo)?.('calendar')}>Open Calendar →</button>
          </div>
        </div>
        {showAddFixture && <AddFixtureModal onClose={() => setShowAddFixture(false)} onSaved={() => setVersion(v=>v+1)} />}
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingBottom: mode === 'sideline' ? 0 : 60 }}>
      <div className="page-head">
        <div>
          <div className="eyebrow">Match Day · {next ? `${next.date} · ${next.kickoff || '15:00'} KO` : 'Season complete'}</div>
          <h1>{teamShort} <span className="muted">vs</span> {next?.opp || '—'}</h1>
          <div className="meta">{next?.venue || ''}{next ? ' · League · Home Ground' : ''}</div>
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

      {/* Quick-links strip — all modes except sideline */}
      {mode !== 'sideline' && <MatchDayQuickLinks onNav={onNav} />}
    </div>
  );
};

/* ---- Pre-match view (XV builder with drag-and-drop + list/pitch/runsheet toggle) ---- */
const PreMatchView = ({ xv, setXv, bench, setBench, getPlayer, next }) => {
  const [view, setView] = React.useState('pitch'); // pitch | list | runsheet
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
              <button className={view === 'pitch'    ? 'active' : ''} onClick={() => setView('pitch')}>▣ Pitch</button>
              <button className={view === 'list'     ? 'active' : ''} onClick={() => setView('list')}>≡ List</button>
              <button className={view === 'runsheet' ? 'active' : ''} onClick={() => setView('runsheet')}>📋 Runsheet</button>
            </div>
            <button className="btn sm">↶ Undo</button>
            <button className="btn sm accent">✦ Auto-fill</button>
            <button className="btn sm primary">✓ Confirm XV</button>
          </div>
        </div>
      </div>

      {/* Runsheet — full-width, no squad tray */}
      {view === 'runsheet' && <RunsheetView next={next} />}

      <div className="split match" style={{ display: view === 'runsheet' ? 'none' : undefined }}>
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
