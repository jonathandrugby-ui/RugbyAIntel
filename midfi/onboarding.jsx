/* RugbyAI mid-fi — Onboarding / Season Setup */

/* ─────────────────────────────────────────────
   Colour extraction + theme utilities
   ───────────────────────────────────────────── */

const _rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return [h * 360, s, l];
};

const _hslToRgb = (h, s, l) => {
  h /= 360;
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1/3) * 255),
    Math.round(hue2rgb(p, q, h)       * 255),
    Math.round(hue2rgb(p, q, h - 1/3) * 255),
  ];
};

const _toHex = (r, g, b) =>
  '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

const _hexToRgb = hex => {
  const v = parseInt(hex.replace('#', ''), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
};

const _shiftL = (hex, delta) => {
  const [r, g, b] = _hexToRgb(hex);
  const [h, s, l] = _rgbToHsl(r, g, b);
  return _toHex(..._hslToRgb(h, s, Math.max(0, Math.min(1, l + delta))));
};

const _rgba = (hex, a) => {
  const [r, g, b] = _hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
};

/* Extract dominant primary + accent from an HTMLImageElement */
const extractBrandColors = (imgEl) => {
  const SIZE = 96;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE; canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgEl, 0, 0, SIZE, SIZE);
  const d = ctx.getImageData(0, 0, SIZE, SIZE).data;

  const buckets = new Map();
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i+1], b = d[i+2], a = d[i+3];
    if (a < 128) continue;
    // skip near-white / near-black
    const lum = (r * 299 + g * 587 + b * 114) / 1000;
    if (lum > 238 || lum < 14) continue;
    // 5-bit bucket per channel
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    const bk  = buckets.get(key);
    if (bk) { bk.r += r; bk.g += g; bk.b += b; bk.n++; }
    else       buckets.set(key, { r, g, b, n: 1 });
  }

  if (buckets.size === 0) return null; // transparent / mono logo

  const cols = Array.from(buckets.values()).map(bk => {
    const r = bk.r / bk.n, g = bk.g / bk.n, b = bk.b / bk.n;
    const [h, s, l] = _rgbToHsl(r, g, b);
    return { r, g, b, h, s, l, n: bk.n };
  });

  // Primary: darkest prominent cluster (l < 0.44, decent saturation)
  const darkPool = cols.filter(c => c.l < 0.44 && c.s > 0.08)
                       .sort((a, b) => b.n - a.n);
  const primary  = darkPool[0] || cols.sort((a, b) => a.l - b.l)[0];

  // Accent: most saturated + reasonably different hue
  const accentPool = cols.filter(c =>
    c.s > 0.28 && c.l > 0.22 && c.l < 0.72 &&
    Math.min(Math.abs(c.h - primary.h), 360 - Math.abs(c.h - primary.h)) > 25
  ).sort((a, b) => (b.s * b.n) - (a.s * a.n));

  const accent = accentPool[0] || null;

  return {
    primary: _toHex(primary.r, primary.g, primary.b),
    accent:  accent
      ? _toHex(accent.r, accent.g, accent.b)
      : _toHex(..._hslToRgb((primary.h + 145) % 360, 0.62, 0.46)),
  };
};

/* Apply a brand palette live to the document */
const applyBrandTheme = (primary, accent) => {
  const root = document.documentElement;
  root.style.setProperty('--primary',      primary);
  root.style.setProperty('--primary-2',    _shiftL(primary, 0.09));
  root.style.setProperty('--primary-soft', _rgba(primary, 0.08));
  root.style.setProperty('--accent',       accent);
  root.style.setProperty('--accent-2',     _shiftL(accent, -0.12));
  root.style.setProperty('--accent-soft',  _rgba(accent, 0.14));
};

const resetBrandTheme = () => {
  const root = document.documentElement;
  ['--primary','--primary-2','--primary-soft','--accent','--accent-2','--accent-soft']
    .forEach(v => root.style.removeProperty(v));
};

/* ─────────────────────────────────────────────
   Onboarding shell
   ───────────────────────────────────────────── */

const STEPS = [
  { id: 'club',     label: 'Your club' },
  { id: 'season',   label: 'Season basics' },
  { id: 'squad',    label: 'Squad import' },
  { id: 'fixtures', label: 'Fixtures' },
  { id: 'done',     label: 'Done' },
];

