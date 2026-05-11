const { useState } = React;

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&family=Roboto+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#050806;--surf:#0b100c;--card:#101610;--card2:#161e16;
  --b:#1c2e1c;--ba:#c9960c;--bg2:#00c44a;
  --ad:#c9960c18;--gd:#00c44a18;
  --ag:0 0 20px #c9960c22;--gg:0 0 20px #00c44a22;
  --t:#dff0e0;--t2:#6b8e72;--t3:#3a5040;
  --red:#ff4444;--amber:#c9960c;--green:#00c44a;
  --fh:'Bebas Neue',sans-serif;--fb:'DM Sans',system-ui,sans-serif;--fm:'Roboto Mono',monospace;
}
body{background:var(--bg);overflow-x:hidden}
.app{min-height:100vh;background:var(--bg);font-family:var(--fb);color:var(--t);padding-bottom:72px}
.nav{position:fixed;bottom:0;left:0;right:0;background:var(--surf);border-top:1px solid var(--b);display:flex;z-index:100}
.nav-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px 2px 12px;cursor:pointer;transition:all .15s;border:none;background:none;color:var(--t3);gap:4px}
.nav-item:hover{color:var(--t2)}
.nav-item.active-a{color:var(--green)}
.nav-item.active-s{color:var(--amber)}
.nav-icon{font-size:17px;line-height:1}
.nav-label{font-family:var(--fm);font-size:7px;letter-spacing:1.2px;text-transform:uppercase}
.hdr{padding:14px 16px;border-bottom:1px solid var(--b);display:flex;align-items:center;gap:10px;background:var(--bg);position:sticky;top:0;z-index:50}
.hdr-logo{display:flex;align-items:center;gap:8px}
.hdr-s{width:8px;height:28px;background:var(--amber);border-radius:2px}
.hdr-g{width:8px;height:28px;background:var(--green);border-radius:2px;margin-left:2px}
.hdr-title{font-family:var(--fh);font-size:20px;letter-spacing:2px;color:var(--t)}
.hdr-sub{font-family:var(--fm);font-size:9px;color:var(--t3);letter-spacing:1px;margin-top:1px}
.hdr-right{margin-left:auto;display:flex;align-items:center;gap:6px;font-family:var(--fm);font-size:9px;color:var(--t3)}
.dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.section{max-width:680px;margin:0 auto;padding:20px 16px 32px}
.sec-lbl{font-family:var(--fm);font-size:9px;color:var(--t3);letter-spacing:2.5px;text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;gap:8px}
.sec-lbl::after{content:'';flex:1;height:1px;background:var(--b)}
.page-title{font-family:var(--fh);font-size:30px;letter-spacing:2px;margin-bottom:4px;color:var(--t)}
.page-sub{font-size:13px;color:var(--t2);margin-bottom:24px;line-height:1.5}
.soul-card{background:linear-gradient(135deg,#1a1200,#0e1a0e);border:1px solid var(--ba);border-radius:10px;padding:18px;margin-bottom:20px;position:relative;overflow:hidden}
.soul-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--amber),var(--green))}
.soul-card-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px}
.soul-team{font-family:var(--fh);font-size:26px;letter-spacing:2px;color:var(--t)}
.soul-badge{font-family:var(--fm);font-size:9px;background:var(--ad);border:1px solid var(--ba);color:var(--amber);padding:3px 8px;border-radius:3px;letter-spacing:1px}
.soul-preview{font-size:12px;color:var(--t2);line-height:1.6;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.soul-actions{display:flex;gap:6px;margin-top:12px}
.no-soul{border:1px dashed var(--b);border-radius:10px;padding:28px;text-align:center;margin-bottom:20px}
.no-soul-icon{font-size:28px;margin-bottom:10px}
.no-soul-title{font-family:var(--fh);font-size:18px;letter-spacing:1px;color:var(--t2);margin-bottom:4px}
.no-soul-sub{font-size:12px;color:var(--t3);margin-bottom:16px}
.quick-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px}
.quick-card{background:var(--card);border:1px solid var(--b);border-radius:8px;padding:12px;cursor:pointer;transition:all .15s;text-align:left}
.quick-card:hover{background:var(--card2);border-color:var(--bg2)}
.quick-card.amber:hover{border-color:var(--ba)}
.quick-name{font-family:var(--fh);font-size:14px;letter-spacing:.5px;color:var(--t);margin-bottom:2px}
.quick-desc{font-size:10px;color:var(--t3)}
.progress{display:flex;align-items:center;margin-bottom:24px}
.pr-step{display:flex;align-items:center;gap:6px;flex:1}
.pr-num{width:26px;height:26px;border-radius:50%;border:1px solid var(--b);background:var(--card);display:flex;align-items:center;justify-content:center;font-family:var(--fm);font-size:10px;color:var(--t3);flex-shrink:0;transition:all .2s}
.pr-num.on{border-color:var(--ba);color:var(--amber);background:var(--ad)}
.pr-num.done{border-color:var(--ba);background:var(--amber);color:#000}
.pr-lbl{font-size:10px;color:var(--t3)}
.pr-lbl.on{color:var(--amber)}
.pr-line{flex:1;height:1px;background:var(--b);margin:0 6px}
.pr-line.done{background:var(--amber)}
.field{margin-bottom:18px}
.lbl{font-family:var(--fm);font-size:9px;color:var(--t3);letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;display:block}
.lbl em{color:var(--amber);font-style:normal}
.inp{width:100%;background:var(--card);border:1px solid var(--b);border-radius:6px;padding:9px 11px;font-family:var(--fb);font-size:13px;color:var(--t);outline:none;transition:border-color .15s}
.inp:focus{border-color:var(--ba)}
.inp::placeholder{color:var(--t3)}
textarea.inp{resize:none;line-height:1.6}
select.inp{cursor:pointer;appearance:none}
.chips{display:flex;flex-wrap:wrap;gap:5px}
.chip{padding:5px 11px;border-radius:100px;font-size:11px;cursor:pointer;border:1px solid var(--b);background:var(--card);color:var(--t2);transition:all .15s;user-select:none}
.chip:hover{border-color:var(--t3)}
.chip.on{background:var(--ad);border-color:var(--ba);color:#f0b429}
.chip.g.on{background:var(--gd);border-color:var(--bg2);color:var(--green)}
.rrow{display:flex;gap:6px}
.rbtn{flex:1;padding:8px;border-radius:6px;font-size:11px;cursor:pointer;border:1px solid var(--b);background:var(--card);color:var(--t2);transition:all .15s;text-align:center}
.rbtn.str.on{background:#0f2a18;border-color:#1a5c30;color:#4ade80}
.rbtn.neu.on{background:var(--ad);border-color:var(--ba);color:#f0b429}
.rbtn.wk.on{background:#2a0f0f;border-color:#5c1a1a;color:#f87171}
.btn-a{width:100%;padding:14px;border-radius:8px;font-family:var(--fh);font-size:20px;letter-spacing:2px;cursor:pointer;border:none;transition:all .15s;background:var(--green);color:#000}
.btn-a:hover:not(:disabled){background:#00e05a;box-shadow:var(--gg)}
.btn-a:disabled{background:var(--card);color:var(--t3);cursor:not-allowed;border:1px solid var(--b)}
.btn-s{width:100%;padding:14px;border-radius:8px;font-family:var(--fh);font-size:20px;letter-spacing:2px;cursor:pointer;border:none;transition:all .15s;background:var(--amber);color:#000}
.btn-s:hover:not(:disabled){background:#f0b429;box-shadow:var(--ag)}
.btn-s:disabled{background:var(--card);color:var(--t3);cursor:not-allowed;border:1px solid var(--b)}
.btn-sm{padding:8px 14px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid var(--b);background:var(--card);color:var(--t2);transition:all .15s}
.btn-sm:hover{background:var(--card2);color:var(--t)}
.btn-sm.g{border-color:var(--bg2);background:var(--gd);color:var(--green)}
.btn-sm.a{border-color:var(--ba);background:var(--ad);color:var(--amber)}
.btn-back{padding:13px 18px;border-radius:8px;background:var(--card);border:1px solid var(--b);color:var(--t2);font-size:13px;cursor:pointer;transition:all .15s}
.btn-back:hover{border-color:var(--t3);color:var(--t)}
.btn-skip{width:100%;padding:10px;border-radius:6px;background:none;border:1px dashed var(--b);color:var(--t3);font-size:12px;cursor:pointer;transition:all .15s;margin-top:8px}
.btn-skip:hover{border-color:var(--t3);color:var(--t2)}
.nav-row{display:flex;gap:8px;margin-top:28px}
.hint{text-align:center;font-family:var(--fm);font-size:9px;color:var(--t3);margin-top:8px;letter-spacing:.5px}
.err{background:#2a0a0a;border:1px solid #5c1a1a;border-radius:6px;padding:12px;color:#f87171;font-size:13px;margin-bottom:12px}
.mod-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px}
.mod-card{background:var(--card);border:1px solid var(--b);border-radius:8px;padding:13px;cursor:pointer;transition:all .15s;text-align:left;position:relative;overflow:hidden}
.mod-card:hover{background:var(--card2);border-color:#2a4a2a}
.mod-card.on{background:var(--gd);border-color:var(--bg2);box-shadow:var(--gg)}
.mod-card.on::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--green)}
.mod-icon{font-size:17px;margin-bottom:5px;display:block}
.mod-name{font-family:var(--fh);font-size:14px;letter-spacing:.3px;color:var(--t);text-transform:uppercase;margin-bottom:2px}
.mod-desc{font-size:10px;color:var(--t2);line-height:1.4}
.pills{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:20px}
.pill{padding:7px 13px;border-radius:100px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid var(--b);background:var(--card);color:var(--t2);transition:all .15s}
.pill:hover{border-color:#2a4a2a;color:var(--t)}
.pill.on{background:var(--green);border-color:var(--green);color:#000;font-weight:600}
.data-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px}
.data-card{background:var(--card);border:1px solid var(--b);border-radius:8px;padding:11px;cursor:pointer;transition:all .15s;position:relative}
.data-card:hover{background:var(--card2);border-color:#2a4a2a}
.data-card.on{background:var(--gd);border-color:var(--bg2)}
.dc-check{position:absolute;top:9px;right:9px;width:15px;height:15px;border-radius:3px;border:1px solid var(--b);background:var(--surf);display:flex;align-items:center;justify-content:center;font-size:9px;transition:all .15s}
.data-card.on .dc-check{background:var(--green);border-color:var(--green);color:#000}
.dc-name{font-size:12px;font-weight:600;color:var(--t);margin-bottom:2px;padding-right:18px}
.dc-desc{font-size:10px;color:var(--t3)}
.inp-wrap{background:var(--card);border:1px solid var(--b);border-radius:8px;padding:13px;margin-bottom:14px;transition:border-color .15s}
.inp-wrap:focus-within{border-color:#2a4a2a}
.tog{display:flex;align-items:center;gap:8px;padding:7px 12px;border-radius:100px;font-size:11px;cursor:pointer;border:1px solid var(--b);background:var(--card);color:var(--t3);transition:all .15s;font-family:var(--fm)}
.tog.on{border-color:var(--bg2);background:var(--gd);color:var(--green)}
.tog-dot{width:7px;height:7px;border-radius:50%;background:var(--t3);transition:all .15s}
.tog.on .tog-dot{background:var(--green);box-shadow:0 0 6px var(--green)}
.opts-row{display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap}
.res-hdr{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--b)}
.res-title{font-family:var(--fh);font-size:22px;letter-spacing:.5px;color:var(--t);text-transform:uppercase}
.res-acts{display:flex;gap:5px;flex-shrink:0}
.sec-card{background:var(--card);border:1px solid var(--b);border-radius:8px;padding:15px;margin-bottom:9px;position:relative;overflow:hidden}
.sec-card::before{content:'';position:absolute;top:0;left:0;bottom:0;width:3px;background:var(--green);opacity:.5}
.sec-head{font-family:var(--fh);font-size:13px;letter-spacing:1px;color:var(--green);text-transform:uppercase;margin-bottom:9px;padding-left:10px}
.sec-body{font-size:13px;line-height:1.75;color:var(--t2);white-space:pre-wrap;padding-left:10px}
.fu-area{margin-top:18px;border-top:1px solid var(--b);padding-top:14px}
.fu-lbl{font-family:var(--fm);font-size:9px;color:var(--t3);letter-spacing:2px;text-transform:uppercase;margin-bottom:7px}
.bot-row{display:flex;gap:8px;margin-top:10px}
.bot-sec{flex:1;padding:11px;border-radius:8px;background:var(--card);border:1px solid var(--b);color:var(--t2);font-size:13px;cursor:pointer;transition:all .15s}
.bot-sec:hover{background:var(--card2);border-color:var(--t3)}
.bot-pri{flex:1;padding:11px;border-radius:8px;background:var(--green);border:none;color:#000;font-family:var(--fh);font-size:16px;letter-spacing:.5px;text-transform:uppercase;cursor:pointer;transition:all .15s}
.bot-pri:hover{background:#00e05a}
.bot-pri:disabled{background:var(--card);color:var(--t3);cursor:not-allowed;border:1px solid var(--b)}
.doc-outer{background:linear-gradient(135deg,#1a1200,#0a140a);border:1px solid var(--ba);border-radius:10px;overflow:hidden;box-shadow:var(--ag)}
.doc-top{background:linear-gradient(90deg,var(--amber),#a07a08);padding:18px 20px;display:flex;align-items:flex-end;justify-content:space-between;gap:10px}
.doc-tn{font-family:var(--fh);font-size:32px;color:#000;letter-spacing:3px;line-height:1}
.doc-meta{text-align:right}
.doc-ml{font-family:var(--fm);font-size:8px;color:#00000077;letter-spacing:2px;display:block}
.doc-mv{font-family:var(--fm);font-size:10px;color:#000000aa;display:block}
.doc-stamp{font-family:var(--fh);font-size:10px;color:#000;background:#00000015;border:1px solid #00000025;padding:3px 9px;border-radius:3px;letter-spacing:2px;margin-top:4px;display:inline-block}
.doc-body{padding:20px}
.doc-sec{margin-bottom:18px;padding-bottom:18px;border-bottom:1px solid var(--b)}
.doc-sec:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
.doc-sh{font-family:var(--fm);font-size:9px;color:var(--amber);letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.doc-sh::after{content:'';flex:1;height:1px;background:var(--b)}
.doc-sb{font-size:13px;color:var(--t2);line-height:1.75;white-space:pre-wrap}
.doc-acts{display:flex;gap:8px;margin-top:16px}
.doc-btn{flex:1;padding:11px;border-radius:6px;font-size:12px;cursor:pointer;border:1px solid var(--b);background:var(--card);color:var(--t2);transition:all .15s}
.doc-btn:hover{background:var(--card2);color:var(--t)}
.doc-btn.pri{background:var(--amber);border-color:var(--amber);color:#000;font-weight:600}
.doc-btn.pri:hover{background:#f0b429}
.ctx-note{margin-top:14px;padding:11px 13px;background:var(--card);border:1px solid var(--b);border-radius:6px}
.ctx-lbl{font-family:var(--fm);font-size:9px;color:var(--t3);letter-spacing:2px;margin-bottom:5px}
.ctx-text{font-size:12px;color:var(--t2);line-height:1.6}
.template-grid{display:grid;grid-template-columns:1fr;gap:8px;margin-bottom:24px}
.tmpl-card{background:var(--card);border:1px solid var(--b);border-radius:8px;padding:14px;cursor:pointer;transition:all .15s;text-align:left}
.tmpl-card:hover{background:var(--card2);border-color:var(--ba)}
.tmpl-name{font-family:var(--fh);font-size:16px;letter-spacing:.5px;color:var(--t);margin-bottom:3px}
.tmpl-desc{font-size:11px;color:var(--t3)}
.saved-card{background:var(--card);border:1px solid var(--b);border-radius:8px;padding:13px;margin-bottom:8px;cursor:pointer;transition:all .15s}
.saved-card:hover{background:var(--card2);border-color:#2a4a2a}
.saved-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px}
.saved-mod{font-family:var(--fh);font-size:14px;letter-spacing:.5px;color:var(--t);text-transform:uppercase}
.saved-preview{font-size:11px;color:var(--t3);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.load-wrap{text-align:center;padding:70px 20px}
.load-ring{width:44px;height:44px;border:2px solid var(--b);border-top-color:var(--green);border-radius:50%;animation:spin 1.2s linear infinite;margin:0 auto 16px}
.load-ring.amber{border-top-color:var(--amber)}
@keyframes spin{to{transform:rotate(360deg)}}
.load-title{font-family:var(--fh);font-size:22px;letter-spacing:2px;margin-bottom:4px}
.load-sub{font-family:var(--fm);font-size:9px;color:var(--t3);letter-spacing:2px;text-transform:uppercase}
/* PROMPTS TAB */
.p-wrap{position:relative;margin-bottom:16px}
.p-ico{position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:13px;color:var(--t3);pointer-events:none}
.p-srch{width:100%;background:var(--card);border:1px solid var(--b);border-radius:6px;padding:9px 12px 9px 32px;font-family:var(--fb);font-size:13px;color:var(--t);outline:none;transition:border-color .15s}
.p-srch:focus{border-color:var(--ba)}.p-srch::placeholder{color:var(--t3)}
.p-card{background:var(--card);border:1px solid var(--b);border-radius:8px;margin-bottom:8px;overflow:hidden;transition:border-color .15s}
.p-card:hover{border-color:#2a4a2a}
.p-hdr{padding:12px 14px;display:flex;align-items:flex-start;justify-content:space-between;cursor:pointer;gap:10px}
.p-meta{flex:1;min-width:0}
.p-ttl{font-family:var(--fh);font-size:16px;letter-spacing:.3px;color:var(--t);text-transform:uppercase}
.p-dsc{font-size:11px;color:var(--t2);margin-top:2px;line-height:1.4}
.p-tags{display:flex;gap:4px;margin-top:5px;flex-wrap:wrap}
.p-tag{font-family:var(--fm);font-size:9px;padding:2px 6px;border-radius:3px;border:1px solid var(--b);color:var(--t3);letter-spacing:.5px}
.p-tag.g{border-color:#00c44a30;color:var(--green);background:#00c44a10}
.p-tag.a{border-color:#c9960c30;color:var(--amber);background:#c9960c10}
.p-acts{display:flex;align-items:center;gap:6px;flex-shrink:0;padding-top:2px}
.p-exp{font-family:var(--fm);font-size:10px;color:var(--t3);cursor:pointer;background:none;border:none;padding:4px;line-height:1}
.p-exp:hover{color:var(--t2)}
.p-cpy{font-size:11px;cursor:pointer;border:1px solid var(--b);background:var(--surf);color:var(--t2);padding:5px 10px;border-radius:5px;transition:all .1s;white-space:nowrap}
.p-cpy:hover{border-color:var(--ba);color:var(--amber)}
.p-cpy.ok{border-color:#00c44a50;color:var(--green);background:#00c44a10}
.p-body{border-top:1px solid var(--b);padding:14px;background:#040c04}
.p-txt{font-family:var(--fm);font-size:11px;line-height:1.8;color:var(--t2);white-space:pre-wrap;word-break:break-word}
.p-stats{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.p-stat{background:var(--card);border:1px solid var(--b);border-radius:6px;padding:7px 12px;display:flex;align-items:baseline;gap:6px}
.p-stat-n{font-family:var(--fm);font-size:16px;color:var(--green)}
.p-stat-l{font-size:10px;color:var(--t3)}
@media(max-width:400px){.mod-grid,.data-grid,.quick-grid{grid-template-columns:1fr}}
`;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const MODULES = [
  {id:'gameplan',label:'Game Plan',icon:'⚔️',desc:'Opposition analysis. Red zone. Tactical frameworks.'},
  {id:'playerdev',label:'Player Dev',icon:'📈',desc:'Evolution maps. Technical programmes.'},
  {id:'season',label:'Season Builder',icon:'📅',desc:'Periodisation. Load management. Peaking.'},
  {id:'coachcoach',label:'Coach Audit',icon:'🔬',desc:'Decision audits. Bias identification.'},
  {id:'coachplayer',label:'Player Coach',icon:'🎯',desc:'Direct player feedback. Targets.'},
  {id:'gameanalysis',label:'Match Analysis',icon:'📊',desc:'Match diagnosis. Decisive moments.'},
  {id:'tactics',label:'Tactics',icon:'🏉',desc:'Positional intelligence. All 15 positions.'},
  {id:'redzone',label:'Red Zone',icon:'🔴',desc:'Territory efficiency. Expected Points.'},
];

const LEVELS = ['Elite Professional','Semi-Professional','Academy','Youth / Age Grade','Community'];

const DATA_TYPES = [
  {id:'GPS and wearable',label:'GPS / Wearable',desc:'Distance, speed, collisions'},
  {id:'video analysis',label:'Video Analysis',desc:'Breakdown, line speed, set piece'},
  {id:'manual statistics',label:'Manual Stats',desc:'Match stats, player metrics'},
  {id:'combined multi-source',label:'Combined',desc:'Multiple data sources'},
];

const STYLES_OPT = ['Physical and contact dominant','Territory and kicking game','Fast and expansive','Set piece foundation','Counter-attack and transition','Defensive structure first','Forward power','Back line creativity'];
const PHYSICAL_OPT = ['Big powerful pack','Athletic mobile forwards','Explosive fast backs','Strong aerial game','High work rate','Physical collision dominant','Light and technical','Mixed and balanced'];
const MENTAL_OPT = ['Composed under pressure','Emotional and reactive','Fight back from adversity','Fragile under siege','Strong defensive identity','Need early momentum','Consistent regardless of scoreline','Perform as underdogs'];
const GROWTH_OPT = ['Set piece dominance','Ruck speed and breakdown','Defensive system','Attack structure','Kicking and territory','Fitness and conditioning','Mental toughness','Bench impact'];
const DEPTH_OPT = ['Very shallow','Adequate','Good depth','Strong squad'];
const DEF_OPT = ['Blitz','Fold','Rush','Hybrid','Drift','Unknown'];

const TEMPLATES = [
  {id:'season',label:'Season Planner',desc:'Full-season framework with phases, peaks, and load flags based on your team identity'},
  {id:'practice',label:'Weekly Practice Structure',desc:'Training week template built around your playing style and non-negotiables'},
  {id:'gameplan',label:'Game Plan Brief Template',desc:'Pre-formatted opposition analysis brief in your team\'s language'},
  {id:'player',label:'Player Development Record',desc:'Individual player tracking template aligned to your system'},
  {id:'matchreport',label:'Match Report Template',desc:'Post-match analysis format built for your coaching staff'},
];

const PLACEHOLDERS = {
  gameplan:'Opposition data:\n- Scrum win %\n- Ruck speed averages\n- Defensive system (blitz/fold/rush)\n- Kicking patterns\n- Lineout accuracy\n- Key player tendencies\n- Your squad strengths',
  playerdev:'Player data:\n- Name, position, age, level\n- Physical metrics (weight, sprint times)\n- Tackle completion, dominant carry %\n- GPS data (distance, collisions)\n- Known weaknesses and injury history',
  season:'Season info:\n- Fixture list with dates\n- Squad size and depth\n- Competition structure\n- Training days available\n- Target peak performance dates',
  coachcoach:'Coaching decision:\n1. What was decided\n2. Stated reasoning at the time\n3. Match situation and scoreline\n4. What happened in the 20 mins after\n5. Any outcome data',
  coachplayer:'Player data:\n- Position, age, level\n- Recent match stats\n- Video observations\n- Physical test results\n- Previous interventions tried',
  gameanalysis:'Match data:\n- Final score and context\n- Territory and possession %\n- Set piece outcomes\n- Ruck speed data\n- Try sequences or missed chances\n- Penalty breakdown',
  tactics:'Specify position or group:\ne.g. Loosehead Prop, Back Three, Front Row\n\nThen paste:\n- Current performance metrics\n- Video observations\n- Physical tests\n- Known deficits',
  redzone:'Red zone data:\n- Number of 22m entries\n- Points scored per entry\n- Decision at each entry (posts/corner/tap)\n- Penalty positions\n- Kicking stats (50/22, box kicks)',
};

// ─── PROMPT LIBRARY DATA ──────────────────────────────────────────────────────

const PROMPT_CATS = [
  {id:'all',label:'All'},
  {id:'foundation',label:'Foundation'},
  {id:'modules',label:'Modules'},
  {id:'data',label:'Data'},
  {id:'extensions',label:'Extensions'},
];

const PROMPT_LIBRARY = [
  {
    id:'arch',cat:'foundation',type:'build',
    title:'Core Architecture',
    desc:'Full RIS system structure, module routing, API pattern, and state management',
    tags:['React','Architecture','Claude API'],
    text:`Act as a Senior Software Architect specialising in sports performance analytics. I am building a Rugby Intelligence System (RIS) using React for the frontend and Claude's API for AI-powered analysis.

Define the complete modular architecture for this system. It needs to:

1. Support 8 analysis modules: Game Plan Developer, Player Developer, Season Constructor, Coach the Coach, Coach the Player, Game Analysis, Tactics and Positions, Red Zone Audit

2. Handle 4 input types that can be combined: GPS and wearable data, video analysis output, manual statistics, combined multi-source

3. Work across 5 rugby levels: Elite Professional, Semi-Professional, Academy, Youth and Age Grade, Community

4. Call Claude's API with dynamically generated system prompts based on the user's selections

Output the complete React component file structure, the API call pattern, the state management approach, and the system prompt generation logic. Include comments explaining every architectural decision.

Use UK English. No dashes. Plain, clean code with no unnecessary complexity.`
  },
  {
    id:'player-schema',cat:'foundation',type:'build',
    title:'Player Data Schema',
    desc:'Complete JavaScript schema for a player profile including position-specific primary value metrics for all 15 positions',
    tags:['Data Schema','JavaScript'],
    text:`Act as a Sports Data Architect. I am building a Rugby Intelligence System and need a comprehensive player data schema.

Build a JavaScript data structure for a rugby player profile that includes:

1. Identity fields: name, date of birth, position number (1 to 15), position name, playing level, current club, nationality

2. Physical metrics: height in cm, weight in kg, body fat percentage, squat to bodyweight ratio, 10m sprint time in seconds, 40m sprint time in seconds, VO2 max estimate

3. Position-specific primary value metrics for all 15 positions. Examples:
   - Loosehead Prop (1): scrum stability percentage, lineout lift accuracy
   - Hooker (2): lineout throw accuracy, ruck arrival time post-tackle
   - Tighthead Prop (3): scrum pressure output, turnover rate at breakdown
   - Lock (4 and 5): lineout catch percentage, dominant carry rate
   - Blindside Flanker (6): ruck clearance speed, tackle completion under fatigue
   - Openside Flanker (7): turnover rate, ruck arrival time
   - Number 8: gain line carry metres, pick and drive conversion
   - Scrum Half (9): ruck clearance latency in seconds, box kick accuracy
   - Fly Half (10): territory kick efficiency, defensive line speed rating
   - Inside Centre (12): dominant carry percentage, defensive intercept rate
   - Outside Centre (13): line break assists, tackle completion under fatigue
   - Wingers (11 and 14): try assist conversion, kick chase completion
   - Fullback (15): counter-attack success rate, aerial claim percentage

4. Performance history: array of match objects each containing date, opposition, minutes played, key position metrics, and GPS summary

5. Development flags: injury risk indicators, plateau signals, wildcard intervention notes

Output as a clean JavaScript object with realistic example data for a Tighthead Prop. Include JSDoc comments for every field. Use UK English.`
  },
  {
    id:'match-schema',cat:'foundation',type:'build',
    title:'Match Event Schema',
    desc:'Tracks every discrete collision event with spatial, temporal, possession, and outcome data. Includes xP calculator function',
    tags:['Data Schema','JavaScript','xP'],
    text:`Act as a Sports Data Engineer. I am building a Rugby Intelligence System that treats every phase of play as a discrete data event.

Build a JavaScript schema for a MatchEvent object that captures:

1. Spatial data: X coordinate (0 to 100, pitch width), Y coordinate (0 to 68, pitch length), territory zone (own 22, own half, opposition half, red zone)

2. Temporal data: match minute, phase number within sequence, cumulative fatigue index calculated from minutes played and collision count

3. Possession data: team in possession, ruck speed in seconds from tackle to ball available, ball carrier position number, support player positions

4. Outcome data: gain line result (dominant advance, held, negative), turnover occurred as boolean, penalty conceded as boolean, try scored as boolean

5. Set piece data: event type (open play, scrum, lineout, restart, penalty), set piece outcome if applicable

Also build a function called calculateXP that:
- Takes field zone and rugby level as parameters
- Returns Expected Points value using these benchmarks: Elite = 4.2 for red zone entry, 2.1 for opposition half, 0.8 for own half
- Scales down by level: Semi-Pro 0.85, Academy 0.70, Youth 0.55, Community 0.45
- Returns the xP value plus the three available decision options with their respective expected outcomes

Output clean JavaScript with JSDoc comments and example usage. Use UK English.`
  },
  {
    id:'season-schema',cat:'foundation',type:'build',
    title:'Season and Squad Schema',
    desc:'Full data structures for squad management, fixture planning, periodisation phases, and Squad Attrition Probability calculation',
    tags:['Data Schema','JavaScript','Load Management'],
    text:`Act as a Rugby Performance Scientist. I am building a Season Constructor module for a Rugby Intelligence System.

Build JavaScript data structures for:

1. A Squad object containing: array of player profiles, designated starters by position, bench rotation plan using the 6 forwards and 2 backs split, injury tracking list, and load history per player

2. A Fixture object containing: date, opposition, competition type, home or away, travel distance in km, estimated match intensity on a 1 to 10 scale, predicted load score

3. A Season object containing: array of Fixture objects, periodisation phases (pre-season, early season, mid-season, playoffs, recovery), Squad Attrition Probability per week, and peak performance target weeks

4. A WeeklyLoadReport object that flags any week where: total squad load exceeds the safe threshold, three or more players have accumulated fatigue scores above 80 percent, travel combined with match density creates a high injury risk window

Also build a function called calculateAttritionProbability that takes a sequence of 4 consecutive fixtures as input, returns a risk percentage based on match intensity scores and travel load, and flags the output as Low Risk below 15 percent, Medium 15 to 30 percent, High above 30 percent.

Output as clean JavaScript with example data for a 30-week season. Use UK English.`
  },
  {
    id:'gameplan-build',cat:'modules',type:'module',
    title:'Game Plan Developer',
    desc:'Structured opposition data form. Returns xP scenarios, pod recommendations, and set piece exploitation plan',
    tags:['React Component','Tactics','xP'],
    text:`I am building a Rugby Intelligence System in React. Build me a complete React component called GamePlanDeveloper.

The component must have a structured form with these fields:
- Opposition team name (text)
- Scrum win percentage (number 0 to 100)
- Average ruck speed in seconds (decimal number)
- Defensive system type (dropdown: Blitz, Fold, Rush, Hybrid)
- Lineout accuracy percentage (number)
- Key player threats (text area)
- Your team's available strengths (text area)
- Rugby level (dropdown: Elite Professional, Semi-Professional, Academy, Youth, Community)

Call Claude's API with this exact system prompt, replacing [level] with the selected level:

"You are a Tactical Performance Director for a [level] rugby team. Generate evidence-based, specific game plans. Generic coaching advice is unacceptable. When given opposition data you must: identify the three most exploitable defensive patterns, calculate Expected Points scenarios for red zone options (kick for posts, kick to corner, tap and go), recommend pod formations (1-3-2-2 or 2-4-2) that exploit specific defensive folding patterns identified, define a ruck speed protocol targeting the 3-second threshold, and flag scrum and lineout vulnerabilities with specific exploitation strategies. Output sections using these exact headers: ## Territory Strategy, ## Set Piece Exploitation, ## Attack Shape and Pods, ## Defensive Counter-Plan, ## Priority Actions."

Parse the response by splitting on ## headers and display each section as a styled card. Include a Deep Analysis toggle that appends "Be exhaustive. Quantify everything. Flag every gap." to the system prompt.`
  },
  {
    id:'playerdev-build',cat:'modules',type:'module',
    title:'Player Developer',
    desc:'Position-aware input form. Generates 12-week technical programme, deficit analysis, wildcard intervention, and milestone targets',
    tags:['React Component','LTAD','Biomechanics'],
    text:`I am building a Rugby Intelligence System in React. Build me a complete React component called PlayerDeveloper.

The component must have a structured form with fields for player identity, physical metrics, performance metrics, GPS summary, and free text for video observations.

When the user selects a position number, automatically display the Primary Value Metrics for that position.

Call Claude's API with this system prompt, replacing [level] and [position] with the selected values:

"You are a High Performance Lead for a [level] rugby programme. Create precise, individualised player evolution maps. Generic training programmes are unacceptable. For the [position] data provided: map current metrics against the gold standard for their position at [level] level, calculate the deficit across the three primary value metrics for their position, generate a 12-week technical programme targeting collision mechanics (body height, leg drive, wrap efficiency), include one Wildcard training intervention that prevents developmental plateauing (e.g. wrestling for breakdown stability, gymnastics for spatial awareness, vision training for decision-makers), flag any injury risk patterns in the data, and set measurable review milestones at weeks 4, 8, and 12. Every recommendation must link to a specific performance metric. Headers: ## Current Performance Profile, ## Deficit Analysis, ## 12-Week Programme, ## Wildcard Protocol, ## Review Milestones."

Include a Save to Squad button that stores the player data and analysis to localStorage.`
  },
  {
    id:'season-build',cat:'modules',type:'module',
    title:'Season Constructor',
    desc:'Fixture input with calendar grid. Calculates Squad Attrition Probability. Generates peaking protocol and 6-2 rotation plan',
    tags:['React Component','Periodisation','Load Management'],
    text:`I am building a Rugby Intelligence System in React. Build me a React component called SeasonConstructor.

The component must have season dates, squad size, fixture builder (up to 40 fixtures with date, opposition, home/away, competition type, travel time), and peak performance target dates.

After fixture input, display a 30-week calendar grid with Week Number, Fixture, Load Score, and Risk Level (green below 15%, amber 15-30%, red above 30%).

Call Claude's API with the fixture data using this system prompt:

"You are a Season Architect for a [level] rugby programme. Using the fixture list provided: build loading, peaking, and recovery phases across the season, calculate Squad Attrition Probability for high-density periods, design a 6-2 bench rotation strategy to protect the forward pack, flag every high-risk week with specific reasoning, and build a Peaking Protocol for the 3 weeks before each marked peak performance date. Headers: ## Season Phase Map, ## High Risk Week Flags, ## Bench Rotation Schedule, ## Peaking Protocol, ## Load Management Principles."

Display the calendar grid first, then the AI analysis below.`
  },
  {
    id:'coachcoach-build',cat:'modules',type:'module',
    title:'Coach the Coach',
    desc:'Decision audit against match data. Identifies cognitive bias. Delivers unfiltered data-driven verdict',
    tags:['React Component','Decision Audit','Bias'],
    text:`I am building a Rugby Intelligence System in React. Build me a React component called CoachAudit.

This module audits coaching decisions against match data. It must be direct, data-driven, and unfiltered.

Component inputs: what decision was made, the coach's stated reasoning, match situation (scoreline, minute, territory zone), what happened in the 10-20 minutes after, performance data after the decision, and rugby level.

Call Claude's API with this exact system prompt, replacing [level]:

"You are a Brutally Honest Strategic Advisor auditing decisions for a [level] rugby programme. Cross-reference every stated reason against the actual outcome data. Identify precisely where the decision improved or damaged key performance metrics. Name the specific cognitive bias operating: choose from confirmation bias, recency bias, sunk cost fallacy, authority bias, availability heuristic, or in-group bias. Provide the data-driven alternative decision that would have optimised the outcome. Deliver a clear verdict using one of these exact words at the start of your verdict section: JUSTIFIED, QUESTIONABLE, or UNSUPPORTED. Be direct. Use data not opinion. Do not soften findings. Headers: ## Decision Audit, ## Data Verdict, ## Bias Identified, ## Alternative Decision, ## One Priority Change."

Parse the verdict and display a large verdict badge: green for JUSTIFIED, amber for QUESTIONABLE, red for UNSUPPORTED.`
  },
  {
    id:'coachplayer-build',cat:'modules',type:'module',
    title:'Coach the Player',
    desc:'Direct, first-person coaching output addressed to the player. Ties every piece of feedback to specific data',
    tags:['React Component','Technical Coaching','Individual'],
    text:`I am building a Rugby Intelligence System in React. Build me a React component called PlayerCoach.

This module delivers direct, honest technical coaching to individual players. No generic coaching language. Every piece of feedback must tie to specific data.

Component inputs: player identity, recent match performance, up to 5 video analysis observations with category, physical test results, what the player believes about their own performance, and previous coaching interventions.

Call Claude's API with this system prompt, replacing [level]:

"You are a Technical Performance Coach speaking directly to a [level] rugby player. Your function is to deliver precise, honest individual coaching. Identify the three highest-priority technical deficits from the data. For each deficit explain exactly why it is limiting performance using biomechanical or tactical reasoning tied to specific data points. Prescribe specific drills and technical cues for each deficit. Set measurable targets with timeframes. Flag any patterns suggesting deeper physical or psychological constraints needing specialist input. Speak directly to the player using second person. Be honest. Be specific. Plain language only. No generic coaching speak. Headers: ## Your Performance Profile, ## The 3 Things Holding You Back, ## What You Need to Do, ## Your Targets, ## Watch Points."

The output must feel addressed directly to the player, not to a coach describing the player.`
  },
  {
    id:'gameanalysis-build',cat:'modules',type:'module',
    title:'Game Analysis',
    desc:'Match diagnosis not summary. Identifies decisive structural moments, territory efficiency vs xP benchmark, gain line turning points',
    tags:['React Component','Match Analysis','xP'],
    text:`I am building a Rugby Intelligence System in React. Build me a React component called MatchAnalyser.

Component inputs: match details (date, teams, score, competition), territory and possession percentage sliders, set piece data (scrums, lineout accuracy), ruck data (average speed, percentage under 3 seconds), scoring data (tries with minutes, penalties, conversions), optional GPS summary, coach observations, and rugby level.

Call Claude's API with this system prompt, replacing [level]:

"You are a Match Intelligence Analyst for a [level] rugby team. Diagnose this match, do not summarise it. Find the structural causes of the outcome. Identify the three decisive moments that structurally determined the result. Analyse territory efficiency: calculate actual points per 22-metre entry and compare against the xP benchmark for this level. Evaluate ruck speed data and its specific impact on defensive line reset capability. Identify which forwards won or lost the gain line battle and at what minute the tide turned. Deliver a clear structural verdict on why this match was won or lost. Every finding must have a cause and effect explanation. No data without diagnosis. Headers: ## Match Verdict, ## Three Decisive Moments, ## Territory Efficiency Report, ## Set Piece Impact, ## Three Priority Actions."

Display the Match Verdict section in a highlighted box at the top of results, separated visually from the other sections.`
  },
  {
    id:'tactics-build',cat:'modules',type:'module',
    title:'Tactics and Positions',
    desc:'Interactive formation diagram for positions 1 to 15. Position-aware input fields and benchmarks. Connects individual performance to team system',
    tags:['React Component','Positions 1-15','Tactical Analysis'],
    text:`I am building a Rugby Intelligence System in React. Build me a React component called PositionalAnalysis.

Component structure:
1. A visual rugby formation diagram built with CSS grid. Display numbered circles for positions 1 to 15 in formation (front row 1-2-3, locks 4-5, back row 6-7-8, half backs 9-10, centres 12-13, back three 11-14-15). Clicking a number selects that position. No external libraries.

2. When a position is selected, display position-specific input fields based on the Primary Value Metric for that position.

3. A text area for additional video observations and a rugby level selector.

Call Claude's API with a prompt that names the position, states its Primary Value Metric, and uses this instruction:

"Compare against the gold standard for that level, identify the specific deficit, prescribe 3 technical adjustments, connect to system impact. Headers: ## Position Profile, ## Performance vs Gold Standard, ## Deficit Analysis, ## Three Adjustments, ## System Impact."

The formation diagram must be built purely with CSS — no SVG, no canvas, no external libraries.`
  },
  {
    id:'redzone-build',cat:'modules',type:'module',
    title:'Red Zone Audit',
    desc:'xP calculator with entry log. Displays index score against level benchmark. Audits decision quality per entry and flags systemic bias',
    tags:['React Component','xP','Territory'],
    text:`I am building a Rugby Intelligence System in React. Build me a React component called RedZoneAudit.

Component inputs: number of 22-metre entries, points scored, entry log (up to 12 entries each with minute, decision type, and outcome), kicking data (50/22 and box kick stats), and rugby level.

Level-based xP benchmarks: Elite Professional 4.2, Semi-Professional 3.6, Academy 3.0, Youth 2.4, Community 2.0.

Calculate and display before the AI analysis: Actual xP, Benchmark xP, and Index Score (actual divided by benchmark multiplied by 100). Display the index score prominently: green above 100, amber 75-100, red below 75.

Also show a simple CSS bar chart (no libraries) showing points scored per entry, colour coded by decision type.

Call Claude's API using this system prompt:

"You are a Red Zone Efficiency Analyst for a [level] rugby team. Analyse whether scoring zone entries are converting at a rate that justifies the territory strategy. Calculate the efficiency score, identify under-indexing patterns, evaluate each decision type for probability optimisation, assess kicking strategy quality, and rank priority adjustments by impact. Headers: ## Territory Efficiency Score, ## xP Analysis, ## Decision Quality Audit, ## Kicking Strategy, ## Priority Adjustments."`
  },
  {
    id:'gps-parser',cat:'data',type:'data',
    title:'GPS Data Parser',
    desc:'Normalises raw GPS exports from Catapult, STATSports, or Polar into a standardised RIS schema. Includes FatigueIndex calculator',
    tags:['JavaScript','GPS','Data Integration'],
    text:`I am building a Rugby Intelligence System in React. Build me a JavaScript utility called parseGPSData.

This function takes raw GPS and wearable export data (CSV or JSON from Catapult, STATSports, or Polar) and converts it into a standardised format my system can use.

Handle these common GPS metrics: Total Distance, High Speed Running Distance (above 5.5 m/s), Sprint Distance (above 7.0 m/s), Maximum Velocity, Acceleration Load (PlayerLoad), Deceleration count, Impact count above 5g mapped to CollisionCount, Heart Rate Average and Maximum, Heart Rate Zone distribution.

The function must:
1. Accept either a CSV string or a JavaScript object
2. Attempt to identify the GPS system from column header names
3. Return a standardised GPSSummary object with consistent field names regardless of source
4. Flag any missing critical fields in a warnings array
5. Calculate a FatigueIndex score from 0 to 100 based on: high speed running distance (weight 0.4), collision count (weight 0.4), and session duration (weight 0.2)

Also build a formatForClaudePrompt function that converts the GPSSummary object into a clean, labelled text block for a Claude API message.

Include error handling for malformed or empty data. Add a parseCSVString helper. Use UK English.`
  },
  {
    id:'video-input',cat:'data',type:'data',
    title:'Video Analysis Input',
    desc:'Structured observation entry for set piece, breakdown, defensive system, attack patterns, and individual player flags',
    tags:['React Component','Video Analysis','Observations'],
    text:`I am building a Rugby Intelligence System in React. Build me a React component called VideoAnalysisInput.

This provides a structured way to enter video analysis observations before sending them to Claude.

The component must have these collapsible sections:

1. Set Piece Observations: Scrum (up to 5 observations) and Lineout (up to 5 observations)

2. Breakdown and Ruck Observations: up to 8 observations each with phase number, position involved (1-15), observation type (Slow Ball, Turnover Risk, Dominant Cleanout, Penalty Risk, Jackaling Threat), and specific note

3. Defensive System Observations: defensive shape identified (Blitz, Fold, Rush, Hybrid, Uncertain) and up to 5 observations on line speed, communication gaps, and edge defence

4. Attack Pattern Observations: up to 5 observations on pod alignment, ball carrier selection, kicking tendencies, and pod formation used (1-3-2-2, 2-4-2, or custom)

5. Individual Player Flags: up to 8 player flags each with position number, observation text, and flag type (Positive, Needs Work, Urgent, Injury Concern)

A Format for Analysis button converts all entered observations into a structured text block ready for Claude. Show the formatted output in a copyable text area.`
  },
  {
    id:'manual-stats',cat:'data',type:'data',
    title:'Manual Stats Input Builder',
    desc:'Standardised stat entry form that formats data correctly for any RIS module. Validates inputs and flags gaps before analysis',
    tags:['React Component','Statistics','Data Entry'],
    text:`I am building a Rugby Intelligence System in React. Build me a React component called ManualStatsInput.

This is a standardised statistics entry form with two modes selectable by the user:

MATCH STATS MODE: basic match details, possession and territory sliders, set piece (scrums won/lost/penalised and lineout accuracy for both teams), breakdown (ruck count, rucks won, average speed, percentage under 3 seconds), scoring (tries with minutes, penalties, conversions, missed kicks), discipline (yellow/red cards, penalty locations), and optional GPS summary.

PLAYER STATS MODE: player identity, match involvement (minutes, carries, metres, dominant carries, offloads, turnovers won, tackles made/missed, errors), set piece involvement, kicking, and GPS.

Validate all inputs: flag missing required fields, flag values outside realistic ranges (e.g. ruck speed under 1 second), and show a validation summary before submission.

A Format for Analysis button converts the completed form into a structured text block optimised for Claude. Show output in a copyable text area.`
  },
  {
    id:'storage',cat:'extensions',type:'extend',
    title:'Squad and Analysis Storage',
    desc:'localStorage-based squad roster and analysis history. Custom hooks, import/export as JSON, roster display component',
    tags:['React Hook','localStorage','Squad Management'],
    text:`I am building a Rugby Intelligence System in React. Build me a data persistence layer using localStorage.

Create two custom hooks:

1. useSquad hook: savePlayer, getPlayer, getAllPlayers (sorted by position number), deletePlayer, getPlayersByPosition, exportSquad (returns JSON string), importSquad (replaces current squad).

2. useAnalysisHistory hook: saveAnalysis (with timestamp and auto-generated ID), getHistory (sorted by date descending), getHistoryByModule, deleteAnalysis, exportAnalysis (returns formatted plain text for download).

Also build a SquadRoster React component displaying all saved players in a table sorted by position number, with Load/Edit/Delete buttons per row, plus Import/Export JSON buttons and a search bar.

And an AnalysisHistory component listing saved analyses with module name, date, level, and one-line preview, with filter buttons per module type and click to expand. Use the same dark analytics aesthetic as the main application.`
  },
  {
    id:'xp-calc',cat:'extensions',type:'extend',
    title:'xP Calculator',
    desc:'Standalone Expected Points calculator for any field position. Quick Decision mode for real-time recommendations. Decision log with outcome tracking',
    tags:['React Component','xP','Real-Time'],
    text:`I am building a Rugby Intelligence System in React. Build me a standalone Expected Points calculator component called xPCalculator.

Level-based benchmarks (use these exactly):
- Elite Professional: red zone = 4.2 xP, opposition half = 2.1, own half = 0.8
- Semi-Professional: multiply all by 0.85
- Academy: multiply all by 0.70
- Youth: multiply all by 0.55
- Community: multiply all by 0.45

CALCULATOR MODE: field position slider (0 to 100 in 5-metre bands), game situation selector, rugby level selector. For each available option display xP value, risk rating, colour coded recommendation, and one-sentence rationale.

QUICK DECISION MODE: scoreline input, match minute, field position, rugby level. Output: single recommended decision with one-line justification and xP value.

Also include a Match Decision Log: record each decision with minute, position, decision taken, xP of recommended decision, actual outcome. Show total xP of decisions made vs optimal as a Decision Quality Score percentage.`
  },
  {
    id:'export',cat:'extensions',type:'extend',
    title:'Analysis Export',
    desc:'Converts any RIS analysis to a formatted .txt or .md report file. Includes header, sections, and footer with generation timestamp',
    tags:['JavaScript','Export','Reporting'],
    text:`I am building a Rugby Intelligence System in React. Build me an export utility for analysis reports.

Build a JavaScript module called exportAnalysis with these functions:

1. formatAsText(analysisData): clean plain text report with header block (module name, date, rugby level, data types used), section headings in uppercase with dashes beneath, section content, and footer (generated by Rugby Intelligence System, timestamp).

2. formatAsMarkdown(analysisData): same structure using markdown formatting.

3. downloadFile(content, filename, type): triggers browser file download as .txt or .md.

4. generateFilename(module, level, date): returns a clean filename like "GamePlan_ElitePro_2025-01-15.txt".

Also build a ShareButton React component that takes an analysis object as a prop, displays two download options (text and markdown), shows a Copy to Clipboard button, shows a character count and estimated reading time, and has a compact design that fits inline with the results view.

The exported reports must be clean, readable, and professional enough to share directly with coaching staff.`
  },
  {
    id:'benchmark-db',cat:'extensions',type:'extend',
    title:'Position Benchmark Database',
    desc:'Static reference database of gold standard performance metrics for all 15 positions across all 5 rugby levels. Includes comparison functions and deficit calculators',
    tags:['JavaScript','Benchmarks','Positions 1-15'],
    text:`I am building a Rugby Intelligence System in React. Build me a position benchmark database as a JavaScript module called positionBenchmarks.

Structure it as a nested object: benchmarks[positionNumber][level] = { metrics object }.

Include realistic benchmarks for each position. Examples:

Position 3 (Tighthead Prop) at Elite Professional level:
- scrumWinRate: 72%, scrumPressureRating: 8.2/10, turnoverRateAtBreakdown: 4.1 per match, dominantCarryRate: 58%, ruckArrivalTime: 3.2 seconds, tackleCompletion: 88%

Position 9 (Scrum Half) at Elite Professional level:
- ruckClearanceLatency: 2.4 seconds average, boxKickAccuracy: 71%, passingAccuracy: 94%, ruckArrival: 1.8 seconds, distributionSpeed: 1.1 seconds

Build realistic values for all 15 positions at all 5 levels. Values should decrease proportionally from Elite to Community.

Also build these functions:
- getDeficit(positionNumber, level, playerMetrics): compares player metrics against benchmark, returns deficit percentage per metric
- getTopDeficit(positionNumber, level, playerMetrics): returns the single biggest gap
- formatForClaudePrompt(positionNumber, level, playerMetrics): returns a text block showing the comparison for use in a Claude API call

Use UK English.`
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const parseDoc = (t) => {
  const s = t.split(/^## /m).filter(Boolean);
  if(s.length<=1) return [{title:null,body:t}];
  return s.map(x=>{const n=x.indexOf('\n');return{title:n>0?x.slice(0,n).trim():x.trim(),body:n>0?x.slice(n+1).trim():''};});
};

const downloadTxt = (content,name) => {
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([content],{type:'text/plain'}));
  a.download=name;a.click();
};

const buildSoulPrompt = (team,season,opp) => {
  let p=`You are a Rugby Intelligence Strategist. Build the Soul Document for ${team.name} — their strategic DNA for this campaign.

TEAM: ${team.name} | ${team.level}
Playing Style: ${team.styles.join(', ')||'Not specified'}
Physical: ${team.physical.join(', ')||'Not specified'}
Scrum: ${team.scrum} | Lineout: ${team.lineout}
Mental: ${team.mental.join(', ')||'Not specified'}
Non-Negotiables: ${team.nonNeg||'Not provided'}
Weaknesses: ${team.weaknesses||'Not provided'}

SEASON: ${season.objective||'Not specified'} | ${season.competition||'Not specified'}
Key Dates: ${season.keyDates||'Not specified'}
Training: ${season.training||'Not specified'}
Growth Need: ${season.growth||'Not specified'} | Depth: ${season.depth||'Not specified'}`;
  if(opp?.name) p+=`\n\nOPPOSITION: ${opp.name}\nSoul: ${opp.soul||'Not described'}\nDefence: ${opp.defence||'Unknown'}\nSet Piece: ${opp.setPiece||'Unknown'}\nThreats: ${opp.threats||'Not provided'}\nPressure Points: ${opp.pressure||'Not provided'}\nConditions: ${opp.conditions||'Standard'}`;
  p+=`\n\nGenerate with these exact section headers:\n## TEAM SOUL\nWho ${team.name} actually are right now. Honest. Specific. What they do, depend on, and how they break. 3-5 sentences.\n## SEASON IDENTITY\nThe gap between current and target state. The central strategic challenge of this campaign.\n${opp?.name?`## OPPOSITION EXPLOIT MAP\nThe exact intersection between ${team.name}'s strengths and ${opp.name}'s vulnerabilities. Where one soul breaks.\n`:''}## CAMPAIGN PRINCIPLES\n3 to 5 non-negotiable identity commitments governing every decision this season.\n## FIRST PRIORITY\nThe single most important thing ${team.name} must address in the next 4 weeks. One thing only.\n\nBe direct. Specific. No clichés. No generic rugby language.`;
  return p;
};

const buildModulePrompt = (moduleId,level,dataTypes,deepMode,soulDoc) => {
  const dc=dataTypes.length>0?dataTypes.join(', '):'manual input';
  const soul=soulDoc?`\n\nTEAM SOUL CONTEXT (calibrate all analysis to this specific team):\n${soulDoc.slice(0,800)}\n`:'';
  const depth=deepMode?'\n\nBe exhaustive. Quantify everything. Flag every gap with a specific action.':'';
  const base={
    gameplan:`You are a Tactical Performance Director for a ${level} rugby team. Generate evidence-based, specific game plans. Generic coaching advice is unacceptable. When given opposition data you must: identify the three most exploitable defensive patterns, calculate Expected Points scenarios for red zone options (kick for posts, kick to corner, tap and go), recommend pod formations (1-3-2-2 or 2-4-2) that exploit specific defensive folding patterns identified, define a ruck speed protocol targeting the 3-second threshold, and flag scrum and lineout vulnerabilities with specific exploitation strategies.${soul}
DATA PROVIDED: ${dc}

Output sections using these exact headers: ## Territory Strategy, ## Set Piece Exploitation, ## Attack Shape and Pods, ## Defensive Counter-Plan, ## Priority Actions.`,

    playerdev:`You are a High Performance Lead for a ${level} rugby programme. Create precise, individualised player evolution maps. Generic training programmes are unacceptable. For the player position data provided: map current metrics against the gold standard for their position at ${level} level, calculate the deficit across the three primary value metrics for their position, generate a 12-week technical programme targeting collision mechanics (body height, leg drive, wrap efficiency), include one Wildcard training intervention that prevents developmental plateauing (e.g. wrestling for breakdown stability, gymnastics for spatial awareness, vision training for decision-makers), flag any injury risk patterns in the data, and set measurable review milestones at weeks 4, 8, and 12. Every recommendation must link to a specific performance metric.${soul}
DATA PROVIDED: ${dc}

Headers: ## Current Performance Profile, ## Deficit Analysis, ## 12-Week Programme, ## Wildcard Protocol, ## Review Milestones.`,

    season:`You are a Season Architect for a ${level} rugby programme. Using the fixture list provided: build loading, peaking, and recovery phases across the season, calculate Squad Attrition Probability for high-density periods, design a 6-2 bench rotation strategy to protect the forward pack, flag every high-risk week with specific reasoning, and build a Peaking Protocol for the 3 weeks before each marked peak performance date.${soul}
DATA PROVIDED: ${dc}

Headers: ## Season Phase Map, ## High Risk Week Flags, ## Bench Rotation Schedule, ## Peaking Protocol, ## Load Management Principles.`,

    coachcoach:`You are a Brutally Honest Strategic Advisor auditing decisions for a ${level} rugby programme. Cross-reference every stated reason against the actual outcome data. Identify precisely where the decision improved or damaged key performance metrics. Name the specific cognitive bias operating: choose from confirmation bias, recency bias, sunk cost fallacy, authority bias, availability heuristic, or in-group bias. Provide the data-driven alternative decision that would have optimised the outcome. Deliver a clear verdict using one of these exact words at the start of your verdict section: JUSTIFIED, QUESTIONABLE, or UNSUPPORTED. Be direct. Use data not opinion. Do not soften findings.${soul}
DATA PROVIDED: ${dc}

Headers: ## Decision Audit, ## Data Verdict, ## Bias Identified, ## Alternative Decision, ## One Priority Change.`,

    coachplayer:`You are a Technical Performance Coach speaking directly to a ${level} rugby player. Your function is to deliver precise, honest individual coaching. Identify the three highest-priority technical deficits from the data. For each deficit explain exactly why it is limiting performance using biomechanical or tactical reasoning tied to specific data points. Prescribe specific drills and technical cues for each deficit. Set measurable targets with timeframes. Flag any patterns suggesting deeper physical or psychological constraints needing specialist input. Speak directly to the player using second person. Be honest. Be specific. Plain language only. No generic coaching speak.${soul}
DATA PROVIDED: ${dc}

Headers: ## Your Performance Profile, ## The 3 Things Holding You Back, ## What You Need to Do, ## Your Targets, ## Watch Points.`,

    gameanalysis:`You are a Match Intelligence Analyst for a ${level} rugby team. Diagnose this match, do not summarise it. Find the structural causes of the outcome. Identify the three decisive moments that structurally determined the result. Analyse territory efficiency: calculate actual points per 22-metre entry and compare against the xP benchmark for this level. Evaluate ruck speed data and its specific impact on defensive line reset capability. Identify which forwards won or lost the gain line battle and at what minute the tide turned. Deliver a clear structural verdict on why this match was won or lost. Every finding must have a cause and effect explanation. No data without diagnosis.${soul}
DATA PROVIDED: ${dc}

Headers: ## Match Verdict, ## Three Decisive Moments, ## Territory Efficiency Report, ## Set Piece Impact, ## Three Priority Actions.`,

    tactics:`You are a Positional Intelligence Specialist for ${level} rugby.${soul}
DATA PROVIDED: ${dc}

PRIMARY VALUE METRICS by position: 1-Scrum stability+lift accuracy, 2-Lineout throw accuracy+ruck arrival, 3-Scrum pressure+turnover rate, 4/5-Lineout catch%+dominant carry, 6-Ruck clearance+tackle completion, 7-Turnover rate+ruck arrival, 8-Carry metres+pick and drive, 9-Ruck clearance latency+box kick, 10-Territory kick efficiency+line speed, 12/13-Dominant carry%+intercept, 11/14-Try assist+kick chase, 15-Counter-attack+aerial claim.

Compare against the gold standard for ${level} level. Identify the specific deficit. Prescribe three technical adjustments. Connect the improvement to team system impact.

Headers: ## Position Profile, ## Performance vs Gold Standard, ## Deficit Analysis, ## Three Adjustments, ## System Impact.`,

    redzone:`You are a Red Zone Efficiency Analyst for a ${level} rugby team. Analyse whether scoring zone entries are converting at a rate that justifies the territory strategy. Calculate the efficiency score, identify under-indexing patterns, evaluate each decision type for probability optimisation, assess kicking strategy quality, and rank priority adjustments by impact.${soul}
DATA PROVIDED: ${dc}
BENCHMARKS: Elite Professional=4.2 xP per entry, Semi-Professional=3.6, Academy=3.0, Youth / Age Grade=2.4, Community=2.0.

Headers: ## Territory Efficiency Score, ## xP Analysis, ## Decision Quality Audit, ## Kicking Strategy, ## Priority Adjustments.`,
  };
  return (base[moduleId]||base.gameanalysis)+depth;
};

const buildTemplatePrompt = (type,soulDoc,teamName) => {
  const ctx=soulDoc?`TEAM SOUL DOCUMENT:\n${soulDoc.slice(0,600)}\n\n`:'';
  const map={
    season:`${ctx}Generate a Season Planner template for ${teamName||'this team'}. Create a structured 30-week framework with: Phase labels (off-season, pre-season, early, mid, playoffs, recovery), weekly training focus areas aligned to their playing identity, load flags for high-risk weeks, peak performance windows, and a bench rotation guide. Format as a clear, printable coaching document with headers and structured sections. Make it specific to this team's soul, not generic.`,
    practice:`${ctx}Generate a Weekly Practice Structure template for ${teamName||'this team'}. Create a 5-day training week framework including rest and gym days with: session type labels, time allocations, focus areas per session aligned to their non-negotiables and playing style, warm-up structure, key drill categories, and cool-down. Include notes on what to prioritise based on their soul. Format as a practical template coaches can print and use immediately.`,
    gameplan:`${ctx}Generate a Game Plan Brief Template for ${teamName||'this team'}. Create a structured opposition analysis document with sections for: Team Soul (opposition profile), Territory Strategy, Set Piece Plan, Attack Shape, Defensive Counter-Plan, Set Plays, and Key Messages for Players. The template should be written in language that matches this team's identity and style. Include prompts in each section to guide the coach. Format as a professional one or two page brief.`,
    player:`${ctx}Generate a Player Development Record template for ${teamName||'this team'}. Create an individual player tracking document with: Profile section (position, level, physical metrics), Current Performance vs Gold Standard, Priority Development Areas (3 max), 12-Week Programme framework, Wildcard Intervention space, Review Milestones (weeks 4, 8, 12), and Coaching Notes. Align the metrics and focus areas to this team's positional system.`,
    matchreport:`${ctx}Generate a Match Report Template for ${teamName||'this team'}. Create a post-match analysis document with sections for: Match Verdict (1 paragraph), Three Decisive Moments, Territory Efficiency (xP actual vs benchmark), Set Piece Report, Gain Line Battle Summary, Individual Flags (positive and development), Priority Actions for next week. Format as a clean document coaches can complete within 30 minutes of a match.`,
  };
  return map[type]||map.practice;
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const ChipSel = ({opts,sel,onChange,green}) => (
  <div className="chips">
    {opts.map(o=>(
      <div key={o} className={`chip${sel.includes(o)?' on':''}${green?' g':''}`}
        onClick={()=>sel.includes(o)?onChange(sel.filter(s=>s!==o)):onChange([...sel,o])}>
        {o}
      </div>
    ))}
  </div>
);

const RateSel = ({val,onChange}) => (
  <div className="rrow">
    {[['Strength','str'],['Neutral','neu'],['Weakness','wk']].map(([l,c])=>(
      <button key={l} className={`rbtn ${c}${val===l?' on':''}`} onClick={()=>onChange(l)}>{l}</button>
    ))}
  </div>
);

const PromptCard = ({prompt}) => {
  const [open,setOpen]=useState(false);
  const [copied,setCopied]=useState(false);
  const tc=prompt.type==='module'?'g':'a';
  const handleCopy=(e)=>{
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.text);
    setCopied(true);setTimeout(()=>setCopied(false),2000);
  };
  return (
    <div className="p-card">
      <div className="p-hdr" onClick={()=>setOpen(!open)}>
        <div className="p-meta">
          <div className="p-ttl">{prompt.title}</div>
          <div className="p-dsc">{prompt.desc}</div>
          <div className="p-tags">
            {prompt.tags.map(t=><span key={t} className={`p-tag ${tc}`}>{t}</span>)}
          </div>
        </div>
        <div className="p-acts">
          <button className={`p-cpy${copied?' ok':''}`} onClick={handleCopy}>{copied?'✓ Copied':'Copy'}</button>
          <button className="p-exp">{open?'▲':'▼'}</button>
        </div>
      </div>
      {open&&(
        <div className="p-body">
          <div className="p-txt">{prompt.text}</div>
        </div>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

function RIS() {
  const [view,setView]=useState('home');
  const [soulStep,setSoulStep]=useState(1);
  const [analyseStep,setAnalyseStep]=useState('select');
  const [loading,setLoading]=useState(false);
  const [loadMsg,setLoadMsg]=useState('');
  const [loadAmber,setLoadAmber]=useState(false);
  const [error,setError]=useState('');

  const [soulDoc,setSoulDoc]=useState('');
  const [team,setTeam]=useState({name:'',level:'Semi-Professional',styles:[],physical:[],mental:[],scrum:'',lineout:'',nonNeg:'',weaknesses:''});
  const [season,setSeason]=useState({objective:'',competition:'',keyDates:'',training:'',growth:'',depth:''});
  const [opp,setOpp]=useState({name:'',soul:'',defence:'',setPiece:'',threats:'',pressure:'',conditions:''});

  const [selMod,setSelMod]=useState(null);
  const [selLevel,setSelLevel]=useState('Semi-Professional');
  const [selData,setSelData]=useState([]);
  const [userInput,setUserInput]=useState('');
  const [result,setResult]=useState('');
  const [history,setHistory]=useState([]);
  const [followUp,setFollowUp]=useState('');
  const [deepMode,setDeepMode]=useState(false);
  const [copied,setCopied]=useState(false);

  const [saved,setSaved]=useState([]);
  const [selTemplate,setSelTemplate]=useState(null);
  const [templateResult,setTemplateResult]=useState('');
  const [expView,setExpView]=useState('list');
  const [viewSaved,setViewSaved]=useState(null);

  const [promptSearch,setPromptSearch]=useState('');
  const [promptCat,setPromptCat]=useState('all');

  const T=f=>v=>setTeam(t=>({...t,[f]:v}));
  const S=f=>v=>setSeason(s=>({...s,[f]:v}));
  const O=f=>v=>setOpp(o=>({...o,[f]:v}));

  const callAPI=async(system,messages,maxT=1400)=>{
    let res;
    try{
      res=await fetch('/api/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-5',max_tokens:maxT,system,messages})});
    }catch(netErr){throw new Error(`Cannot reach server — is it running? (${netErr.message})`);}
    const text=await res.text();
    let d;
    try{d=JSON.parse(text);}
    catch{throw new Error(`Server returned non-JSON (HTTP ${res.status}): ${text.slice(0,200)}`);}
    if(d.error) throw new Error(d.error.message||JSON.stringify(d.error));
    if(!d.content?.[0]) throw new Error(`Unexpected API response: ${text.slice(0,200)}`);
    return d.content[0].text;
  };

  const generateSoul=async()=>{
    setLoading(true);setLoadAmber(true);setLoadMsg('BUILDING SOUL DOCUMENT');setError('');
    try{
      const txt=await callAPI(
        'You are a Rugby Intelligence Strategist. Build precise, honest, specific Soul Documents. No clichés. No generic rugby language.',
        [{role:'user',content:buildSoulPrompt(team,season,opp)}],1200
      );
      setSoulDoc(txt);setSoulStep('done');
    }catch(e){setError(e.message||'Connection failed.');}
    finally{setLoading(false);setLoadAmber(false);}
  };

  const generateAnalysis=async()=>{
    setLoading(true);setLoadAmber(false);setLoadMsg('ANALYSING');setError('');setResult('');setHistory([]);setFollowUp('');
    try{
      const sys=buildModulePrompt(selMod.id,selLevel,selData,deepMode,soulDoc);
      const msgs=[{role:'user',content:userInput}];
      const txt=await callAPI(sys,msgs,deepMode?1800:1400);
      setHistory([{role:'user',content:userInput},{role:'assistant',content:txt}]);
      setResult(txt);setAnalyseStep('result');
    }catch(e){setError(e.message||'Connection failed.');}
    finally{setLoading(false);}
  };

  const handleFollowUp=async()=>{
    if(!followUp.trim()||loading) return;
    setLoading(true);setError('');
    const nh=[...history,{role:'user',content:followUp}];
    try{
      const sys=buildModulePrompt(selMod.id,selLevel,selData,deepMode,soulDoc);
      const txt=await callAPI(sys,nh,1200);
      setHistory([...nh,{role:'assistant',content:txt}]);
      setResult(txt);setFollowUp('');
    }catch(e){setError(e.message||'Connection failed.');}
    finally{setLoading(false);}
  };

  const saveAnalysis=()=>{
    const entry={id:Date.now(),module:selMod.label,level:selLevel,input:userInput,result,date:new Date().toLocaleDateString('en-GB')};
    setSaved(s=>[entry,...s]);
    alert('Analysis saved to Templates tab.');
  };

  const generateTemplate=async(type)=>{
    setLoading(true);setLoadAmber(true);setLoadMsg('GENERATING TEMPLATE');setError('');setTemplateResult('');
    try{
      const txt=await callAPI(
        'You are a Rugby Coaching Document Designer. Generate structured, immediately usable coaching templates that are specific to the team provided, not generic. Use clear headings, sections, and practical guidance.',
        [{role:'user',content:buildTemplatePrompt(type,soulDoc,team.name)}],1000
      );
      setTemplateResult(txt);setExpView('template');
    }catch(e){setError(e.message||'Connection failed.');}
    finally{setLoading(false);setLoadAmber(false);}
  };

  const today=new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase();

  if(loading) return (
    <>
      <style>{STYLE}</style>
      <div className="app"><div className="load-wrap">
        <div className={`load-ring${loadAmber?' amber':''}`}/>
        <div className="load-title" style={{color:loadAmber?'var(--amber)':'var(--green)'}}>{loadMsg}</div>
        {team.name&&<div className="load-sub" style={{marginTop:8,color:loadAmber?'var(--amber)':'var(--green)'}}>{team.name.toUpperCase()}</div>}
        <div className="load-sub" style={{marginTop:4}}>POWERED BY CLAUDE AI</div>
      </div></div>
    </>
  );

  const parsedSoul=soulDoc?parseDoc(soulDoc):[];
  const parsedResult=result?parseDoc(result):[];

  // HOME
  const renderHome=()=>(
    <div className="section">
      {soulDoc?(
        <div className="soul-card">
          <div className="soul-card-top">
            <div><div className="soul-team">{team.name.toUpperCase()}</div><div style={{fontFamily:'var(--fm)',fontSize:9,color:'var(--t3)',letterSpacing:'1px',marginTop:2}}>{team.level.toUpperCase()} · {today}</div></div>
            <div className="soul-badge">SOUL ACTIVE</div>
          </div>
          <div className="soul-preview">{soulDoc.replace(/##[^\n]*/g,'').trim()}</div>
          <div className="soul-actions">
            <button className="btn-sm a" onClick={()=>{setView('soul');setSoulStep('done');}}>View Soul</button>
            <button className="btn-sm a" onClick={()=>{setView('soul');setSoulStep(1);setSoulDoc('');}}>Rebuild</button>
            <button className="btn-sm g" onClick={()=>setView('analyse')}>Run Analysis</button>
          </div>
        </div>
      ):(
        <div className="no-soul">
          <div className="no-soul-icon">⚡</div>
          <div className="no-soul-title">START WITH THE HEART</div>
          <div className="no-soul-sub">Build your Team Soul Document first. It powers every analysis.</div>
          <button className="btn-s" style={{maxWidth:280}} onClick={()=>setView('soul')}>BUILD TEAM SOUL</button>
        </div>
      )}
      <div className="sec-lbl">QUICK ACCESS</div>
      <div className="quick-grid">
        {MODULES.slice(0,6).map(m=>(
          <div key={m.id} className="quick-card" onClick={()=>{setSelMod(m);setAnalyseStep('input');setView('analyse');}}>
            <span style={{fontSize:16,marginBottom:4,display:'block'}}>{m.icon}</span>
            <div className="quick-name">{m.label}</div>
            <div className="quick-desc">{m.desc}</div>
          </div>
        ))}
      </div>
      {soulDoc&&(
        <>
          <div className="sec-lbl" style={{marginTop:4}}>GENERATE TEMPLATES</div>
          <div className="quick-grid">
            <div className="quick-card amber" onClick={()=>{setView('exports');setExpView('templates');}}>
              <span style={{fontSize:16,marginBottom:4,display:'block'}}>📋</span>
              <div className="quick-name">Templates</div>
              <div className="quick-desc">Season planner, practice structure, game plan brief</div>
            </div>
            <div className="quick-card amber" onClick={()=>setView('exports')}>
              <span style={{fontSize:16,marginBottom:4,display:'block'}}>💾</span>
              <div className="quick-name">Saved ({saved.length})</div>
              <div className="quick-desc">View and download your saved analyses</div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // SOUL
  const renderSoul=()=>{
    if(soulStep==='done'&&soulDoc) return (
      <div className="section">
        <div className="doc-outer">
          <div className="doc-top">
            <div><div className="doc-tn">{team.name.toUpperCase()}</div><div className="doc-stamp">SOUL DOCUMENT</div></div>
            <div className="doc-meta">
              <span className="doc-ml">LEVEL</span><span className="doc-mv">{team.level.toUpperCase()}</span>
              <span className="doc-ml" style={{marginTop:6}}>DATE</span><span className="doc-mv">{today}</span>
            </div>
          </div>
          <div className="doc-body">
            {parsedSoul.length===1&&!parsedSoul[0].title?(
              <div className="doc-sb">{soulDoc}</div>
            ):parsedSoul.map((s,i)=>(
              <div key={i} className="doc-sec">
                {s.title&&<div className="doc-sh">{s.title}</div>}
                <div className="doc-sb">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
        {error&&<div className="err" style={{marginTop:12}}>{error}</div>}
        <div className="doc-acts">
          <button className="doc-btn" onClick={()=>{navigator.clipboard.writeText(soulDoc);setCopied(true);setTimeout(()=>setCopied(false),2000);}}>
            {copied?'Copied':'Copy'}
          </button>
          <button className="doc-btn" onClick={()=>downloadTxt(`${team.name.toUpperCase()} — SOUL DOCUMENT\n${today}\n\n${soulDoc}`,`${team.name}_Soul_Document.txt`)}>
            Download
          </button>
          <button className="doc-btn pri" onClick={()=>{setSoulStep(1);setSoulDoc('');}}>Rebuild</button>
        </div>
        <div className="ctx-note">
          <div className="ctx-lbl">HOW TO USE</div>
          <div className="ctx-text">This Soul Document is automatically included in every analysis you run. Go to Analyse and the system knows who your team is before it starts.</div>
        </div>
      </div>
    );

    return (
      <div className="section">
        <div className="progress">
          {[1,2,3].map((n,i)=>(
            <div key={n} className="pr-step">
              <div className={`pr-num${soulStep===n?' on':soulStep>n?' done':''}`}>{soulStep>n?'✓':n}</div>
              <div className={`pr-lbl${soulStep===n?' on':''}`}>{['Team Soul','Season','Opposition'][n-1]}</div>
              {i<2&&<div className={`pr-line${soulStep>n?' done':''}`}/>}
            </div>
          ))}
        </div>

        {soulStep===1&&(
          <>
            <div className="page-title">YOUR TEAM'S SOUL</div>
            <div className="page-sub">Who are you right now. Not who you want to be. The more honest, the more accurate everything that follows.</div>
            <div className="field"><label className="lbl">TEAM NAME <em>*</em></label>
              <input className="inp" placeholder="e.g. Stormers, Cape Town RFC" value={team.name} onChange={e=>T('name')(e.target.value)}/>
            </div>
            <div className="field"><label className="lbl">LEVEL</label>
              <select className="inp" value={team.level} onChange={e=>T('level')(e.target.value)}>
                {LEVELS.map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="field"><label className="lbl">PLAYING IDENTITY <em>*</em></label>
              <ChipSel opts={STYLES_OPT} sel={team.styles} onChange={T('styles')}/>
            </div>
            <div className="field"><label className="lbl">PHYSICAL PROFILE</label>
              <ChipSel opts={PHYSICAL_OPT} sel={team.physical} onChange={T('physical')}/>
            </div>
            <div className="field"><label className="lbl">SCRUM <em>*</em></label><RateSel val={team.scrum} onChange={T('scrum')}/></div>
            <div className="field"><label className="lbl">LINEOUT <em>*</em></label><RateSel val={team.lineout} onChange={T('lineout')}/></div>
            <div className="field"><label className="lbl">MENTAL CHARACTER</label>
              <ChipSel opts={MENTAL_OPT} sel={team.mental} onChange={T('mental')}/>
            </div>
            <div className="field"><label className="lbl">NON-NEGOTIABLES</label>
              <textarea className="inp" rows={3} placeholder="What will you always do, no matter what?" value={team.nonNeg} onChange={e=>T('nonNeg')(e.target.value)}/>
            </div>
            <div className="field"><label className="lbl">KNOWN WEAKNESSES</label>
              <textarea className="inp" rows={3} placeholder="Be honest. This stays internal." value={team.weaknesses} onChange={e=>T('weaknesses')(e.target.value)}/>
            </div>
            {error&&<div className="err">{error}</div>}
            <div className="nav-row">
              <button className="btn-s" disabled={!team.name||team.styles.length===0||!team.scrum||!team.lineout} onClick={()=>setSoulStep(2)}>NEXT: SEASON</button>
            </div>
          </>
        )}

        {soulStep===2&&(
          <>
            <div className="page-title">SEASON IDENTITY</div>
            <div className="page-sub">What does this season need to achieve? Define the target.</div>
            <div className="field"><label className="lbl">SEASON OBJECTIVE <em>*</em></label>
              <textarea className="inp" rows={2} placeholder="e.g. Win the league. Reach the final. Develop 5 players for higher selection." value={season.objective} onChange={e=>S('objective')(e.target.value)}/>
            </div>
            <div className="field"><label className="lbl">COMPETITION</label>
              <input className="inp" placeholder="e.g. URC, Currie Cup, Club league" value={season.competition} onChange={e=>S('competition')(e.target.value)}/>
            </div>
            <div className="field"><label className="lbl">KEY PEAK DATES</label>
              <input className="inp" placeholder="e.g. Finals in August. Derby match 12 April." value={season.keyDates} onChange={e=>S('keyDates')(e.target.value)}/>
            </div>
            <div className="field"><label className="lbl">TRAINING RESOURCES</label>
              <input className="inp" placeholder="e.g. 4 sessions/week, 1 gym session, full-time staff" value={season.training} onChange={e=>S('training')(e.target.value)}/>
            </div>
            <div className="field"><label className="lbl">BIGGEST GROWTH NEED</label>
              <div className="chips">{GROWTH_OPT.map(g=><div key={g} className={`chip${season.growth===g?' on':''}`} onClick={()=>S('growth')(season.growth===g?'':g)}>{g}</div>)}</div>
            </div>
            <div className="field"><label className="lbl">SQUAD DEPTH</label>
              <div className="chips">{DEPTH_OPT.map(d=><div key={d} className={`chip${season.depth===d?' on':''}`} onClick={()=>S('depth')(season.depth===d?'':d)}>{d}</div>)}</div>
            </div>
            {error&&<div className="err">{error}</div>}
            <div className="nav-row">
              <button className="btn-back" onClick={()=>setSoulStep(1)}>Back</button>
              <button className="btn-s" disabled={!season.objective} onClick={()=>setSoulStep(3)}>NEXT: OPPOSITION</button>
            </div>
          </>
        )}

        {soulStep===3&&(
          <>
            <div className="page-title">OPPOSITION SOUL</div>
            <div className="page-sub" style={{marginBottom:16}}>Define who you are playing. The system maps where your soul and theirs collide.</div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:20}}>
              <span style={{fontFamily:'var(--fm)',fontSize:9,color:'var(--t3)',border:'1px solid var(--b)',padding:'2px 8px',borderRadius:3,letterSpacing:1}}>OPTIONAL</span>
              <span style={{fontSize:12,color:'var(--t3)'}}>Skip to build team soul only</span>
            </div>
            <div className="field"><label className="lbl">OPPOSITION TEAM</label>
              <input className="inp" placeholder="e.g. Lions, Makasa, Cape Town High" value={opp.name} onChange={e=>O('name')(e.target.value)}/>
            </div>
            <div className="field"><label className="lbl">THEIR SOUL</label>
              <textarea className="inp" rows={3} placeholder="Fast, expansive, hate physicality, struggle at set piece..." value={opp.soul} onChange={e=>O('soul')(e.target.value)}/>
            </div>
            <div className="field"><label className="lbl">THEIR DEFENSIVE SYSTEM</label>
              <div className="chips">{DEF_OPT.map(d=><div key={d} className={`chip${opp.defence===d?' on':''}`} onClick={()=>O('defence')(opp.defence===d?'':d)}>{d}</div>)}</div>
            </div>
            <div className="field"><label className="lbl">THEIR SET PIECE</label><RateSel val={opp.setPiece} onChange={O('setPiece')}/></div>
            <div className="field"><label className="lbl">KEY THREATS</label>
              <textarea className="inp" rows={2} placeholder="What do they do that hurts you?" value={opp.threats} onChange={e=>O('threats')(e.target.value)}/>
            </div>
            <div className="field"><label className="lbl">THEIR PRESSURE POINTS</label>
              <textarea className="inp" rows={2} placeholder="Where do they break?" value={opp.pressure} onChange={e=>O('pressure')(e.target.value)}/>
            </div>
            <div className="field"><label className="lbl">CONDITIONS</label>
              <input className="inp" placeholder="e.g. Narrow pitch, wet surface, evening kickoff" value={opp.conditions} onChange={e=>O('conditions')(e.target.value)}/>
            </div>
            {error&&<div className="err">{error}</div>}
            <div className="nav-row">
              <button className="btn-back" onClick={()=>setSoulStep(2)}>Back</button>
              <button className="btn-s" onClick={generateSoul}>BUILD SOUL DOCUMENT</button>
            </div>
            <button className="btn-skip" onClick={generateSoul}>Skip opposition — build team soul only</button>
          </>
        )}
      </div>
    );
  };

  // ANALYSE
  const renderAnalyse=()=>{
    if(analyseStep==='result'&&result) return (
      <div className="section">
        <div className="res-hdr">
          <div>
            <div className="res-title">{selMod?.label}</div>
            <div style={{fontFamily:'var(--fm)',fontSize:9,color:'var(--t3)',letterSpacing:1,marginTop:2}}>
              {selLevel.toUpperCase()}{soulDoc&&team.name?` · ${team.name.toUpperCase()}`:''}{deepMode?' · DEEP':''}
            </div>
          </div>
          <div className="res-acts">
            <button className="btn-sm" onClick={()=>{navigator.clipboard.writeText(result);setCopied(true);setTimeout(()=>setCopied(false),2000);}}>
              {copied?'✓':'Copy'}
            </button>
            <button className="btn-sm g" onClick={saveAnalysis}>Save</button>
            <button className="btn-sm" onClick={()=>{setResult('');setAnalyseStep('input');}}>Reset</button>
          </div>
        </div>

        {parsedResult.length===1&&!parsedResult[0].title?(
          <div className="sec-card"><div className="sec-body">{result}</div></div>
        ):parsedResult.map((s,i)=>(
          <div key={i} className="sec-card">
            {s.title&&<div className="sec-head">{s.title}</div>}
            <div className="sec-body">{s.body}</div>
          </div>
        ))}

        <div className="fu-area">
          <div className="fu-lbl">FOLLOW-UP</div>
          <textarea className="inp" rows={3} placeholder="Go deeper on a section, request an alternative approach, or add new data..." value={followUp} onChange={e=>setFollowUp(e.target.value)}/>
          {error&&<div className="err">{error}</div>}
        </div>
        <div className="bot-row">
          <button className="bot-sec" onClick={()=>{setResult('');setUserInput('');setAnalyseStep('select');}}>New</button>
          <button className="bot-pri" onClick={handleFollowUp} disabled={followUp.trim().length<5}>Refine</button>
        </div>
        <button className="btn-skip" onClick={()=>downloadTxt(`${selMod?.label?.toUpperCase()} — ${selLevel}\n${today}\n\n${result}`,`${selMod?.id}_analysis.txt`)}>
          Download as .txt
        </button>
      </div>
    );

    return (
      <div className="section">
        {soulDoc&&team.name&&(
          <div style={{background:'var(--ad)',border:'1px solid var(--ba)',borderRadius:6,padding:'8px 12px',marginBottom:20,display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontFamily:'var(--fm)',fontSize:9,color:'var(--amber)',letterSpacing:1}}>SOUL ACTIVE</span>
            <span style={{fontSize:12,color:'var(--t2)'}}>{team.name} — context loaded into all analyses</span>
          </div>
        )}

        {analyseStep==='select'&&(
          <>
            <div className="sec-lbl">SELECT MODULE</div>
            <div className="mod-grid">
              {MODULES.map(m=>(
                <button key={m.id} className={`mod-card${selMod?.id===m.id?' on':''}`} onClick={()=>{setSelMod(m);setAnalyseStep('input');}}>
                  <span className="mod-icon">{m.icon}</span>
                  <div className="mod-name">{m.label}</div>
                  <div className="mod-desc">{m.desc}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {analyseStep==='input'&&selMod&&(
          <>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
              <button className="btn-sm" onClick={()=>setAnalyseStep('select')}>← Back</button>
              <span style={{fontFamily:'var(--fh)',fontSize:20,letterSpacing:1,color:'var(--t)'}}>{selMod.icon} {selMod.label.toUpperCase()}</span>
            </div>

            <div className="sec-lbl">RUGBY LEVEL</div>
            <div className="pills">
              {LEVELS.map(l=><button key={l} className={`pill${selLevel===l?' on':''}`} onClick={()=>setSelLevel(l)}>{l}</button>)}
            </div>

            <div className="sec-lbl">DATA INPUT TYPE <span style={{color:'var(--t3)',letterSpacing:0,textTransform:'none',fontSize:9}}>(select all that apply)</span></div>
            <div className="data-grid" style={{marginBottom:20}}>
              {DATA_TYPES.map(d=>(
                <button key={d.id} className={`data-card${selData.includes(d.id)?' on':''}`}
                  onClick={()=>setSelData(p=>p.includes(d.id)?p.filter(x=>x!==d.id):[...p,d.id])}>
                  <div className="dc-check">{selData.includes(d.id)?'✓':''}</div>
                  <div className="dc-name">{d.label}</div>
                  <div className="dc-desc">{d.desc}</div>
                </button>
              ))}
            </div>

            <div className="sec-lbl">YOUR DATA</div>
            <div className="inp-wrap">
              <textarea className="inp" style={{background:'transparent',border:'none',outline:'none',minHeight:160}} rows={8}
                placeholder={PLACEHOLDERS[selMod.id]} value={userInput} onChange={e=>setUserInput(e.target.value)}/>
            </div>

            <div className="opts-row">
              <button className={`tog${deepMode?' on':''}`} onClick={()=>setDeepMode(!deepMode)}>
                <div className="tog-dot"/>{deepMode?'DEEP ON':'DEEP OFF'}
              </button>
              <span style={{fontSize:11,color:'var(--t3)'}}>{deepMode?'Exhaustive output':'Standard output'}</span>
            </div>

            {error&&<div className="err">{error}</div>}
            <button className="btn-a" disabled={!userInput.trim()||userInput.trim().length<10} onClick={generateAnalysis}>
              GENERATE ANALYSIS
            </button>
            {(!userInput.trim()||userInput.trim().length<10)&&<div className="hint">Enter your data above to generate</div>}
          </>
        )}
      </div>
    );
  };

  // EXPORTS
  const renderExports=()=>{
    if(expView==='template'&&templateResult){
      const parsed=parseDoc(templateResult);
      return (
        <div className="section">
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
            <button className="btn-sm" onClick={()=>{setExpView('templates');setTemplateResult('');}}>← Back</button>
            <span style={{fontFamily:'var(--fh)',fontSize:20,letterSpacing:1,color:'var(--t)'}}>{selTemplate?.label?.toUpperCase()}</span>
          </div>
          {parsed.length===1&&!parsed[0].title?(
            <div className="sec-card"><div className="sec-body">{templateResult}</div></div>
          ):parsed.map((s,i)=>(
            <div key={i} className="sec-card" style={{borderLeft:'3px solid var(--amber)'}}>
              {s.title&&<div className="sec-head" style={{color:'var(--amber)'}}>{s.title}</div>}
              <div className="sec-body">{s.body}</div>
            </div>
          ))}
          <div className="bot-row" style={{marginTop:16}}>
            <button className="bot-sec" onClick={()=>{navigator.clipboard.writeText(templateResult);setCopied(true);setTimeout(()=>setCopied(false),2000);}}>
              {copied?'Copied':'Copy'}
            </button>
            <button className="bot-sec" onClick={()=>downloadTxt(`${selTemplate?.label?.toUpperCase()}\n${team.name?`${team.name} · `:''}${today}\n\n${templateResult}`,`${selTemplate?.id}_template.txt`)}>
              Download
            </button>
          </div>
        </div>
      );
    }

    if(viewSaved) return (
      <div className="section">
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
          <button className="btn-sm" onClick={()=>setViewSaved(null)}>← Back</button>
          <span style={{fontFamily:'var(--fh)',fontSize:18,letterSpacing:1,color:'var(--t)'}}>{viewSaved.module.toUpperCase()}</span>
        </div>
        {parseDoc(viewSaved.result).map((s,i)=>(
          <div key={i} className="sec-card">
            {s.title&&<div className="sec-head">{s.title}</div>}
            <div className="sec-body">{s.body}</div>
          </div>
        ))}
        <div className="bot-row" style={{marginTop:12}}>
          <button className="bot-sec" onClick={()=>navigator.clipboard.writeText(viewSaved.result)}>Copy</button>
          <button className="bot-sec" onClick={()=>downloadTxt(viewSaved.result,`${viewSaved.module}_${viewSaved.date}.txt`)}>Download</button>
        </div>
      </div>
    );

    return (
      <div className="section">
        {!soulDoc&&(
          <div style={{background:'var(--ad)',border:'1px solid var(--ba)',borderRadius:6,padding:'10px 13px',marginBottom:20}}>
            <div style={{fontSize:12,color:'var(--t2)'}}>Build your Team Soul Document first to generate personalised templates.</div>
            <button className="btn-sm a" style={{marginTop:8}} onClick={()=>setView('soul')}>Build Soul Document</button>
          </div>
        )}
        <div className="sec-lbl">COACHING TEMPLATES</div>
        <div className="template-grid">
          {TEMPLATES.map(t=>(
            <div key={t.id} className="tmpl-card" onClick={()=>{setSelTemplate(t);setExpView('templates');generateTemplate(t.id);}}>
              <div className="tmpl-name">{t.label}</div>
              <div className="tmpl-desc">{t.desc}</div>
            </div>
          ))}
        </div>
        {saved.length>0&&(
          <>
            <div className="sec-lbl">SAVED ANALYSES ({saved.length})</div>
            {saved.map(a=>(
              <div key={a.id} className="saved-card" onClick={()=>setViewSaved(a)}>
                <div className="saved-top">
                  <div className="saved-mod">{a.module}</div>
                  <span style={{fontFamily:'var(--fm)',fontSize:9,color:'var(--t3)'}}>{a.date}</span>
                </div>
                <div className="saved-preview">{a.result}</div>
              </div>
            ))}
          </>
        )}
        {saved.length===0&&(
          <div style={{textAlign:'center',padding:'32px 20px',color:'var(--t3)',fontFamily:'var(--fm)',fontSize:11,letterSpacing:1}}>
            NO SAVED ANALYSES YET<br/>
            <span style={{fontSize:10,marginTop:4,display:'block'}}>Run an analysis and hit Save to store it here</span>
          </div>
        )}
        {error&&<div className="err">{error}</div>}
      </div>
    );
  };

  // PROMPTS
  const renderPrompts=()=>{
    const filtered=PROMPT_LIBRARY.filter(p=>{
      const matchCat=promptCat==='all'||p.cat===promptCat;
      const q=promptSearch.toLowerCase();
      const matchSearch=q===''||p.title.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q)||p.tags.some(t=>t.toLowerCase().includes(q));
      return matchCat&&matchSearch;
    });
    const grouped={
      foundation:filtered.filter(p=>p.cat==='foundation'),
      modules:filtered.filter(p=>p.cat==='modules'),
      data:filtered.filter(p=>p.cat==='data'),
      extensions:filtered.filter(p=>p.cat==='extensions'),
    };
    const labels={foundation:'Foundation and Architecture',modules:'Analysis Module Builds',data:'Data Integration',extensions:'Extensions and Utilities'};
    return (
      <div className="section">
        <div className="p-stats">
          <div className="p-stat"><span className="p-stat-n">4</span><span className="p-stat-l">Foundation</span></div>
          <div className="p-stat"><span className="p-stat-n">8</span><span className="p-stat-l">Modules</span></div>
          <div className="p-stat"><span className="p-stat-n">3</span><span className="p-stat-l">Data</span></div>
          <div className="p-stat"><span className="p-stat-n">4</span><span className="p-stat-l">Extensions</span></div>
        </div>
        <div className="p-wrap">
          <span className="p-ico">🔍</span>
          <input className="p-srch" placeholder="Search by title, description, or tag..." value={promptSearch} onChange={e=>setPromptSearch(e.target.value)}/>
        </div>
        <div className="pills" style={{marginBottom:20}}>
          {PROMPT_CATS.map(c=>(
            <button key={c.id} className={`pill${promptCat===c.id?' on':''}`} onClick={()=>setPromptCat(c.id)}>{c.label}</button>
          ))}
        </div>
        {Object.entries(grouped).map(([cat,prompts])=>
          prompts.length>0?(
            <div key={cat}>
              <div className="sec-lbl">{labels[cat]}</div>
              {prompts.map(p=><PromptCard key={p.id} prompt={p}/>)}
            </div>
          ):null
        )}
        {filtered.length===0&&(
          <div style={{textAlign:'center',padding:'60px 20px',color:'var(--t3)',fontFamily:'var(--fm)',fontSize:11,letterSpacing:1}}>
            NO PROMPTS MATCH YOUR SEARCH
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <div className="hdr">
          <div className="hdr-logo">
            <div className="hdr-s"/>
            <div className="hdr-g"/>
          </div>
          <div>
            <div className="hdr-title">RUGBY INTELLIGENCE</div>
            <div className="hdr-sub">POWERED BY CLAUDE AI</div>
          </div>
          <div className="hdr-right">
            <div className="dot"/>LIVE
            {soulDoc&&<span style={{color:'var(--amber)',fontSize:9,marginLeft:6}}>{team.name?.toUpperCase()}</span>}
          </div>
        </div>

        {view==='home'&&renderHome()}
        {view==='soul'&&renderSoul()}
        {view==='analyse'&&renderAnalyse()}
        {view==='exports'&&renderExports()}
        {view==='prompts'&&renderPrompts()}

        <div className="nav">
          {[
            {id:'home',icon:'🏠',label:'HOME',amber:false},
            {id:'soul',icon:'⚡',label:'SOUL',amber:true},
            {id:'analyse',icon:'🎯',label:'ANALYSE',amber:false},
            {id:'exports',icon:'📋',label:'TEMPLATES',amber:true},
            {id:'prompts',icon:'📚',label:'PROMPTS',amber:false},
          ].map(n=>(
            <button key={n.id} className={`nav-item${view===n.id?(n.amber?' active-s':' active-a'):''}`}
              onClick={()=>{setView(n.id);if(n.id==='exports'){setExpView('list');setViewSaved(null);}}}>
              <div className="nav-icon">{n.icon}</div>
              <div className="nav-label">{n.label}</div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

document.getElementById('loader')&&(document.getElementById('loader').style.display='none');
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(RIS));
