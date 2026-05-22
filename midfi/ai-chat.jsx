/* RugbyAI mid-fi — AI Floating Chat Widget */

/* ---------- Simulated AI response engine ---------- */
const _AI_RULES = [
  {
    match: /\b(available|saturday|sunday|starting|select|fifteen|xv|pick|lineup)\b/i,
    response: () => {
      const avail = SQUAD.filter(p => p.fit === 'Good' && p.status === 'Committed');
      const inj   = SQUAD.filter(p => p.fit !== 'Good');
      const top5  = avail.sort((a,b)=>b.caps-a.caps).slice(0,5).map(p=>`${p.fn} ${p.ln}`).join(', ');
      return `**${avail.length} players** are fit and committed right now.\n\nFor Saturday vs UCT, I'd anchor the XV around your most-capped contracted players: ${top5} — and others.\n\n${inj.length > 0 ? `⚠️ Unavailable: ${inj.map(p=>`${p.fn} ${p.ln} (${p.fit})`).join(', ')}.` : '✅ No current injury concerns.'}`;
    },
  },
  {
    match: /\b(uct|upcoming|next match|jun|june|fixture|opponent)\b/i,
    response: () => `Your next league fixture is **vs UCT on Jun 14 (HOME)**.\n\nContext: You lost 19–24 to UCT in the warmup. They're strong at the breakdown and transition defence.\n\n**My recommendation:** Focus Tuesday's session on ruck speed and counter-rucking. Lineout must be bulletproof — UCT target maul ball under pressure.\n\nWant me to draft a practice plan for the week?`,
  },
  {
    match: /\b(form|results?|season|record|wins?|losses?|points?|score|how.*(we|team)|stats?)\b/i,
    response: () => {
      const played  = FIXTURES.filter(f => f.result && !f.upcoming);
      const wins    = played.filter(f => f.result === 'W').length;
      const losses  = played.filter(f => f.result === 'L').length;
      const ptsFor  = played.reduce((s,f)=>s+(f.f||0),0);
      const ptsAg   = played.reduce((s,f)=>s+(f.a||0),0);
      const ratio   = (ptsFor/Math.max(ptsAg,1)*100).toFixed(0);
      return `**Season record: ${wins}W – ${losses}L** (${played.length} played)\n\nPoints for: **${ptsFor}** | Against: **${ptsAg}** | Ratio: ${ratio}%\n\nBest result: Rocklands away (W 19–17)\nToughest loss: Tygerberg away (L 7–103)\n\nLeague form is trending up — Rocklands win on May 25 showed real improvement in ball retention. 📈 3 fixtures left to finish strong.`;
    },
  },
  {
    match: /\b(practice|drill|session|training|train|coach|plan|week)\b/i,
    response: () => `For the UCT build-up I'd suggest:\n\n**Tuesday** — Breakdown & jackalling (40 min)\n**Wednesday** — Set piece: lineout & scrum work (50 min)\n**Thursday** — Phase play, off-9 attack (35 min)\n\nKey focus cues: *"Low body height at contact"* and *"Ruck and move — no camping."*\n\nHead to the **Practice Planner** to build this out, or I can walk you through drill options.`,
  },
  {
    match: /\b(player|squad|roster|sign|contract|re-sign|caps|experience)\b/i,
    response: () => {
      const contracted   = SQUAD.filter(p => p.contract);
      const noContract   = SQUAD.filter(p => !p.contract && p.status === 'Committed');
      const topCap       = [...SQUAD].sort((a,b)=>b.caps-a.caps)[0];
      return `**Squad overview — ${SQUAD.length} players**\n\nContracted: ${contracted.length} | Off-contract (committed): ${noContract.length}\n\n⚡ Highest-capped: **${topCap.fn} ${topCap.ln}** (${topCap.caps} caps)\n\n${noContract.length > 0 ? `💬 **Action needed:** ${noContract.length} committed players are off-contract — ${noContract.slice(0,3).map(p=>p.fn+' '+p.ln).join(', ')}… Consider initiating re-signing conversations before end of June.` : ''}`;
    },
  },
  {
    match: /\b(injur|fit|recover|unavailable|health|medical)\b/i,
    response: () => {
      const issues = SQUAD.filter(p => p.fit !== 'Good');
      if (issues.length === 0) return `✅ **No current fitness concerns.** All ${SQUAD.length} squad members are showing "Good" fitness.\n\nI'll flag anything that changes before Saturday.`;
      return `**Fitness report:**\n\n${issues.map(p=>`⚠️ **${p.fn} ${p.ln}** (${p.pos}) — ${p.fit}`).join('\n')}\n\nMonitor recovery sessions closely. I'll re-assess closer to match day.`;
    },
  },
  {
    match: /\b(opponent|intel|scout|analysis|rocklands|stellenberg|tygerberg|helderberg|villager|hamiltons)\b/i,
    response: () => `Cross-referencing match data with opponent profiles:\n\n🔴 **Stellenberg** — Physical pack, dominant maul. Lost 12–38 to them. Anticipate direct carries at 10.\n🟡 **Helderberg** — 10–42 loss. High line speed in defence — use width early.\n🟢 **Rocklands** — Beaten them twice. Vulnerable on left channel in D.\n🔵 **UCT** (upcoming) — Fast recycling, strong at the breakdown. Win first contact.\n\nHead to **Opponent Intel** for full cards. Want a pre-match brief on any team?`,
  },
  {
    match: /\b(video|clip|footage|review|highlight)\b/i,
    response: () => `I've tagged **47 clips** from the last 3 matches:\n\n• 12 breakdown turnovers (8 against, 4 won)\n• 9 lineout sequences (6 clean, 3 disrupted)\n• 14 phase attack patterns\n• 12 defensive shape moments\n\nMost flagged pattern: **Slow ruck ball (3+ sec) → defensive reset**. This appeared 11 times vs Hamiltons.\n\nHead to **Video Clips** to review with timestamp notes.`,
  },
];

