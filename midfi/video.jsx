/* RugbyAI mid-fi — Video Clip Tagging Surface */

const LINGO_TAGS = [
  /* Attack */
  { id: 'BLACK',    cat: 'Attack',   label: 'BLACK',    desc: 'Quick hands wide' },
  { id: 'BRUMBY',   cat: 'Attack',   label: 'BRUMBY',   desc: 'Dummy pod / behind player' },
  { id: 'PLUS',     cat: 'Attack',   label: 'PLUS/ZIP',  desc: 'Short pass outside' },
  { id: 'MINUS',    cat: 'Attack',   label: 'MINUS',    desc: 'Inside cleaner' },
  { id: 'RIO',      cat: 'Attack',   label: 'RIO',      desc: 'Right-side attack' },
  { id: 'LONDON',   cat: 'Attack',   label: 'LONDON',   desc: 'Left-side attack' },
  { id: 'TAXI',     cat: 'Attack',   label: 'TAXI',     desc: 'Shape off 9' },
  { id: 'BUS',      cat: 'Attack',   label: 'BUS',      desc: 'Shape off 10' },
  { id: 'BULLS',    cat: 'Attack',   label: 'BULLS',    desc: 'Pick & drive' },
  { id: 'STORMERS', cat: 'Attack',   label: 'STORMERS', desc: 'Back pass to 10/12' },
  /* Defence */
  { id: 'PILLAR',   cat: 'Defence',  label: 'PILLAR',   desc: '1st defender arriving' },
  { id: 'JACKLE',   cat: 'Defence',  label: 'JACKLE',   desc: 'Brace over to steal' },
  { id: 'DOUBLES',  cat: 'Defence',  label: 'DOUBLES',  desc: 'Double-hit tackle' },
  { id: 'CHOP',     cat: 'Defence',  label: 'CHOP',     desc: 'Chop tackle on legs' },
  { id: 'BLITZ',    cat: 'Defence',  label: 'BLITZ',    desc: 'Pressing defence' },
  { id: 'CHOKE',    cat: 'Defence',  label: 'CHOKE',    desc: 'Hold player up in tackle' },
  { id: 'FIRE',     cat: 'Defence',  label: 'FIRE',     desc: 'Counter ruck through' },
  { id: 'CRUSADER', cat: 'Defence',  label: 'CRUSADER', desc: 'Numbers on feet' },
  /* Set piece */
  { id: 'LINEOUT',  cat: 'Set Piece', label: 'LINEOUT',  desc: 'Lineout play' },
  { id: 'SCRUM',    cat: 'Set Piece', label: 'SCRUM',    desc: 'Scrum play / result' },
  { id: 'MAUL',     cat: 'Set Piece', label: 'MAUL',     desc: 'Maul drive' },
  /* Zones */
  { id: 'RED_ZONE', cat: 'Zone',     label: 'RED ZONE', desc: 'Own 22 — exit territory' },
  { id: 'GREEN',    cat: 'Zone',     label: 'GREEN',    desc: 'Attacking half' },
  /* Outcome */
  { id: 'TRY',      cat: 'Outcome',  label: 'TRY',      desc: 'Try scored' },
  { id: 'TURNOVER', cat: 'Outcome',  label: 'TURNOVER', desc: 'Turnover won/lost' },
  { id: 'PENALTY',  cat: 'Outcome',  label: 'PENALTY',  desc: 'Penalty given/received' },
];

const TAG_CAT_COLOR = {
  'Attack':    { bg: 'rgba(46,122,69,.12)', fg: 'var(--ok)' },
  'Defence':   { bg: 'rgba(24,43,84,.10)', fg: 'var(--primary)' },
  'Set Piece': { bg: 'rgba(201,148,30,.16)', fg: 'var(--accent-2)' },
  'Zone':      { bg: 'rgba(184,65,45,.10)', fg: 'var(--warn)' },
  'Outcome':   { bg: 'rgba(0,0,0,.06)', fg: 'var(--ink)' },
};

const TAG_CATS = ['All', 'Attack', 'Defence', 'Set Piece', 'Zone', 'Outcome'];

