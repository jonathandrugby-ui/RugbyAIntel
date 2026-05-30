/* RugbyAI mid-fi — App router + tweaks */

/* ── Shared overlay helper ── */
const Overlay = ({ onClose, children, width = 520 }) => (
  <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.45)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20 }}>
    <div onClick={e => e.stopPropagation()} style={{ background:'var(--paper)',borderRadius:14,width:'100%',maxWidth:width,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,.3)' }}>
      {children}
    </div>
  </div>
);
const OverlayHead = ({ title, sub, onClose }) => (
  <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',padding:'22px 24px 0' }}>
    <div>
      <div style={{ fontFamily:'var(--font-display)',fontSize:20,fontWeight:700 }}>{title}</div>
      {sub && <div style={{ fontSize:13,color:'var(--ink-soft)',marginTop:2 }}>{sub}</div>}
    </div>
    <button onClick={onClose} style={{ background:'none',border:'none',fontSize:22,cursor:'pointer',color:'var(--muted)',lineHeight:1,marginTop:-2 }}>×</button>
  </div>
);

/* ── Help panel ── */
const HELP_SECTIONS = [
  { icon:'◆', title:'Season', desc:'Your home base. Log results, track wins/losses, and watch your record build.' },
  { icon:'◇', title:'Squad', desc:'Import players via CSV or add them manually. Track fitness and availability.' },
  { icon:'▣', title:'Match Day', desc:'Build your XV, create a pre-match runsheet, and manage the game live.' },
  { icon:'▦', title:'Calendar', desc:'All fixtures and practices in one view. Click any date to add events.' },
  { icon:'◔', title:'Practice', desc:'Plan sessions, drag in drills from the library, assign leads and groups.' },
  { icon:'◈', title:'Tactical Intel', desc:'AI match briefing with opponent patterns and win probability model.' },
  { icon:'✦', title:'Analyst', desc:'Ask anything — XV selection, form trends, injury risks, opponent analysis.' },
];
const HelpPanel = ({ onClose, onTour }) => (
  <Overlay onClose={onClose} width={560}>
    <OverlayHead title="RugbyAI — Help" sub="Coach Cockpit · Mid-fi prototype" onClose={onClose} />
    <div style={{ padding:'20px 24px 24px' }}>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20 }}>
        {HELP_SECTIONS.map(s => (
          <div key={s.title} style={{ background:'var(--sand)',borderRadius:10,padding:'12px 14px' }}>
            <div style={{ fontSize:18,marginBottom:4 }}>{s.icon}</div>
            <div style={{ fontWeight:600,fontSize:14,marginBottom:3 }}>{s.title}</div>
            <div style={{ fontSize:12,color:'var(--ink-soft)',lineHeight:1.45 }}>{s.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ borderTop:'1px solid var(--border)',paddingTop:16,display:'flex',gap:10 }}>
        <button className="btn primary" onClick={onTour}>▶ Take the tour</button>
        <button className="btn" onClick={onClose}>Close</button>
      </div>
    </div>
  </Overlay>
);

/* ── Alerts / upcoming matches panel ── */
const AlertsPanel = ({ onClose, onNav }) => {
  const upcoming = FIXTURES.filter(f => !f.result).slice(0, 5);
  return (
    <Overlay onClose={onClose} width={400}>
      <OverlayHead title="⏰ Upcoming" sub="Fixtures & reminders" onClose={onClose} />
      <div style={{ padding:'16px 24px 24px' }}>
        {upcoming.length === 0 ? (
          <div className="muted" style={{ textAlign:'center',padding:'20px 0' }}>No upcoming fixtures</div>
        ) : upcoming.map((f,i) => (
          <div key={i} style={{ display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:i<upcoming.length-1?'1px solid var(--border)':'none' }}>
            <div style={{ width:42,height:42,borderRadius:10,background:f.venue==='HOME'?'var(--primary)':'var(--sand)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:f.venue==='HOME'?'#fff':'var(--ink)',fontFamily:'var(--font-mono)' }}>
              {f.venue==='HOME'?'H':'A'}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600,fontSize:14 }}>vs {f.opp}</div>
              <div style={{ fontSize:12,color:'var(--ink-soft)' }}>{f.date} · {f.kickoff||'15:00'} KO · {f.type}</div>
            </div>
          </div>
        ))}
        <button className="btn sm" style={{ marginTop:14,width:'100%' }} onClick={() => { onClose(); onNav('calendar'); }}>View full calendar →</button>
      </div>
    </Overlay>
  );
};

/* ── App tour overlay ── */
const TOUR_STEPS = [
  { route:'dashboard', icon:'◆', title:'Season at a Glance', desc:'Your command centre. Log results after every match and watch your record, points difference, and form update automatically.' },
  { route:'squad',     icon:'◇', title:'Squad Management',   desc:'Import players from a CSV, or add them one by one. Track who\'s committed, injured, or unavailable — then poll them for availability by email.' },
  { route:'match',     icon:'▣', title:'Match Day Workspace', desc:'Build your team sheet, set up a pre-match runsheet, and switch to Live mode for real-time substitution tracking.' },
  { route:'calendar',  icon:'▦', title:'Season Calendar',    desc:'Every fixture and practice in one view. Click any week to drill in, or use Month view to see the full picture.' },
  { route:'practice',  icon:'◔', title:'Practice Planner',   desc:'Plan your week\'s sessions, drag drills from the library, assign focus areas and group leads.' },
  { route:'tactical',  icon:'◈', title:'Tactical Intelligence', desc:'AI match briefing tailored to your next opponent — predictive patterns, win probability, and counter-play suggestions.' },
  { route:'analyst',   icon:'✦', title:'AI Analyst',         desc:'Ask anything. XV selection advice, form trends, injury risk flags, opponent scouting — all grounded in your own data.' },
];
const TourOverlay = ({ step, onNext, onPrev, onClose, onNav }) => {
  const s = TOUR_STEPS[step];
  if (!s) { onClose(); return null; }
  React.useEffect(() => { onNav(s.route); }, [step]);
  const isLast = step === TOUR_STEPS.length - 1;
  return (
    <div style={{ position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',zIndex:999,width:520,background:'var(--primary)',color:'#fff',borderRadius:16,padding:'20px 24px',boxShadow:'0 12px 40px rgba(0,0,0,.4)',display:'flex',gap:16,alignItems:'flex-start' }}>
      <div style={{ fontSize:32,lineHeight:1 }}>{s.icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:11,opacity:.7,letterSpacing:.08,textTransform:'uppercase',marginBottom:4 }}>Step {step+1} of {TOUR_STEPS.length}</div>
        <div style={{ fontFamily:'var(--font-display)',fontSize:17,fontWeight:700,marginBottom:6 }}>{s.title}</div>
        <div style={{ fontSize:13,opacity:.85,lineHeight:1.55 }}>{s.desc}</div>
        <div style={{ display:'flex',gap:8,marginTop:14 }}>
          {step > 0 && <button onClick={onPrev} style={{ background:'rgba(255,255,255,.15)',border:'none',color:'#fff',borderRadius:8,padding:'7px 14px',cursor:'pointer',fontSize:13 }}>← Back</button>}
          <button onClick={isLast ? onClose : onNext} style={{ background:'var(--accent)',border:'none',color:'#fff',borderRadius:8,padding:'7px 16px',cursor:'pointer',fontWeight:600,fontSize:13 }}>{isLast ? 'Done ✓' : 'Next →'}</button>
          <button onClick={onClose} style={{ background:'none',border:'none',color:'rgba(255,255,255,.6)',cursor:'pointer',fontSize:13,marginLeft:'auto' }}>Skip tour</button>
        </div>
      </div>
    </div>
  );
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "pumas",
  "density": "regular"
}/*EDITMODE-END*/;

/* --- Crumb labels per route --- */
const CRUMBS = {
  dashboard: <>Workspace / <b>Season</b></>,
  squad:     <>Workspace / <b>Squad</b></>,
  match:     <>Workspace / Match Day / <b>Fixtures</b></>,
  ratings:   <>Workspace / Match Day / <b>Ratings</b></>,
  calendar:  <>Workspace / <b>Calendar</b></>,
  practice:  <>Workspace / Calendar / <b>Practice planner</b></>,
  opponent:  <>Workspace / <b>Opponent Intel</b></>,
  video:     <>Workspace / <b>Video Clips</b></>,
  playbook:  <>Workspace / <b>Playbook</b></>,
  tactical:  <>Analytics / <b>Tactical Intelligence</b></>,
  setpiece:  <>Analytics / <b>Set Piece Trends</b></>,
  kicking:   <>Analytics / <b>Kicking &amp; Territory</b></>,
  workload:  <>Analytics / <b>Workload &amp; Fatigue</b></>,
  breakdown: <>Analytics / <b>Collision &amp; Breakdown</b></>,
  analyst:   <>Assistant / <b>Analyst</b></>,
  onboarding:<>Setup / <b>New season</b></>,
};

const App = () => {
  /* ── Team setup store ── */
  const setup = useTeamSetup();

  /* ── Routing — default to onboarding when no team is set up ── */
  const [route, setRoute] = React.useState(() => {
    if (!setup.hasSetup) return 'onboarding';
    const u = new URL(window.location.href);
    return u.searchParams.get('r') || 'dashboard';
  });
  const [focusPracticeDate, setFocusPracticeDate] = React.useState(null);

  /* When setup changes (reset → re-onboard) force onboarding route */
  React.useEffect(() => {
    if (!setup.hasSetup) setRoute('onboarding');
  }, [setup.hasSetup]);

  /* Apply custom brand colours whenever teamInfo changes */
  React.useEffect(() => {
    if (setup.hasSetup && setup.teamInfo?.primary && setup.teamInfo?.accent) {
      document.documentElement.style.setProperty('--primary',      setup.teamInfo.primary);
      document.documentElement.style.setProperty('--primary-soft', setup.teamInfo.primary + '18');
      document.documentElement.style.setProperty('--accent',       setup.teamInfo.accent);
    }
  }, [setup.hasSetup, setup.teamInfo]);

  /* ── Sidebar open/closed — persisted in localStorage ── */
  const [sidebarOpen, setSidebarOpen] = React.useState(() => {
    try { return localStorage.getItem('rugbyai-sidebar') !== 'closed'; }
    catch { return true; }
  });
  const toggleSidebar = () => setSidebarOpen(s => {
    const next = !s;
    try { localStorage.setItem('rugbyai-sidebar', next ? 'open' : 'closed'); } catch {}
    return next;
  });

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const store = usePractices();

  React.useEffect(() => {
    document.documentElement.setAttribute('data-palette', t.palette);
    document.documentElement.setAttribute('data-density', t.density);
  }, [t.palette, t.density]);

  React.useEffect(() => {
    const u = new URL(window.location.href);
    u.searchParams.set('r', route);
    window.history.replaceState({}, '', u.toString());
  }, [route]);

  const [showHelp,   setShowHelp]   = React.useState(false);
  const [showAlerts, setShowAlerts] = React.useState(false);
  const [tourStep,   setTourStep]   = React.useState(-1);

  const navTo = (id) => { setRoute(id); setFocusPracticeDate(null); };

  /* Expose navTo globally so child components can navigate without prop drilling */
  React.useEffect(() => { window.navTo = navTo; });
  const jumpToPractice = (iso) => { setFocusPracticeDate(iso); setRoute('practice'); };

  /* Called by Onboarding Done step */
  const handleSetupComplete = (team, squad, fixtures) => {
    setup.commitSetup(team, squad, fixtures);
    navTo('dashboard');
  };

  /* Full reset — clears all data and returns to onboarding */
  const handleReset = () => {
    setup.resetSetup();
    store.resetSeed(); // also clears practices localStorage key
    /* Clear practice store */
    try { localStorage.removeItem('rugbyai_practices_v1'); } catch {}
  };

  /* Onboarding is full-screen — hide sidebar/nav */
  const isOnboarding = route === 'onboarding';

  return (
    <div
      className="app-shell"
      data-screen-label={`Mid-Fi · ${route}`}
      data-sidebar={isOnboarding ? 'closed' : (sidebarOpen ? 'open' : 'closed')}
    >
      {!isOnboarding && (
        <Sidebar
          active={route}
          onNav={navTo}
          onCollapse={toggleSidebar}
          teamInfo={setup.teamInfo}
          squadCount={SQUAD.length}
        />
      )}

      <main className="main">
        {!isOnboarding && (
          <TopBar
            crumb={CRUMBS[route]}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
            onHelp={() => setShowHelp(true)}
            onAlerts={() => setShowAlerts(true)}
            onTour={() => setTourStep(0)}
          />
        )}

        {route === 'dashboard'  && <Dashboard onNav={navTo} />}
        {route === 'squad'      && <Squad onNav={navTo} />}
        {route === 'match'      && <MatchDay onNav={navTo} />}
        {route === 'ratings'    && <Ratings />}
        {route === 'calendar'   && (
          <SeasonCalendar
            practices={store.practices}
            jumpToPractice={jumpToPractice}
            addPractice={store.createSession}
          />
        )}
        {route === 'practice'   && (
          <PracticePlanner
            practices={store.practices}
            addDrill={store.addDrill}
            addDrillToSession={store.addDrillToSession}
            addSession={store.addSession}
            removeDrill={store.removeDrill}
            removePractice={store.removePractice}
            resetSeed={store.resetSeed}
            focusDate={focusPracticeDate}
          />
        )}
        {route === 'opponent'   && <OpponentIntel />}
        {route === 'video'      && <VideoClips />}
        {route === 'playbook'   && <Playbook />}
        {route === 'tactical'   && <TacticalIntelligence />}
        {route === 'setpiece'   && <SetPieceTrends />}
        {route === 'kicking'    && <KickingAnalytics />}
        {route === 'workload'   && <WorkloadRisk />}
        {route === 'breakdown'  && <BreakdownEfficiency />}
        {route === 'analyst'    && <Analyst />}
        {route === 'onboarding' && (
          <Onboarding onComplete={handleSetupComplete} />
        )}
      </main>

      {/* Mobile bottom tab navigation — hidden during onboarding */}
      {!isOnboarding && <MobileNav active={route} onNav={navTo} />}

      {/* Floating AI chat widget — accessible from any screen */}
      <AIChat />

      {/* Global overlay panels */}
      {showHelp   && <HelpPanel   onClose={() => setShowHelp(false)}   onTour={() => { setShowHelp(false); setTourStep(0); }} />}
      {showAlerts && <AlertsPanel onClose={() => setShowAlerts(false)} onNav={navTo} />}
      {tourStep >= 0 && <TourOverlay step={tourStep} onNext={() => setTourStep(s => s+1)} onPrev={() => setTourStep(s => Math.max(0,s-1))} onClose={() => setTourStep(-1)} onNav={navTo} />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Team palette">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[
              { key: 'pumas',  label: 'Pumas',  swatch: ['#182b54','#c9941e','#faf7ed'] },
              { key: 'forest', label: 'Forest', swatch: ['#1f3d28','#c98a2d','#f4f1e4'] },
              { key: 'maroon', label: 'Maroon', swatch: ['#5a1d2a','#d7a04a','#f6efe6'] },
              { key: 'sky',    label: 'Sky',    swatch: ['#1d3f5e','#de7637','#f3f1ea'] },
            ].map(p => {
              const sel = t.palette === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => setTweak('palette', p.key)}
                  style={{
                    border: sel ? '2px solid #29261b' : '1px solid rgba(0,0,0,.15)',
                    borderRadius: 8,
                    padding: '6px 8px',
                    background: 'rgba(255,255,255,.6)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex', flexDirection: 'column', gap: 4,
                    font: 'inherit',
                  }}
                >
                  <div style={{ display: 'flex', gap: 2, height: 18 }}>
                    {p.swatch.map(c => (
                      <div key={c} style={{ flex: 1, background: c, borderRadius: 2 }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>{p.label}</span>
                </button>
              );
            })}
          </div>
        </TweakSection>

        <TweakSection label="Density">
          <TweakRadio
            label="Row density"
            value={t.density}
            onChange={v => setTweak('density', v)}
            options={['compact','regular','comfy']}
          />
        </TweakSection>

        <TweakSection label="Data">
          <TweakButton onClick={handleReset}>↺ Clear all data — restart onboarding</TweakButton>
          <TweakButton onClick={store.resetSeed}>↺ Reset practice sessions to seed data</TweakButton>
        </TweakSection>

        <TweakSection label="Jump to screen" />
        {Object.entries({
          dashboard:   '◆ Season Dashboard',
          squad:       '◇ Squad List',
          match:       '▣ Match Day',
          ratings:     '★ Match Ratings',
          calendar:    '▦ Season Calendar',
          practice:    '◔ Practice Planner',
          opponent:    '◉ Opponent Intel',
          video:       '▶ Video Clips',
          playbook:    '☰ Playbook',
          tactical:    '◈ Tactical Intel',
          setpiece:    '⬆ Set Piece Trends',
          kicking:     '◎ Kicking & Territory',
          workload:    '◑ Workload & Fatigue',
          breakdown:   '⊕ Breakdown',
          analyst:     '✦ Analyst (AI)',
          onboarding:  '✿ New season setup',
        }).map(([k, label]) => (
          <TweakButton key={k} onClick={() => navTo(k)}>{label}</TweakButton>
        ))}
      </TweaksPanel>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
