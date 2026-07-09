export const TEAMS = {
  ARS: { name: 'Arsenal', color: '#EF0107', abbr: 'ARS' },
  MCI: { name: 'Man City', color: '#6CABDD', abbr: 'MCI' },
  LIV: { name: 'Liverpool', color: '#C8102E', abbr: 'LIV' },
  CHE: { name: 'Chelsea', color: '#034694', abbr: 'CHE' },
  MUN: { name: 'Man United', color: '#DA291C', abbr: 'MUN' },
  TOT: { name: 'Tottenham', color: '#132257', abbr: 'TOT' },
  NEW: { name: 'Newcastle', color: '#241F20', abbr: 'NEW' },
  AVL: { name: 'Aston Villa', color: '#95BFE5', abbr: 'AVL' },
  BHA: { name: 'Brighton', color: '#0057B8', abbr: 'BHA' },
  WHU: { name: 'West Ham', color: '#7A263A', abbr: 'WHU' },
  LAL: { name: 'Lakers', color: '#552583', abbr: 'LAL' },
  BOS: { name: 'Celtics', color: '#007A33', abbr: 'BOS' },
  GSW: { name: 'Warriors', color: '#1D428A', abbr: 'GSW' },
  MIA: { name: 'Heat', color: '#98002E', abbr: 'MIA' },
};

export const MATCHES = [
  { id: 1, league: 'Premier League', home: 'ARS', away: 'MCI', homeScore: 2, awayScore: 1, status: 'live', minute: "67'" },
  { id: 2, league: 'Premier League', home: 'LIV', away: 'CHE', homeScore: 0, awayScore: 0, status: 'live', minute: "23'" },
  { id: 3, league: 'Premier League', home: 'MUN', away: 'TOT', homeScore: 3, awayScore: 2, status: 'ft', minute: 'FT' },
  { id: 4, league: 'Premier League', home: 'NEW', away: 'AVL', homeScore: 1, awayScore: 1, status: 'ft', minute: 'FT' },
  { id: 5, league: 'Premier League', home: 'BHA', away: 'WHU', homeScore: null, awayScore: null, status: 'upcoming', minute: '15:00' },
  { id: 6, league: 'NBA', home: 'LAL', away: 'BOS', homeScore: 98, awayScore: 102, status: 'live', minute: 'Q4 4:12' },
  { id: 7, league: 'NBA', home: 'GSW', away: 'MIA', homeScore: 112, awayScore: 108, status: 'ft', minute: 'Final' },
];

export const STANDINGS = [
  { pos: 1, team: 'ARS', played: 34, won: 24, drawn: 5, lost: 5, gf: 78, ga: 28, pts: 77 },
  { pos: 2, team: 'MCI', played: 34, won: 23, drawn: 7, lost: 4, gf: 72, ga: 31, pts: 76 },
  { pos: 3, team: 'LIV', played: 34, won: 22, drawn: 8, lost: 4, gf: 74, ga: 32, pts: 74 },
  { pos: 4, team: 'AVL', played: 34, won: 20, drawn: 7, lost: 7, gf: 68, ga: 45, pts: 67 },
  { pos: 5, team: 'TOT', played: 34, won: 19, drawn: 6, lost: 9, gf: 65, ga: 48, pts: 63 },
  { pos: 6, team: 'CHE', played: 34, won: 17, drawn: 9, lost: 8, gf: 58, ga: 42, pts: 60 },
  { pos: 7, team: 'NEW', played: 34, won: 16, drawn: 8, lost: 10, gf: 62, ga: 50, pts: 56 },
  { pos: 8, team: 'MUN', played: 34, won: 15, drawn: 6, lost: 13, gf: 52, ga: 55, pts: 51 },
  { pos: 9, team: 'BHA', played: 34, won: 12, drawn: 10, lost: 12, gf: 48, ga: 52, pts: 46 },
  { pos: 10, team: 'WHU', played: 34, won: 11, drawn: 9, lost: 14, gf: 44, ga: 58, pts: 42 },
];

