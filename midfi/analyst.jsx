/* RugbyAI mid-fi — Analyst (AI tab) */

const SAMPLE_THREADS = [
  { id: 't1', title: 'XV for UCT', last: 'Mathebula + Naidoo at 9-10', when: 'today', active: true },
  { id: 't2', title: 'Why are we losing lineouts?', last: 'Lift timing on weak side', when: 'yest.' },
  { id: 't3', title: 'Practice plan — scrums', last: '2-week block draft', when: '3d ago' },
  { id: 't4', title: 'Mkiva feedback note', last: 'sent · 4 paragraphs', when: '4d ago' },
  { id: 't5', title: 'Tries against UCT 2023', last: '5 tries · 3 from kicks', when: '1w ago' },
  { id: 't6', title: 'Bench impact analysis', last: '+60% try rate since R5', when: '1w ago' },
];

const Analyst = () => {
  const [input, setInput] = React.useState('');
  const next = FIXTURES.find(f => f.upcoming);

  return (
    <div className="page" style={{ padding: '14px 18px 0', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - var(--topbar-h))' }}>
      <div className="page-head" style={{ marginBottom: 14 }}>
        <div>
          <div className="eyebrow">Coach's analyst  ·  Haiku-class</div>
          <h1>What do you want to know?</h1>
        </div>
        <div className="row gap-3">
          <button className="btn"><span className="ico">⤓</span> Export thread</button>
          <button className="btn primary"><span className="ico">+</span> New thread</button>
        </div>
      </div>

      <div className="split analyst" style={{ flex: 1, alignItems: 'stretch' }}>
        {/* Threads */}
        <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 14px 8px', borderBottom: '1px solid var(--line)' }}>
            <div className="row between">
              <span className="card-title">Threads</span>
              <span className="kbd">⌘ N</span>
            </div>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {SAMPLE_THREADS.map(t => (
              <div key={t.id} style={{
                padding: '10px 14px',
                background: t.active ? 'var(--paper-2)' : 'transparent',
                borderLeft: t.active ? '3px solid var(--accent)' : '3px solid transparent',
                borderBottom: '1px solid var(--line-soft)',
                cursor: 'pointer',
              }}>
                <div className="row between" style={{ marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: t.active ? 600 : 500, color: 'var(--ink)' }}>{t.title}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.last}</div>
                <div className="mono" style={{ marginTop: 2 }}>{t.when}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: 12, borderTop: '1px solid var(--line)', background: 'var(--paper-2)' }}>
            <div className="mono" style={{ marginBottom: 6 }}>Saved cards</div>
            <div className="row gap-2 wrap">
              <Badge variant="accent">UCT XV draft</Badge>
              <Badge>Lineout trends</Badge>
              <Badge>Petersen note</Badge>
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
            <div className="row between">
              <div>
                <div className="card-title">XV for UCT</div>
                <div className="mono">3 messages  ·  pulling from 4 sources</div>
              </div>
              <div className="row gap-2">
                <button className="btn ghost sm">Pin thread</button>
                <button className="btn ghost sm">⋯</button>
              </div>
            </div>
          </div>

          <div className="chat-thread" style={{ flex: 1, overflowY: 'auto' }}>
            <div className="bubble me">
              Who should I start at 9 and 10 vs UCT?
            </div>

            <div className="bubble ai">
              Looking at the last 5 matches against scrum-heavy sides like UCT, plus availability for Jun 14.<br />
              <span className="muted" style={{ fontSize: 12 }}>Pulled from Squad List · Match Ratings · Fixtures vs UCT (3yr) · Caps Tracker</span>
            </div>

            {/* AI result card — Suggested half-backs */}
            <div className="ai-result" style={{ alignSelf: 'flex-start', maxWidth: '90%' }}>
              <div className="ai-result-head">
                <div>
                  <div className="mono">Suggested half-backs</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 600, letterSpacing: '-.01em' }}>
                    Mathebula (9)  ·  Naidoo (10)
                  </div>
                </div>
                <div className="row gap-2">
                  <button className="btn sm">Pin</button>
                  <button className="btn sm accent">Apply to team sheet</button>
                </div>
              </div>
              <div className="ai-result-body">
                <div className="split two">
                  <div>
                    <div className="mono" style={{ marginBottom: 8 }}>Why 9 — K. Mathebula</div>
                    <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13, lineHeight: 1.7 }}>
                      <li>Form rating <b>+18%</b> over last 4 fixtures</li>
                      <li>Avg <b>2.4 try assists</b> per game (squad best)</li>
                      <li>Pass-speed vs UCT-style blitz def. — top quartile</li>
                      <li>Last meeting (Mar 9): 7/10 player rating</li>
                    </ul>
                  </div>
                  <div>
                    <div className="mono" style={{ marginBottom: 8 }}>Why 10 — M. Naidoo</div>
                    <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13, lineHeight: 1.7 }}>
                      <li>Kicking <b>78%</b> accuracy in own half</li>
                      <li>Calls Bus &amp; Bulls effectively (set-piece data)</li>
                      <li>Coetzee impact off bench <b>↑</b> when Naidoo starts</li>
                      <li>Best paired with Mathebula in 4 of last 5 wins</li>
                    </ul>
                  </div>
                </div>
                <hr className="hr dashed" />
                <div className="row gap-2 wrap">
                  <span className="ai-source">Source: Match Ratings (12)</span>
                  <span className="ai-source">Source: Caps Tracker</span>
                  <span className="ai-source">Source: vs UCT (7 matches)</span>
                  <span className="ai-source">Source: Lingo Reference</span>
                </div>
              </div>
            </div>

            <div className="bubble me">
              And what about #6? Codee-Waries is out.
            </div>

            <div className="bubble ai">
              Two viable options. I can draft both XVs side-by-side, or just pick one.
            </div>

            {/* Alternative card */}
            <div className="ai-result" style={{ alignSelf: 'flex-start', maxWidth: '90%' }}>
              <div className="ai-result-head">
                <div>
                  <div className="mono">#6 candidates</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 600 }}>Ambrosi or Bistoli</div>
                </div>
                <div className="row gap-2">
                  <button className="btn sm">Draft both</button>
                </div>
              </div>
              <div className="ai-result-body">
                <div className="split two">
                  <div className="card paper" style={{ padding: 12 }}>
                    <div className="row gap-3" style={{ marginBottom: 6 }}>
                      <Head p={SQUAD[1]} />
                      <div>
                        <div style={{ fontWeight: 600 }}>L. Ambrosi</div>
                        <div className="mono">Utility Fwd · 64c</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                      Bigger ball-carrier · slows UCT's blitz · fits Bulls play.
                    </div>
                    <div className="row gap-2" style={{ marginTop: 8 }}>
                      <Badge variant="ok">size +</Badge>
                      <Badge variant="warn">breakdown ↓</Badge>
                    </div>
                  </div>
                  <div className="card paper" style={{ padding: 12 }}>
                    <div className="row gap-3" style={{ marginBottom: 6 }}>
                      <Head p={SQUAD[3]} />
                      <div>
                        <div style={{ fontWeight: 600 }}>V. Bistoli</div>
                        <div className="mono">Utility Fwd · 28c</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                      Quick over the ball · strong jackal · suits high-tempo phases.
                    </div>
                    <div className="row gap-2" style={{ marginTop: 8 }}>
                      <Badge variant="ok">breakdown +</Badge>
                      <Badge variant="warn">avail. unknown</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Composer */}
          <div style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--line)' }}>
            <div className="composer">
              <textarea
                placeholder="Ask anything about the season, squad, opponent, last match…"
                value={input}
                onChange={e => setInput(e.target.value)}
                rows={2}
              />
              <div className="row between">
                <div className="row gap-2 wrap">
                  <button className="chip">📋 Draft XV</button>
                  <button className="chip">📊 Summarize match</button>
                  <button className="chip">📅 Plan practice</button>
                  <button className="chip">📈 Show trend</button>
                  <button className="chip">✉️ Player feedback</button>
                </div>
                <button className="btn primary sm">Send →</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right rail — context */}
        <div className="card" style={{ padding: 14, alignSelf: 'flex-start' }}>
          <div className="card-head">
            <div className="card-title">Context</div>
            <button className="btn ghost sm">Manage</button>
          </div>
          <div className="mono" style={{ marginBottom: 8 }}>What the analyst can see</div>
          <div className="col" style={{ gap: 8 }}>
            {[
              ['Squad List', '27 players', true],
              ['Fixtures 2024', '15 games', true],
              ['Match Ratings', '12 games', true],
              ['UCT head-to-head', '7 matches · 3yr', true],
              ['Lingo Reference', 'attack + defence', true],
              ['Coaching Facets', 'set piece KPIs', true],
              ['Practice plans', '8 plans', false],
              ['Video clips (drop-in)', '0 imported', false],
            ].map((c, i) => (
              <div key={i} className="row between" style={{ padding: '6px 0', borderBottom: '1px dashed var(--line)' }}>
                <span style={{ fontSize: 13 }}>{c[0]}</span>
                <div className="row gap-2">
                  <span className="mono">{c[1]}</span>
                  {c[2]
                    ? <span style={{ color: 'var(--ok)' }}>●</span>
                    : <span style={{ color: 'var(--muted)' }}>○</span>}
                </div>
              </div>
            ))}
          </div>

          <hr className="hr dashed" />

          <div className="mono" style={{ marginBottom: 8 }}>Quick prompts</div>
          <div className="col" style={{ gap: 6 }}>
            <button className="chip" style={{ justifyContent: 'flex-start', width: '100%' }}>Summarize last 3 matches</button>
            <button className="chip" style={{ justifyContent: 'flex-start', width: '100%' }}>Who's in red-zone fatigue?</button>
            <button className="chip" style={{ justifyContent: 'flex-start', width: '100%' }}>Compare us vs {next.opp} (UCT)</button>
            <button className="chip" style={{ justifyContent: 'flex-start', width: '100%' }}>Draft parent update — week 14</button>
          </div>

          <hr className="hr dashed" />

          <div style={{ padding: 10, background: 'var(--paper-2)', borderRadius: 8, fontSize: 12, color: 'var(--ink-soft)' }}>
            <b>Heads-up:</b> the analyst uses your team data only. No video tagging or external feeds enabled yet — connect from Settings → Integrations.
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Analyst });