const _AI_DEFAULT = `I'm the **RugbyAI Analyst** — here to help with anything Warwick Pumas RFC.\n\nI can help with:\n• **Team selection** & availability\n• **Season stats** & form analysis\n• **Upcoming fixture** preparation\n• **Training recommendations**\n• **Opponent intelligence**\n• **Squad & contract management**\n\nWhat would you like to explore?`;

const SUGGESTED_PROMPTS = [
  "Who's available for Saturday?",
  "How's our season going?",
  "Prep me for UCT on Jun 14",
  "Any fitness concerns?",
];

const AI_GREETING = {
  role: 'ai',
  text: `**Good to see you, Coach Louw.** 👋\n\nQuick brief: **3 fixtures** remaining this season, next up is UCT at home on Jun 14. You have ${(SQUAD||[]).filter(p=>p.fit==='Good').length} fit players in the squad.\n\nWhat would you like to know?`,
  ts: () => new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),
};

const resolveAI = (msg) => {
  for (const rule of _AI_RULES) {
    if (rule.match.test(msg)) return rule.response();
  }
  return _AI_DEFAULT;
};

/* Markdown-lite: bold (**x**), line breaks */
const MdText = ({ text }) => {
  const lines = text.split('\n');
  return (
    <span>
      {lines.map((line, li) => {
        const parts = line.split(/\*\*(.+?)\*\*/g);
        return (
          <React.Fragment key={li}>
            {parts.map((p, pi) =>
              pi % 2 === 1
                ? <strong key={pi} style={{ fontWeight: 700 }}>{p}</strong>
                : <React.Fragment key={pi}>{p}</React.Fragment>
            )}
            {li < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </span>
  );
};

/* -------- AIChat component -------- */
const AIChat = () => {
  const [open, setOpen]       = React.useState(false);
  const [messages, setMsgs]   = React.useState(() => [
    { role: 'ai', text: AI_GREETING.text, ts: AI_GREETING.ts() }
  ]);
  const [input, setInput]     = React.useState('');
  const [thinking, setThink]  = React.useState(false);
  const [unread, setUnread]   = React.useState(false);
  const bottomRef             = React.useRef(null);
  const inputRef              = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const send = (text) => {
    const msg = (text !== undefined ? text : input).trim();
    if (!msg || thinking) return;
    setInput('');
    const ts = new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    setMsgs(prev => [...prev, { role: 'user', text: msg, ts }]);
    setThink(true);
    const delay = 700 + Math.random() * 700;
    setTimeout(() => {
      const reply = resolveAI(msg);
      const replyTs = new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
      setMsgs(prev => [...prev, { role: 'ai', text: reply, ts: replyTs }]);
      setThink(false);
      if (!open) setUnread(true);
    }, delay);
  };

  const showSuggestions = messages.length <= 2 && !thinking;

  return (
    <>
      {/* ── Chat panel ─────────────────────────────── */}
      {open && (
        <div className="aichat-panel-wrap" style={{
          position: 'fixed', bottom: 82, right: 20, width: 368, height: 508,
          background: 'var(--chalk)', borderRadius: 18,
          boxShadow: '0 12px 48px rgba(0,0,0,.22), 0 2px 8px rgba(0,0,0,.10)',
          display: 'flex', flexDirection: 'column', zIndex: 9999,
          border: '1px solid rgba(0,0,0,.09)', overflow: 'hidden',
          animation: 'aichat-rise .22s cubic-bezier(.22,.68,0,1.2) both',
        }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-2) 100%)',
            color: '#fff', padding: '13px 16px',
            display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(255,255,255,.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, flexShrink: 0,
            }}>✦</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>AI Analyst</div>
              <div style={{ fontSize: 10, opacity: .7, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block',
                }} />
                Warwick Pumas RFC · RugbyAI
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'rgba(255,255,255,.12)', border: 'none', color: '#fff',
                width: 28, height: 28, borderRadius: '50%', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0,
              }}
            >×</button>
          </div>

          {/* Message thread */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '14px 14px 8px',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                gap: 7, alignItems: 'flex-end',
              }}>
                {m.role === 'ai' && (
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: 'var(--primary)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, marginBottom: 2,
                  }}>✦</div>
                )}
                <div style={{
                  maxWidth: '82%',
                  background: m.role === 'user' ? 'var(--primary)' : 'var(--paper)',
                  color: m.role === 'user' ? '#fff' : 'var(--ink)',
                  borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '2px 12px 12px 12px',
                  padding: '8px 12px', fontSize: 12, lineHeight: 1.6,
                  border: m.role === 'ai' ? '1px solid var(--rule)' : 'none',
                }}>
                  <MdText text={m.text} />
                  <div style={{
                    fontSize: 9, opacity: .45, marginTop: 4,
                    textAlign: m.role === 'user' ? 'right' : 'left',
                  }}>{m.ts}</div>
                </div>
              </div>
            ))}

            {/* Thinking dots */}
            {thinking && (
              <div style={{ display: 'flex', gap: 7, alignItems: 'flex-end' }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--primary)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, marginBottom: 2,
                }}>✦</div>
                <div style={{
                  background: 'var(--paper)', border: '1px solid var(--rule)',
                  borderRadius: '2px 12px 12px 12px', padding: '10px 14px',
                  display: 'flex', gap: 4, alignItems: 'center',
                }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 5, height: 5, borderRadius: '50%', background: 'var(--muted)',
                      animation: `aichat-dot .9s ${i*0.2}s ease-in-out infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Suggested prompts */}
          {showSuggestions && (
            <div style={{
              padding: '6px 12px 8px',
              display: 'flex', flexWrap: 'wrap', gap: 5,
              borderTop: '1px solid var(--rule)',
            }}>
              {SUGGESTED_PROMPTS.map((p, i) => (
                <button key={i} onClick={() => send(p)} style={{
                  background: 'var(--primary-soft)',
                  border: '1px solid rgba(24,43,84,.15)',
                  borderRadius: 20, padding: '4px 11px',
                  fontSize: 10.5, cursor: 'pointer',
                  color: 'var(--primary)', fontFamily: 'inherit',
                  fontWeight: 600, transition: 'background .15s',
                  whiteSpace: 'nowrap',
                }}>{p}</button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div style={{
            padding: '9px 12px', borderTop: '1px solid var(--rule)',
            display: 'flex', gap: 8, alignItems: 'center',
            background: 'var(--chalk)', flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              placeholder="Ask about squad, fixtures, tactics…"
              style={{
                flex: 1, border: '1px solid var(--rule)',
                borderRadius: 20, padding: '7px 13px',
                fontSize: 12, fontFamily: 'inherit',
                background: 'var(--paper)', color: 'var(--ink)',
                outline: 'none', transition: 'border-color .15s',
              }}
              onFocus={e  => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e   => e.target.style.borderColor = 'var(--rule)'}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || thinking}
              style={{
                width: 34, height: 34, borderRadius: '50%', border: 'none',
                background: input.trim() && !thinking ? 'var(--primary)' : 'var(--rule)',
                color: '#fff',
                cursor: input.trim() && !thinking ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0, transition: 'background .15s',
              }}
            >↑</button>
          </div>
        </div>
      )}

      {/* ── Floating button ─────────────────────────── */}
      <button
        className="aichat-float-btn"
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 20, right: 20,
          width: 54, height: 54, borderRadius: '50%',
          background: open ? 'var(--primary-2)' : 'var(--primary)',
          color: '#fff', border: 'none',
          boxShadow: open
            ? '0 4px 20px rgba(0,0,0,.22)'
            : '0 4px 20px rgba(0,0,0,.28), 0 0 0 0 var(--primary-soft)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, zIndex: 10000,
          transition: 'background .2s, transform .18s, box-shadow .2s',
          transform: open ? 'rotate(45deg) scale(1)' : 'scale(1)',
          animation: !open ? 'aichat-pulse 3s 2s ease-in-out 3' : 'none',
        }}
        title={open ? 'Close AI Analyst' : 'Open AI Analyst'}
        onMouseEnter={e => { if (!open) e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {open ? '×' : '✦'}
        {unread && !open && (
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 10, height: 10, borderRadius: '50%',
            background: 'var(--accent)',
            border: '2px solid #fff',
            pointerEvents: 'none',
          }} />
        )}
      </button>

      {/* ── Keyframe styles ─────────────────────────── */}
      <style>{`
        @keyframes aichat-rise {
          from { opacity: 0; transform: translateY(18px) scale(.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   }
        }
        @keyframes aichat-dot {
          0%, 80%, 100% { transform: scale(.65); opacity: .35; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
        @keyframes aichat-pulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,.28), 0 0 0 0 var(--primary-soft); }
          50%       { box-shadow: 0 4px 20px rgba(0,0,0,.28), 0 0 0 10px transparent; }
        }
      `}</style>
    </>
  );
};

Object.assign(window, { AIChat });