const Onboarding = () => {
  const [step, setStep] = React.useState(0);
  const [club, setClub] = React.useState({
    name:    'Warwick Pumas RFC',
    short:   'PUM',
    nick:    'The Pumas',
    primary: '#182b54',
    accent:  '#c9941e',
    home:    'Sportground 1, Cape Town',
    logoUrl: null,
  });
  const [season, setSeason] = React.useState({
    year: '2024', league: 'Western Cape Premier B', warmups: 5, matches: 14,
  });
  const [squadMethod, setSquadMethod] = React.useState('csv');
  const [csvText, setCsvText]         = React.useState('');
  const [fixturesEntered, setFixturesEntered] = React.useState(false);

  const next = () => setStep(s => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep(s => Math.max(0, s - 1));

  /* Keep CSS vars in sync whenever club colours change */
  React.useEffect(() => {
    applyBrandTheme(club.primary, club.accent);
  }, [club.primary, club.accent]);

  return (
    <div className="onb-shell">
      <div className="eyebrow" style={{ marginBottom: 8 }}>Week 1 · fresh season setup</div>
      <h1 style={{ marginBottom: 8 }}>Let's get the season on the board.</h1>
      <div className="meta" style={{ marginBottom: 24, fontSize: 15, color: 'var(--ink-soft)' }}>
        Five steps. Skip whatever isn't ready yet — you can come back from <b>Settings → Season setup</b>.
      </div>

      <div className="onb-steps">
        {STEPS.map((s, i) => (
          <div key={s.id} className={`onb-step ${i < step ? 'done' : i === step ? 'active' : ''}`}
            onClick={() => i < step && setStep(i)}>
            <span className="num">{i < step ? '✓' : i + 1}</span>
            <span className="lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {step === 0 && <StepClub club={club} setClub={setClub} onNext={next} />}
      {step === 1 && <StepSeason season={season} setSeason={setSeason} onPrev={prev} onNext={next} />}
      {step === 2 && <StepSquad method={squadMethod} setMethod={setSquadMethod} csv={csvText} setCsv={setCsvText} onPrev={prev} onNext={next} />}
      {step === 3 && <StepFixtures entered={fixturesEntered} setEntered={setFixturesEntered} onPrev={prev} onNext={next} />}
      {step === 4 && <StepDone club={club} />}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Step 1 — Club + Logo + Brand colours
   ───────────────────────────────────────────── */

const PRESET_PALETTES = [
  { p: '#182b54', a: '#c9941e', name: 'Navy & Gold' },
  { p: '#1f3d28', a: '#c98a2d', name: 'Forest' },
  { p: '#5a1d2a', a: '#d7a04a', name: 'Maroon' },
  { p: '#1d3f5e', a: '#de7637', name: 'Sky & Amber' },
  { p: '#0e1424', a: '#b8412d', name: 'Ink & Red' },
];

const StepClub = ({ club, setClub, onNext }) => {
  const [extracting, setExtracting]   = React.useState(false);
  const [extracted,  setExtracted]    = React.useState(!!club.logoUrl);
  const [dragOver,   setDragOver]     = React.useState(false);
  const fileInputRef = React.useRef();

  const processImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setExtracting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const colors = extractBrandColors(img);
        if (colors) {
          setClub(c => ({ ...c, logoUrl: e.target.result, primary: colors.primary, accent: colors.accent }));
          setExtracted(true);
        } else {
          setClub(c => ({ ...c, logoUrl: e.target.result }));
          setExtracted(false);
        }
        setExtracting(false);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e) => processImageFile(e.target.files[0]);
  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    processImageFile(e.dataTransfer.files[0]);
  };

  const removeLogo = () => {
    setClub(c => ({ ...c, logoUrl: null }));
    setExtracted(false);
    resetBrandTheme();
    setClub(c => ({ ...c, primary: '#182b54', accent: '#c9941e' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const logoSideLen = 120;

  return (
    <div className="onb-card">
      <h2>What club are we coaching?</h2>
      <div className="muted" style={{ marginBottom: 20, fontSize: 15 }}>
        This is what shows on team sheets, parent updates, and the dashboard hero.
      </div>

      {/* ── Logo upload + live brand extraction ── */}
      <div style={{ marginBottom: 24 }}>
        <span className="mono" style={{ display: 'block', marginBottom: 10 }}>Club logo · brand colours</span>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

          {/* Drop zone / preview */}
          <div
            onClick={() => !club.logoUrl && fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            style={{
              width: logoSideLen, height: logoSideLen, borderRadius: 16, flexShrink: 0,
              border: dragOver ? '2.5px dashed var(--primary)' : club.logoUrl ? '2px solid var(--line)' : '2px dashed var(--line)',
              background: dragOver ? 'var(--primary-soft)' : club.logoUrl ? 'var(--paper-2)' : 'var(--paper-2)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: club.logoUrl ? 'default' : 'pointer', position: 'relative', overflow: 'hidden',
              transition: 'border-color .15s, background .15s',
            }}
          >
            {club.logoUrl ? (
              <>
                <img src={club.logoUrl} alt="Club logo"
                  style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: 8 }} />
                <button
                  onClick={e => { e.stopPropagation(); removeLogo(); }}
                  title="Remove logo"
                  style={{
                    position: 'absolute', top: 5, right: 5,
                    background: 'rgba(0,0,0,.45)', border: 0, borderRadius: '50%',
                    width: 20, height: 20, color: '#fff', cursor: 'pointer',
                    fontSize: 12, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >×</button>
              </>
            ) : extracting ? (
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', textAlign: 'center', padding: 8 }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>⟳</div>
                Extracting…
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 10 }}>
                <div style={{ fontSize: 28, marginBottom: 6, color: 'var(--ink-soft)' }}>⊕</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>Upload logo</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>PNG · SVG · JPG</div>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={onFileChange}
          />

          {/* Colour result panel */}
          <div style={{ flex: 1 }}>
            {club.logoUrl && extracted ? (
              /* Extracted colours */
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: 'var(--ok)', fontWeight: 700 }}>✦ Brand colours extracted</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>— applied across the app</span>
                </div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  <div>
                    <div style={{ width: 56, height: 40, background: club.primary, borderRadius: 8, marginBottom: 4, border: '1px solid rgba(0,0,0,.1)' }} />
                    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)', fontWeight: 700 }}>PRIMARY</div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--ink)', marginTop: 1 }}>{club.primary}</div>
                  </div>
                  <div>
                    <div style={{ width: 56, height: 40, background: club.accent, borderRadius: 8, marginBottom: 4, border: '1px solid rgba(0,0,0,.1)' }} />
                    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)', fontWeight: 700 }}>ACCENT</div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--ink)', marginTop: 1 }}>{club.accent}</div>
                  </div>
                  {/* Live preview swatch */}
                  <div style={{ marginLeft: 4, padding: '8px 12px', borderRadius: 8, background: club.primary, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', opacity: .7 }}>PREVIEW</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700 }}>{club.short || 'RFC'}</div>
                    <div style={{ width: '100%', height: 4, borderRadius: 2, background: club.accent, marginTop: 2 }} />
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginBottom: 8 }}>
                  Not quite right? Pick a preset or upload a different logo.
                </div>
              </div>
            ) : club.logoUrl && !extracted ? (
              <div style={{ padding: '12px 16px', background: 'var(--paper-2)', borderRadius: 10, border: '1px solid var(--line)', fontSize: 13, color: 'var(--ink-soft)' }}>
                Couldn't auto-detect colours from this logo — pick one below instead.
              </div>
            ) : (
              <div style={{ padding: '14px 16px', background: 'var(--paper-2)', borderRadius: 10, border: '1px dashed var(--line)', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                <b style={{ color: 'var(--ink)' }}>Upload your club badge</b> and we'll instantly extract your brand colours and apply them across the whole app — sidebar, buttons, badges, and charts.
              </div>
            )}

            {/* Preset palette swatches */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: club.logoUrl && extracted ? 0 : 14 }}>
              {PRESET_PALETTES.map(c => {
                const sel = club.primary === c.p && club.accent === c.a;
                return (
                  <button key={c.name}
                    onClick={() => { setClub(prev => ({ ...prev, primary: c.p, accent: c.a })); setExtracted(false); }}
                    title={c.name}
                    style={{
                      padding: '8px 10px', background: 'var(--paper)', cursor: 'pointer',
                      border: sel ? '2px solid var(--ink)' : '1px solid var(--line)',
                      borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 5, font: 'inherit',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 3 }}>
                      <div style={{ width: 28, height: 18, background: c.p, borderRadius: 3 }} />
                      <div style={{ width: 18, height: 18, background: c.a, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.04em', color: 'var(--ink-soft)' }}>{c.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom hex pickers */}
            <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)', fontWeight: 700 }}>PRIMARY</label>
                <input type="color" value={club.primary}
                  onChange={e => { setClub(c => ({ ...c, primary: e.target.value })); setExtracted(false); }}
                  style={{ width: 28, height: 28, padding: 2, borderRadius: 6, border: '1px solid var(--line)', cursor: 'pointer', background: 'var(--paper)' }}
                />
                <input value={club.primary} readOnly
                  style={{ width: 72, fontSize: 11, fontFamily: 'var(--font-mono)', padding: '3px 6px', borderRadius: 5, border: '1px solid var(--line)', background: 'var(--paper-2)' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)', fontWeight: 700 }}>ACCENT</label>
                <input type="color" value={club.accent}
                  onChange={e => { setClub(c => ({ ...c, accent: e.target.value })); setExtracted(false); }}
                  style={{ width: 28, height: 28, padding: 2, borderRadius: 6, border: '1px solid var(--line)', cursor: 'pointer', background: 'var(--paper)' }}
                />
                <input value={club.accent} readOnly
                  style={{ width: 72, fontSize: 11, fontFamily: 'var(--font-mono)', padding: '3px 6px', borderRadius: 5, border: '1px solid var(--line)', background: 'var(--paper-2)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="hr" />

      {/* Club name fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <FormRow label="Club name" hint="Full official name">
          <input className="input" value={club.name} onChange={e => setClub({ ...club, name: e.target.value })} />
        </FormRow>
        <FormRow label="Short code" hint="3–4 letters · used on scoreboards">
          <input className="input" maxLength={4} value={club.short}
            onChange={e => setClub({ ...club, short: e.target.value.toUpperCase() })}
            style={{ width: 100, fontFamily: 'var(--font-mono)', letterSpacing: '.1em' }} />
        </FormRow>
        <FormRow label="Nickname" hint="Optional — for the social channel">
          <input className="input" value={club.nick} onChange={e => setClub({ ...club, nick: e.target.value })} />
        </FormRow>
        <FormRow label="Home ground" hint="Address shows on fixture cards">
          <input className="input" value={club.home} onChange={e => setClub({ ...club, home: e.target.value })} />
        </FormRow>
      </div>

      <div className="row gap-3" style={{ marginTop: 28, justifyContent: 'flex-end' }}>
        <button className="btn primary lg" onClick={onNext}>Next: season basics →</button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Step 2 — Season basics
   ───────────────────────────────────────────── */
const StepSeason = ({ season, setSeason, onPrev, onNext }) => (
  <div className="onb-card">
    <h2>The 2024 season at a glance.</h2>
    <div className="muted" style={{ marginBottom: 20, fontSize: 15 }}>Just the structure. You'll add actual fixtures next.</div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <FormRow label="Season year">
        <input className="input" value={season.year} onChange={e => setSeason({ ...season, year: e.target.value })}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 16 }} />
      </FormRow>
      <FormRow label="League / division">
        <input className="input" value={season.league} onChange={e => setSeason({ ...season, league: e.target.value })} />
      </FormRow>
      <FormRow label="Warmup matches" hint="Pre-season friendlies">
        <input className="input" type="number" min="0" max="20" value={season.warmups}
          onChange={e => setSeason({ ...season, warmups: +e.target.value })} style={{ width: 100 }} />
      </FormRow>
      <FormRow label="League fixtures" hint="Regular season + playoffs">
        <input className="input" type="number" min="0" max="40" value={season.matches}
          onChange={e => setSeason({ ...season, matches: +e.target.value })} style={{ width: 100 }} />
      </FormRow>
    </div>

    <hr className="hr" />

    <FormRow label="Practice rhythm" hint="So the planner can pre-fill the calendar">
      <div className="row gap-3 wrap">
        {['Tue + Thu', 'Mon + Wed + Fri', 'Wed + Fri', 'Tue + Thu + Sat AM', 'Custom'].map(p => (
          <button key={p} className={`chip ${p === 'Tue + Thu' ? 'active' : ''}`}>{p}</button>
        ))}
      </div>
    </FormRow>

    <div className="row between" style={{ marginTop: 28 }}>
      <button className="btn" onClick={onPrev}>← Back</button>
      <button className="btn primary lg" onClick={onNext}>Next: squad import →</button>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Step 3 — Squad
   ───────────────────────────────────────────── */
const StepSquad = ({ method, setMethod, csv, setCsv, onPrev, onNext }) => {
  const sampleCsv = `Position,First Name,Last Name,Phone,Notes
Loosehead Prop,Luthando,Bulana,+27 82 ...,Captain
Hooker,Siyasanga,Mkiva,+27 71 ...,
Tighthead Prop,Sipho,Nkosi,+27 83 ...,
Lock,Thabo,Jacobs,+27 76 ...,
...`;
  return (
    <div className="onb-card">
      <h2>Get the squad on the board.</h2>
      <div className="muted" style={{ marginBottom: 20, fontSize: 15 }}>Bulk import is fastest. You can always edit and add later from the Squad screen.</div>

      <div className="row gap-3" style={{ marginBottom: 18 }}>
        {[
          ['csv',    '📋 Paste from spreadsheet'],
          ['file',   '⤓ Upload CSV / Excel'],
          ['manual', '✎ Add players one by one'],
          ['skip',   '⏭ Skip for now'],
        ].map(([k, lbl]) => (
          <button key={k} onClick={() => setMethod(k)}
            className={`chip ${method === k ? 'active' : ''}`}
            style={{ padding: '10px 14px', fontSize: 14 }}>
            {lbl}
          </button>
        ))}
      </div>

      {method === 'csv' && (
        <>
          <div className="mono" style={{ marginBottom: 6 }}>Paste rows from your spreadsheet — we'll match the columns</div>
          <textarea className="input" placeholder={sampleCsv} value={csv}
            onChange={e => setCsv(e.target.value)} rows={10}
            style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 12, resize: 'vertical' }} />
          {csv && (
            <div className="card paper" style={{ marginTop: 12, padding: 12 }}>
              <div className="row between">
                <div>
                  <div className="mono">Preview</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{csv.split('\n').filter(l => l.trim()).length - 1} players detected</div>
                </div>
                <Badge variant="ok">Ready to import</Badge>
              </div>
            </div>
          )}
        </>
      )}
      {method === 'file' && (
        <div className="empty-zone" style={{ padding: 40 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>⤓</div>
          <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>Drop your roster file here</div>
          <div>or <button className="btn sm" style={{ verticalAlign: 'baseline' }}>browse files</button> — accepts .csv, .xlsx, .numbers</div>
          <div className="row gap-3" style={{ justifyContent: 'center', marginTop: 18 }}>
            <Badge variant="outline">Squad List sheet</Badge>
            <Badge variant="outline">Player Registry</Badge>
            <Badge variant="outline">Last season export</Badge>
          </div>
        </div>
      )}
      {method === 'manual' && (
        <>
          <div className="mono" style={{ marginBottom: 6 }}>Add one player to start. You can finish the rest later.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
            <input className="input" placeholder="Position" />
            <input className="input" placeholder="First name" />
            <input className="input" placeholder="Surname" />
            <input className="input" placeholder="Phone" />
          </div>
          <button className="btn sm" style={{ marginTop: 10 }}>+ Add another</button>
        </>
      )}
      {method === 'skip' && (
        <div className="empty-zone" style={{ padding: 30 }}>
          That's fine — you can build the squad as the season goes. The app will be a little quieter until then.
        </div>
      )}

      <hr className="hr" />

      <div className="row gap-3" style={{ marginBottom: 6 }}>
        <div className="ai-glyph" style={{ width: 28, height: 28, fontSize: 14 }}>AI</div>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
          The analyst learns from squad data over time — caps, ratings, availability. It'll be ready to help with XV selection once a few matches are logged.
        </div>
      </div>

      <div className="row between" style={{ marginTop: 24 }}>
        <button className="btn" onClick={onPrev}>← Back</button>
        <button className="btn primary lg" onClick={onNext}>Next: fixtures →</button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Step 4 — Fixtures
   ───────────────────────────────────────────── */
const StepFixtures = ({ entered, setEntered, onPrev, onNext }) => (
  <div className="onb-card">
    <h2>What's the fixture list?</h2>
    <div className="muted" style={{ marginBottom: 20, fontSize: 15 }}>Paste, import, or skip. Each fixture creates a Match Day workspace.</div>

    {!entered ? (
      <div className="empty-zone" style={{ padding: 36 }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>📅</div>
        <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>No fixtures yet</div>
        <div>Drop a CSV, paste from the union website, or add them one at a time.</div>
        <div className="row gap-3" style={{ justifyContent: 'center', marginTop: 18 }}>
          <button className="btn primary" onClick={() => setEntered(true)}>Add fixtures</button>
          <button className="btn">Import from .csv</button>
          <button className="btn">Skip for now</button>
        </div>
      </div>
    ) : (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 80px 110px 110px', gap: 6, alignItems: 'center', marginBottom: 8 }}>
          <span className="mono">Type</span>
          <span className="mono">Opposition</span>
          <span className="mono">H/A</span>
          <span className="mono">Date</span>
          <span className="mono">Kickoff</span>
        </div>
        {[
          ['Warmup', 'False Bay', 'HOME', '16 Feb', '15:00'],
          ['Warmup', 'Rocklands', 'AWAY', '24 Feb', '15:30'],
          ['League', 'Stellenberg', 'HOME', '30 Mar', '15:00'],
        ].map((row, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 80px 110px 110px', gap: 6, marginBottom: 4 }}>
            <select className="input" defaultValue={row[0]}><option>Warmup</option><option>League</option><option>Cup</option></select>
            <input className="input" defaultValue={row[1]} />
            <select className="input" defaultValue={row[2]}><option>HOME</option><option>AWAY</option></select>
            <input className="input" defaultValue={row[3]} />
            <input className="input" defaultValue={row[4]} style={{ fontFamily: 'var(--font-mono)' }} />
          </div>
        ))}
        <button className="btn sm" style={{ marginTop: 10 }}>+ Add fixture</button>
        <div className="row gap-3" style={{ marginTop: 14 }}>
          <Badge variant="ok"><span className="dot" />3 fixtures · 16 to go</Badge>
          <Badge variant="outline">Auto-generate practice calendar</Badge>
        </div>
      </>
    )}

    <div className="row between" style={{ marginTop: 24 }}>
      <button className="btn" onClick={onPrev}>← Back</button>
      <button className="btn primary lg" onClick={onNext}>Finish setup →</button>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Step 5 — Done
   ───────────────────────────────────────────── */
const StepDone = ({ club }) => (
  <div className="onb-card" style={{ textAlign: 'center' }}>
    <div style={{
      width: 64, height: 64, borderRadius: 16,
      background: club.logoUrl ? 'transparent' : 'var(--accent)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontSize: club.logoUrl ? 'inherit' : 36, fontWeight: 700,
      marginBottom: 16, overflow: 'hidden', border: club.logoUrl ? '2px solid var(--line)' : 'none',
    }}>
      {club.logoUrl
        ? <img src={club.logoUrl} alt={club.name} style={{ width: 64, height: 64, objectFit: 'contain' }} />
        : '✓'}
    </div>
    <h2 style={{ fontSize: 36 }}>{club.name} is on the board.</h2>
    <div className="muted" style={{ marginBottom: 28, fontSize: 16 }}>
      The dashboard, squad, and Match Day are ready. The analyst will start surfacing trends after a few matches.
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, textAlign: 'left' }}>
      <div className="card paper">
        <div className="mono">Next up</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, marginTop: 4 }}>Build your XV</div>
        <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>Open Match Day to draft a team sheet for the first warmup.</div>
        <button className="btn sm primary" style={{ marginTop: 10 }}>Open Match Day →</button>
      </div>
      <div className="card paper">
        <div className="mono">Then</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, marginTop: 4 }}>Plan practice</div>
        <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>The calendar's pre-filled with Tue/Thu slots — drop drills in.</div>
        <button className="btn sm" style={{ marginTop: 10 }}>Open Practice</button>
      </div>
      <div className="card paper">
        <div className="mono">Anytime</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, marginTop: 4 }}>Ask the analyst</div>
        <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>"What did we learn from pre-season?" — quietly powerful once data flows.</div>
        <button className="btn sm accent" style={{ marginTop: 10 }}>Open Analyst</button>
      </div>
    </div>

    <div className="row gap-3" style={{ justifyContent: 'center', marginTop: 28 }}>
      <button className="btn primary lg">Go to dashboard</button>
      <button className="btn">Invite assistant coach</button>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Tiny helpers
   ───────────────────────────────────────────── */
const FormRow = ({ label, hint, children }) => (
  <div className="col tight" style={{ gap: 4 }}>
    <span className="mono">{label}</span>
    {children}
    {hint && <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{hint}</span>}
  </div>
);

Object.assign(window, { Onboarding });
