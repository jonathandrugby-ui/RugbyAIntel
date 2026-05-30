/* RugbyAI mid-fi — Match Ratings (post-match form) */

const RATING_DIMS_FW = [
  { key: 'rating',  label: 'Player /10',  base: 'overall' },
  { key: 'scrum',   label: 'Scrums /10',  base: 'set' },
  { key: 'lineout', label: 'Lineouts /10',base: 'set' },
  { key: 'work',    label: 'Work rate /10', base: 'effort' },
  { key: 'battle',  label: 'Battle rate /10', base: 'effort' },
];

const RATING_DIMS_BK = [
  { key: 'rating', label: 'Player /10' },
  { key: 'attack', label: 'Attack /10' },
  { key: 'def',    label: 'Defence /10' },
  { key: 'kick',   label: 'Kicking /10' },
  { key: 'decisions', label: 'Decisions /10' },
];

/* Sample ratings to show density */
const SAMPLE_RATINGS = {
  5:  { rating: 8, scrum: 9, lineout: 6, work: 8, battle: 9 }, // Bulana
  10: { rating: 7, scrum: 7, lineout: 8, work: 7, battle: 7 }, // Mkiva
  20: { rating: 6, scrum: 7, lineout: 6, work: 6, battle: 6 }, // Nkosi
  11: { rating: 7, scrum: 6, lineout: 8, work: 8, battle: 7 }, // Jacobs
  19: { rating: null }, // Moyo
  14: { rating: 8, scrum: 7, lineout: 7, work: 9, battle: 8 }, // Davids
  15: { rating: 7, scrum: 6, lineout: 7, work: 8, battle: 8 }, // Ngubane
  16: { rating: 9, scrum: 8, lineout: 7, work: 9, battle: 9 }, // Petersen — MOTM
  12: { rating: 7, attack: 8, def: 6, kick: 5, decisions: 7 }, // Mathebula
  13: { rating: 8, attack: 8, def: 7, kick: 9, decisions: 8 }, // Naidoo
  3:  { rating: 7, attack: 8, def: 6, kick: 5, decisions: 6 }, // Barnier
  18: { rating: 6, attack: 6, def: 7, kick: 4, decisions: 6 }, // Adams
  17: { rating: 7, attack: 7, def: 7, kick: 5, decisions: 7 }, // Mtawana
  6:  { rating: 6, attack: 7, def: 6, kick: 4, decisions: 6 }, // Bunu
  21: { rating: 7, attack: 7, def: 8, kick: 7, decisions: 7 }, // van Wyk
};

const RatingCell = ({ v, max = 10 }) => {
  if (v == null) return <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>;
  const color = v >= 8 ? 'var(--ok)' : v >= 6 ? 'var(--ink)' : 'var(--warn)';
  return (
    <div className="row gap-2" style={{ justifyContent: 'center' }}>
      <span className="mono-num" style={{ fontWeight: 600, color, fontSize: 14 }}>{v}</span>
      <div style={{
        width: 32, height: 4, borderRadius: 2,
        background: 'var(--paper-2)', overflow: 'hidden',
      }}>
        <div style={{ width: `${(v/max)*100}%`, height: '100%', background: color }} />
      </div>
    </div>
  );
};

