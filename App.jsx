const { useEffect, useMemo, useState } = React;

const STORAGE_KEY = "warwick-pumas-rfc-site-state-v1";

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "season", label: "Season" },
  { id: "squad", label: "Squad" },
  { id: "selection", label: "Selection" },
  { id: "training", label: "Training" },
  { id: "intelligence", label: "Intelligence" },
];

const STATUS_OPTIONS = ["Committed", "Unknown", "No"];
const PHYSICAL_OPTIONS = ["Good", "Injured", "Rehab", "Managed"];
const CONTRACT_OPTIONS = ["Yes", "No"];
const CONTACT_OPTIONS = ["Yes", "No", "Unknown"];
const UNAVAILABLE_CATEGORIES = ["Injury", "Away/Work", "Studies", "Discipline", "Other"];
const POSITION_LABELS = {
  Prop: "Loosehead / Tighthead Prop",
  Hooker: "Hooker",
  Lock: "Lock",
  Scrumhalf: "Scrumhalf",
  Flyhalf: "Flyhalf",
  Centre: "Centre",
  Wing: "Wing",
  Fullback: "Fullback",
  "Utility Forward": "Utility Forward",
  "Utility Back": "Utility Back",
};

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
*{box-sizing:border-box}
html,body,#root{margin:0;min-height:100%;background:#f3efe3;color:#10201d}
body{font-family:'IBM Plex Sans',sans-serif}
button,input,select,textarea{font:inherit}
.app{min-height:100vh;background:
radial-gradient(circle at top left, rgba(203,167,72,.18), transparent 30%),
radial-gradient(circle at top right, rgba(36,97,74,.16), transparent 24%),
linear-gradient(180deg,#f6f1e6 0%,#efe6d4 100%)}
.shell{max-width:1380px;margin:0 auto;padding:28px 18px 80px}
.hero{background:linear-gradient(140deg,#123d31 0%,#0f2722 52%,#6d5316 100%);border-radius:28px;padding:28px;color:#f8f4ea;box-shadow:0 24px 70px rgba(16,32,29,.18);overflow:hidden;position:relative}
.hero:after{content:"";position:absolute;inset:auto -10% -50% 38%;height:320px;background:radial-gradient(circle, rgba(255,255,255,.14), transparent 62%);transform:rotate(-10deg)}
.hero-top{display:flex;gap:18px;align-items:flex-start;justify-content:space-between;position:relative;z-index:1}
.kicker{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#d2c088}
.headline{font-family:'Anton',sans-serif;font-size:clamp(44px,8vw,92px);line-height:.92;margin:10px 0 14px;letter-spacing:.03em;text-transform:uppercase;max-width:8ch}
.subcopy{max-width:760px;font-size:16px;line-height:1.6;color:#deeadf}
.hero-side{display:grid;gap:12px;min-width:260px}
.pulse{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:18px;padding:16px}
.pulse-label{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#d7c78d}
.pulse-value{font-size:34px;font-weight:700;margin:8px 0 2px}
.pulse-note{font-size:13px;color:#dbe7dc}
.nav{display:flex;gap:10px;flex-wrap:wrap;margin:22px 0 26px}
.nav button{border:none;background:#e6decb;color:#28443d;padding:12px 18px;border-radius:999px;font-weight:600;cursor:pointer;transition:.18s transform,.18s background,.18s color,.18s box-shadow}
.nav button.active{background:#123d31;color:#f9f4ea;box-shadow:0 10px 24px rgba(18,61,49,.18)}
.nav button:hover{transform:translateY(-1px)}
.grid{display:grid;gap:18px}
.grid.cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}
.grid.cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}
.grid.cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}
.card{background:rgba(255,250,243,.86);backdrop-filter:blur(8px);border:1px solid rgba(24,48,42,.08);border-radius:24px;padding:20px;box-shadow:0 12px 40px rgba(50,46,32,.06)}
.card.dark{background:#123d31;color:#f8f4ea}
.card h2,.card h3,.card h4{margin:0}
.section-title{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;margin-bottom:16px}
.section-title h2{font-size:24px}
.section-title p{margin:4px 0 0;color:#5a665e;font-size:14px}
.stat{display:grid;gap:10px}
.stat-label{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#7d7a67}
.stat-number{font-size:40px;font-weight:700;line-height:1}
.stat-foot{font-size:14px;color:#51645d}
.badge{display:inline-flex;align-items:center;gap:8px;padding:7px 12px;border-radius:999px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.badge.green{background:#d7efe0;color:#145039}
.badge.amber{background:#f5e4b7;color:#76520d}
.badge.red{background:#f7d4cf;color:#8b261e}
.badge.slate{background:#e5e5df;color:#4e5450}
.fixture-list,.stack{display:grid;gap:10px}
.fixture{display:grid;grid-template-columns:90px 1fr 92px 84px;gap:12px;align-items:center;padding:12px 14px;border-radius:18px;background:#f7f1e4}
.fixture strong{display:block;font-size:16px}
.fixture small{display:block;color:#66756d;margin-top:4px}
.bar-track{display:flex;align-items:flex-end;gap:6px;height:160px;padding-top:18px}
.bar{flex:1;min-width:18px;border-radius:999px 999px 14px 14px;position:relative;display:flex;align-items:flex-end;justify-content:center;padding-bottom:10px;color:#fff;font-family:'IBM Plex Mono',monospace;font-size:11px}
.bar.green{background:linear-gradient(180deg,#2f7d5d,#123d31)}
.bar.red{background:linear-gradient(180deg,#c16051,#8b261e)}
.bar span{position:absolute;top:-24px;color:#233630}
.table-wrap{overflow:auto}
table{width:100%;border-collapse:collapse;min-width:760px}
th,td{padding:12px 10px;border-bottom:1px solid rgba(19,40,35,.08);text-align:left;font-size:14px;vertical-align:top}
th{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#6d6e62;font-family:'IBM Plex Mono',monospace}
tr:last-child td{border-bottom:none}
.row-actions{display:flex;gap:8px;flex-wrap:wrap}
.btn{border:none;border-radius:14px;padding:11px 14px;font-weight:700;cursor:pointer;transition:.18s transform,.18s opacity}
.btn:hover{transform:translateY(-1px)}
.btn.primary{background:#123d31;color:#f8f4ea}
.btn.secondary{background:#dbc57d;color:#3d2f09}
.btn.ghost{background:#ece4d0;color:#24433b}
.btn.slim{padding:9px 12px;font-size:13px}
.field-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.field{display:grid;gap:7px}
.field label{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#6a6657;font-family:'IBM Plex Mono',monospace}
.field input,.field select,.field textarea{width:100%;border:1px solid rgba(18,61,49,.14);border-radius:14px;padding:12px;background:#fffdf8;color:#162a26}
.field textarea{min-height:110px;resize:vertical}
.mini-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.pill-row{display:flex;gap:8px;flex-wrap:wrap}
.pill{background:#eee4ce;color:#36524a;padding:8px 12px;border-radius:999px;font-size:13px;font-weight:600}
.roster{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.player-card{padding:14px;border-radius:18px;background:#f7f1e4;border:1px solid rgba(18,61,49,.08)}
.player-name{font-size:17px;font-weight:700;margin-bottom:4px}
.player-meta{font-size:13px;color:#567067;margin-bottom:10px}
.slot-grid{display:grid;gap:10px}
.slot{display:grid;grid-template-columns:72px 180px 1fr 90px;gap:10px;align-items:center;padding:12px;border-radius:18px;background:#f7f1e4}
.slot label{font-family:'IBM Plex Mono',monospace;font-size:12px;text-transform:uppercase;color:#5f695f}
.rating-grid{display:grid;gap:10px}
.rating-row{display:grid;grid-template-columns:66px 190px 1fr repeat(5,76px);gap:8px;align-items:center;padding:10px;border-radius:18px;background:#f7f1e4}
.calendar-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.month-card{padding:16px;border-radius:18px;background:#f7f1e4;min-height:180px}
.month-card h4{font-size:19px;margin-bottom:10px}
.month-card ul{padding-left:18px;margin:0;display:grid;gap:8px}
.month-card li{font-size:14px;color:#355249}
.facet-list{display:grid;gap:12px}
.facet{padding:14px;border-radius:18px;background:#f7f1e4}
.facet-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:10px}
.facet-top strong{font-size:17px}
.facet p{margin:0;color:#476158;line-height:1.55;font-size:14px}
.note{font-size:14px;color:#5d675c;line-height:1.6}
.empty{padding:24px;border-radius:18px;border:1px dashed rgba(18,61,49,.2);color:#50645d;background:rgba(255,255,255,.4)}
.loading{min-height:100vh;display:grid;place-items:center;font-family:'IBM Plex Mono',monospace;letter-spacing:.12em;text-transform:uppercase;color:#355249}
@media (max-width:1120px){
  .grid.cols-4,.grid.cols-3,.calendar-grid,.field-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .hero-top{grid-template-columns:1fr;display:grid}
}
@media (max-width:760px){
  .shell{padding:16px 14px 72px}
  .grid.cols-4,.grid.cols-3,.grid.cols-2,.calendar-grid,.field-grid,.mini-grid,.roster{grid-template-columns:1fr}
  .headline{font-size:56px}
  .fixture{grid-template-columns:1fr}
  .slot,.rating-row{grid-template-columns:1fr}
  table{min-width:640px}
}
`;

function injectStyles() {
  if (document.getElementById("warwick-pumas-styles")) return;
  const styleTag = document.createElement("style");
  styleTag.id = "warwick-pumas-styles";
  styleTag.textContent = STYLE;
  document.head.appendChild(styleTag);
}

function formatDate(value) {
  if (!value) return "TBC";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.valueOf())
    ? value
    : date.toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}

function average(values) {
  const nums = values.map(Number).filter((value) => !Number.isNaN(value) && value > 0);
  if (!nums.length) return 0;
  return nums.reduce((sum, value) => sum + value, 0) / nums.length;
}

function buildInitialEditable(seed) {
  return {
    squad: seed.squad,
    teamSheet: seed.teamSheet,
    ratings: {
      matchVs: seed.ratingsTemplate.matchVs,
      date: seed.ratingsTemplate.date,
      players: seed.ratingsTemplate.players.map((player) => ({
        ...player,
        selectedPlayerId: "",
        gameImpact: "",
        scrum: "",
        lineout: "",
        workRate: "",
        battleRate: "",
        notes: "",
      })),
    },
    unavailability: seed.unavailability,
  };
}

function outcomeClass(result) {
  if (result === "Win") return "green";
  if (result === "Loss") return "red";
  if (result === "Draw") return "amber";
  return "slate";
}

function App() {
  const [tab, setTab] = useState("dashboard");
  const [seed, setSeed] = useState(null);
  const [editable, setEditable] = useState(null);
  const [search, setSearch] = useState("");
  const [savingState, setSavingState] = useState("Workbook import");

  useEffect(() => {
    injectStyles();
    fetch("seasonData.json")
      .then((response) => response.json())
      .then((payload) => {
        setSeed(payload);
        const saved = localStorage.getItem(STORAGE_KEY);
        setEditable(saved ? JSON.parse(saved) : buildInitialEditable(payload));
        setSavingState(saved ? "Local save restored" : "Workbook imported");
      })
      .catch(() => {
        setSavingState("Could not load season data");
      });
  }, []);

  useEffect(() => {
    if (!editable) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(editable));
    setSavingState("Auto-saved locally");
  }, [editable]);

  const summary = useMemo(() => {
    if (!seed || !editable) return null;
    const fixtures = seed.fixtures;
    const wins = fixtures.filter((fixture) => fixture.result === "Win").length;
    const losses = fixtures.filter((fixture) => fixture.result === "Loss").length;
    const draws = fixtures.filter((fixture) => fixture.result === "Draw").length;
    const scored = fixtures.reduce((sum, fixture) => sum + fixture.pointsFor, 0);
    const conceded = fixtures.reduce((sum, fixture) => sum + fixture.pointsAgainst, 0);
    const tries = fixtures.reduce((sum, fixture) => sum + fixture.tries, 0);
    const committed = editable.squad.filter((player) => player.status === "Committed").length;
    const unavailable = editable.unavailability.length;
    const contracted = editable.squad.filter((player) => player.contractSigned === "Yes").length;
    return {
      played: fixtures.length,
      wins,
      losses,
      draws,
      winRate: fixtures.length ? Math.round((wins / fixtures.length) * 100) : 0,
      scored,
      conceded,
      diff: scored - conceded,
      tries,
      committed,
      unavailable,
      contracted,
    };
  }, [seed, editable]);

  const filteredSquad = useMemo(() => {
    if (!editable) return [];
    const query = search.trim().toLowerCase();
    if (!query) return editable.squad;
    return editable.squad.filter((player) =>
      `${player.firstName} ${player.lastName} ${player.position} ${player.status}`.toLowerCase().includes(query)
    );
  }, [editable, search]);

  if (!seed || !editable || !summary) {
    return <div className="loading">{savingState}</div>;
  }

  const squadOptions = editable.squad
    .map((player) => ({
      value: String(player.id),
      label: `${player.firstName} ${player.lastName} · ${POSITION_LABELS[player.position] || player.position}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const startersSelected = editable.teamSheet.starters.filter((slot) => slot.playerId).length;
  const ratingAverage = average(editable.ratings.players.map((player) => average([
    player.gameImpact,
    player.scrum,
    player.lineout,
    player.workRate,
    player.battleRate,
  ])));

  function updateSquadPlayer(id, field, value) {
    setEditable((current) => ({
      ...current,
      squad: current.squad.map((player) => (player.id === id ? { ...player, [field]: value } : player)),
    }));
  }

  function updateTeamMeta(field, value) {
    setEditable((current) => ({
      ...current,
      teamSheet: { ...current.teamSheet, [field]: value },
    }));
  }

  function updateTeamSlot(group, no, field, value) {
    setEditable((current) => ({
      ...current,
      teamSheet: {
        ...current.teamSheet,
        [group]: current.teamSheet[group].map((slot) => (slot.no === no ? { ...slot, [field]: value } : slot)),
      },
    }));
  }

  function updateRating(field, value) {
    setEditable((current) => ({
      ...current,
      ratings: { ...current.ratings, [field]: value },
    }));
  }

  function updateRatingPlayer(no, field, value) {
    setEditable((current) => ({
      ...current,
      ratings: {
        ...current.ratings,
        players: current.ratings.players.map((player) => (player.no === no ? { ...player, [field]: value } : player)),
      },
    }));
  }

  function addUnavailablePlayer() {
    setEditable((current) => ({
      ...current,
      unavailability: [
        {
          firstName: "",
          lastName: "",
          reason: "",
          category: "Injury",
          returnDate: "",
        },
        ...current.unavailability,
      ],
    }));
  }

  function updateUnavailable(index, field, value) {
    setEditable((current) => ({
      ...current,
      unavailability: current.unavailability.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [field]: value } : entry
      ),
    }));
  }

  function removeUnavailable(index) {
    setEditable((current) => ({
      ...current,
      unavailability: current.unavailability.filter((_, entryIndex) => entryIndex !== index),
    }));
  }

  function resetLocalState() {
    localStorage.removeItem(STORAGE_KEY);
    setEditable(buildInitialEditable(seed));
    setSavingState("Reset to workbook defaults");
  }

  return (
    <div className="app">
      <div className="shell">
        <section className="hero">
          <div className="hero-top">
            <div>
              <div className="kicker">Warwick Pumas RFC • {seed.season} digital season room</div>
              <div className="headline">Season Control Centre</div>
              <div className="subcopy">
                The spreadsheet has been rebuilt as a working website with live selection, editable squad tracking,
                match ratings, coaching priorities, weekly practice planning, and season intelligence in one place.
              </div>
            </div>
            <div className="hero-side">
              <div className="pulse">
                <div className="pulse-label">Auto-save status</div>
                <div className="pulse-value">{savingState}</div>
                <div className="pulse-note">Changes stay in this browser until you reset them.</div>
              </div>
              <div className="pulse">
                <div className="pulse-label">Selection readiness</div>
                <div className="pulse-value">{startersSelected}/15</div>
                <div className="pulse-note">Starting jerseys currently assigned.</div>
              </div>
            </div>
          </div>
        </section>

        <div className="nav">
          {TABS.map((item) => (
            <button
              key={item.id}
              className={tab === item.id ? "active" : ""}
              onClick={() => setTab(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "dashboard" && (
          <div className="grid">
            <div className="grid cols-4">
              <StatCard label="Games played" value={summary.played} foot={`${summary.wins}W • ${summary.losses}L • ${summary.draws}D`} />
              <StatCard label="Win rate" value={`${summary.winRate}%`} foot="Workbook season results" />
              <StatCard label="Points diff" value={summary.diff} foot={`${summary.scored} scored • ${summary.conceded} conceded`} />
              <StatCard label="Tries" value={summary.tries} foot={`${(summary.tries / summary.played).toFixed(1)} per game`} />
            </div>

            <div className="grid cols-3">
              <StatCard label="Committed squad" value={summary.committed} foot={`${editable.squad.length} total listed players`} />
              <StatCard label="Unavailable" value={summary.unavailable} foot="Live player welfare view" />
              <StatCard label="Contracts signed" value={summary.contracted} foot="Editable commitment tracker" />
            </div>

            <div className="grid cols-2">
              <div className="card">
                <div className="section-title">
                  <div>
                    <h2>Results momentum</h2>
                    <p>Point differential by fixture across warm-ups and league games.</p>
                  </div>
                  <span className={`badge ${summary.diff >= 0 ? "green" : "red"}`}>{summary.diff >= 0 ? "Positive" : "Negative"} trend</span>
                </div>
                <div className="bar-track">
                  {seed.fixtures.map((fixture) => {
                    const height = Math.max(26, Math.min(140, Math.abs(fixture.pointsDiff) * 1.35 || 26));
                    return (
                      <div key={`${fixture.section}-${fixture.round}-${fixture.opposition}`} className={`bar ${fixture.pointsDiff >= 0 ? "green" : "red"}`} style={{ height }}>
                        <span>{fixture.pointsDiff >= 0 ? `+${fixture.pointsDiff}` : fixture.pointsDiff}</span>
                        {fixture.round}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card">
                <div className="section-title">
                  <div>
                    <h2>Coach alert board</h2>
                    <p>Three fast signals pulled from the imported workbook and current edits.</p>
                  </div>
                </div>
                <div className="stack">
                  <InsightCard
                    badge="amber"
                    title="Selection depth risk"
                    body={`${summary.unavailable} players are currently unavailable. Prioritise cover for tight five, halfback and strike runners before the next selection lock.`}
                  />
                  <InsightCard
                    badge="green"
                    title="Committed group size"
                    body={`${summary.committed} players are marked committed, giving a stable core for continuity if contracts and attendance keep improving.`}
                  />
                  <InsightCard
                    badge="red"
                    title="Season differential"
                    body={`The imported campaign sits at ${summary.diff}. The site keeps training priorities tied to defensive systems, attack shape and breakdown speed to address that gap.`}
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="section-title">
                <div>
                  <h2>Latest fixtures</h2>
                  <p>Recent results imported from the workbook.</p>
                </div>
              </div>
              <div className="fixture-list">
                {seed.fixtures.slice(-6).reverse().map((fixture) => (
                  <div key={`${fixture.section}-${fixture.round}-${fixture.opposition}`} className="fixture">
                    <div>
                      <div className="stat-label">{fixture.section}</div>
                      <strong>R{fixture.round}</strong>
                    </div>
                    <div>
                      <strong>vs {fixture.opposition}</strong>
                      <small>{formatDate(fixture.date)} • {fixture.venue}</small>
                    </div>
                    <div>
                      <strong>{fixture.pointsFor} - {fixture.pointsAgainst}</strong>
                    </div>
                    <div>
                      <span className={`badge ${outcomeClass(fixture.result)}`}>{fixture.result}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "season" && (
          <div className="grid">
            <div className="card">
              <div className="section-title">
                <div>
                  <h2>Fixtures and season path</h2>
                  <p>Warm-up and league campaign detail from the workbook.</p>
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Block</th>
                      <th>Round</th>
                      <th>Opponent</th>
                      <th>Date</th>
                      <th>Venue</th>
                      <th>Score</th>
                      <th>Tries</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seed.fixtures.map((fixture) => (
                      <tr key={`${fixture.section}-${fixture.round}-${fixture.opposition}`}>
                        <td>{fixture.section}</td>
                        <td>{fixture.round}</td>
                        <td>{fixture.opposition}</td>
                        <td>{formatDate(fixture.date)}</td>
                        <td>{fixture.venue}</td>
                        <td>{fixture.pointsFor} - {fixture.pointsAgainst}</td>
                        <td>{fixture.tries}</td>
                        <td><span className={`badge ${outcomeClass(fixture.result)}`}>{fixture.result}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="section-title">
                <div>
                  <h2>Calendar lens</h2>
                  <p>Season pacing translated from the spreadsheet into an easier planning view.</p>
                </div>
              </div>
              <div className="calendar-grid">
                {seed.calendar.months.map((month, index) => {
                  const monthFixtures = seed.fixtures.filter((fixture) => {
                    if (!fixture.date) return false;
                    return new Date(`${fixture.date}T00:00:00`).getMonth() === index;
                  });
                  return (
                    <div className="month-card" key={month}>
                      <h4>{month}</h4>
                      <div className="note" style={{ marginBottom: 10 }}>{seed.calendar.notes[index]}</div>
                      {monthFixtures.length ? (
                        <ul>
                          {monthFixtures.map((fixture) => (
                            <li key={`${month}-${fixture.round}-${fixture.opposition}`}>
                              {formatDate(fixture.date)} • {fixture.opposition} ({fixture.venue})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="note">No recorded fixture in the imported workbook.</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === "squad" && (
          <div className="grid">
            <div className="card">
              <div className="section-title">
                <div>
                  <h2>Squad management</h2>
                  <p>Edit commitment, availability readiness and contract progress directly in the site.</p>
                </div>
                <div className="row-actions">
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search players, positions or statuses"
                    style={{ borderRadius: 14, border: "1px solid rgba(18,61,49,.14)", padding: "12px 14px", minWidth: 260 }}
                  />
                  <button className="btn ghost" type="button" onClick={resetLocalState}>Reset local edits</button>
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Position</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Physical</th>
                      <th>Contract</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSquad.map((player) => (
                      <tr key={player.id}>
                        <td><strong>{player.firstName} {player.lastName}</strong></td>
                        <td>{POSITION_LABELS[player.position] || player.position}</td>
                        <td>
                          <select value={player.contacted} onChange={(event) => updateSquadPlayer(player.id, "contacted", event.target.value)}>
                            {CONTACT_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                          </select>
                        </td>
                        <td>
                          <select value={player.status} onChange={(event) => updateSquadPlayer(player.id, "status", event.target.value)}>
                            {STATUS_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                          </select>
                        </td>
                        <td>
                          <select value={player.physical} onChange={(event) => updateSquadPlayer(player.id, "physical", event.target.value)}>
                            {PHYSICAL_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                          </select>
                        </td>
                        <td>
                          <select value={player.contractSigned} onChange={(event) => updateSquadPlayer(player.id, "contractSigned", event.target.value)}>
                            {CONTRACT_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                          </select>
                        </td>
                        <td>
                          <input value={player.notes} onChange={(event) => updateSquadPlayer(player.id, "notes", event.target.value)} placeholder="Coach note" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid cols-2">
              <div className="card">
                <div className="section-title">
                  <div>
                    <h2>Unavailable players</h2>
                    <p>Player welfare, studies, work and injury management.</p>
                  </div>
                  <button className="btn primary slim" type="button" onClick={addUnavailablePlayer}>Add player</button>
                </div>
                <div className="stack">
                  {editable.unavailability.map((entry, index) => (
                    <div className="player-card" key={`${entry.firstName}-${entry.lastName}-${index}`}>
                      <div className="field-grid">
                        <div className="field">
                          <label>First name</label>
                          <input value={entry.firstName} onChange={(event) => updateUnavailable(index, "firstName", event.target.value)} />
                        </div>
                        <div className="field">
                          <label>Last name</label>
                          <input value={entry.lastName} onChange={(event) => updateUnavailable(index, "lastName", event.target.value)} />
                        </div>
                        <div className="field">
                          <label>Category</label>
                          <select value={entry.category} onChange={(event) => updateUnavailable(index, "category", event.target.value)}>
                            {UNAVAILABLE_CATEGORIES.map((option) => <option key={option}>{option}</option>)}
                          </select>
                        </div>
                        <div className="field">
                          <label>Return date</label>
                          <input value={entry.returnDate} onChange={(event) => updateUnavailable(index, "returnDate", event.target.value)} placeholder="Unknown" />
                        </div>
                      </div>
                      <div className="mini-grid" style={{ marginTop: 12 }}>
                        <div className="field">
                          <label>Reason</label>
                          <input value={entry.reason} onChange={(event) => updateUnavailable(index, "reason", event.target.value)} />
                        </div>
                        <div className="field">
                          <label>Action</label>
                          <button className="btn ghost" type="button" onClick={() => removeUnavailable(index)}>Remove entry</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="section-title">
                  <div>
                    <h2>Caps tracker</h2>
                    <p>Imported first XV experience leaderboard.</p>
                  </div>
                </div>
                <div className="roster">
                  {seed.caps.slice(0, 12).map((player) => (
                    <div key={`${player.rank}-${player.firstName}`} className="player-card">
                      <div className="player-name">#{player.rank} {player.firstName} {player.lastName}</div>
                      <div className="player-meta">{player.caps} total caps</div>
                      <div className="pill-row">
                        <span className="pill">Season caps: {player.seasonCaps}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "selection" && (
          <div className="grid">
            <div className="card">
              <div className="section-title">
                <div>
                  <h2>Match day team sheet</h2>
                  <p>The spreadsheet template is now a live selection interface.</p>
                </div>
                <span className={`badge ${startersSelected === 15 ? "green" : "amber"}`}>{startersSelected === 15 ? "Ready" : "Incomplete"}</span>
              </div>
              <div className="field-grid" style={{ marginBottom: 18 }}>
                <div className="field">
                  <label>Match vs</label>
                  <input value={editable.teamSheet.matchVs} onChange={(event) => updateTeamMeta("matchVs", event.target.value)} />
                </div>
                <div className="field">
                  <label>Venue</label>
                  <input value={editable.teamSheet.venue} onChange={(event) => updateTeamMeta("venue", event.target.value)} />
                </div>
                <div className="field">
                  <label>Date</label>
                  <input value={editable.teamSheet.date} onChange={(event) => updateTeamMeta("date", event.target.value)} />
                </div>
                <div className="field">
                  <label>Competition</label>
                  <input value={editable.teamSheet.competition} onChange={(event) => updateTeamMeta("competition", event.target.value)} />
                </div>
              </div>

              <SectionHeading title="Starting XV" copy="Assign players to jerseys and capture coach notes per role." />
              <div className="slot-grid">
                {editable.teamSheet.starters.map((slot) => (
                  <div className="slot" key={`starter-${slot.no}`}>
                    <label>#{slot.no}</label>
                    <strong>{slot.position}</strong>
                    <select value={slot.playerId || ""} onChange={(event) => updateTeamSlot("starters", slot.no, "playerId", event.target.value)}>
                      <option value="">Select player</option>
                      {squadOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    <input value={slot.notes || ""} onChange={(event) => updateTeamSlot("starters", slot.no, "notes", event.target.value)} placeholder="Notes" />
                  </div>
                ))}
              </div>

              <SectionHeading title="Bench" copy="Keep the 16 to 23 block flexible for impact or coverage." />
              <div className="slot-grid">
                {editable.teamSheet.bench.map((slot) => (
                  <div className="slot" key={`bench-${slot.no}`}>
                    <label>#{slot.no}</label>
                    <strong>{slot.position}</strong>
                    <select value={slot.playerId || ""} onChange={(event) => updateTeamSlot("bench", slot.no, "playerId", event.target.value)}>
                      <option value="">Select player</option>
                      {squadOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    <input value={slot.notes || ""} onChange={(event) => updateTeamSlot("bench", slot.no, "notes", event.target.value)} placeholder="Impact role" />
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="section-title">
                <div>
                  <h2>Player ratings board</h2>
                  <p>Rates key match-day roles against the workbook’s structure.</p>
                </div>
                <span className={`badge ${ratingAverage >= 7 ? "green" : ratingAverage >= 5 ? "amber" : "red"}`}>Team avg {ratingAverage.toFixed(1)}</span>
              </div>
              <div className="field-grid" style={{ marginBottom: 18 }}>
                <div className="field">
                  <label>Match vs</label>
                  <input value={editable.ratings.matchVs} onChange={(event) => updateRating("matchVs", event.target.value)} />
                </div>
                <div className="field">
                  <label>Date</label>
                  <input value={editable.ratings.date} onChange={(event) => updateRating("date", event.target.value)} />
                </div>
              </div>
              <div className="rating-grid">
                {editable.ratings.players.map((player) => {
                  const overall = average([player.gameImpact, player.scrum, player.lineout, player.workRate, player.battleRate]);
                  return (
                    <div className="rating-row" key={`rating-${player.no}`}>
                      <label>#{player.no}</label>
                      <strong>{player.position}</strong>
                      <select value={player.selectedPlayerId} onChange={(event) => updateRatingPlayer(player.no, "selectedPlayerId", event.target.value)}>
                        <option value="">Assign player</option>
                        {squadOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                      <input value={player.gameImpact} onChange={(event) => updateRatingPlayer(player.no, "gameImpact", event.target.value)} placeholder="Game" />
                      <input value={player.scrum} onChange={(event) => updateRatingPlayer(player.no, "scrum", event.target.value)} placeholder="Scrum" />
                      <input value={player.lineout} onChange={(event) => updateRatingPlayer(player.no, "lineout", event.target.value)} placeholder="Lineout" />
                      <input value={player.workRate} onChange={(event) => updateRatingPlayer(player.no, "workRate", event.target.value)} placeholder="Work rate" />
                      <input value={player.battleRate} onChange={(event) => updateRatingPlayer(player.no, "battleRate", event.target.value)} placeholder="Battle" />
                      <span className={`badge ${overall >= 7 ? "green" : overall >= 5 ? "amber" : "red"}`}>{overall ? overall.toFixed(1) : "N/A"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === "training" && (
          <div className="grid">
            <div className="card">
              <div className="section-title">
                <div>
                  <h2>Coaching facets</h2>
                  <p>Priority allocation model from the workbook, now easier to scan and use in planning meetings.</p>
                </div>
              </div>
              <div className="facet-list">
                {seed.facets.map((facet) => (
                  <div className="facet" key={facet.rank}>
                    <div className="facet-top">
                      <div>
                        <strong>{facet.rank}. {facet.facet}</strong>
                        <div className="pill-row" style={{ marginTop: 8 }}>
                          <span className="pill">{facet.pct}</span>
                          <span className="pill">{facet.minutes}</span>
                          <span className="pill">{facet.tier}</span>
                        </div>
                      </div>
                    </div>
                    <p><strong>Focus:</strong> {facet.subfacets}</p>
                    <p style={{ marginTop: 10 }}><strong>Coach note:</strong> {facet.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="section-title">
                <div>
                  <h2>Weekly practice planner</h2>
                  <p>Field, gym, leadership and match-day structure imported from the spreadsheet.</p>
                </div>
              </div>
              <div className="stack">
                {seed.planner.map((item, index) =>
                  item.type === "day" ? (
                    <div className="card dark" key={`${item.label}-${index}`}>
                      <h3>{item.label}</h3>
                    </div>
                  ) : (
                    <div className="player-card" key={`${item.day}-${item.start}-${index}`}>
                      <div className="section-title" style={{ marginBottom: 10 }}>
                        <div>
                          <h4>{item.day} • {item.start}</h4>
                          <p>{item.duration} • {item.facet}</p>
                        </div>
                        <span className={`badge ${item.priority === "CRITICAL" ? "red" : item.priority === "IMPORTANT" ? "amber" : "green"}`}>{item.priority}</span>
                      </div>
                      <div className="note"><strong>Activity:</strong> {item.activity}</div>
                      <div className="note" style={{ marginTop: 8 }}><strong>Lead:</strong> {item.lead} • <strong>Assist:</strong> {item.assist}</div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "intelligence" && (
          <div className="grid">
            <div className="grid cols-2">
              <div className="card">
                <div className="section-title">
                  <div>
                    <h2>Team lingo</h2>
                    <p>Attack and defence terminology from the workbook.</p>
                  </div>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Phase</th>
                        <th>Term</th>
                        <th>Meaning</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seed.lingo.map((item) => (
                        <tr key={`${item.phase}-${item.term}`}>
                          <td>{item.phase}</td>
                          <td><strong>{item.term}</strong></td>
                          <td>{item.meaning}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <div className="section-title">
                  <div>
                    <h2>How this site works</h2>
                    <p>The spreadsheet is no longer trapped in one workbook.</p>
                  </div>
                </div>
                <div className="stack">
                  <div className="note">Dashboard pulls the imported season record into a visual control room.</div>
                  <div className="note">Squad view lets you edit player status, physical readiness, contracts and availability live.</div>
                  <div className="note">Selection view gives you a proper team sheet and a ratings board instead of blank cells.</div>
                  <div className="note">Training keeps the coaching facet model and weekly planner usable in one scrollable page.</div>
                  <div className="note">All edits auto-save in the browser so the site functions as a tool, not just a display.</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="section-title">
                <div>
                  <h2>Priority snapshot</h2>
                  <p>The top training loads that should shape weekly planning.</p>
                </div>
              </div>
              <div className="grid cols-3">
                {seed.facets.slice(0, 6).map((facet) => (
                  <div className="player-card" key={`snapshot-${facet.rank}`}>
                    <div className="player-name">{facet.facet}</div>
                    <div className="player-meta">{facet.pct} • {facet.minutes} • {facet.tier}</div>
                    <div className="note">{facet.notes}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, foot }) {
  return (
    <div className="card stat">
      <div className="stat-label">{label}</div>
      <div className="stat-number">{value}</div>
      <div className="stat-foot">{foot}</div>
    </div>
  );
}

function InsightCard({ badge, title, body }) {
  return (
    <div className="player-card">
      <div className={`badge ${badge}`}>{title}</div>
      <div className="note" style={{ marginTop: 10 }}>{body}</div>
    </div>
  );
}

function SectionHeading({ title, copy }) {
  return (
    <div className="section-title" style={{ marginTop: 22 }}>
      <div>
        <h3>{title}</h3>
        <p>{copy}</p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
