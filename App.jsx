const { useState } = React;

// ─── KNOWLEDGE BASE ───────────────────────────────────────────────────────────

const SKILL_TAXONOMY = {
  ball: {
    label:'Core Ball Skills',
    passing:{label:'Passing',skills:['Chest pass','Spin pass','Pop pass','Switch/scissor','Skip pass','Offload in contact','One-handed flick']},
    receiving:{label:'Receiving',skills:['Early catch','Catching at height','Receiving on the burst','Grounding under pressure']},
    kicking:{label:'Kicking',skills:['Punt','Box kick','Grubber','Chip and chase','Drop kick','Place kicking','50:22 kick']},
  },
  contact:{
    label:'Contact & Breakdown',
    tackling:{label:'Tackling',skills:['Front-on tackle','Side-on tackle','Ankle tap','Smother tackle','Double tackle']},
    breakdown:{label:'Breakdown',skills:['Jackalling','Clearing out','Sealing','Ball presentation']},
    evasion:{label:'Evasion',skills:['Side-step','Swerve','Fend','Change of pace','Dummy pass']},
  },
  setPiece:{
    label:'Set Piece',
    scrummaging:{label:'Scrummaging',skills:['Engagement timing','Bind height','Foot positioning','Hooker strike','Flanker anchor','8-man alignment']},
    lineout:{label:'Lineout',skills:['Throw accuracy','Explosive jump','Lifting technique','Maul formation','Peel off back']},
    restarts:{label:'Restarts',skills:['Kick-off hang time','Aerial contest','Blocking runners','Exit execution']},
  },
};

const ALL_SKILL_CATS = [
  ...Object.values(SKILL_TAXONOMY.ball).filter(v=>v.skills).map(c=>({...c,domain:'ball'})),
  ...Object.values(SKILL_TAXONOMY.contact).filter(v=>v.skills).map(c=>({...c,domain:'contact'})),
  ...Object.values(SKILL_TAXONOMY.setPiece).filter(v=>v.skills).map(c=>({...c,domain:'setPiece'})),
];

const POSITIONAL_ARCHETYPES = {
  1:{name:'Loosehead Prop',primary:['Engagement timing','Bind height','Foot positioning'],secondary:['Clearing out','Front-on tackle','Ball presentation'],tertiary:['Maul formation','Spin pass']},
  2:{name:'Hooker',primary:['Throw accuracy','Engagement timing','Hooker strike'],secondary:['Jackalling','Front-on tackle','Lifting technique'],tertiary:['Pop pass','Maul formation']},
  3:{name:'Tighthead Prop',primary:['Engagement timing','Flanker anchor','8-man alignment'],secondary:['Clearing out','Front-on tackle','Foot positioning'],tertiary:['Ball presentation','Bind height']},
  4:{name:'Blindside Lock',primary:['Explosive jump','Lifting technique','Front-on tackle'],secondary:['Clearing out','Maul formation','Aerial contest'],tertiary:['Ball presentation','Jackalling']},
  5:{name:'Openside Lock',primary:['Explosive jump','Lifting technique','Aerial contest'],secondary:['Clearing out','Front-on tackle','Ball presentation'],tertiary:['Jackalling','Maul formation']},
  6:{name:'Blindside Flanker',primary:['Front-on tackle','Jackalling','Clearing out'],secondary:['Flanker anchor','Maul formation','Ball presentation'],tertiary:['Pop pass','Fend']},
  7:{name:'Openside Flanker',primary:['Jackalling','Front-on tackle','Ankle tap'],secondary:['Clearing out','Side-on tackle','Ball presentation'],tertiary:['Spin pass','Swerve']},
  8:{name:'Number 8',primary:['8-man alignment','Front-on tackle','Ball presentation'],secondary:['Clearing out','Spin pass','Fend'],tertiary:['Box kick','Pop pass']},
  9:{name:'Scrum-Half',primary:['Spin pass','Pop pass','Box kick'],secondary:['Chest pass','Switch/scissor','Punt'],tertiary:['Side-step','Jackalling']},
  10:{name:'Fly-Half',primary:['Punt','Place kicking','Spin pass'],secondary:['Grubber','Drop kick','50:22 kick'],tertiary:['Side-step','Chip and chase']},
  11:{name:'Left Wing',primary:['Side-step','Swerve','Fend'],secondary:['Aerial contest','Exit execution','Grubber'],tertiary:['Offload in contact','Chip and chase']},
  12:{name:'Inside Centre',primary:['Front-on tackle','Fend','Switch/scissor'],secondary:['Skip pass','Double tackle','Clearing out'],tertiary:['Grubber','Change of pace']},
  13:{name:'Outside Centre',primary:['Side-step','Fend','Offload in contact'],secondary:['Front-on tackle','Skip pass','Swerve'],tertiary:['Chip and chase','Aerial contest']},
  14:{name:'Right Wing',primary:['Swerve','Side-step','Aerial contest'],secondary:['Exit execution','Grubber','One-handed flick'],tertiary:['Kick-off hang time','Fend']},
  15:{name:'Fullback',primary:['Aerial contest','Punt','Catching at height'],secondary:['Exit execution','Kick-off hang time','Side-step'],tertiary:['50:22 kick','Place kicking']},
};

const CONDITIONING_STANDARDS = {
  rowTest:{name:'Elite Row Test',protocol:'1000m, 750m, 500m, 250m, 750m',unit:'mins total',elite:13,good:15,adequate:17,direction:'lower'},
  aerobicPower:{name:'Aerobic Power (E2MOM)',protocol:'200m run every 2 mins',unit:'rounds completed',elite:10,good:8,adequate:6,direction:'higher'},
  capacity:{name:'Aerobic Capacity',protocol:'4 × 2000m run (1:1 rest)',unit:'mins per rep',elite:8,good:9,adequate:10.5,direction:'lower'},
};

const KPI_FACTORS = [
  {id:'pathway',label:'Structured Pathway Efficiency',desc:'Athlete → elite route clarity'},
  {id:'coaching',label:'Coaching + Sports Science Integration',desc:'Staff coordination & evidence use'},
  {id:'medical',label:'Medical Support Quality',desc:'Physio, rehab, concussion protocols'},
  {id:'leadership',label:'Leadership Stability',desc:'Management consistency & culture'},
  {id:'investment',label:'Investment ROI',desc:'Return on performance spend'},
];

const LOG_EVENTS = [
  {cat:'Scrummaging',skills:['Stable','Penalty won','Collapsed','Reset','Dominant shove']},
  {cat:'Lineout',skills:['Clean catch','Steal','Overthrow','Maul formed','Disrupted']},
  {cat:'Jackalling',skills:['Turnover won','Held up','Penalty conceded','Cleared out']},
  {cat:'Breakdown',skills:['Ruck won','Ruck lost','Slow ball (>3s)','Penalty conceded']},
  {cat:'Tackling',skills:['Dominant tackle','Completion','Missed tackle','Double tackle']},
  {cat:'Ball Carrying',skills:['Metres gained','Dominant carry','Lost in tackle','Offload success']},
  {cat:'Kicking',skills:['50:22 won','Box kick contested','Clearance clean','Kick charged']},
];

// ─── STYLES ───────────────────────────────────────────────────────────────────

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
.nav-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px 2px 10px;cursor:pointer;transition:all .15s;border:none;background:none;color:var(--t3);gap:3px}
.nav-item:hover{color:var(--t2)}
.nav-item.active-a{color:var(--green)}
.nav-item.active-s{color:var(--amber)}
.nav-icon{font-size:16px;line-height:1}
.nav-label{font-family:var(--fm);font-size:7px;letter-spacing:1px;text-transform:uppercase}

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
.soul-actions{display:flex;gap:6px;margin-top:12px;flex-wrap:wrap}

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
.btn-sm.red{border-color:var(--red);background:#2a0a0a;color:#f87171}
.btn-back{padding:13px 18px;border-radius:8px;background:var(--card);border:1px solid var(--b);color:var(--t2);font-size:13px;cursor:pointer;transition:all .15s}
.btn-back:hover{border-color:var(--t3);color:var(--t)}
.btn-skip{width:100%;padding:10px;border-radius:6px;background:none;border:1px dashed var(--b);color:var(--t3);font-size:12px;cursor:pointer;transition:all .15s;margin-top:8px}
.btn-skip:hover{border-color:var(--t3);color:var(--t2)}
.nav-row{display:flex;gap:8px;margin-top:28px}
.hint{text-align:center;font-family:var(--fm);font-size:9px;color:var(--t3);margin-top:8px;letter-spacing:.5px}
.err{background:#2a0a0a;border:1px solid #5c1a1a;border-radius:6px;padding:12px;color:#f87171;font-size:13px;margin-bottom:12px}

.mod-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px}
.mod-card{background:var(--card);border:1px solid var(--b);border-radius:8px;padding:13px;cursor:pointer;transition:all .15s;text-align:left;position:relative;overflow:hidden;border:none;width:100%}
.mod-card:hover{background:var(--card2);border:1px solid #2a4a2a}
.mod-card.on{background:var(--gd);border:1px solid var(--bg2);box-shadow:var(--gg)}
.mod-card.on::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--green)}
.mod-card.amber-mod:hover{border:1px solid var(--ba)!important}
.mod-card.amber-mod.on{background:var(--ad);border:1px solid var(--ba)!important;box-shadow:var(--ag)}
.mod-card.amber-mod.on::before{background:var(--amber)}
.mod-icon{font-size:17px;margin-bottom:5px;display:block}
.mod-name{font-family:var(--fh);font-size:14px;letter-spacing:.3px;color:var(--t);text-transform:uppercase;margin-bottom:2px}
.mod-desc{font-size:10px;color:var(--t2);line-height:1.4}
.mod-tag{font-family:var(--fm);font-size:7px;color:var(--amber);letter-spacing:1px;margin-top:4px}