const Ratings = () => {
  const lastMatch = FIXTURES.filter(f => f.result).slice(-1)[0];
  const getPlayer = id => SQUAD.find(p => p.n === id);

  /* Build same XV as match-day */
  const fwSlots = DEFAULT_XV.slice(0, 8);
  const bkSlots = DEFAULT_XV.slice(8);

  const motm = 16; // Petersen

  /* Averages */
  const avgFw = RATING_DIMS_FW.map(d => {
    const vals = fwSlots.map(s => SAMPLE_RATINGS[s.squadId]?.[d.key]).filter(v => v != null);
    return vals.length ? (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(1) : '—';
  });
  const avgBk = RATING_DIMS_BK.map(d => {
    const vals = bkSlots.map(s => SAMPLE_RATINGS[s.squadId]?.[d.key]).filter(v => v != null);
    return vals.length ? (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(1) : '—';
  });

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Post-match · {lastMatch.date} 2024</div>
          <h1>Player ratings  ·  vs {lastMatch.opp}</h1>
          <div className="meta">{lastMatch.venue} · Result: <b style={{ color: lastMatch.result === 'W' ? 'var(--ok)' : 'var(--warn)' }}>
            {lastMatch.result === 'W' ? `Win ${lastMatch.f}–${lastMatch.a}` : `Loss ${lastMatch.f}–${lastMatch.a}`}
          </b> · 14 of 23 ratings entered</div>
        </div>
        <div className="row gap-3">
          <button className="btn">Share with players</button>
          <button className="btn">Export</button>
          <button className="btn primary"><span className="ico">✓</span> Lock ratings</button>
        </div>
      </div>

      {/* Summary strip */}
      <div className="split three" style={{ marginBottom: 14 }}>
        <div className="stat accent">
          <span className="label">Man of the match</span>
          <span className="value" style={{ fontSize: 26 }}>P. Petersen</span>
          <span className="sub">8th Man · 9.0 avg · +1 try, 18 carries, 2 turnovers</span>
        </div>
        <div className="stat">
          <span className="label">Forwards avg</span>
          <span className="value">{avgFw[0]}<span style={{ color: 'var(--ink-soft)', fontSize: 22 }}>/10</span></span>
          <span className="sub">Strong set piece · lineout 100%</span>
        </div>
        <div className="stat">
          <span className="label">Backs avg</span>
          <span className="value">{avgBk[0]}<span style={{ color: 'var(--ink-soft)', fontSize: 22 }}>/10</span></span>
          <span className="sub">Naidoo's kicking pinned them in 22m</span>
        </div>
      </div>

      {/* Forwards table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}>
        <div className="card-head" style={{ padding: '14px 18px 4px', marginBottom: 0 }}>
          <div className="card-title">Forwards  ·  1–8</div>
          <div className="row gap-3">
            <span className="mono">Tap a cell to edit</span>
            <button className="btn ghost sm">Reset</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 38 }}>#</th>
              <th>Player</th>
              <th>Position</th>
              {RATING_DIMS_FW.map(d => <th key={d.key} className="center">{d.label}</th>)}
              <th className="center">Avg</th>
              <th>Coach note</th>
            </tr>
          </thead>
          <tbody>
            {fwSlots.map(slot => {
              const p = getPlayer(slot.squadId);
              const r = SAMPLE_RATINGS[slot.squadId] || {};
              const vals = RATING_DIMS_FW.map(d => r[d.key]).filter(v => v != null);
              const avg = vals.length ? (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(1) : '—';
              const isMotm = slot.squadId === motm;
              return (
                <tr key={slot.jersey} style={{ background: isMotm ? 'var(--accent-soft)' : undefined }}>
                  <td><span className="jersey starter">{slot.jersey}</span></td>
                  <td>
                    <div className="row gap-3">
                      {p && <Head p={p} />}
                      <div>
                        <div className="player-name">{p ? `${p.fn} ${p.ln}` : '— vacant —'}</div>
                        {isMotm && <span style={{ fontSize: 11, color: 'var(--accent-2)', fontWeight: 600 }}>MOTM</span>}
                      </div>
                    </div>
                  </td>
                  <td className="player-pos">{slot.pos}</td>
                  {RATING_DIMS_FW.map(d => (
                    <td key={d.key} className="center"><RatingCell v={r[d.key]} /></td>
                  ))}
                  <td className="center"><b className="mono-num">{avg}</b></td>
                  <td>
                    <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                      {slot.squadId === 5 ? 'Anchored scrum all 80\'.' :
                       slot.squadId === 16 ? 'Try + 18 carries. Outstanding.' :
                       slot.squadId === 19 ? '(did not play)' :
                       slot.squadId === 14 ? 'Tackle 11/11. Set tone.' :
                       'Solid 60\'.'}
                    </span>
                  </td>
                </tr>
              );
            })}
            {/* Averages row */}
            <tr style={{ background: 'var(--paper-2)' }}>
              <td colSpan="3" className="mono" style={{ textAlign: 'right' }}>Pack averages →</td>
              {avgFw.map((v, i) => <td key={i} className="center mono-num" style={{ fontWeight: 600 }}>{v}</td>)}
              <td className="center mono-num" style={{ fontWeight: 700 }}>{avgFw[0]}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Backs table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}>
        <div className="card-head" style={{ padding: '14px 18px 4px', marginBottom: 0 }}>
          <div className="card-title">Backs  ·  9–15</div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 38 }}>#</th>
              <th>Player</th>
              <th>Position</th>
              {RATING_DIMS_BK.map(d => <th key={d.key} className="center">{d.label}</th>)}
              <th className="center">Avg</th>
              <th>Coach note</th>
            </tr>
          </thead>
          <tbody>
            {bkSlots.map(slot => {
              const p = getPlayer(slot.squadId);
              const r = SAMPLE_RATINGS[slot.squadId] || {};
              const vals = RATING_DIMS_BK.map(d => r[d.key]).filter(v => v != null);
              const avg = vals.length ? (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(1) : '—';
              return (
                <tr key={slot.jersey}>
                  <td><span className="jersey starter">{slot.jersey}</span></td>
                  <td>
                    <div className="row gap-3">
                      {p && <Head p={p} />}
                      <div className="player-name">{p ? `${p.fn} ${p.ln}` : '—'}</div>
                    </div>
                  </td>
                  <td className="player-pos">{slot.pos}</td>
                  {RATING_DIMS_BK.map(d => (
                    <td key={d.key} className="center"><RatingCell v={r[d.key]} /></td>
                  ))}
                  <td className="center"><b className="mono-num">{avg}</b></td>
                  <td>
                    <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                      {slot.squadId === 13 ? '4/4 kicks at goal. Field position elite.' :
                       slot.squadId === 12 ? 'Tempo off the base; spotty box-kicks.' :
                       slot.squadId === 21 ? 'Last-ditch saver.' :
                       'Steady.'}
                    </span>
                  </td>
                </tr>
              );
            })}
            <tr style={{ background: 'var(--paper-2)' }}>
              <td colSpan="3" className="mono" style={{ textAlign: 'right' }}>Backs averages →</td>
              {avgBk.map((v, i) => <td key={i} className="center mono-num" style={{ fontWeight: 600 }}>{v}</td>)}
              <td className="center mono-num" style={{ fontWeight: 700 }}>{avgBk[0]}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* AI brief */}
      <div className="ai-card">
        <div className="ai-glyph">AI</div>
        <div className="body">
          <b>Match summary draft</b> — Set piece (lineout 100%, scrum 5/6) carried the win. Petersen MOTM. Backs averaged <em>6.7/10</em>; box-kicking off the base was the soft spot. Want me to draft player feedback notes &amp; a parent update?
        </div>
        <button className="btn accent">Draft feedback</button>
        <button className="btn">Save summary</button>
      </div>
    </div>
  );
};

Object.assign(window, { Ratings });
