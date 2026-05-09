const { useState } = React;

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=DM+Sans:wght@400;500&family=Roboto+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #06090a;
    --surface: #0d1215;
    --card: #111820;
    --card-hover: #161e28;
    --border: #1c2a35;
    --border-active: #0ea5e9;
    --blue: #0ea5e9;
    --blue-dim: #0ea5e915;
    --green: #10b981;
    --amber: #f59e0b;
    --text: #e2eaf2;
    --text-2: #64869e;
    --text-3: #3a5568;
    --mono: 'Roboto Mono', monospace;
    --head: 'Barlow Condensed', sans-serif;
    --body: 'DM Sans', system-ui, sans-serif;
  }
  body { background: var(--bg); }
  .app { display: flex; min-height: 100vh; font-family: var(--body); color: var(--text); background: var(--bg); }

  .sidebar {
    width: 220px; min-width: 220px;
    border-right: 1px solid var(--border);
    background: var(--surface);
    display: flex; flex-direction: column;
    position: sticky; top: 0;
    height: 100vh; overflow-y: auto;
  }
  .sidebar-brand { padding: 16px; border-bottom: 1px solid var(--border); }
  .brand-name { font-family: var(--head); font-size: 16px; font-weight: 700; color: var(--text); text-transform: uppercase; letter-spacing: 0.5px; }
  .brand-sub { font-family: var(--mono); font-size: 9px; color: var(--text-3); letter-spacing: 1px; margin-top: 2px; }
  .back-link { display: flex; align-items: center; gap: 6px; padding: 10px 16px; font-size: 11px; color: var(--text-3); text-decoration: none; border-bottom: 1px solid var(--border); transition: color 0.15s; }
  .back-link:hover { color: var(--blue); }
  .nav-section { padding: 14px 12px 4px; }
  .nav-section-label { font-family: var(--mono); font-size: 9px; color: var(--text-3); letter-spacing: 2px; text-transform: uppercase; padding: 0 4px; margin-bottom: 4px; }
  .nav-item { display: flex; align-items: center; gap: 8px; padding: 7px 8px; border-radius: 6px; cursor: pointer; font-size: 12px; color: var(--text-2); transition: all 0.1s; border: 1px solid transparent; background: none; width: 100%; text-align: left; margin-bottom: 1px; }
  .nav-item:hover { background: var(--card); color: var(--text); }
  .nav-item.active { background: var(--blue-dim); border-color: var(--border-active); color: var(--blue); }
  .nav-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
  .count-badge { margin-left: auto; font-family: var(--mono); font-size: 9px; background: var(--card); border: 1px solid var(--border); color: var(--text-3); padding: 1px 5px; border-radius: 3px; }

  .main { flex: 1; overflow-y: auto; }
  .main-header { padding: 20px 24px 16px; border-bottom: 1px solid var(--border); background: var(--surface); position: sticky; top: 0; z-index: 5; }
  .main-title { font-family: var(--head); font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text); }
  .main-subtitle { font-size: 12px; color: var(--text-2); margin-top: 2px; }
  .content { padding: 20px 24px 48px; max-width: 900px; }

  .section-heading { font-family: var(--mono); font-size: 10px; color: var(--text-3); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; margin-top: 28px; display: flex; align-items: center; gap: 8px; }
  .section-heading:first-child { margin-top: 0; }
  .section-heading::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .prompt-card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 10px; overflow: hidden; transition: border-color 0.15s; }
  .prompt-card:hover { border-color: #1c3545; }
  .prompt-header { padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; gap: 12px; }
  .prompt-meta { flex: 1; }
  .prompt-title { font-family: var(--head); font-size: 15px; font-weight: 600; color: var(--text); text-transform: uppercase; letter-spacing: 0.3px; }
  .prompt-desc { font-size: 11px; color: var(--text-2); margin-top: 2px; }
  .prompt-tags { display: flex; gap: 4px; margin-top: 5px; flex-wrap: wrap; }
  .tag { font-family: var(--mono); font-size: 9px; padding: 2px 6px; border-radius: 3px; border: 1px solid var(--border); color: var(--text-3); letter-spacing: 0.5px; }
  .tag.blue { border-color: #0ea5e930; color: var(--blue); background: var(--blue-dim); }
  .tag.green { border-color: #10b98130; color: var(--green); background: #10b98110; }
  .tag.amber { border-color: #f59e0b30; color: var(--amber); background: #f59e0b10; }

  .prompt-actions { display: flex; align-items: center; gap: 6px; }
  .expand-btn { font-family: var(--mono); font-size: 10px; color: var(--text-3); cursor: pointer; background: none; border: none; padding: 4px; transition: color 0.1s; }
  .expand-btn:hover { color: var(--text-2); }
  .copy-btn { font-size: 11px; font-weight: 500; cursor: pointer; border: 1px solid var(--border); background: var(--surface); color: var(--text-2); padding: 5px 10px; border-radius: 5px; transition: all 0.1s; white-space: nowrap; }
  .copy-btn:hover { border-color: var(--border-active); color: var(--blue); }
  .copy-btn.copied { border-color: #10b98150; color: var(--green); background: #10b98110; }

  .prompt-body { border-top: 1px solid var(--border); padding: 14px; background: #0a0f15; }
  .prompt-text { font-family: var(--mono); font-size: 11px; line-height: 1.8; color: #8aabbd; white-space: pre-wrap; word-break: break-word; }

  .search-wrap { margin-bottom: 20px; position: relative; }
  .search-input { width: 100%; background: var(--card); border: 1px solid var(--border); border-radius: 6px; padding: 9px 12px 9px 32px; font-family: var(--body); font-size: 13px; color: var(--text); outline: none; transition: border-color 0.15s; }
  .search-input:focus { border-color: var(--border-active); }
  .search-input::placeholder { color: var(--text-3); }
  .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 13px; color: var(--text-3); pointer-events: none; }

  .stats-row { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  .stat { background: var(--card); border: 1px solid var(--border); border-radius: 6px; padding: 8px 14px; display: flex; align-items: baseline; gap: 6px; }
  .stat-num { font-family: var(--mono); font-size: 18px; font-weight: 500; color: var(--blue); }
  .stat-label { font-size: 11px; color: var(--text-3); }

  @media (max-width: 640px) {
    .sidebar { display: none; }
    .content { padding: 16px; }
  }
`;

const PROMPTS = [
  {
    id: 'arch',
    category: 'foundation',
    title: 'Core Architecture',
    desc: 'Defines the full RIS system structure, module routing, API pattern, and state management',
    tags: ['React', 'Architecture', 'Claude API'],
    type: 'build',
    text: `Act as a Senior Software Architect specialising in sports performance analytics. I am building a Rugby Intelligence System (RIS) using React for the frontend and Claude's API for AI-powered analysis.

Define the complete modular architecture for this system. It needs to:

1. Support 8 analysis modules: Game Plan Developer, Player Developer, Season Constructor, Coach the Coach, Coach the Player, Game Analysis, Tactics and Positions, Red Zone Audit

2. Handle 4 input types that can be combined: GPS and wearable data, video analysis output, manual statistics, combined multi-source

3. Work across 5 rugby levels: Elite Professional, Semi-Professional, Academy, Youth and Age Grade, Community

4. Call Claude's API (claude-sonnet-4-20250514) with dynamically generated system prompts based on the user's selections

Output the complete React component file structure, the API call pattern, the state management approach, and the system prompt generation logic. Include comments explaining every architectural decision.

Use UK English. No dashes. Plain, clean code with no unnecessary complexity.`
  },
  {
    id: 'player-schema',
    category: 'foundation',
    title: 'Player Data Schema',
    desc: 'Complete JavaScript schema for a player profile including position-specific primary value metrics for all 15 positions',
    tags: ['Data Schema', 'JavaScript'],
    type: 'build',
    text: `Act as a Sports Data Architect. I am building a Rugby Intelligence System and need a comprehensive player data schema.

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
    id: 'match-schema',
    category: 'foundation',
    title: 'Match Event Schema',
    desc: 'Tracks every discrete collision event with spatial, temporal, possession, and outcome data. Includes xP calculator function',
    tags: ['Data Schema', 'JavaScript', 'xP'],
    type: 'build',
    text: `Act as a Sports Data Engineer. I am building a Rugby Intelligence System that treats every phase of play as a discrete data event.

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
    id: 'season-schema',
    category: 'foundation',
    title: 'Season and Squad Schema',
    desc: 'Full data structures for squad management, fixture planning, periodisation phases, and Squad Attrition Probability calculation',
    tags: ['Data Schema', 'JavaScript', 'Load Management'],
    type: 'build',
    text: `Act as a Rugby Performance Scientist. I am building a Season Constructor module for a Rugby Intelligence System.

Build JavaScript data structures for:

1. A Squad object containing: array of player profiles, designated starters by position, bench rotation plan using the 6 forwards and 2 backs split, injury tracking list, and load history per player

2. A Fixture object containing: date, opposition, competition type, home or away, travel distance in km, estimated match intensity on a 1 to 10 scale, predicted load score

3. A Season object containing: array of Fixture objects, periodisation phases (pre-season, early season, mid-season, playoffs, recovery), Squad Attrition Probability per week, and peak performance target weeks

4. A WeeklyLoadReport object that flags any week where: total squad load exceeds the safe threshold, three or more players have accumulated fatigue scores above 80 percent, travel combined with match density creates a high injury risk window

Also build a function called calculateAttritionProbability that:
- Takes a sequence of 4 consecutive fixtures as input
- Returns a risk percentage based on match intensity scores and travel load
- Flags the output as Low Risk below 15 percent, Medium 15 to 30 percent, High above 30 percent

Output as clean JavaScript with example data for a 30-week season. Use UK English.`
  },
  {
    id: 'gameplan',
    category: 'modules',
    title: 'Game Plan Developer',
    desc: 'Structured opposition data form. Calls Claude with tactical system prompt. Returns xP scenarios, pod recommendations, and set piece exploitation plan',
    tags: ['React Component', 'Tactics', 'xP'],
    type: 'module',
    text: `I am building a Rugby Intelligence System in React. Build me a complete React component called GamePlanDeveloper.

The component must have a structured form with these fields:
- Opposition team name (text)
- Scrum win percentage (number 0 to 100)
- Average ruck speed in seconds (decimal number)
- Defensive system type (dropdown: Blitz, Fold, Rush, Hybrid)
- Lineout accuracy percentage (number)
- Key player threats (text area)
- Your team's available strengths (text area)
- Rugby level (dropdown: Elite Professional, Semi-Professional, Academy, Youth, Community)

Call Claude's API (claude-sonnet-4-20250514, max_tokens 2000) with this exact system prompt, replacing [level] with the selected level:

"You are a Tactical Performance Director for a [level] rugby team. Generate evidence-based, specific game plans. Generic coaching advice is unacceptable. When given opposition data you must: identify the three most exploitable defensive patterns, calculate Expected Points scenarios for red zone options (kick for posts, kick to corner, tap and go), recommend pod formations (1-3-2-2 or 2-4-2) that exploit specific defensive folding patterns identified, define a ruck speed protocol targeting the 3-second threshold, and flag scrum and lineout vulnerabilities with specific exploitation strategies. Output sections using these exact headers: ## Territory Strategy, ## Set Piece Exploitation, ## Attack Shape and Pods, ## Defensive Counter-Plan, ## Priority Actions."

Parse the response by splitting on ## headers and display each section as a styled card.

Include a Deep Analysis toggle that sets max_tokens to 4000 and appends "Be exhaustive. Quantify everything. Flag every gap." to the system prompt.

Use dark background (#06090a), blue accent (#0ea5e9), Barlow Condensed for headings, DM Sans for body. No generic design. This must look like professional sports analytics software.`
  },
  {
    id: 'playerdev',
    category: 'modules',
    title: 'Player Developer',
    desc: 'Position-aware input form. Generates 12-week technical programme, deficit analysis, wildcard intervention, and milestone targets',
    tags: ['React Component', 'LTAD', 'Biomechanics'],
    type: 'module',
    text: `I am building a Rugby Intelligence System in React. Build me a complete React component called PlayerDeveloper.

The component must have a structured form with these fields:
- Player name (text), position number 1 to 15 (number), position name (auto-filled from number), age (number)
- Playing level (dropdown: Elite Professional, Semi-Professional, Academy, Youth, Community)
- Physical metrics: weight in kg, squat to bodyweight ratio, 10m sprint time, 40m sprint time (number fields)
- Performance metrics: tackle completion percentage, dominant carry percentage, errors per match (number fields)
- GPS summary: total distance metres, high-speed running metres, collision count (number fields)
- Free text area for video analysis observations and known technical issues

When the user selects a position number, automatically display the Primary Value Metrics for that position so the user knows what to focus on.

Call Claude's API with this system prompt, replacing [level] and [position] with the selected values:

"You are a High Performance Lead for a [level] rugby programme. Create precise, individualised player evolution maps. Generic training programmes are unacceptable. For the [position] data provided: map current metrics against the gold standard for their position at [level] level, calculate the deficit across the three primary value metrics for their position, generate a 12-week technical programme targeting collision mechanics (body height, leg drive, wrap efficiency), include one Wildcard training intervention that prevents developmental plateauing (e.g. wrestling for breakdown stability, gymnastics for spatial awareness, vision training for decision-makers), flag any injury risk patterns in the data, and set measurable review milestones at weeks 4, 8, and 12. Every recommendation must link to a specific performance metric. Headers: ## Current Performance Profile, ## Deficit Analysis, ## 12-Week Programme, ## Wildcard Protocol, ## Review Milestones."

Include a Save to Squad button that stores the player data and analysis to localStorage.`
  },
  {
    id: 'season',
    category: 'modules',
    title: 'Season Constructor',
    desc: 'Fixture input with visual calendar grid. Calculates Squad Attrition Probability. Generates peaking protocol and 6-2 rotation plan',
    tags: ['React Component', 'Periodisation', 'Load Management'],
    type: 'module',
    text: `I am building a Rugby Intelligence System in React. Build me a React component called SeasonConstructor.

The component must have:
1. Season start and end dates (date inputs)
2. Squad size (number)
3. Fixture builder: allow the user to add up to 40 fixtures, each with date, opposition name, home or away (dropdown), competition type (dropdown: League, Cup, Friendly, Playoff), and estimated travel time in hours (number). Display added fixtures in a sortable table.
4. Peak performance targets: allow the user to mark up to 3 fixture dates as key performance peaks
5. Rugby level selector

After fixture input, display a 30-week calendar grid:
- One row per week, columns for: Week Number, Fixture (if any), Load Score, Risk Level
- Colour code the Risk Level cell: green below 15 percent, amber 15 to 30 percent, red above 30 percent

Call Claude's API with the fixture data formatted as text, using this system prompt:

"You are a Season Architect for a [level] rugby programme. Using the fixture list provided: build loading, peaking, and recovery phases across the season, calculate Squad Attrition Probability for high-density periods, design a 6-2 bench rotation strategy to protect the forward pack, flag every high-risk week with specific reasoning, and build a Peaking Protocol for the 3 weeks before each marked peak performance date. Headers: ## Season Phase Map, ## High Risk Week Flags, ## Bench Rotation Schedule, ## Peaking Protocol, ## Load Management Principles."`
  },
  {
    id: 'coachcoach',
    category: 'modules',
    title: 'Coach the Coach',
    desc: 'Decision audit against match data. Identifies cognitive bias. Delivers unfiltered data-driven verdict. Names the bias operating in the decision',
    tags: ['React Component', 'Decision Audit', 'Bias'],
    type: 'module',
    text: `I am building a Rugby Intelligence System in React. Build me a React component called CoachAudit.

This module audits coaching decisions against match data. It must be direct, data-driven, and unfiltered.

Component inputs:
1. What decision was made (text area, required)
2. The coach's stated reasoning at the time (text area, required)
3. Match situation at decision: scoreline, match minute, territory zone (form fields)
4. What happened in the 10 to 20 minutes after the decision (text area)
5. Performance data after the decision: territory change percentage, key metric change (number fields, optional)
6. Rugby level selector

Call Claude's API with this exact system prompt, replacing [level]:

"You are a Brutally Honest Strategic Advisor auditing decisions for a [level] rugby programme. Cross-reference every stated reason against the actual outcome data. Identify precisely where the decision improved or damaged key performance metrics. Name the specific cognitive bias operating: choose from confirmation bias, recency bias, sunk cost fallacy, authority bias, availability heuristic, or in-group bias. Provide the data-driven alternative decision that would have optimised the outcome. Deliver a clear verdict using one of these exact words at the start of your verdict section: JUSTIFIED, QUESTIONABLE, or UNSUPPORTED. Be direct. Use data not opinion. Do not soften findings. Headers: ## Decision Audit, ## Data Verdict, ## Bias Identified, ## Alternative Decision, ## One Priority Change."

Parse the verdict from the response and display a large verdict badge at the top of results: green for JUSTIFIED, amber for QUESTIONABLE, red for UNSUPPORTED.`
  },
  {
    id: 'coachplayer',
    category: 'modules',
    title: 'Coach the Player',
    desc: 'Direct, first-person coaching output addressed to the player. Ties every piece of feedback to specific data. No generic language',
    tags: ['React Component', 'Technical Coaching', 'Individual'],
    type: 'module',
    text: `I am building a Rugby Intelligence System in React. Build me a React component called PlayerCoach.

This module delivers direct, honest technical coaching to individual players. No generic coaching language. Every piece of feedback must tie to specific data.

Component inputs:
1. Player name, position, age, playing level (form fields)
2. Recent match performance: minutes played, dominant carries, tackle completions, errors made, GPS collision count (number fields)
3. Video analysis observations: up to 5 specific technical observations the coach has made
4. Physical test results: sprint times, strength test ratios (text fields)
5. What the player currently believes about their own performance (text area)
6. Previous coaching interventions that have or have not worked (text area)

Call Claude's API with this system prompt, replacing [level]:

"You are a Technical Performance Coach speaking directly to a [level] rugby player. Your function is to deliver precise, honest individual coaching. Identify the three highest-priority technical deficits from the data. For each deficit explain exactly why it is limiting performance using biomechanical or tactical reasoning tied to specific data points. Prescribe specific drills and technical cues for each deficit. Set measurable targets with timeframes. Flag any patterns suggesting deeper physical or psychological constraints needing specialist input. Speak directly to the player using second person. Be honest. Be specific. Plain language only. No generic coaching speak. Headers: ## Your Performance Profile, ## The 3 Things Holding You Back, ## What You Need to Do, ## Your Targets, ## Watch Points."

The output must feel addressed directly to the player, not to a coach describing the player.`
  },
  {
    id: 'gameanalysis',
    category: 'modules',
    title: 'Game Analysis',
    desc: 'Match diagnosis not summary. Identifies decisive structural moments, territory efficiency vs xP benchmark, and gain line battle turning points',
    tags: ['React Component', 'Match Analysis', 'xP'],
    type: 'module',
    text: `I am building a Rugby Intelligence System in React. Build me a React component called MatchAnalyser.

Component inputs:
1. Match details: date, home team, away team, final score, competition, home or away for your team
2. Territory and possession: percentage sliders 0 to 100
3. Set piece data: scrums won, scrums lost, lineout accuracy percentage
4. Ruck data: average ruck speed in seconds, percentage of rucks under 3 seconds
5. Scoring: tries scored with minutes, tries conceded with minutes, penalties for and against
6. GPS summary (optional): total distance, high-speed running distance, total collision count
7. Coach observations (text area)
8. Rugby level selector

Call Claude's API with this system prompt, replacing [level]:

"You are a Match Intelligence Analyst for a [level] rugby team. Diagnose this match, do not summarise it. Find the structural causes of the outcome. Identify the three decisive moments that structurally determined the result. Analyse territory efficiency: calculate actual points per 22-metre entry and compare against the xP benchmark for this level. Evaluate ruck speed data and its specific impact on defensive line reset capability. Identify which forwards won or lost the gain line battle and at what minute the tide turned. Deliver a clear structural verdict on why this match was won or lost. Every finding must have a cause and effect explanation. No data without diagnosis. Headers: ## Match Verdict, ## Three Decisive Moments, ## Territory Efficiency Report, ## Set Piece Impact, ## Three Priority Actions."

Display the Match Verdict section in a highlighted box at the top of results, separated visually from the other sections.`
  },
  {
    id: 'tactics',
    category: 'modules',
    title: 'Tactics and Positions',
    desc: 'Interactive formation diagram for positions 1 to 15. Position-aware input fields and benchmarks. Connects individual performance to team system',
    tags: ['React Component', 'Positions 1-15', 'Tactical Analysis'],
    type: 'module',
    text: `I am building a Rugby Intelligence System in React. Build me a React component called PositionalAnalysis.

Component structure:

1. A visual rugby formation diagram built with CSS grid. Display numbered circles for positions 1 to 15 arranged in a rough formation shape. Clicking a number selects that position and highlights it.

2. When a position is selected, display position-specific input fields based on the Primary Value Metric for that position:
   - Loosehead (1): scrum stability percentage, lineout lift accuracy
   - Hooker (2): lineout throw accuracy, ruck arrival time
   - Tighthead (3): scrum pressure rating, turnover rate
   - Locks (4, 5): lineout catch percentage, dominant carry rate
   - Blindside (6): ruck clearance speed, tackle completion under fatigue
   - Openside (7): turnover rate, ruck arrival time
   - Number 8: gain line carry metres, pick and drive conversion rate
   - Scrum Half (9): ruck clearance latency, box kick accuracy
   - Fly Half (10): territory kick efficiency, defensive line speed
   - Centres (12, 13): dominant carry percentage, intercept rate
   - Wingers (11, 14): try assist conversion, kick chase completion
   - Fullback (15): counter-attack success rate, aerial claim percentage

3. A text area for additional video observations
4. Rugby level selector

Call Claude's API with a prompt that names the position, states its Primary Value Metric, and instructs Claude to: compare against the gold standard for that level, identify the specific deficit, prescribe three technical adjustments, and connect the improvement to team system impact. Headers: ## Position Profile, ## Performance vs Gold Standard, ## Deficit Analysis, ## Three Adjustments, ## System Impact.`
  },
  {
    id: 'redzone',
    category: 'modules',
    title: 'Red Zone Audit',
    desc: 'xP calculator with entry log. Displays index score against level benchmark. Audits decision quality per entry and flags systemic bias',
    tags: ['React Component', 'xP', 'Territory'],
    type: 'module',
    text: `I am building a Rugby Intelligence System in React. Build me a React component called RedZoneAudit.

Component inputs:
1. Number of 22-metre entries (number)
2. Points scored from those entries (number)
3. Entry log: for up to 12 entries, allow input of minute, decision taken (dropdown: Kick for Posts, Kick to Corner, Tap and Go, Scrum, Lineout), and outcome (dropdown: Points Scored, Turnover, No Score, Penalty Against)
4. Kicking data: 50/22 attempts, 50/22 successes, box kicks attempted, box kicks retained
5. Rugby level selector

Level-based xP benchmarks:
- Elite Professional: 4.2 per entry
- Semi-Professional: 3.6
- Academy: 3.0
- Youth: 2.4
- Community: 2.0

Calculate and display before the AI analysis:
- Actual xP: total points divided by number of entries
- Index Score: actual xP divided by benchmark multiplied by 100
- Display as a large prominent number: green above 100, amber 75 to 100, red below 75

Call Claude's API with the formatted entry log using this system prompt:

"You are a Red Zone Efficiency Analyst for a [level] rugby team. Analyse whether scoring zone entries are converting at a rate that justifies the territory strategy. Calculate the efficiency score, identify under-indexing patterns, evaluate each decision type for probability optimisation, assess kicking strategy quality, and rank priority adjustments by impact. Headers: ## Territory Efficiency Score, ## xP Analysis, ## Decision Quality Audit, ## Kicking Strategy, ## Priority Adjustments."`
  },
  {
    id: 'gps-parser',
    category: 'data',
    title: 'GPS Data Parser',
    desc: 'Utility that normalises raw GPS exports from Catapult, STATSports, or Polar into a standardised RIS schema. Includes FatigueIndex calculator and Claude-ready formatter',
    tags: ['JavaScript', 'GPS', 'Data Integration'],
    type: 'data',
    text: `I am building a Rugby Intelligence System in React. Build me a JavaScript utility called parseGPSData.

This function takes raw GPS and wearable export data (typically CSV or JSON from systems like Catapult, STATSports, or Polar) and converts it into a standardised format my system can use.

Handle these common GPS metrics and map them to my schema:
- Total Distance in metres
- High Speed Running Distance: metres above 5.5 m/s threshold
- Sprint Distance: metres above 7.0 m/s threshold
- Maximum Velocity in m/s
- Acceleration Load (PlayerLoad or equivalent)
- Impact count above 5g threshold mapped to CollisionCount
- Heart Rate Average and Maximum

The function must:
1. Accept either a CSV string or a JavaScript object
2. Attempt to identify the GPS system from column header names
3. Return a standardised GPSSummary object with consistent field names regardless of source
4. Flag any missing critical fields in a warnings array
5. Calculate a FatigueIndex score from 0 to 100 based on: high speed running distance (weight 0.4), collision count (weight 0.4), and session duration (weight 0.2)

Also build a formatForClaudePrompt function that converts the GPSSummary object into a clean, labelled text block suitable for pasting directly into a Claude API message.

Include error handling for malformed or empty data. Use UK English.`
  },
  {
    id: 'video-input',
    category: 'data',
    title: 'Video Analysis Input',
    desc: 'Structured observation entry for set piece, breakdown, defensive system, attack patterns, and individual player flags. Exports as Claude-ready text block',
    tags: ['React Component', 'Video Analysis', 'Observations'],
    type: 'data',
    text: `I am building a Rugby Intelligence System in React. Build me a React component called VideoAnalysisInput.

This provides a structured way to enter video analysis observations before sending them to Claude.

The component must have these collapsible sections:

1. Set Piece Observations
   - Scrum: up to 5 specific observations with text fields
   - Lineout: up to 5 observations on calls, timing, and accuracy

2. Breakdown and Ruck Observations
   - Up to 8 observations each with: phase number (optional), position involved (1 to 15), observation type (dropdown: Slow Ball, Turnover Risk, Dominant Cleanout, Penalty Risk, Jackaling Threat), specific note (text)

3. Defensive System Observations
   - Defensive shape identified (dropdown: Blitz, Fold, Rush, Hybrid, Uncertain)
   - Up to 5 observations on line speed, communication gaps, and edge defence

4. Attack Pattern Observations
   - Up to 5 observations on pod alignment, ball carrier selection, and kicking tendencies

5. Individual Player Flags
   - Up to 8 player flags each with: position number, observation text, flag type (dropdown: Positive, Needs Work, Urgent, Injury Concern)

A Format for Analysis button at the bottom converts all entered observations into a structured text block optimised for Claude to parse. Show the formatted output in a copyable text area.`
  },
  {
    id: 'manual-stats',
    category: 'data',
    title: 'Manual Stats Input Builder',
    desc: 'Standardised stat entry form that formats data correctly for any RIS module. Validates inputs and flags gaps before analysis',
    tags: ['React Component', 'Statistics', 'Data Entry'],
    type: 'data',
    text: `I am building a Rugby Intelligence System in React. Build me a React component called ManualStatsInput.

This is a standardised statistics entry form that structures raw match or player data correctly before sending it to any analysis module.

The component has two modes selectable by the user:

MATCH STATS MODE:
- Basic: date, teams, score, competition, home or away
- Possession and territory: percentage sliders for both
- Set piece: scrum wins, losses, and penalties; lineout accuracy percentage
- Breakdown: ruck count, rucks won, average ruck speed, percentage under 3 seconds
- Scoring: tries scored and conceded with minutes, penalties for and against, conversions

PLAYER STATS MODE:
- Identity: name, position, level, age
- Match involvement: minutes played, carries, metres gained, dominant carries, offloads, turnovers won, tackles made, tackles missed, errors
- GPS: distance, high-speed running, collision count

Validate all inputs: flag missing required fields and values outside realistic ranges. Show a validation summary before the user submits.

A Format for Analysis button converts the completed form into a structured text block optimised for Claude to parse.`
  },
  {
    id: 'storage',
    category: 'extensions',
    title: 'Squad and Analysis Storage',
    desc: 'localStorage-based squad roster and analysis history. Custom hooks, import and export as JSON, and roster display component',
    tags: ['React Hook', 'localStorage', 'Squad Management'],
    type: 'extend',
    text: `I am building a Rugby Intelligence System in React. Build me a data persistence layer using localStorage.

Create two custom hooks:

1. useSquad hook providing:
   - savePlayer(playerData): saves or updates a player by name and position
   - getPlayer(name): retrieves a specific player profile
   - getAllPlayers(): returns the full squad as an array sorted by position number
   - deletePlayer(name): removes a player
   - exportSquad(): returns the full squad as a JSON string for download
   - importSquad(jsonString): replaces the current squad with imported data

2. useAnalysisHistory hook providing:
   - saveAnalysis(module, level, input, output): saves with timestamp and auto-generated ID
   - getHistory(): returns all analyses sorted by date descending
   - getHistoryByModule(moduleId): filters by module type
   - deleteAnalysis(id): removes an entry
   - exportAnalysis(id): returns a formatted plain text version of one analysis suitable for download as a .txt file

Also build a SquadRoster React component that:
- Displays all saved players in a table sorted by position number
- Shows: position number, position name, player name, level, and last updated date
- Has Load, Edit, and Delete buttons per row
- Has Import JSON and Export JSON buttons at the top
- Has a search bar filtering by name or position

Use the same dark analytics aesthetic as the main application.`
  },
  {
    id: 'xp-calc',
    category: 'extensions',
    title: 'xP Calculator',
    desc: 'Standalone Expected Points calculator for any field position and game context. Quick Decision mode for real-time recommendations. Decision log with outcome tracking',
    tags: ['React Component', 'xP', 'Real-Time'],
    type: 'extend',
    text: `I am building a Rugby Intelligence System in React. Build me a standalone Expected Points calculator component called xPCalculator.

Level-based benchmarks (use these exactly):
- Elite Professional: red zone = 4.2 xP, opposition half = 2.1, own half = 0.8
- Semi-Professional: multiply all by 0.85
- Academy: multiply all by 0.70
- Youth: multiply all by 0.55
- Community: multiply all by 0.45

Component must have two modes:

CALCULATOR MODE:
- Field position slider from own try line (0) to opposition try line (100) in 5-metre bands
- Game situation selector: Normal, Leading by 7 or more, Trailing by 7 or more, Final 10 minutes, Final 3 minutes
- Rugby level selector
- For each available option display: Expected Points value, Risk rating (Low, Medium, High), colour coded recommendation, one-sentence rationale

QUICK DECISION MODE:
- Scoreline input, match minute, field position slider, rugby level selector
- Output: a single recommended decision with a one-line justification and the xP value

Also include a Match Decision Log:
- Record each decision with: minute, position, decision taken, xP of recommended decision, actual outcome
- Show total xP of decisions made vs total xP of optimal decisions as a Decision Quality Score percentage`
  },
  {
    id: 'export',
    category: 'extensions',
    title: 'Analysis Export',
    desc: 'Converts any RIS analysis to a formatted .txt or .md report file. Includes header, sections, and footer with generation timestamp',
    tags: ['JavaScript', 'Export', 'Reporting'],
    type: 'extend',
    text: `I am building a Rugby Intelligence System in React. Build me an export utility for analysis reports.

Build a JavaScript module called exportAnalysis with these functions:

1. formatAsText(analysisData): converts an analysis object to a clean plain text report with:
   - Header block: module name, date, rugby level, data types used
   - All section headings in uppercase with a line of dashes beneath
   - Footer: generated by Rugby Intelligence System, timestamp

2. formatAsMarkdown(analysisData): same structure but using markdown formatting

3. downloadFile(content, filename, type): triggers a browser file download

4. generateFilename(module, level, date): returns a clean filename like "GamePlan_ElitePro_2025-01-15.txt"

Also build a ShareButton React component that:
- Takes an analysis object as a prop
- Displays two download options: Download as Text and Download as Markdown
- Shows a Copy to Clipboard button
- Shows a character count and estimated reading time for the analysis

The exported reports must be clean, readable, and professional enough to share directly with coaching staff.`
  },
  {
    id: 'benchmark-db',
    category: 'extensions',
    title: 'Position Benchmark Database',
    desc: 'Static reference database of gold standard performance metrics for all 15 positions across all 5 rugby levels. Includes comparison functions and deficit calculators',
    tags: ['JavaScript', 'Benchmarks', 'Positions 1-15'],
    type: 'extend',
    text: `I am building a Rugby Intelligence System in React. Build me a position benchmark database as a JavaScript module called positionBenchmarks.

This is a static reference database containing gold standard performance metrics for all 15 positions across 5 rugby levels.

Structure it as a nested object: benchmarks[positionNumber][level] = { metrics object }.

Include realistic but evidence-based benchmarks for each position. Examples:

Position 3 (Tighthead Prop) at Elite Professional level:
- scrumWinRate: 72 (percentage)
- scrumPressureRating: 8.2 (out of 10)
- turnoverRateAtBreakdown: 4.1 (per match)
- dominantCarryRate: 58 (percentage of carries that beat the gain line)
- tackleCompletion: 88 (percentage)

Position 9 (Scrum Half) at Elite Professional level:
- ruckClearanceLatency: 2.4 (seconds average from ball available to pass)
- boxKickAccuracy: 71 (percentage landing in contested zone)
- passingAccuracy: 94 (percentage)

Build realistic values for all 15 positions at all 5 levels. Values should decrease proportionally from Elite to Community.

Also build these functions:
- getDeficit(positionNumber, level, playerMetrics): returns deficit percentage per metric
- getTopDeficit(positionNumber, level, playerMetrics): returns the single biggest gap
- formatForClaudePrompt(positionNumber, level, playerMetrics): returns a text block for use in a Claude API call

Use UK English.`
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Prompts', count: PROMPTS.length },
  { id: 'foundation', label: 'Foundation', count: PROMPTS.filter(p => p.category === 'foundation').length },
  { id: 'modules', label: 'Analysis Modules', count: PROMPTS.filter(p => p.category === 'modules').length },
  { id: 'data', label: 'Data Integration', count: PROMPTS.filter(p => p.category === 'data').length },
  { id: 'extensions', label: 'Extensions', count: PROMPTS.filter(p => p.category === 'extensions').length },
];

const TYPE_COLORS = { build: 'blue', module: 'green', data: 'amber', extend: 'amber' };

const SECTION_LABELS = {
  foundation: 'Foundation and Architecture',
  modules: 'Analysis Module Builds',
  data: 'Data Integration',
  extensions: 'Extensions and Utilities',
};

function PromptCard({ prompt }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="prompt-card">
      <div className="prompt-header" onClick={() => setOpen(!open)}>
        <div className="prompt-meta">
          <div className="prompt-title">{prompt.title}</div>
          <div className="prompt-desc">{prompt.desc}</div>
          <div className="prompt-tags">
            {prompt.tags.map(t => (
              <span key={t} className={`tag ${TYPE_COLORS[prompt.type] || ''}`}>{t}</span>
            ))}
          </div>
        </div>
        <div className="prompt-actions">
          <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button className="expand-btn">{open ? '▲' : '▼'}</button>
        </div>
      </div>
      {open && (
        <div className="prompt-body">
          <div className="prompt-text">{prompt.text}</div>
        </div>
      )}
    </div>
  );
}

function PromptLibrary() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = PROMPTS.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const grouped = {
    foundation: filtered.filter(p => p.category === 'foundation'),
    modules: filtered.filter(p => p.category === 'modules'),
    data: filtered.filter(p => p.category === 'data'),
    extensions: filtered.filter(p => p.category === 'extensions'),
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-name">RIS Prompt Library</div>
            <div className="brand-sub">RUGBY INTELLIGENCE SYSTEM</div>
          </div>
          <a className="back-link" href="/">← Back to RIS</a>
          {CATEGORIES.map(c => (
            <div key={c.id} className="nav-section" style={{ paddingBottom: 0 }}>
              <button
                className={`nav-item ${activeCategory === c.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(c.id)}
              >
                <div className="nav-dot" />
                {c.label}
                <span className="count-badge">{c.count}</span>
              </button>
            </div>
          ))}
          <div style={{ padding: '24px 16px', marginTop: 'auto' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '1px', lineHeight: 1.8 }}>
              COPY EACH PROMPT<br />
              PASTE INTO CLAUDE<br />
              BUILD YOUR MODULE
            </div>
          </div>
        </div>

        <div className="main">
          <div className="main-header">
            <div className="main-title">Rugby Intelligence System — Prompt Library</div>
            <div className="main-subtitle">
              {PROMPTS.length} prompts across 4 categories. Copy any prompt and paste it into Claude to build that component.
            </div>
          </div>

          <div className="content">
            <div className="stats-row">
              <div className="stat"><span className="stat-num">4</span><span className="stat-label">Foundation Prompts</span></div>
              <div className="stat"><span className="stat-num">8</span><span className="stat-label">Module Builds</span></div>
              <div className="stat"><span className="stat-num">3</span><span className="stat-label">Data Integration</span></div>
              <div className="stat"><span className="stat-num">4</span><span className="stat-label">Extensions</span></div>
            </div>

            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="Search prompts by title, description, or tag..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {Object.entries(grouped).map(([cat, prompts]) =>
              prompts.length > 0 ? (
                <div key={cat}>
                  <div className="section-heading">{SECTION_LABELS[cat]}</div>
                  {prompts.map(p => <PromptCard key={p.id} prompt={p} />)}
                </div>
              ) : null
            )}

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: 1 }}>
                NO PROMPTS MATCH YOUR SEARCH
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(PromptLibrary));