.pills{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:20px}
.pill{padding:7px 13px;border-radius:100px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid var(--b);background:var(--card);color:var(--t2);transition:all .15s}
.pill:hover{border-color:#2a4a2a;color:var(--t)}
.pill.on{background:var(--green);border-color:var(--green);color:#000;font-weight:600}
.data-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px}
.data-card{background:var(--card);border:1px solid var(--b);border-radius:8px;padding:11px;cursor:pointer;transition:all .15s;position:relative;border:none;text-align:left;width:100%}
.data-card:hover{background:var(--card2);border:1px solid #2a4a2a}
.data-card.on{background:var(--gd);border:1px solid var(--bg2)}
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
.sec-card.amber-card::before{background:var(--amber)}
.sec-head{font-family:var(--fh);font-size:13px;letter-spacing:1px;color:var(--green);text-transform:uppercase;margin-bottom:9px;padding-left:10px}
.sec-head.amber{color:var(--amber)}
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

/* SKILLS TAB */
.player-list{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
.player-card{background:var(--card);border:1px solid var(--b);border-radius:8px;padding:13px;cursor:pointer;transition:all .15s;text-align:left;width:100%;display:flex;align-items:center;justify-content:space-between}
.player-card:hover{background:var(--card2);border-color:#2a4a2a}
.player-pos{font-family:var(--fm);font-size:9px;color:var(--green);letter-spacing:1px;margin-bottom:2px}
.player-name{font-family:var(--fh);font-size:18px;letter-spacing:1px;color:var(--t)}
.fit-badge{text-align:right}
.fit-score{font-family:var(--fh);font-size:28px;line-height:1}
.fit-label{font-family:var(--fm);font-size:7px;color:var(--t3);letter-spacing:1.5px}
.skill-domain{margin-bottom:20px}
.skill-domain-lbl{font-family:var(--fm);font-size:9px;color:var(--t3);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.skill-domain-lbl::after{content:'';flex:1;height:1px;background:var(--b)}
.skill-cat-lbl{font-size:11px;font-weight:600;color:var(--t2);margin:10px 0 6px;padding-left:2px}
.skill-row{display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid #0d150d}
.skill-name-lbl{font-size:12px;color:var(--t2);flex:1}
.skill-name-lbl.is-primary{color:var(--amber)}
.skill-name-lbl.is-secondary{color:var(--t)}
.skill-dots{display:flex;gap:5px}
.skill-dot{width:12px;height:12px;border-radius:50%;border:1px solid var(--b);background:var(--surf);cursor:pointer;transition:all .1s}
.skill-dot:hover{border-color:var(--t3)}
.skill-dot.on{background:var(--green);border-color:var(--green)}
.skill-dot.pri.on{background:var(--amber);border-color:var(--amber)}
.archetype-bar{background:var(--gd);border:1px solid var(--bg2);border-radius:6px;padding:10px 13px;margin-bottom:16px;display:flex;align-items:center;gap:10px}
.archetype-name{font-family:var(--fh);font-size:16px;letter-spacing:1px;color:var(--green)}
.archetype-hint{font-size:11px;color:var(--t3)}

/* MATCH LOGGER */
.log-cats{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.log-cat{padding:6px 12px;border-radius:4px;font-size:11px;cursor:pointer;border:1px solid var(--b);background:var(--card);color:var(--t3);transition:all .15s;font-family:var(--fm);letter-spacing:.5px}
.log-cat:hover{border-color:var(--t2);color:var(--t2)}
.log-cat.on{border-color:var(--bg2);background:var(--gd);color:var(--green)}
.log-skills{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:12px;min-height:32px}
.log-skill{padding:5px 10px;border-radius:4px;font-size:11px;cursor:pointer;border:1px solid var(--b);background:var(--card);color:var(--t2);transition:all .15s}
.log-skill.on{border-color:var(--bg2);background:var(--gd);color:var(--green)}
.log-btns{display:flex;gap:8px;margin-bottom:16px}
.log-win{flex:1;padding:10px;border-radius:6px;font-family:var(--fh);font-size:16px;letter-spacing:1px;cursor:pointer;border:none;background:#00c44a;color:#000;transition:all .15s}
.log-win:disabled{background:var(--card);border:1px solid var(--b);color:var(--t3);cursor:not-allowed}
.log-fail{flex:1;padding:10px;border-radius:6px;font-family:var(--fh);font-size:16px;letter-spacing:1px;cursor:pointer;border:none;background:var(--red);color:#fff;transition:all .15s}
.log-fail:disabled{background:var(--card);border:1px solid var(--b);color:var(--t3);cursor:not-allowed}
.event-feed{background:var(--card);border:1px solid var(--b);border-radius:8px;max-height:200px;overflow-y:auto;margin-bottom:14px}
.event-entry{padding:7px 12px;border-bottom:1px solid #0d150d;display:flex;align-items:center;gap:8px;font-size:11px;color:var(--t2)}
.event-entry:last-child{border-bottom:none}
.ev-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.ev-dot.win{background:var(--green)}
.ev-dot.fail{background:var(--red)}
.eff-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px}
.eff-card{background:var(--card);border:1px solid var(--b);border-radius:6px;padding:10px;text-align:center}
.eff-card.danger{border-color:var(--red);background:#1a0505}
.eff-pct{font-family:var(--fh);font-size:26px;line-height:1}
.eff-pct.ok{color:var(--green)}
.eff-pct.mid{color:var(--amber)}
.eff-pct.low{color:var(--red)}
.eff-name{font-family:var(--fm);font-size:8px;color:var(--t3);letter-spacing:1px;margin-top:3px}
.alert-bar{background:#1a0505;border:1px solid var(--red);border-radius:6px;padding:10px 12px;margin-bottom:10px;font-size:12px;color:#f87171;display:flex;gap:8px;align-items:flex-start}

/* KPI ENGINE */
.kpi-factor{margin-bottom:18px}
.kpi-lbl{font-family:var(--fm);font-size:9px;color:var(--t3);letter-spacing:2px;text-transform:uppercase;margin-bottom:3px;display:flex;justify-content:space-between;align-items:center}
.kpi-desc{font-size:11px;color:var(--t3);margin-bottom:6px}
.kpi-slider{width:100%;height:4px;accent-color:var(--amber);cursor:pointer;margin-bottom:2px}
.kpi-marks{display:flex;justify-content:space-between;font-family:var(--fm);font-size:8px;color:var(--t3)}
.kpi-total{text-align:center;padding:20px 0}
.kpi-big{font-family:var(--fh);font-size:72px;line-height:1;margin-bottom:4px}
.kpi-big-lbl{font-family:var(--fm);font-size:9px;color:var(--t3);letter-spacing:2px}

/* CONDITIONING */
.cond-input{margin-bottom:16px}
.cond-row{display:flex;gap:8px;align-items:flex-end;margin-bottom:12px}
.cond-metric{flex:1}
.cond-badge{font-family:var(--fm);font-size:8px;letter-spacing:1px;padding:2px 7px;border-radius:3px}
.cond-badge.elite{background:var(--gd);border:1px solid var(--bg2);color:var(--green)}
.cond-badge.good{background:var(--ad);border:1px solid var(--ba);color:var(--amber)}
.cond-badge.risk{background:#2a0a0a;border:1px solid var(--red);color:#f87171}

/* RISK FLAGS */
.risk-flag{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:6px;margin-bottom:6px;font-size:12px}
.risk-flag.high{background:#2a0a0a;border:1px solid var(--red);color:#f87171}
.risk-flag.med{background:var(--ad);border:1px solid var(--ba);color:var(--amber)}
.risk-flag.ok{background:var(--gd);border:1px solid var(--bg2);color:var(--green)}

@media(max-width:400px){.mod-grid,.data-grid,.quick-grid,.eff-grid{grid-template-columns:1fr}}
`;

// ─── STATIC DATA ──────────────────────────────────────────────────────────────

const MODULES = [
  {id:'gameplan',label:'Game Plan',icon:'⚔️',desc:'Opposition analysis. Red zone. Tactical frameworks.',amber:false},
  {id:'playerdev',label:'Player Dev',icon:'📈',desc:'Evolution maps. Technical programmes.',amber:false},
  {id:'season',label:'Season Builder',icon:'📅',desc:'Periodisation. Load management. Peaking.',amber:false},
  {id:'coachcoach',label:'Coach Audit',icon:'🔬',desc:'Decision audits. Bias identification.',amber:false},
  {id:'coachplayer',label:'Player Coach',icon:'🎯',desc:'Direct player feedback. Targets.',amber:false},
  {id:'gameanalysis',label:'Match Analysis',icon:'📊',desc:'Match diagnosis. Decisive moments.',amber:false},
  {id:'tactics',label:'Tactics',icon:'🏉',desc:'Positional intelligence. All 15 positions.',amber:false},
  {id:'redzone',label:'Red Zone',icon:'🔴',desc:'Territory efficiency. Expected Points.',amber:false},
  {id:'conditioning',label:'Conditioning',icon:'💪',desc:'Elite baseline. Rugby Ready risk flags. 4-week peak cycle.',amber:true},
  {id:'kpi',label:'KPI Engine',icon:'📡',desc:'Digital Readiness Score. HP competitiveness 1–100.',amber:true},
  {id:'skillanalysis',label:'Skill Matrix',icon:'🎓',desc:'Positional archetypes. Technical proficiency plans.',amber:true},
  {id:'matchlog',label:'Match Logger',icon:'⚡',desc:'Live event logging. Real-time efficiency ratios.',amber:true},
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
  {id:'season',label:'Season Planner',desc:'Full-season framework with phases, peaks, and load flags'},
  {id:'practice',label:'Weekly Practice Structure',desc:'Training week template aligned to your playing identity'},
  {id:'gameplan',label:'Game Plan Brief Template',desc:'Opposition analysis brief in your team\'s language'},
  {id:'player',label:'Player Development Record',desc:'Individual tracking template with skill taxonomy'},
  {id:'matchreport',label:'Match Report Template',desc:'Post-match analysis format for coaching staff'},
  {id:'conditioning',label:'Peak Performance Cycle',desc:'4-week conditioning programme vs elite baseline'},
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
  conditioning:'Player physical data:\n- Row test time (mins)\n- E2MOM rounds completed\n- 4×2000m avg time (mins)\n- Squat 1RM (kg)\n- Bench 1RM (kg)\n- Deadlift 1RM (kg)\n- Body weight (kg)\n- Position\n- Current training load\n- Any injury history',
  skillanalysis:'Player profile:\n- Name, position, age\n- Skill self-ratings or coach observations\n- Video analysis notes\n- Match stat summary\n- Known technical deficits',
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const parseDoc = (t) => {
  const s = t.split(/^## /m).filter(Boolean);
  if(s.length<=1) return [{title:null,body:t}];
  return s.map(x=>{const n=x.indexOf('\n');return{title:n>0?x.slice(0,n).trim():x.trim(),body:n>0?x.slice(n+1).trim():''};});
};

const downloadTxt = (content, name) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content],{type:'text/plain'}));
  a.download = name;
  a.click();
};

const calcPositionFit = (player) => {
  if(!player||!player.position||!player.skills) return 0;
  const arch = POSITIONAL_ARCHETYPES[player.position];
  if(!arch) return 0;
  let score=0,max=0;
  (arch.primary||[]).forEach(s=>{score+=(player.skills[s]||0)*3;max+=15;});
  (arch.secondary||[]).forEach(s=>{score+=(player.skills[s]||0)*2;max+=10;});
  (arch.tertiary||[]).forEach(s=>{score+=(player.skills[s]||0);max+=5;});
  return max>0?Math.round((score/max)*100):0;
};

const calcMatchStats = (events) => {
  const bycat = {};
  events.forEach(e=>{
    if(!bycat[e.cat]) bycat[e.cat]={success:0,total:0};
    bycat[e.cat].total++;
    if(e.success) bycat[e.cat].success++;
  });
  return Object.entries(bycat).map(([cat,d])=>({
    cat,
    pct:d.total>0?Math.round((d.success/d.total)*100):0,
    total:d.total,
    alert:(cat==='Jackalling'||cat==='Scrummaging'||cat==='Breakdown')&&d.total>=3&&(d.success/d.total)<0.7,
  }));
};

const skillTaxonomyText = () => {
  const lines=[];
  Object.values(SKILL_TAXONOMY).forEach(domain=>{
    lines.push(domain.label+':');
    Object.values(domain).filter(v=>v.skills).forEach(cat=>{
      lines.push(`  ${cat.label}: ${cat.skills.join(', ')}`);
    });
  });
  return lines.join('\n');
};

const conditioningText = () =>
  Object.values(CONDITIONING_STANDARDS).map(s=>`${s.name} (${s.protocol}): Elite=${s.elite}${s.unit}, Good=${s.good}${s.unit}, Adequate=${s.adequate}${s.unit}`).join('\n');

// ─── PROMPT BUILDERS ─────────────────────────────────────────────────────────

const buildSoulPrompt = (team,season,opp) => {
  let p=`You are a Rugby Intelligence Strategist. Build the Soul Document for ${team.name} — their strategic DNA for this campaign.\n\nTEAM: ${team.name} | ${team.level}\nPlaying Style: ${team.styles.join(', ')||'Not specified'}\nPhysical: ${team.physical.join(', ')||'Not specified'}\nScrum: ${team.scrum} | Lineout: ${team.lineout}\nMental: ${team.mental.join(', ')||'Not specified'}\nNon-Negotiables: ${team.nonNeg||'Not provided'}\nWeaknesses: ${team.weaknesses||'Not provided'}\n\nSEASON: ${season.objective||'Not specified'} | ${season.competition||'Not specified'}\nKey Dates: ${season.keyDates||'Not specified'}\nTraining: ${season.training||'Not specified'}\nGrowth Need: ${season.growth||'Not specified'} | Depth: ${season.depth||'Not specified'}`;
  if(opp?.name) p+=`\n\nOPPOSITION: ${opp.name}\nSoul: ${opp.soul||'Not described'}\nDefence: ${opp.defence||'Unknown'}\nSet Piece: ${opp.setPiece||'Unknown'}\nThreats: ${opp.threats||'Not provided'}\nPressure Points: ${opp.pressure||'Not provided'}\nConditions: ${opp.conditions||'Standard'}`;
  p+=`\n\nGenerate with these exact section headers:\n## TEAM SOUL\nWho ${team.name} actually are right now. Honest. Specific. What they do, depend on, and how they break. 3-5 sentences.\n## SEASON IDENTITY\nThe gap between current and target state. The central strategic challenge of this campaign.\n${opp?.name?`## OPPOSITION EXPLOIT MAP\nThe exact intersection between ${team.name}'s strengths and ${opp.name}'s vulnerabilities. Where one soul breaks.\n`:''}## CAMPAIGN PRINCIPLES\n3 to 5 non-negotiable identity commitments governing every decision this season.\n## FIRST PRIORITY\nThe single most important thing ${team.name} must address in the next 4 weeks. One thing only.\n\nBe direct. Specific. No clichés. No generic rugby language.`;
  return p;
};

const buildModulePrompt = (moduleId,level,dataTypes,deepMode,soulDoc) => {
  const dc=dataTypes.length>0?dataTypes.join(', '):'manual input';
  const soul=soulDoc?`\n\nTEAM SOUL CONTEXT:\n${soulDoc.slice(0,700)}\n`:'';
  const depth=deepMode?'\n\nDEPTH MODE: Be exhaustive. Quantify everything. Flag every gap with a specific action.':'';
  // Abbreviated taxonomy keeps prompts lean enough for Lambda's 30s timeout
  const skillCtx=`\n\nSKILL TAXONOMY (key categories): Ball Skills: passing, receiving, kicking. Contact: tackling, breakdown, evasion. Set Piece: scrummaging, lineout, restarts. Use the World Rugby skill taxonomy for all assessments.`;
  const condCtx=`\n\nELITE CONDITIONING BASELINES:\n${conditioningText()}`;

  const base={
    gameplan:`You are a Tactical Performance Director for a ${level} rugby team. Evidence-based game plans only.${soul}\nDATA: ${dc}\n\nTACTICAL SCHEMA: Analyse by Zone (own 22, mid, opp 22), Channel (1-5 across the field), and Time phase (0-20, 20-40, 40-60, 60-80 mins).\n\n1. Identify 3 exploitable defensive patterns with zone/channel specificity\n2. Calculate xP for red zone options: posts vs corner vs tap\n3. Recommend pod formations (1-3-2-2 or 2-4-2) for identified gaps\n4. Define ruck speed protocol targeting 3-second threshold\n5. Flag scrum and lineout vulnerabilities by zone\n\n## Territory Strategy | ## Set Piece Exploitation | ## Attack Shape | ## Defensive Counter-Plan | ## Priority Actions`,

    playerdev:`You are a High Performance Lead for a ${level} programme. Individualised evolution maps only.${soul}${skillCtx}\nDATA: ${dc}\n\n1. Map metrics against gold standard for position at ${level}\n2. Calculate deficit across 3 primary value metrics using the Skill Taxonomy\n3. Generate 12-week programme targeting collision mechanics and technical deficits\n4. Include one Wildcard intervention (wrestling, vision training, gymnastics)\n5. Set milestones at weeks 4, 8, 12 with specific measurable targets\n\n## Current Profile | ## Deficit Analysis | ## 12-Week Programme | ## Wildcard Protocol | ## Review Milestones`,

    season:`You are a Season Architect for a ${level} programme.${soul}${condCtx}\nDATA: ${dc}\n\n1. Map loading, peaking, recovery phases across the season\n2. Flag every week where injury probability exceeds 20% based on fixture density\n3. Design 6-2 bench rotation to protect the forward pack\n4. Build Peaking Protocol for final 3 weeks of competition\n5. Integrate conditioning standards — flag when squad conditioning likely to fall below adequate baseline\n\n## Season Phase Map | ## High Risk Weeks | ## Bench Rotation | ## Peaking Protocol | ## Load Principles`,

    coachcoach:`You are a Brutally Honest Strategic Advisor. Audit coaching decisions against data only.${soul}\nDATA: ${dc} | ${level}\n\n1. Cross-reference every stated reason against actual outcome\n2. Name the cognitive bias operating (confirmation, recency, sunk cost, authority, availability)\n3. Provide the data-driven alternative decision\n4. Verdict: JUSTIFIED, QUESTIONABLE, or UNSUPPORTED\n5. One priority change for the next 4 weeks\n\n## Decision Audit | ## Data Verdict | ## Bias Identified | ## Alternative Decision | ## One Priority Change`,

    coachplayer:`You are a Technical Performance Coach speaking directly to a ${level} player.${soul}${skillCtx}\nDATA: ${dc}\n\n1. Identify 3 highest-priority technical deficits from the Skill Taxonomy\n2. Explain exactly why each limits performance (biomechanical or tactical reasoning)\n3. Prescribe specific drills and cues for each\n4. Set measurable targets with timeframes\n5. Flag any Rugby Ready safety constraints\n\nSpeak directly to the player. Plain language.\n## Your Profile | ## 3 Things Holding You Back | ## What You Need To Do | ## Your Targets | ## Watch Points`,

    gameanalysis:`You are a Match Intelligence Analyst for a ${level} team. Diagnose. Do not summarise.${soul}\nDATA: ${dc}\n\nANALYSIS SCHEMA: Map events by Zone (own 22 / mid-field / opp 22), Channel (1-5), and Time phase.\n\n1. Identify 3 decisive structural moments with zone/channel/time context\n2. Territory efficiency: entries vs conversion rate vs xP surplus/deficit\n3. Ruck speed impact on defensive reset\n4. Gain line battle: winner and turning point minute\n5. Structural verdict on why the match was won or lost\n\n## Match Verdict | ## Three Decisive Moments | ## Territory Efficiency | ## Set Piece Impact | ## Three Priority Actions`,

    tactics:`You are a Positional Intelligence Specialist for ${level} rugby.${soul}${skillCtx}\nDATA: ${dc}\n\nPOSITIONAL ARCHETYPES: Each position has primary (weight 3), secondary (weight 2), and tertiary (weight 1) skills from the Skill Taxonomy.\n\n1. Define Primary Value Metric for the position\n2. Compare against gold standard at ${level}\n3. Identify specific deficit from the Skill Taxonomy\n4. Prescribe 3 technical adjustments with drills\n5. Connect to system impact\n\n## Position Profile | ## vs Gold Standard | ## Deficit Analysis | ## Three Adjustments | ## System Impact`,

    redzone:`You are a Red Zone Efficiency Analyst for a ${level} team.${soul}\nDATA: ${dc}\nBENCHMARKS: Elite=4.2 xP, Semi-Pro=3.6, Academy=3.0, Youth=2.4, Community=2.0\n\n1. Calculate xP per entry vs benchmark\n2. Evaluate each decision type (posts/corner/tap) for probability optimisation\n3. Assess kicking strategy: 50:22 execution, box kicks, retention\n4. Identify systemic bias toward low-probability options\n5. Prescribe 3 specific adjustments to improve xP\n\n## Territory Efficiency Score | ## xP Analysis | ## Decision Quality Audit | ## Kicking Strategy | ## Priority Adjustments`,

    conditioning:`You are a High Performance Conditioning Specialist. Apply Rugby Ready safety standards as the floor, elite HP targets as the ceiling.${soul}\nELITE BASELINES:\n${conditioningText()}\n\nRUGBY READY SAFETY: Pre-participation medical screening required. Flag any player whose Strength Base or Aerobic Power falls below adequate as HIGH RISK for set-piece engagement.\n\nDATA: ${dc}\n\n1. Compare each metric against elite/good/adequate baseline\n2. Flag HIGH RISK players (below adequate in any metric)\n3. Generate a 4-week Peak Performance cycle using 5,5,5,3,3,3 strength progression and E2MOM aerobic blocks\n4. Prioritise outcome over activity — measurable shifts in power-to-weight ratio\n5. Integrate concussion and injury history constraints\n\n## Risk Assessment | ## Baseline Comparison | ## 4-Week Peak Cycle | ## Strength Programme | ## Return Protocols`,

    skillanalysis:`You are a Positional Skill Development Analyst for ${level} rugby.${soul}${skillCtx}\n\nPOSITIONAL ARCHETYPES:\n${Object.entries(POSITIONAL_ARCHETYPES).map(([n,a])=>`${n}. ${a.name}: Primary=[${a.primary.join(',')}] Secondary=[${a.secondary.join(',')}]`).join('\n')}\n\nDATA: ${dc}\n\n1. Map player's skill profile against their positional archetype\n2. Calculate Position Fit Score (primary skills weighted x3, secondary x2, tertiary x1)\n3. Identify the 3 highest-impact skill deficits\n4. Prescribe a technical development programme using specific skills from the taxonomy\n5. Flag any cross-references with Rugby Ready safety markers\n\n## Position Fit Assessment | ## Skill Gap Analysis | ## Development Priority | ## Technical Programme | ## Safety Flags`,

    kpi:`You are a High Performance Programme Evaluator. Calculate a Digital Readiness Score based on five factors.${soul}\n\nHP FRAMEWORK: Integrated systematic learning and continuous improvement toward pinnacle event targets. Structured pathways, world-class coaching, sports science integration, professional leadership, measurable KPIs, efficient investment.\n\nDATA: ${dc}\n\n1. Evaluate each of the 5 factors (1-10): Pathway Efficiency, Coaching+Science Integration, Medical Support, Leadership Stability, Investment ROI\n2. Apply weighted scoring: Pathway 25%, Coaching 25%, Medical 20%, Leadership 20%, Investment 10%\n3. Output a Digital Readiness Score (0-100)\n4. Identify the single biggest gap limiting elite potential\n5. Prescribe 3 specific structural interventions\n\n## Digital Readiness Score | ## Factor Breakdown | ## Critical Gap | ## Structural Interventions | ## 12-Month Roadmap`,
  };
  return (base[moduleId]||base.gameanalysis)+depth;
};

const buildTemplatePrompt = (type, soulDoc, teamName) => {
  const ctx=soulDoc?`TEAM SOUL DOCUMENT:\n${soulDoc.slice(0,600)}\n\n`:'';
  const map={
    season:`${ctx}Generate a Season Planner template for ${teamName||'this team'}. 30-week framework with phase labels, weekly training focus areas, load flags for high-risk weeks, peak performance windows, and a bench rotation guide. Specific to this team's soul.`,
    practice:`${ctx}Generate a Weekly Practice Structure template for ${teamName||'this team'}. 5-day framework with session types, time allocations, focus areas aligned to non-negotiables, warm-up structure, key drill categories. Practical and printable.`,
    gameplan:`${ctx}Generate a Game Plan Brief Template for ${teamName||'this team'}. Sections for: Team Soul, Territory Strategy, Set Piece Plan, Attack Shape, Defensive Counter-Plan, Set Plays, Key Messages. Include prompts in each section.`,
    player:`${ctx}Generate a Player Development Record template using the Rugby Skill Taxonomy. Sections: Profile, Current vs Gold Standard (by position archetype), Priority Development Areas (3 max), 12-Week Programme, Wildcard Intervention, Review Milestones.`,
    matchreport:`${ctx}Generate a Match Report Template for ${teamName||'this team'}. Sections: Match Verdict, Three Decisive Moments, Territory Efficiency (xP vs benchmark), Set Piece Report, Gain Line Summary, Individual Flags, Priority Actions. Completable in 30 minutes.`,
    conditioning:`${ctx}Generate a 4-Week Peak Performance Conditioning Cycle for ${teamName||'this team'}. Based on Elite Row Test, E2MOM 20, and 5,5,5,3,3,3 strength progression. Prioritise power-to-weight ratio improvement and aerobic recovery speed. Include Rugby Ready safety checks at weeks 1 and 3.`,
  };
  return map[type]||map.practice;
};

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────

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

const SkillDots = ({val,onChange,isPrimary}) => (
  <div className="skill-dots">
    {[1,2,3,4,5].map(n=>(
      <div key={n}
        className={`skill-dot${val>=n?' on':''}${isPrimary&&val>=n?' pri':''}`}
        onClick={()=>onChange(val===n?0:n)}
      />
    ))}
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

function RIS() {
  const [view,setView] = useState('home');
  const [soulStep,setSoulStep] = useState(1);
  const [analyseStep,setAnalyseStep] = useState('select');
  const [loading,setLoading] = useState(false);
  const [loadMsg,setLoadMsg] = useState('');
  const [loadAmber,setLoadAmber] = useState(false);
  const [error,setError] = useState('');

  // Soul
  const [soulDoc,setSoulDoc] = useState('');
  const [team,setTeam] = useState({name:'',level:'Semi-Professional',styles:[],physical:[],mental:[],scrum:'',lineout:'',nonNeg:'',weaknesses:''});
  const [season,setSeason] = useState({objective:'',competition:'',keyDates:'',training:'',growth:'',depth:''});
  const [opp,setOpp] = useState({name:'',soul:'',defence:'',setPiece:'',threats:'',pressure:'',conditions:''});

  // Analyse
  const [selMod,setSelMod] = useState(null);
  const [selLevel,setSelLevel] = useState('Semi-Professional');
  const [selData,setSelData] = useState([]);
  const [userInput,setUserInput] = useState('');
  const [result,setResult] = useState('');
  const [history,setHistory] = useState([]);
  const [followUp,setFollowUp] = useState('');
  const [deepMode,setDeepMode] = useState(false);
  const [copied,setCopied] = useState(false);

  // KPI sliders
  const [kpiFactors,setKpiFactors] = useState({pathway:5,coaching:5,medical:5,leadership:5,investment:5});

  // Match Logger
  const [logCat,setLogCat] = useState(null);
  const [logSkill,setLogSkill] = useState(null);
  const [matchEvents,setMatchEvents] = useState([]);

  // Skills tab
  const [players,setPlayers] = useState([]);
  const [editPlayer,setEditPlayer] = useState(null);
  const [newPlayerName,setNewPlayerName] = useState('');
  const [newPlayerPos,setNewPlayerPos] = useState(10);
  const [skillsView,setSkillsView] = useState('list');

  // Exports
  const [saved,setSaved] = useState([]);
  const [selTemplate,setSelTemplate] = useState(null);
  const [templateResult,setTemplateResult] = useState('');
  const [expView,setExpView] = useState('list');
  const [viewSaved,setViewSaved] = useState(null);

  const T=f=>v=>setTeam(t=>({...t,[f]:v}));
  const S=f=>v=>setSeason(s=>({...s,[f]:v}));
  const O=f=>v=>setOpp(o=>({...o,[f]:v}));

  const callAPI = async(system,messages,maxT=2000) => {
    let res;
    try{
      res=await fetch('/api/messages',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:maxT,system,messages})
      });
    }catch(netErr){
      throw new Error(`Cannot reach server — is it running? (${netErr.message})`);
    }
    const text=await res.text();
    let d;
    try{ d=JSON.parse(text); }
    catch{ throw new Error(`Server returned non-JSON (HTTP ${res.status}): ${text.slice(0,200)}`); }
    if(d.error) throw new Error(d.error.message||JSON.stringify(d.error));
    if(!d.content?.[0]) throw new Error(`Unexpected API response: ${text.slice(0,200)}`);
    return d.content[0].text;
  };

  const generateSoul = async() => {
    setLoading(true);setLoadAmber(true);setLoadMsg('BUILDING SOUL DOCUMENT');setError('');
    try{
      const txt=await callAPI(
        'You are a Rugby Intelligence Strategist. Build precise, honest, specific Soul Documents. No clichés.',
        [{role:'user',content:buildSoulPrompt(team,season,opp)}],1200
      );
      setSoulDoc(txt);setSoulStep('done');
    }catch(e){setError(e.message||'Connection failed.');}
    finally{setLoading(false);setLoadAmber(false);}
  };

  const generateAnalysis = async() => {
    let input=userInput;
    if(selMod?.id==='kpi'){
      const total=Math.round(
        kpiFactors.pathway*2.5+kpiFactors.coaching*2.5+kpiFactors.medical*2+kpiFactors.leadership*2+kpiFactors.investment*1
      );
      input=`FACTOR SCORES (1-10):\nPathway Efficiency: ${kpiFactors.pathway}\nCoaching+Science Integration: ${kpiFactors.coaching}\nMedical Support: ${kpiFactors.medical}\nLeadership Stability: ${kpiFactors.leadership}\nInvestment ROI: ${kpiFactors.investment}\n\nCalculated raw score: ${total}/100\n\nAdditional context:\n${userInput||'None provided'}`;
    }
    if(selMod?.id==='matchlog'&&matchEvents.length>0){
      const stats=calcMatchStats(matchEvents);
      input=`MATCH EVENT LOG (${matchEvents.length} events):\n${stats.map(s=>`${s.cat}: ${s.pct}% efficiency (${s.total} events)`).join('\n')}\n\nFull event sequence:\n${matchEvents.map((e,i)=>`${i+1}. ${e.cat} — ${e.skill} — ${e.success?'SUCCESS':'FAIL'}`).join('\n')}\n\nAdditional context:\n${userInput||'None provided'}`;
    }
    setLoading(true);setLoadAmber(false);setLoadMsg('ANALYSING');setError('');setResult('');setHistory([]);setFollowUp('');
    try{
      const sys=buildModulePrompt(selMod.id,selLevel,selData,deepMode,soulDoc);
      const msgs=[{role:'user',content:input}];
      const txt=await callAPI(sys,msgs,deepMode?1800:1400);
      setHistory([{role:'user',content:input},{role:'assistant',content:txt}]);
      setResult(txt);setAnalyseStep('result');
    }catch(e){setError(e.message||'Connection failed.');}
    finally{setLoading(false);}
  };

  const handleFollowUp = async() => {
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

  const saveAnalysis = () => {
    const entry={id:Date.now(),module:selMod.label,level:selLevel,input:userInput,result,date:new Date().toLocaleDateString('en-GB')};
    setSaved(s=>[entry,...s]);
    alert('Saved to Templates tab.');
  };

  const generateTemplate = async(type) => {
    setLoading(true);setLoadAmber(true);setLoadMsg('GENERATING TEMPLATE');setError('');setTemplateResult('');
    try{
      const txt=await callAPI(
        'You are a Rugby Coaching Document Designer. Generate structured, immediately usable coaching templates specific to the team provided, not generic.',
        [{role:'user',content:buildTemplatePrompt(type,soulDoc,team.name)}],1000
      );
      setTemplateResult(txt);setExpView('template');
    }catch(e){setError(e.message||'Connection failed.');}
    finally{setLoading(false);setLoadAmber(false);}
  };

  const generateDevPlan = async(player) => {
    const arch=POSITIONAL_ARCHETYPES[player.position];
    const fitScore=calcPositionFit(player);
    const skillLines=ALL_SKILL_CATS.map(cat=>{
      const rated=cat.skills.filter(s=>player.skills[s]);
      return rated.map(s=>`${s}: ${player.skills[s]}/5`).join(', ');
    }).filter(Boolean).join('\n');
    const input=`PLAYER: ${player.name}\nPOSITION: ${arch?.name||player.position}\nPOSITION FIT SCORE: ${fitScore}/100\n\nSKILL RATINGS:\n${skillLines||'No ratings recorded yet'}\n\nPRIMARY SKILLS FOR POSITION: ${arch?.primary?.join(', ')}\nSECONDARY SKILLS: ${arch?.secondary?.join(', ')}`;
    setLoading(true);setLoadAmber(false);setLoadMsg('BUILDING PLAN');setError('');
    try{
      const sys=buildModulePrompt('skillanalysis',selLevel,[],false,soulDoc);
      const txt=await callAPI(sys,[{role:'user',content:input}],1400);
      setResult(txt);setSelMod(MODULES.find(m=>m.id==='skillanalysis'));setAnalyseStep('result');setView('analyse');
    }catch(e){setError(e.message||'Connection failed.');}
    finally{setLoading(false);}
  };

  const logEvent = (success) => {
    if(!logCat||!logSkill) return;
    setMatchEvents(ev=>[...ev,{cat:logCat,skill:logSkill,success,time:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}]);
    setLogSkill(null);
  };

  const today=new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase();
  const matchStats=calcMatchStats(matchEvents);
  const alerts=matchStats.filter(s=>s.alert);

  // ─── LOADING ───────────────────────────────────────────────────────────────

  if(loading) return(
    <>
      <style>{STYLE}</style>
      <div className="app"><div className="load-wrap">
        <div className={`load-ring${loadAmber?' amber':''}`}/>
        <div className="load-title" style={{color:loadAmber?'var(--amber)':'var(--green)'}}>{loadMsg}</div>
        {team.name&&<div className="load-sub" style={{marginTop:8,color:loadAmber?'var(--amber)':'var(--green)'}}>{team.name.toUpperCase()}</div>}
        <div className="load-sub" style={{marginTop:4}}>RUGBY INTELLIGENCE SYSTEM</div>
      </div></div>
    </>
  );

  const parsedSoul=soulDoc?parseDoc(soulDoc):[];
  const parsedResult=result?parseDoc(result):[];

  // ─── HOME ──────────────────────────────────────────────────────────────────

  const renderHome = () => (
    <div className="section">
      {soulDoc?(
        <div className="soul-card">
          <div className="soul-card-top">
            <div><div className="soul-team">{team.name.toUpperCase()}</div>
              <div style={{fontFamily:'var(--fm)',fontSize:9,color:'var(--t3)',letterSpacing:'1px',marginTop:2}}>{team.level.toUpperCase()} · {today}</div>
            </div>
            <div className="soul-badge">SOUL ACTIVE</div>
          </div>
          <div className="soul-preview">{soulDoc.replace(/##[^\n]*/g,'').trim()}</div>
          <div className="soul-actions">
            <button className="btn-sm a" onClick={()=>{setView('soul');setSoulStep('done');}}>View Soul</button>
            <button className="btn-sm a" onClick={()=>{setView('soul');setSoulStep(1);setSoulDoc('');}}>Rebuild</button>
            <button className="btn-sm g" onClick={()=>setView('analyse')}>Analyse</button>
            <button className="btn-sm g" onClick={()=>setView('skills')}>Skills</button>
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

      <div className="sec-lbl">ANALYSIS MODULES</div>
      <div className="quick-grid">
        {MODULES.slice(0,6).map(m=>(
          <div key={m.id} className="quick-card" onClick={()=>{setSelMod(m);setAnalyseStep('input');setView('analyse');}}>
            <span style={{fontSize:16,marginBottom:4,display:'block'}}>{m.icon}</span>
            <div className="quick-name">{m.label}</div>
            <div className="quick-desc">{m.desc}</div>
          </div>
        ))}
      </div>

      <div className="sec-lbl">INTELLIGENCE LAYER</div>
      <div className="quick-grid">
        {MODULES.slice(8).map(m=>(
          <div key={m.id} className={`quick-card amber`} onClick={()=>{setSelMod(m);m.id==='matchlog'?setAnalyseStep('logger'):setAnalyseStep('input');setView('analyse');}}>
            <span style={{fontSize:16,marginBottom:4,display:'block'}}>{m.icon}</span>
            <div className="quick-name">{m.label}</div>
            <div className="quick-desc">{m.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── SOUL ──────────────────────────────────────────────────────────────────

  const renderSoul = () => {
    if(soulStep==='done'&&soulDoc) return(
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
            {parsedSoul.length===1&&!parsedSoul[0].title?(<div className="doc-sb">{soulDoc}</div>)
              :parsedSoul.map((s,i)=>(
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
          <button className="doc-btn" onClick={()=>downloadTxt(`${team.name.toUpperCase()} — SOUL DOCUMENT\n${today}\n\n${soulDoc}`,`${team.name}_Soul.txt`)}>Download</button>
          <button className="doc-btn pri" onClick={()=>{setSoulStep(1);setSoulDoc('');}}>Rebuild</button>
        </div>
        <div className="ctx-note">
          <div className="ctx-lbl">HOW TO USE</div>
          <div className="ctx-text">This Soul Document loads automatically into every analysis. Go to Analyse — the system knows your team before it starts.</div>
        </div>
      </div>
    );

    return(
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

        {soulStep===1&&(<>
          <div className="page-title">YOUR TEAM'S SOUL</div>
          <div className="page-sub">Who are you right now. Not who you want to be.</div>
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
        </>)}

        {soulStep===2&&(<>
          <div className="page-title">SEASON IDENTITY</div>
          <div className="page-sub">What does this season need to achieve?</div>
          <div className="field"><label className="lbl">SEASON OBJECTIVE <em>*</em></label>
            <textarea className="inp" rows={2} placeholder="e.g. Win the league. Reach the final." value={season.objective} onChange={e=>S('objective')(e.target.value)}/>
          </div>
          <div className="field"><label className="lbl">COMPETITION</label>
            <input className="inp" placeholder="e.g. URC, Currie Cup, Club league" value={season.competition} onChange={e=>S('competition')(e.target.value)}/>
          </div>
          <div className="field"><label className="lbl">KEY PEAK DATES</label>
            <input className="inp" placeholder="e.g. Finals in August. Derby 12 April." value={season.keyDates} onChange={e=>S('keyDates')(e.target.value)}/>
          </div>
          <div className="field"><label className="lbl">TRAINING RESOURCES</label>
            <input className="inp" placeholder="e.g. 4 sessions/week, full-time staff" value={season.training} onChange={e=>S('training')(e.target.value)}/>
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
        </>)}

        {soulStep===3&&(<>
          <div className="page-title">OPPOSITION SOUL</div>
          <div className="page-sub" style={{marginBottom:16}}>Map where your soul and theirs collide.</div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:20}}>
            <span style={{fontFamily:'var(--fm)',fontSize:9,color:'var(--t3)',border:'1px solid var(--b)',padding:'2px 8px',borderRadius:3}}>OPTIONAL</span>
            <span style={{fontSize:12,color:'var(--t3)'}}>Skip to build team soul only</span>
          </div>
          <div className="field"><label className="lbl">OPPOSITION TEAM</label>
            <input className="inp" placeholder="e.g. Lions, Cape Town High" value={opp.name} onChange={e=>O('name')(e.target.value)}/>
          </div>
          <div className="field"><label className="lbl">THEIR SOUL</label>
            <textarea className="inp" rows={3} placeholder="Fast, expansive, hate physicality..." value={opp.soul} onChange={e=>O('soul')(e.target.value)}/>
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
            <input className="inp" placeholder="e.g. Narrow pitch, wet, evening kickoff" value={opp.conditions} onChange={e=>O('conditions')(e.target.value)}/>
          </div>
          {error&&<div className="err">{error}</div>}
          <div className="nav-row">
            <button className="btn-back" onClick={()=>setSoulStep(2)}>Back</button>
            <button className="btn-s" onClick={generateSoul}>BUILD SOUL DOCUMENT</button>
          </div>
          <button className="btn-skip" onClick={generateSoul}>Skip opposition — build team soul only</button>
        </>)}
      </div>
    );
  };

  // ─── ANALYSE ──────────────────────────────────────────────────────────────

  const renderMatchLogger = () => {
    const catData=LOG_EVENTS.find(c=>c.cat===logCat);
    return(
      <div className="section">
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
          <button className="btn-sm" onClick={()=>setAnalyseStep('select')}>← Back</button>
          <span style={{fontFamily:'var(--fh)',fontSize:20,letterSpacing:1,color:'var(--t)'}}>⚡ MATCH LOGGER</span>
          {matchEvents.length>0&&<button className="btn-sm red" style={{marginLeft:'auto'}} onClick={()=>{setMatchEvents([]);setLogCat(null);setLogSkill(null);}}>Clear</button>}
        </div>

        {alerts.length>0&&alerts.map(a=>(
          <div key={a.cat} className="alert-bar">⚠️ PENALTY RISK — {a.cat} efficiency at {a.pct}%. Exceeds 30% failure threshold.</div>
        ))}

        <div className="sec-lbl">SELECT CATEGORY</div>
        <div className="log-cats">
          {LOG_EVENTS.map(c=>(
            <button key={c.cat} className={`log-cat${logCat===c.cat?' on':''}`} onClick={()=>{setLogCat(c.cat);setLogSkill(null);}}>{c.cat}</button>
          ))}
        </div>

        {catData&&(<>
          <div className="sec-lbl">SELECT EVENT</div>
          <div className="log-skills">
            {catData.skills.map(s=>(
              <button key={s} className={`log-skill${logSkill===s?' on':''}`} onClick={()=>setLogSkill(s)}>{s}</button>
            ))}
          </div>
        </>)}

        <div className="log-btns">
          <button className="log-win" disabled={!logCat||!logSkill} onClick={()=>logEvent(true)}>✓ SUCCESS</button>
          <button className="log-fail" disabled={!logCat||!logSkill} onClick={()=>logEvent(false)}>✗ FAIL</button>
        </div>

        {matchEvents.length>0&&(<>
          <div className="sec-lbl">EFFICIENCY — {matchEvents.length} EVENTS</div>
          <div className="eff-grid">
            {matchStats.map(s=>(
              <div key={s.cat} className={`eff-card${s.alert?' danger':''}`}>
                <div className={`eff-pct${s.pct>=70?' ok':s.pct>=50?' mid':' low'}`}>{s.pct}%</div>
                <div className="eff-name">{s.cat.toUpperCase()} ({s.total})</div>
              </div>
            ))}
          </div>

          <div className="sec-lbl">EVENT FEED</div>
          <div className="event-feed">
            {[...matchEvents].reverse().map((e,i)=>(
              <div key={i} className="event-entry">
                <div className={`ev-dot${e.success?' win':' fail'}`}/>
                <span style={{color:'var(--t3)',fontFamily:'var(--fm)',fontSize:9}}>{e.time}</span>
                <span style={{flex:1}}>{e.cat} — {e.skill}</span>
                <span style={{color:e.success?'var(--green)':'var(--red)',fontFamily:'var(--fm)',fontSize:9}}>{e.success?'WIN':'FAIL'}</span>
              </div>
            ))}
          </div>

          <div className="opts-row">
            <span style={{fontSize:12,color:'var(--t3)'}}>Add context for AI analysis (optional)</span>
          </div>
          <div className="inp-wrap">
            <textarea className="inp" style={{background:'transparent',border:'none',outline:'none',minHeight:60}} rows={3}
              placeholder="Match situation, opposition, phase of game..." value={userInput} onChange={e=>setUserInput(e.target.value)}/>
          </div>
          {error&&<div className="err">{error}</div>}
          <button className="btn-a" onClick={generateAnalysis}>ANALYSE PATTERNS WITH AI</button>
        </>)}

        {matchEvents.length===0&&(
          <div style={{textAlign:'center',padding:'32px 20px',color:'var(--t3)',fontFamily:'var(--fm)',fontSize:10,letterSpacing:1}}>
            SELECT A CATEGORY AND LOG EVENTS<br/>
            <span style={{fontSize:9,marginTop:4,display:'block'}}>Efficiency ratios and penalty risk alerts update in real time</span>
          </div>
        )}
      </div>
    );
  };

  const renderKPIInput = () => {
    const weighted=Math.round(kpiFactors.pathway*2.5+kpiFactors.coaching*2.5+kpiFactors.medical*2+kpiFactors.leadership*2+kpiFactors.investment*1);
    const col=weighted>=75?'var(--green)':weighted>=50?'var(--amber)':'var(--red)';
    return(
      <div className="section">
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
          <button className="btn-sm" onClick={()=>setAnalyseStep('select')}>← Back</button>
          <span style={{fontFamily:'var(--fh)',fontSize:20,letterSpacing:1,color:'var(--t)'}}>📡 KPI ENGINE</span>
        </div>

        <div className="kpi-total">
          <div className="kpi-big" style={{color:col}}>{weighted}</div>
          <div className="kpi-big-lbl">DIGITAL READINESS SCORE</div>
        </div>

        {KPI_FACTORS.map(f=>(
          <div key={f.id} className="kpi-factor">
            <div className="kpi-lbl">
              {f.label}
              <span style={{color:'var(--amber)'}}>{kpiFactors[f.id]}/10</span>
            </div>
            <div style={{fontSize:11,color:'var(--t3)',marginBottom:6}}>{f.desc}</div>
            <input type="range" className="kpi-slider" min={1} max={10} step={1}
              value={kpiFactors[f.id]}
              onChange={e=>setKpiFactors(k=>({...k,[f.id]:+e.target.value}))}
            />
            <div className="kpi-marks"><span>1 — Minimal</span><span>10 — World Class</span></div>
          </div>
        ))}

        <div className="field" style={{marginTop:8}}><label className="lbl">ADDITIONAL CONTEXT</label>
          <textarea className="inp" rows={3} placeholder="Programme history, recent results, squad overview, challenges..." value={userInput} onChange={e=>setUserInput(e.target.value)}/>
        </div>
        {error&&<div className="err">{error}</div>}
        <button className="btn-s" onClick={generateAnalysis}>GENERATE FULL ASSESSMENT</button>
      </div>
    );
  };

  const renderAnalyse = () => {
    if(analyseStep==='result'&&result) return(
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
          <div key={i} className={`sec-card${selMod?.amber?' amber-card':''}`}>
            {s.title&&<div className={`sec-head${selMod?.amber?' amber':''}`}>{s.title}</div>}
            <div className="sec-body">{s.body}</div>
          </div>
        ))}

        <div className="fu-area">
          <div className="fu-lbl">FOLLOW-UP</div>
          <textarea className="inp" rows={3} placeholder="Go deeper on a section, add new data, request alternative..." value={followUp} onChange={e=>setFollowUp(e.target.value)}/>
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

    if(analyseStep==='logger') return renderMatchLogger();
    if(analyseStep==='kpi') return renderKPIInput();

    return(
      <div className="section">
        {soulDoc&&team.name&&(
          <div style={{background:'var(--ad)',border:'1px solid var(--ba)',borderRadius:6,padding:'8px 12px',marginBottom:20,display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontFamily:'var(--fm)',fontSize:9,color:'var(--amber)',letterSpacing:1}}>SOUL ACTIVE</span>
            <span style={{fontSize:12,color:'var(--t2)'}}>{team.name} — context in all analyses</span>
          </div>
        )}

        {analyseStep==='select'&&(<>
          <div className="sec-lbl">TACTICAL MODULES</div>
          <div className="mod-grid">
            {MODULES.filter(m=>!m.amber).map(m=>(
              <button key={m.id} className={`mod-card${selMod?.id===m.id?' on':''}`}
                onClick={()=>{setSelMod(m);setAnalyseStep('input');}}>
                <span className="mod-icon">{m.icon}</span>
                <div className="mod-name">{m.label}</div>
                <div className="mod-desc">{m.desc}</div>
              </button>
            ))}
          </div>
          <div className="sec-lbl">INTELLIGENCE LAYER</div>
          <div className="mod-grid">
            {MODULES.filter(m=>m.amber).map(m=>(
              <button key={m.id} className={`mod-card amber-mod${selMod?.id===m.id?' on':''}`}
                onClick={()=>{setSelMod(m);m.id==='matchlog'?setAnalyseStep('logger'):m.id==='kpi'?setAnalyseStep('kpi'):setAnalyseStep('input');}}>
                <span className="mod-icon">{m.icon}</span>
                <div className="mod-name">{m.label}</div>
                <div className="mod-desc">{m.desc}</div>
                <div className="mod-tag">NEW</div>
              </button>
            ))}
          </div>
        </>)}

        {analyseStep==='input'&&selMod&&(<>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
            <button className="btn-sm" onClick={()=>setAnalyseStep('select')}>← Back</button>
            <span style={{fontFamily:'var(--fh)',fontSize:20,letterSpacing:1,color:'var(--t)'}}>{selMod.icon} {selMod.label.toUpperCase()}</span>
          </div>

          <div className="sec-lbl">RUGBY LEVEL</div>
          <div className="pills">
            {LEVELS.map(l=><button key={l} className={`pill${selLevel===l?' on':''}`} onClick={()=>setSelLevel(l)}>{l}</button>)}
          </div>

          <div className="sec-lbl">DATA INPUT TYPE</div>
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
              placeholder={PLACEHOLDERS[selMod.id]||'Paste your data here...'} value={userInput} onChange={e=>setUserInput(e.target.value)}/>
          </div>

          <div className="opts-row">
            <button className={`tog${deepMode?' on':''}`} onClick={()=>setDeepMode(!deepMode)}>
              <div className="tog-dot"/>{deepMode?'DEEP ON':'DEEP OFF'}
            </button>
            <span style={{fontSize:11,color:'var(--t3)'}}>{deepMode?'Exhaustive output':'Standard output'}</span>
          </div>

          {error&&<div className="err">{error}</div>}
          <button className="btn-a" disabled={!userInput.trim()||userInput.trim().length<10} onClick={generateAnalysis}>GENERATE ANALYSIS</button>
          {(!userInput.trim()||userInput.trim().length<10)&&<div className="hint">Enter your data above to generate</div>}
        </>)}
      </div>
    );
  };

  // ─── SKILLS ───────────────────────────────────────────────────────────────

  const renderSkills = () => {
    if(skillsView==='edit'&&editPlayer){
      const arch=POSITIONAL_ARCHETYPES[editPlayer.position];
      const fitScore=calcPositionFit(editPlayer);
      const fitCol=fitScore>=70?'var(--green)':fitScore>=45?'var(--amber)':'var(--red)';

      const updateSkill=(skill,val)=>{
        const updated={...editPlayer,skills:{...editPlayer.skills,[skill]:val}};
        setEditPlayer(updated);
        setPlayers(ps=>ps.map(p=>p.id===updated.id?updated:p));
      };

      const isPrimary=skill=>arch?.primary?.includes(skill);
      const isSecondary=skill=>arch?.secondary?.includes(skill);

      return(
        <div className="section">
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <button className="btn-sm" onClick={()=>setSkillsView('list')}>← Back</button>
            <span style={{fontFamily:'var(--fh)',fontSize:20,letterSpacing:1,color:'var(--t)'}}>{editPlayer.name.toUpperCase()}</span>
          </div>

          {arch&&(
            <div className="archetype-bar">
              <div>
                <div className="archetype-name">{arch.name}</div>
                <div className="archetype-hint">#{editPlayer.position} · Primary skills highlighted in amber</div>
              </div>
              <div style={{marginLeft:'auto',textAlign:'right'}}>
                <div className="fit-score" style={{color:fitCol}}>{fitScore}</div>
                <div className="fit-label">FIT SCORE</div>
              </div>
            </div>
          )}

          {Object.entries(SKILL_TAXONOMY).map(([domKey,domain])=>(
            <div key={domKey} className="skill-domain">
              <div className="skill-domain-lbl">{domain.label}</div>
              {Object.entries(domain).filter(([k,v])=>v.skills).map(([catKey,cat])=>(
                <div key={catKey}>
                  <div className="skill-cat-lbl">{cat.label}</div>
                  {cat.skills.map(skill=>(
                    <div key={skill} className="skill-row">
                      <span className={`skill-name-lbl${isPrimary(skill)?' is-primary':isSecondary(skill)?' is-secondary':''}`}>
                        {skill}{isPrimary(skill)?' ★':''}
                      </span>
                      <SkillDots
                        val={editPlayer.skills[skill]||0}
                        onChange={val=>updateSkill(skill,val)}
                        isPrimary={isPrimary(skill)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

          {error&&<div className="err">{error}</div>}
          <div className="bot-row" style={{marginTop:16}}>
            <button className="bot-sec" onClick={()=>setSkillsView('list')}>Done</button>
            <button className="bot-pri" onClick={()=>generateDevPlan(editPlayer)}>Build Dev Plan</button>
          </div>
        </div>
      );
    }

    return(
      <div className="section">
        <div className="page-title">SKILL MATRIX</div>
        <div className="page-sub">Track technical proficiency for every player against positional archetypes.</div>

        {players.length>0&&(
          <div className="player-list">
            {players.map(p=>{
              const arch=POSITIONAL_ARCHETYPES[p.position];
              const fit=calcPositionFit(p);
              const fitCol=fit>=70?'var(--green)':fit>=45?'var(--amber)':'var(--red)';
              return(
                <button key={p.id} className="player-card" onClick={()=>{setEditPlayer(p);setSkillsView('edit');}}>
                  <div>
                    <div className="player-pos">{arch?.name?.toUpperCase()||`POSITION ${p.position}`}</div>
                    <div className="player-name">{p.name}</div>
                  </div>
                  <div className="fit-badge">
                    <div className="fit-score" style={{color:fitCol}}>{fit}</div>
                    <div className="fit-label">FIT SCORE</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="sec-lbl">ADD PLAYER</div>
        <div className="field">
          <label className="lbl">NAME</label>
          <input className="inp" placeholder="Player name" value={newPlayerName} onChange={e=>setNewPlayerName(e.target.value)}/>
        </div>
        <div className="field">
          <label className="lbl">POSITION (1–15)</label>
          <select className="inp" value={newPlayerPos} onChange={e=>setNewPlayerPos(+e.target.value)}>
            {Object.entries(POSITIONAL_ARCHETYPES).map(([n,a])=><option key={n} value={n}>{n}. {a.name}</option>)}
          </select>
        </div>
        <button className="btn-a" disabled={!newPlayerName.trim()} onClick={()=>{
          const p={id:Date.now(),name:newPlayerName.trim(),position:newPlayerPos,skills:{}};
          setPlayers(ps=>[...ps,p]);
          setEditPlayer(p);
          setSkillsView('edit');
          setNewPlayerName('');
        }}>ADD PLAYER</button>

        {players.length===0&&(
          <div style={{textAlign:'center',padding:'24px 0',color:'var(--t3)',fontFamily:'var(--fm)',fontSize:10,letterSpacing:1,marginTop:16}}>
            NO PLAYERS YET<br/>
            <span style={{fontSize:9,display:'block',marginTop:4}}>Add a player to start rating their skills</span>
          </div>
        )}
      </div>
    );
  };

  // ─── EXPORTS ──────────────────────────────────────────────────────────────

  const renderExports = () => {
    if(expView==='template'&&templateResult){
      const parsed=parseDoc(templateResult);
      return(
        <div className="section">
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
            <button className="btn-sm" onClick={()=>{setExpView('list');setTemplateResult('');}}>← Back</button>
            <span style={{fontFamily:'var(--fh)',fontSize:20,letterSpacing:1,color:'var(--t)'}}>{selTemplate?.label?.toUpperCase()}</span>
          </div>
          {parsed.length===1&&!parsed[0].title?(
            <div className="sec-card amber-card"><div className="sec-body">{templateResult}</div></div>
          ):parsed.map((s,i)=>(
            <div key={i} className="sec-card amber-card">
              {s.title&&<div className="sec-head amber">{s.title}</div>}
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

    if(viewSaved) return(
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

    return(
      <div className="section">
        {!soulDoc&&(
          <div style={{background:'var(--ad)',border:'1px solid var(--ba)',borderRadius:6,padding:'10px 13px',marginBottom:20}}>
            <div style={{fontSize:12,color:'var(--t2)'}}>Build your Team Soul Document first for personalised templates.</div>
            <button className="btn-sm a" style={{marginTop:8}} onClick={()=>setView('soul')}>Build Soul</button>
          </div>
        )}
        <div className="sec-lbl">COACHING TEMPLATES</div>
        <div className="template-grid">
          {TEMPLATES.map(t=>(
            <div key={t.id} className="tmpl-card" onClick={()=>{setSelTemplate(t);generateTemplate(t.id);}}>
              <div className="tmpl-name">{t.label}</div>
              <div className="tmpl-desc">{t.desc}</div>
            </div>
          ))}
        </div>
        {saved.length>0&&(<>
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
        </>)}
        {saved.length===0&&(
          <div style={{textAlign:'center',padding:'24px 20px',color:'var(--t3)',fontFamily:'var(--fm)',fontSize:10,letterSpacing:1}}>
            NO SAVED ANALYSES<br/><span style={{fontSize:9,marginTop:4,display:'block'}}>Run an analysis and hit Save</span>
          </div>
        )}
        {error&&<div className="err">{error}</div>}
      </div>
    );
  };

  // ─── SHELL ────────────────────────────────────────────────────────────────

  const NAV_ITEMS=[
    {id:'home',icon:'🏠',label:'HOME',amber:false},
    {id:'soul',icon:'⚡',label:'SOUL',amber:true},
    {id:'analyse',icon:'🎯',label:'ANALYSE',amber:false},
    {id:'skills',icon:'🎓',label:'SKILLS',amber:false},
    {id:'exports',icon:'📋',label:'DOCS',amber:true},
  ];

  return(
    <>
      <style>{STYLE}</style>
      <div className="app">
        <div className="hdr">
          <div className="hdr-logo"><div className="hdr-s"/><div className="hdr-g"/></div>
          <div>
            <div className="hdr-title">RUGBY INTELLIGENCE</div>
            <div className="hdr-sub">AI SYSTEM · WORLD RUGBY STANDARDS</div>
          </div>
          <div className="hdr-right">
            <div className="dot"/>
            {soulDoc?<span style={{color:'var(--amber)',fontSize:9,marginLeft:4}}>{team.name?.toUpperCase()}</span>:<span>LIVE</span>}
            <a href="/prompts.html" style={{fontFamily:'var(--fm)',fontSize:8,color:'var(--t3)',textDecoration:'none',marginLeft:10,border:'1px solid var(--b)',padding:'2px 6px',borderRadius:3,letterSpacing:'1px'}} title="Prompt Library">PROMPTS</a>
          </div>
        </div>

        {view==='home'&&renderHome()}
        {view==='soul'&&renderSoul()}
        {view==='analyse'&&renderAnalyse()}
        {view==='skills'&&renderSkills()}
        {view==='exports'&&renderExports()}

        <div className="nav">
          {NAV_ITEMS.map(n=>(
            <button key={n.id}
              className={`nav-item${view===n.id?(n.amber?' active-s':' active-a'):''}`}
              onClick={()=>{
                setView(n.id);
                if(n.id==='exports'){setExpView('list');setViewSaved(null);}
                if(n.id==='skills'){setSkillsView('list');}
              }}>
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
