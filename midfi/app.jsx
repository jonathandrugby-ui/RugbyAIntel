/* RugbyAI mid-fi — App router + tweaks */

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

  const navTo = (id) => { setRoute(id); setFocusPracticeDate(null); };
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
          />
        )}

        {route === 'dashboard'  && <Dashboard />}
        {route === 'squad'      && <Squad />}
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
