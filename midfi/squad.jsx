/* RugbyAI mid-fi — Squad List */

const Squad = () => {
  const [filter, setFilter] = React.useState('all');
  const [sortKey, setSortKey] = React.useState('n');
  const [query, setQuery] = React.useState('');

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
          <div className="eyebrow">Roster · 2024</div>
          <h1>Squad list</h1>
          <div className="meta">{SQUAD.length} players · {counts.committed} committed · {counts.injured} unavailable</div>
        </div>
        <div className="row gap-3">
          <button className="btn">Import .csv</button>
          <button className="btn">Export</button>
          <button className="btn primary"><span className="ico">+</span> Add player</button>
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
          <button className="btn sm">Bulk SMS</button>
          <button className="btn sm">Send availability poll</button>
          <button className="btn sm accent">✦ Ask analyst about squad</button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Squad });