const SAMPLE_CLIPS = [
  {
    id: 'c1', match: 'vs Rocklands', date: 'May 25', half: '1H', min: 12,
    title: 'Brumby off 9 — try assist', duration: '0:34',
    tags: ['BRUMBY', 'TRY', 'GREEN'],
    note: 'Perfect execution — Mathebula holds #7, Barnier finishes on the wing.',
    thumbnail: { label: 'TRY — BRUMBY', color: 'var(--ok)' },
  },
  {
    id: 'c2', match: 'vs Rocklands', date: 'May 25', half: '2H', min: 58,
    title: 'Scrum — tighthead win + Petersen pick-and-go', duration: '0:27',
    tags: ['SCRUM', 'BULLS', 'TRY'],
    note: 'Scrum dominance sets up #8 carry from the base. Classic Bulls call.',
    thumbnail: { label: 'SCRUM WIN', color: 'var(--primary)' },
  },
  {
    id: 'c3', match: 'vs Hamiltons', date: 'May 4', half: '1H', min: 23,
    title: 'Lineout — jumper timing breakdown', duration: '0:18',
    tags: ['LINEOUT', 'TURNOVER'],
    note: 'Lift hesitated — UCT stole clean. Replicate pressure in this week\'s drill.',
    thumbnail: { label: 'LO LOST', color: 'var(--warn)' },
  },
  {
    id: 'c4', match: 'vs UCT (Mar 9)', date: 'Mar 9', half: '1H', min: 8,
    title: 'UCT — Bus off 10, centre line-break', duration: '0:22',
    tags: ['BUS', 'PENALTY'],
    note: 'Their #10 set Bus shape perfectly. Our pillar drifted — created 10m gap.',
    thumbnail: { label: 'OPP BUS', color: 'var(--warn)' },
  },
  {
    id: 'c5', match: 'vs UCT (Mar 9)', date: 'Mar 9', half: '2H', min: 52,
    title: 'UCT — Jackle #7, our ball lost', duration: '0:15',
    tags: ['JACKLE', 'TURNOVER'],
    note: 'We were too slow clearing the ruck. Fortuin jackled twice in this passage.',
    thumbnail: { label: 'JACKLE OPP', color: 'var(--warn)' },
  },
  {
    id: 'c6', match: 'vs Brackenfell', date: 'Apr 6', half: '2H', min: 67,
    title: 'Blitz defence — turnover in 22', duration: '0:29',
    tags: ['BLITZ', 'TURNOVER', 'RED_ZONE'],
    note: 'Blitz cut off their bus angle — Davids made the key hit, Codee-Waries jackling.',
    thumbnail: { label: 'BLITZ WIN', color: 'var(--primary)' },
  },
  {
    id: 'c7', match: 'vs Brackenfell', date: 'Apr 6', half: '1H', min: 34,
    title: 'London attack — try left wing', duration: '0:31',
    tags: ['LONDON', 'TRY', 'GREEN'],
    note: 'Set up beautifully from previous Stormers call. Bunu finishes in the corner.',
    thumbnail: { label: 'TRY — LONDON', color: 'var(--ok)' },
  },
  {
    id: 'c8', match: 'vs Stellenberg', date: 'Mar 30', half: '1H', min: 18,
    title: 'Scrum — loose tighthead, penalty', duration: '0:16',
    tags: ['SCRUM', 'PENALTY'],
    note: 'Nkosi came off the bind. Need to shore up the tighthead channel for next UCT match.',
    thumbnail: { label: 'SCRUM PEN', color: 'var(--warn)' },
  },
];

