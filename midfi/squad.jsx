/* RugbyAI mid-fi — Squad List */

/* ── shared input style ── */
const _inp = { width:'100%', padding:'8px 10px', border:'1px solid var(--border)', borderRadius:8, fontSize:14, fontFamily:'inherit', boxSizing:'border-box', background:'#fff' };

/* ── Add / Edit Player modal ── */
const AddPlayerModal = ({ onClose, onSaved, player: existing, idx }) => {
  const blank = { n:'', pos:'Loosehead Prop', fn:'', ln:'', status:'Committed', fit:'Good', caps:0 };
  const [p, setP] = React.useState(existing ? { ...existing } : blank);
  const POSITIONS = ['Loosehead Prop','Hooker','Tighthead Prop','Lock','Lock','Flanker','Flanker','8th Man','Scrumhalf','Flyhalf','Wing','Centre','Centre','Wing','Fullback','Utility Forward','Utility Back'];
  const set = (k, v) => setP(prev => ({ ...prev, [k]: v }));
  const save = () => {
    if (!p.fn && !p.ln) return;
    if (existing != null && idx != null) {
      SQUAD[idx] = { ...SQUAD[idx], ...p, caps: parseInt(p.caps)||0, n: parseInt(p.n)||SQUAD[idx].n };
    } else {
      SQUAD.push({ phone: false, status: p.status, fit: p.fit, contract: false, ...p, n: parseInt(p.n)||(SQUAD.length+1), caps: parseInt(p.caps)||0 });
    }
    try {
      const raw = localStorage.getItem('rugbyai_team_v2');
      if (raw) { const d = JSON.parse(raw); d.squad = SQUAD; localStorage.setItem('rugbyai_team_v2', JSON.stringify(d)); }
    } catch {}
    window.SQUAD = SQUAD;
    onSaved();
    onClose();
  };
  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.45)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'var(--paper)',borderRadius:14,width:'100%',maxWidth:460,boxShadow:'0 20px 60px rgba(0,0,0,.3)' }}>
        <div style={{ padding:'22px 24px 0',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div style={{ fontFamily:'var(--font-display)',fontSize:20,fontWeight:700 }}>{existing?'Edit player':'Add player'}</div>
          <button onClick={onClose} style={{ background:'none',border:'none',fontSize:22,cursor:'pointer',color:'var(--muted)' }}>×</button>
        </div>
        <div style={{ padding:'16px 24px 24px',display:'flex',flexDirection:'column',gap:12 }}>
          <div style={{ display:'grid',gridTemplateColumns:'80px 1fr',gap:10 }}>
            <div><div style={{ fontSize:11,fontWeight:600,marginBottom:5,textTransform:'uppercase' }}>#</div><input style={_inp} type="number" min="1" max="99" placeholder="1" value={p.n} onChange={e=>set('n',e.target.value)} /></div>
            <div><div style={{ fontSize:11,fontWeight:600,marginBottom:5,textTransform:'uppercase' }}>Position</div>
              <select style={_inp} value={p.pos} onChange={e=>set('pos',e.target.value)}>
                {POSITIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
            <div><div style={{ fontSize:11,fontWeight:600,marginBottom:5,textTransform:'uppercase' }}>First name</div><input style={_inp} placeholder="e.g. Luthando" value={p.fn} onChange={e=>set('fn',e.target.value)} /></div>
            <div><div style={{ fontSize:11,fontWeight:600,marginBottom:5,textTransform:'uppercase' }}>Last name</div><input style={_inp} placeholder="e.g. Bulana" value={p.ln} onChange={e=>set('ln',e.target.value)} /></div>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 80px',gap:10 }}>
            <div><div style={{ fontSize:11,fontWeight:600,marginBottom:5,textTransform:'uppercase' }}>Status</div>
              <select style={_inp} value={p.status} onChange={e=>set('status',e.target.value)}>
                <option>Committed</option><option>Unknown</option>
              </select>
            </div>
            <div><div style={{ fontSize:11,fontWeight:600,marginBottom:5,textTransform:'uppercase' }}>Fitness</div>
              <select style={_inp} value={p.fit} onChange={e=>set('fit',e.target.value)}>
                <option>Good</option><option>Recovering</option><option>Injured</option>
              </select>
            </div>
            <div><div style={{ fontSize:11,fontWeight:600,marginBottom:5,textTransform:'uppercase' }}>Caps</div><input style={_inp} type="number" min="0" placeholder="0" value={p.caps} onChange={e=>set('caps',e.target.value)} /></div>
          </div>
          <div style={{ display:'flex',gap:10,paddingTop:4 }}>
            <button className="btn primary" onClick={save} disabled={!p.fn&&!p.ln} style={{ flex:1 }}>{existing?'Save changes':'Add player'}</button>
            <button className="btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Availability poll modal (email) ── */
const PollModal = ({ onClose }) => {
  const committed = SQUAD.filter(p => p.status === 'Committed');
  const [emails, setEmails] = React.useState(committed.map(p => `${p.fn.toLowerCase()}.${p.ln.toLowerCase()}@example.com`).join('\n'));
  const [match, setMatch] = React.useState(FIXTURES.filter(f=>!f.result)[0]?.date || '');
  const [sent, setSent] = React.useState(false);
  const send = () => setSent(true);
  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.45)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'var(--paper)',borderRadius:14,width:'100%',maxWidth:500,boxShadow:'0 20px 60px rgba(0,0,0,.3)' }}>
        <div style={{ padding:'22px 24px 0',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div style={{ fontFamily:'var(--font-display)',fontSize:20,fontWeight:700 }}>Send availability poll</div>
          <button onClick={onClose} style={{ background:'none',border:'none',fontSize:22,cursor:'pointer',color:'var(--muted)' }}>×</button>
        </div>
        {sent ? (
          <div style={{ padding:'32px 24px',textAlign:'center' }}>
            <div style={{ fontSize:40,marginBottom:12 }}>✉</div>
            <div style={{ fontFamily:'var(--font-display)',fontSize:18,fontWeight:700,marginBottom:8 }}>Poll sent!</div>
            <div className="muted" style={{ fontSize:14,marginBottom:20 }}>Players will receive an email asking them to confirm availability for {match}.</div>
            <button className="btn primary" onClick={onClose}>Done</button>
          </div>
        ) : (
          <div style={{ padding:'16px 24px 24px',display:'flex',flexDirection:'column',gap:14 }}>
            <div>
              <div style={{ fontSize:11,fontWeight:600,marginBottom:5,textTransform:'uppercase' }}>Match date</div>
              <input style={_inp} placeholder="e.g. 7 Jun" value={match} onChange={e=>setMatch(e.target.value)} />
            </div>
            <div>
              <div style={{ fontSize:11,fontWeight:600,marginBottom:5,textTransform:'uppercase' }}>Player emails — one per line</div>
              <textarea style={{ ..._inp, resize:'vertical', minHeight:120, fontFamily:'var(--font-mono)', fontSize:12 }} value={emails} onChange={e=>setEmails(e.target.value)} />
              <div style={{ fontSize:11,color:'var(--muted)',marginTop:4 }}>{emails.trim().split('\n').filter(Boolean).length} recipients</div>
            </div>
            <div style={{ background:'var(--sand)',borderRadius:8,padding:'10px 14px',fontSize:13 }}>
              <b>Email preview:</b> "Please confirm your availability for the match on {match}. Reply YES or NO."
            </div>
            <div style={{ display:'flex',gap:10 }}>
              <button className="btn primary" onClick={send} style={{ flex:1 }}>✉ Send poll</button>
              <button className="btn" onClick={onClose}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── CSV helpers ── */
const parseSquadCSV = (text) => {
  const lines = text.trim().split('\n').filter(Boolean);
  const header = lines[0].toLowerCase();
  const start = /pos|name|fn|first/.test(header) ? 1 : 0;
  return lines.slice(start).map((line, i) => {
    const cols = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
    // Try: pos, first, last OR first, last, pos OR number, pos, first, last
    const [a, b, c, d] = cols;
    let pos='Player', fn='', ln='', n=i+1;
    if (!isNaN(+a)) { n=+a; pos=b||'Player'; fn=c||''; ln=d||''; }
    else if (/prop|hook|lock|flank|8th|scrum|fly|wing|cent|full|back|forward/i.test(a)) { pos=a; fn=b||''; ln=c||''; }
    else { fn=a; ln=b||''; pos=c||'Player'; }
    return { n, pos, fn, ln, phone:false, status:'Committed', fit:'Good', contract:false, caps:0 };
  }).filter(p => p.fn || p.ln);
};

const exportSquadCSV = () => {
  const header = ['#','Position','First name','Last name','Status','Fitness','Caps'];
  const rows = SQUAD.map(p => [p.n, p.pos, p.fn, p.ln, p.status, p.fit, p.caps]);
  const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type:'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'squad.csv'; a.click();
  URL.revokeObjectURL(url);
};

const Squad = ({ onNav }) => {
  const [filter, setFilter] = React.useState('all');
  const [sortKey, setSortKey] = React.useState('n');
  const [query, setQuery] = React.useState('');

  const [showAdd,    setShowAdd]    = React.useState(false);
  const [showPoll,   setShowPoll]   = React.useState(false);
  const [editPlayer, setEditPlayer] = React.useState(null); /* {player, idx} */
  const [version,    setVersion]    = React.useState(0);
  const fileRef = React.useRef();

  const handleImportCSV = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const players = parseSquadCSV(ev.target.result);
      if (players.length === 0) { alert('No valid players found. Check your CSV format.'); return; }
      if (window.confirm(`Import ${players.length} players? This will ADD to your current squad.`)) {
        players.forEach(p => SQUAD.push({ ...p, n: SQUAD.length + 1 }));
        window.SQUAD = SQUAD;
        try {
          const raw = localStorage.getItem('rugbyai_team_v2');
          if (raw) { const d = JSON.parse(raw); d.squad = SQUAD; localStorage.setItem('rugbyai_team_v2', JSON.stringify(d)); }
        } catch {}
        setVersion(v => v+1);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filtered = SQUAD
    .filter(p => {
      if (filter === 'forwards') return /Prop|Hooker|Lock|Flank|8th|Forward/i.test(p.pos);
      if (filter === 'backs') return /Back|Wing|Centre|Flyhalf|Scrum|Fullback/i.test(p.pos);
      if (filter === 'injured') return p.fit === 'Injured' || p.fit === 'Recovering';
      if (filter === 'committed') return p.status === 'Committed';
      if (filter === 'unknown') return p.status === 'Unknown' || p.status === '—';
      return true;
    })
    .filter(p => !query || `${p.fn} ${p.ln} ${p.pos}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === 'name') return a.ln.localeCompare(b.ln);
      if (sortKey === 'caps') return b.caps - a.caps;
      if (sortKey === 'pos') return a.pos.localeCompare(b.pos);
      return a.n - b.n;
    });

  const counts = {
    all: SQUAD.length,
    forwards: SQUAD.filter(p => /Prop|Hooker|Lock|Flank|8th|Forward/i.test(p.pos)).length,
    backs: SQUAD.filter(p => /Back|Wing|Centre|Flyhalf|Scrum|Fullback/i.test(p.pos)).length,
    injured: SQUAD.filter(p => p.fit === 'Injured' || p.fit === 'Recovering').length,
    committed: SQUAD.filter(p => p.status === 'Committed').length,
    unknown: SQUAD.filter(p => p.status === 'Unknown' || p.status === '—').length,
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Roster · {SEASON_YEAR}</div>
          <h1>Squad list</h1>
          <div className="meta">{SQUAD.length} players · {counts.committed} committed · {counts.injured} unavailable</div>
        </div>
        <div className="row gap-3">
          <input ref={fileRef} type="file" accept=".csv,.txt" style={{ display:'none' }} onChange={handleImportCSV} />
          <button className="btn" onClick={() => fileRef.current?.click()}>Import .csv</button>
          <button className="btn" onClick={exportSquadCSV}>Export</button>
          <button className="btn primary" onClick={() => setShowAdd(true)}><span className="ico">+</span> Add player</button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="toolbar">
        <button className={`chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All <span className="count">{counts.all}</span></button>
        <button className={`chip ${filter === 'forwards' ? 'active' : ''}`} onClick={() => setFilter('forwards')}>Forwards <span className="count">{counts.forwards}</span></button>
        <button className={`chip ${filter === 'backs' ? 'active' : ''}`} onClick={() => setFilter('backs')}>Backs <span className="count">{counts.backs}</span></button>
        <button className={`chip ${filter === 'committed' ? 'active' : ''}`} onClick={() => setFilter('committed')}>Committed <span className="count">{counts.committed}</span></button>
        <button className={`chip ${filter === 'injured' ? 'active' : ''}`} onClick={() => setFilter('injured')}>Injured/Rec. <span className="count">{counts.injured}</span></button>
        <button className={`chip ${filter === 'unknown' ? 'active' : ''}`} onClick={() => setFilter('unknown')}>Unknown <span className="count">{counts.unknown}</span></button>
        <div style={{ flex: 1 }} />
        <input className="input" placeholder="Filter by name or position…" value={query} onChange={e => setQuery(e.target.value)} style={{ width: 260 }} />
        <div className="row gap-2">
          <span className="mono">Sort</span>
          <select className="input" style={{ padding: '6px 10px' }} value={sortKey} onChange={e => setSortKey(e.target.value)}>
            <option value="n">Squad #</option>
            <option value="name">Surname</option>
            <option value="caps">Caps</option>
            <option value="pos">Position</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 38 }}>#</th>
              <th>Player</th>
              <th>Position</th>
              <th>Status</th>
              <th>Physical</th>
              <th className="num">Caps</th>
              <th className="center">Contact</th>
              <th className="center">Contract</th>
              <th>Notes</th>
              <th style={{ width: 50 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.n}>
                <td><span className="mono-num" style={{ color: 'var(--ink-soft)' }}>{String(p.n).padStart(2,'0')}</span></td>
                <td>
                  <div className="row gap-3">
                    <Head p={p} />
                    <div>
                      <div className="player-name">{p.fn} {p.ln}</div>
                      <div className="player-pos">PUM · {p.fn[0]}.{p.ln}</div>
                    </div>
                  </div>
                </td>
                <td>{p.pos}</td>
                <td>
                  {p.status === 'Committed'
                    ? <Status value="Committed" />
                    : p.status === 'Unknown'
                      ? <Status value="Unknown" />
                      : <span className="muted">—</span>}
                </td>
                <td>
                  {p.fit === 'Good' && <Status value="Good" label="Good" />}
                  {p.fit === 'Injured' && <Status value="Injured" label="Injured" />}
                  {p.fit === 'Recovering' && <span className="status accent"><span className="dot" /> Recovering</span>}
                </td>
                <td className="num">{p.caps}</td>
                <td className="center">
                  {p.phone
                    ? <span style={{ color: 'var(--ok)', fontWeight: 600 }}>✓</span>
                    : <span style={{ color: 'var(--muted)' }}>—</span>}
                </td>
                <td className="center">
                  {p.contract
                    ? <Badge variant="accent">Signed</Badge>
                    : <Badge variant="outline">Pending</Badge>}
                </td>
                <td>
                  <span className="muted" style={{ fontSize: 12 }}>
                    {p.fit === 'Injured' ? 'Knee sprain — 4–6 wk' :
                     p.fit === 'Recovering' ? 'Return target Jul 10' :
                     p.status === 'Unknown' ? 'Follow-up needed' : '—'}
                  </span>
                </td>
                <td>
                  <button className="btn ghost sm">⋯</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="row between" style={{ marginTop: 16 }}>
        <div className="muted" style={{ fontSize: 12 }}>
          Showing {filtered.length} of {SQUAD.length} players
        </div>
        <div className="row gap-3">
          <button className="btn sm" onClick={() => setShowPoll(true)}>✉ Send availability poll</button>
          <button className="btn sm accent" onClick={() => (onNav || window.navTo)?.('analyst')}>✦ Ask analyst about squad</button>
        </div>
      </div>

      {showAdd && <AddPlayerModal onClose={() => setShowAdd(false)} onSaved={() => setVersion(v=>v+1)} />}
      {showPoll && <PollModal onClose={() => setShowPoll(false)} />}
      {editPlayer && <AddPlayerModal onClose={() => setEditPlayer(null)} onSaved={() => setVersion(v=>v+1)} player={editPlayer.player} idx={editPlayer.idx} />}
    </div>
  );
};

Object.assign(window, { Squad });