export const ARTICLES = [
  {
    id: 1,
    category: 'Premier League',
    title: 'Saka brace fires Arsenal past City in title race thriller',
    excerpt: 'Bukayo Saka scored twice as Arsenal moved two points clear at the top with a dramatic 2-1 win over Manchester City at the Emirates.',
    author: 'James Richardson',
    time: '12 min ago',
    sport: 'football',
    body: [
      'Arsenal produced a statement performance under the Emirates lights, defeating Manchester City 2-1 in a match that could define the Premier League title race.',
      'Bukayo Saka was the hero, curling a stunning opener into the far corner before doubling the lead with a composed finish after the break. Erling Haaland pulled one back late on, but Mikel Arteta\'s side held firm.',
      '"We showed character when it mattered most," Arteta said post-match. "The fans pushed us through those final minutes."',
      'City manager Pep Guardiola acknowledged his side were second best: "Arsenal deserved it tonight. We must respond on Saturday."',
    ],
  },
  {
    id: 2,
    category: 'Transfer News',
    title: 'Real Madrid monitoring Liverpool midfielder ahead of summer window',
    excerpt: 'Sources close to the club suggest Los Blancos are preparing a record bid as contract talks stall in Merseyside.',
    author: 'Sarah Martinez',
    time: '34 min ago',
    sport: 'football',
    body: [
      'Real Madrid have identified a Liverpool midfielder as their primary summer target, according to multiple sources in Spain and England.',
      'The player\'s contract situation has become a talking point, with negotiations reportedly stalling over wage demands and release clauses.',
      'Liverpool are understood to be reluctant sellers but may face a difficult decision if a bid exceeding €120m materialises.',
    ],
  },
  {
    id: 3,
    category: 'NBA',
    title: 'Celtics edge Lakers in overtime classic at TD Garden',
    excerpt: 'Jayson Tatum dropped 38 points as Boston survived a late LeBron surge to win 102-98 in a heavyweight Western Conference clash.',
    author: 'Marcus Webb',
    time: '1 hr ago',
    sport: 'basketball',
    body: [
      'Boston Celtics extended their home winning streak with a gritty 102-98 overtime victory over the Los Angeles Lakers.',
      'Jayson Tatum led all scorers with 38 points, while LeBron James countered with a triple-double in a game that swung back and forth through four quarters and an extra period.',
      'The win keeps Boston firmly in the Eastern Conference playoff picture with ten games remaining.',
    ],
  },
  {
    id: 4,
    category: 'Analysis',
    title: 'Why Villa\'s high press is the Premier League\'s best-kept secret',
    excerpt: 'Unai Emery\'s tactical tweaks have transformed Aston Villa into genuine top-four contenders this season.',
    author: 'Tom Hughes',
    time: '2 hr ago',
    sport: 'football',
    body: [
      'Aston Villa\'s rise under Unai Emery has been one of the stories of the season, and the data reveals a coordinated high press that rivals any team in Europe.',
      'Villa recover the ball in the final third more frequently than any side outside the traditional top six, converting those turnovers into high-quality chances at an impressive rate.',
      'Emery\'s system demands exceptional fitness levels, but the results speak for themselves: Villa sit fourth and have lost just three home games all campaign.',
    ],
  },
  {
    id: 5,
    category: 'Premier League',
    title: 'Ten Hag under pressure after United slump to third straight defeat',
    excerpt: 'Fan groups call for change as Manchester United fall to 8th place following a chaotic 3-2 loss to Tottenham.',
    author: 'Emma Clarke',
    time: '3 hr ago',
    sport: 'football',
    body: [
      'Manchester United\'s season hit a new low with a 3-2 defeat to Tottenham Hotspur at Old Trafford, extending their losing streak to three matches.',
      'Defensive errors cost United dearly, with two own goals contributing to a result that leaves them eighth in the table.',
      'Supporters\' groups issued a statement calling for "urgent structural review" as pressure mounts on Erik ten Hag.',
    ],
  },
  {
    id: 6,
    category: 'NBA',
    title: 'Curry hits 3,500th career three as Warriors clinch playoff spot',
    excerpt: 'Golden State secured their postseason berth with a 112-108 win over Miami behind another vintage Steph performance.',
    author: 'Marcus Webb',
    time: '4 hr ago',
    sport: 'basketball',
    body: [
      'Stephen Curry made history and secured Golden State\'s playoff place in the same night, draining his 3,500th career three-pointer in a 112-108 win over the Miami Heat.',
      'Curry finished with 31 points, while the Warriors\' defence held firm in the fourth quarter to seal a crucial victory.',
    ],
  },
];

export const TRENDING = [
  { id: 1, text: 'Saka brace sinks City in title decider' },
  { id: 2, text: 'Haaland injury scare after Emirates clash' },
  { id: 3, text: 'Slot confirms Salah will start vs Chelsea' },
  { id: 4, text: 'NBA: Tatum 38 pts in Celtics OT win' },
  { id: 5, text: 'Villa eye Champions League qualification' },
];

export const FEATURED_MATCH = MATCHES[0];