const Clip = ({ clip, selected, onSelect }) => {
  const { bg, fg } = TAG_CAT_COLOR[LINGO_TAGS.find(t => t.id === clip.tags[0])?.cat] || TAG_CAT_COLOR['Outcome'];
  return (
    <div
      onClick={() => onSelect(clip.id)}
      style={{
        borderRadius: 10,
        border: `2px solid ${selected ? 'var(--primary)' : 'var(--line)'}`,
        background: selected ? 'var(--primary-soft)' : 'var(--chalk)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color .12s, background .12s',
      }}
    >
      {/* Striped placeholder thumbnail */}
      <div style={{
        height: 90,
        background: `repeating-linear-gradient(135deg, ${clip.thumbnail.color}18 0px, ${clip.thumbnail.color}18 8px, transparent 8px, transparent 16px)`,
        borderBottom: '1px solid var(--line)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        backgroundColor: `${clip.thumbnail.color}0a`,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12,
          letterSpacing: '.08em', color: clip.thumbnail.color,
          background: 'rgba(255,255,255,.85)', padding: '3px 8px',
          borderRadius: 4,
        }}>{clip.thumbnail.label}</span>
        <span style={{
          position: 'absolute', bottom: 6, right: 8,
          fontFamily: 'var(--font-mono)', fontSize: 10,
          background: 'rgba(0,0,0,.55)', color: '#fff',
          padding: '1px 5px', borderRadius: 3,
        }}>{clip.duration}</span>
        <span style={{
          position: 'absolute', top: 6, left: 8,
          fontFamily: 'var(--font-mono)', fontSize: 9,
          color: 'var(--muted)',
        }}>{clip.half} · {clip.min}'</span>
      </div>
      <div style={{ padding: '8px 10px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{clip.title}</div>
        <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginBottom: 6 }}>{clip.match} · {clip.date}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {clip.tags.map(t => {
            const tag = LINGO_TAGS.find(x => x.id === t);
            const col = TAG_CAT_COLOR[tag?.cat] || TAG_CAT_COLOR['Outcome'];
            return (
              <span key={t} style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
                letterSpacing: '.06em', padding: '1px 5px',
                borderRadius: 3, background: col.bg, color: col.fg,
              }}>{t}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const VideoClips = () => {
  const [selectedId, setSelectedId] = React.useState('c1');
  const [filterTag, setFilterTag] = React.useState(null);
  const [filterCat, setFilterCat] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [pendingTags, setPendingTags] = React.useState({});
  const [aiSuggesting, setAiSuggesting] = React.useState(false);

  const clip = SAMPLE_CLIPS.find(c => c.id === selectedId);

  const effectiveTags = clip
    ? [...(clip.tags || []), ...(pendingTags[clip.id] || [])]
    : [];

  const toggleTag = (tagId) => {
    if (!clip) return;
    if (clip.tags.includes(tagId)) return; // already committed
    setPendingTags(prev => {
      const current = prev[clip.id] || [];
      const next = current.includes(tagId)
        ? current.filter(t => t !== tagId)
        : [...current, tagId];
      return { ...prev, [clip.id]: next };
    });
  };

  const commitTags = () => {
    if (!clip) return;
    // In a real app this would persist. Here we just clear pending.
    setPendingTags(prev => ({ ...prev, [clip.id]: [] }));
  };

  const filteredClips = SAMPLE_CLIPS.filter(c => {
    if (filterTag && !c.tags.includes(filterTag)) return false;
    if (filterCat !== 'All') {
      const catTags = LINGO_TAGS.filter(t => t.cat === filterCat).map(t => t.id);
      if (!c.tags.some(t => catTags.includes(t))) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.match.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  const handleAiSuggest = () => {
    setAiSuggesting(true);
    setTimeout(() => setAiSuggesting(false), 1200);
  };

  return (
    <div className="page" style={{ paddingBottom: 60 }}>
      <div className="page-head">
        <div>
          <div className="eyebrow">Match library · {SEASON_YEAR} season</div>
          <h1>Video clips</h1>
          <div className="meta">{SAMPLE_CLIPS.length} clips · {Object.values(pendingTags).flat().length} pending tags · auto-tagged by AI</div>
        </div>
        <div className="row gap-3">
          <button className="btn"><span className="ico">⤓</span> Import clips</button>
          <button className="btn accent sm" onClick={handleAiSuggest}>
            {aiSuggesting ? '⏳ Analysing…' : '✦ AI auto-tag all'}
          </button>
          <button className="btn primary"><span className="ico">+</span> Upload clip</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14, alignItems: 'flex-start' }}>

        {/* Left — clip grid + filters */}
        <div className="col">
          {/* Filter bar */}
          <div className="card" style={{ padding: '12px 14px' }}>
            <div className="row gap-3 wrap">
              <input
                className="input"
                placeholder="Search clips, tags, matches…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: 240 }}
              />
              <div style={{ width: 1, height: 28, background: 'var(--line)' }} />
              {TAG_CATS.map(cat => (
                <button
                  key={cat}
                  className={`chip ${filterCat === cat ? 'active' : ''}`}
                  onClick={() => { setFilterCat(cat); setFilterTag(null); }}
                >{cat}</button>
              ))}
              {filterTag && (
                <button
                  className="chip active"
                  onClick={() => setFilterTag(null)}
                  style={{ background: 'var(--warn)', borderColor: 'var(--warn)', color: '#fff' }}
                >
                  {filterTag} ×
                </button>
              )}
              <div style={{ flex: 1 }} />
              <span className="mono">{filteredClips.length} clips</span>
            </div>
          </div>

          {/* Clip grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10 }}>
            {filteredClips.map(c => (
              <Clip
                key={c.id}
                clip={c}
                selected={selectedId === c.id}
                onSelect={setSelectedId}
              />
            ))}
            {/* Import placeholder */}
            <div
              style={{
                borderRadius: 10, border: '2px dashed var(--line-strong)',
                background: 'var(--paper-2)',
                height: 180,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 6, cursor: 'pointer', color: 'var(--muted)',
              }}
            >
              <span style={{ fontSize: 28 }}>⤓</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>Drop a clip here</span>
              <span style={{ fontSize: 11 }}>.mp4 · .mov · YouTube link</span>
            </div>
          </div>

          {/* AI auto-tag banner */}
          <div className="ai-card">
            <div className="ai-glyph">AI</div>
            <div className="body">
              <b>Auto-tag in progress</b> — the analyst scanned 2 new clips from last week and suggested <em>BLITZ + TURNOVER</em> for the Hamiltons ruck steal. Review and confirm with one tap.
            </div>
            <button className="btn accent sm">Review 2 suggestions</button>
            <button className="btn sm">Skip</button>
          </div>
        </div>

        {/* Right — clip detail + tagger */}
        {clip && (
          <div className="col" style={{ position: 'sticky', top: 'calc(var(--topbar-h) + 14px)' }}>
            {/* Clip preview */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Large thumbnail */}
              <div style={{
                height: 160,
                background: `repeating-linear-gradient(135deg,
                  ${LINGO_TAGS.find(t => t.id === clip.tags[0]) ? TAG_CAT_COLOR[LINGO_TAGS.find(t => t.id === clip.tags[0]).cat].fg : 'var(--ink)'}18 0px,
                  ${LINGO_TAGS.find(t => t.id === clip.tags[0]) ? TAG_CAT_COLOR[LINGO_TAGS.find(t => t.id === clip.tags[0]).cat].fg : 'var(--ink)'}18 10px,
                  transparent 10px, transparent 20px)`,
                backgroundColor: `${clip.thumbnail.color}0d`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
                borderBottom: '1px solid var(--line)',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'rgba(0,0,0,.45)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, margin: '0 auto 6px',
                    cursor: 'pointer',
                  }}>▶</div>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    background: 'rgba(0,0,0,.55)', color: '#fff',
                    padding: '2px 6px', borderRadius: 3,
                  }}>{clip.duration} · {clip.half} · {clip.min}'</span>
                </div>
                <span style={{
                  position: 'absolute', top: 10, left: 12,
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  background: 'rgba(0,0,0,.55)', color: '#fff',
                  padding: '2px 7px', borderRadius: 3, letterSpacing: '.06em',
                }}>VIDEO PLACEHOLDER</span>
              </div>

              <div style={{ padding: '12px 14px 14px' }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{clip.title}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 10 }}>
                  {clip.match} · {clip.date}
                </div>
                {clip.note && (
                  <div style={{
                    fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.55,
                    padding: '8px 10px', background: 'var(--paper-2)',
                    borderRadius: 7, borderLeft: '3px solid var(--accent)', marginBottom: 10,
                  }}>
                    {clip.note}
                  </div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                  {effectiveTags.map(t => {
                    const tag = LINGO_TAGS.find(x => x.id === t);
                    const col = TAG_CAT_COLOR[tag?.cat] || TAG_CAT_COLOR['Outcome'];
                    const isPending = (pendingTags[clip.id] || []).includes(t);
                    return (
                      <span key={t} style={{
                        fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                        letterSpacing: '.06em', padding: '2px 7px',
                        borderRadius: 4, background: col.bg, color: col.fg,
                        border: isPending ? `1.5px dashed ${col.fg}` : '1.5px solid transparent',
                        cursor: 'pointer',
                      }} onClick={() => toggleTag(t)} title={tag?.desc}>
                        {t}{isPending ? ' ×' : ''}
                      </span>
                    );
                  })}
                </div>
                {(pendingTags[clip.id] || []).length > 0 && (
                  <button className="btn primary sm" style={{ width: '100%', justifyContent: 'center', marginBottom: 6 }} onClick={commitTags}>
                    Save {(pendingTags[clip.id] || []).length} new tag{(pendingTags[clip.id] || []).length > 1 ? 's' : ''}
                  </button>
                )}
                <div className="row gap-2">
                  <button className="btn sm ghost">Share</button>
                  <button className="btn sm ghost">Trim</button>
                  <button className="btn sm ghost accent">Add to playlist</button>
                </div>
              </div>
            </div>

            {/* Tag editor */}
            <div className="card">
              <div className="card-head">
                <div className="card-title">Tag this clip</div>
                <button className="btn ghost sm" onClick={handleAiSuggest}>
                  {aiSuggesting ? '⏳' : '✦ AI suggest'}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TAG_CATS.filter(c => c !== 'All').map(cat => {
                  const col = TAG_CAT_COLOR[cat];
                  const catTags = LINGO_TAGS.filter(t => t.cat === cat);
                  return (
                    <div key={cat}>
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: 9,
                        letterSpacing: '.1em', textTransform: 'uppercase',
                        color: col.fg, marginBottom: 5, fontWeight: 600,
                      }}>{cat}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {catTags.map(tag => {
                          const active = effectiveTags.includes(tag.id);
                          return (
                            <button
                              key={tag.id}
                              onClick={() => toggleTag(tag.id)}
                              title={tag.desc}
                              style={{
                                fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                                letterSpacing: '.06em', padding: '3px 8px',
                                borderRadius: 4,
                                background: active ? col.fg : col.bg,
                                color: active ? (cat === 'Set Piece' || cat === 'Zone' || cat === 'Outcome' ? 'var(--ink)' : '#fff') : col.fg,
                                border: 'none', cursor: 'pointer',
                                opacity: clip.tags.includes(tag.id) ? 0.7 : 1,
                              }}
                            >
                              {tag.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {aiSuggesting && (
                <div style={{
                  marginTop: 12, padding: '10px 12px',
                  background: 'var(--ink)', borderRadius: 8, color: 'var(--paper)',
                  fontSize: 13, lineHeight: 1.5,
                }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 600 }}>✦ Analyst sees:</span>{' '}
                  Based on the timestamp and match context, this looks like a <b>BLITZ</b> call with a <b>TURNOVER</b> outcome.
                  <div className="row gap-2" style={{ marginTop: 8 }}>
                    <button className="btn accent sm" onClick={() => { ['BLITZ','TURNOVER'].forEach(t => toggleTag(t)); setAiSuggesting(false); }}>
                      Apply both
                    </button>
                    <button className="btn sm" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--paper)', borderColor: 'transparent' }} onClick={() => setAiSuggesting(false)}>
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tag frequency mini-chart */}
            <div className="card paper">
              <div className="card-head">
                <div className="card-title">Most-used tags</div>
                <span className="mono">all {SAMPLE_CLIPS.length} clips</span>
              </div>
              {(() => {
                const counts = {};
                SAMPLE_CLIPS.forEach(c => c.tags.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
                return Object.entries(counts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([tagId, count]) => {
                    const tag = LINGO_TAGS.find(t => t.id === tagId);
                    const col = TAG_CAT_COLOR[tag?.cat] || TAG_CAT_COLOR['Outcome'];
                    const max = Math.max(...Object.values(counts));
                    return (
                      <div key={tagId} style={{ marginBottom: 6 }}>
                        <div className="row between" style={{ marginBottom: 2 }}>
                          <button
                            onClick={() => setFilterTag(filterTag === tagId ? null : tagId)}
                            style={{
                              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                              letterSpacing: '.06em', padding: '1px 6px',
                              borderRadius: 3, background: filterTag === tagId ? col.fg : col.bg,
                              color: filterTag === tagId ? '#fff' : col.fg,
                              border: 'none', cursor: 'pointer',
                            }}
                          >{tagId}</button>
                          <span className="mono">{count}</span>
                        </div>
                        <div className="meter" style={{ height: 5 }}>
                          <div style={{ width: `${(count / max) * 100}%`, background: col.fg, height: '100%', borderRadius: 4 }} />
                        </div>
                      </div>
                    );
                  });
              })()}
              <div className="mono" style={{ marginTop: 6, fontSize: 9, color: 'var(--muted)' }}>
                Click a tag to filter the grid
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { VideoClips });
