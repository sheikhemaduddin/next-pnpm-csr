/** Local seed for Leaders when Supabase is not configured (no Docker / cloud required). */
export const LEADERS_SEED = [
  { id: 's1', category: 'scorer', player_name: 'Erling Haaland', team: 'Man City', sport: 'football', value: 27, unit: 'Goals', rank: 1, season: '2025/26' },
  { id: 's2', category: 'scorer', player_name: 'Mohamed Salah', team: 'Liverpool', sport: 'football', value: 24, unit: 'Goals', rank: 2, season: '2025/26' },
  { id: 's3', category: 'scorer', player_name: 'Bukayo Saka', team: 'Arsenal', sport: 'football', value: 19, unit: 'Goals', rank: 3, season: '2025/26' },
  { id: 's4', category: 'scorer', player_name: 'Cole Palmer', team: 'Chelsea', sport: 'football', value: 18, unit: 'Goals', rank: 4, season: '2025/26' },
  { id: 's5', category: 'scorer', player_name: 'Alexander Isak', team: 'Newcastle', sport: 'football', value: 17, unit: 'Goals', rank: 5, season: '2025/26' },
  { id: 's6', category: 'scorer', player_name: 'Ollie Watkins', team: 'Aston Villa', sport: 'football', value: 16, unit: 'Goals', rank: 6, season: '2025/26' },
  { id: 's7', category: 'scorer', player_name: 'Son Heung-min', team: 'Tottenham', sport: 'football', value: 15, unit: 'Goals', rank: 7, season: '2025/26' },
  { id: 's8', category: 'scorer', player_name: 'Dominic Solanke', team: 'Tottenham', sport: 'football', value: 14, unit: 'Goals', rank: 8, season: '2025/26' },
  { id: 'b1', category: 'bowler', player_name: 'Jasprit Bumrah', team: 'India', sport: 'cricket', value: 42, unit: 'Wickets', rank: 1, season: '2025' },
  { id: 'b2', category: 'bowler', player_name: 'Pat Cummins', team: 'Australia', sport: 'cricket', value: 38, unit: 'Wickets', rank: 2, season: '2025' },
  { id: 'b3', category: 'bowler', player_name: 'Shaheen Afridi', team: 'Pakistan', sport: 'cricket', value: 35, unit: 'Wickets', rank: 3, season: '2025' },
  { id: 'b4', category: 'bowler', player_name: 'Kagiso Rabada', team: 'South Africa', sport: 'cricket', value: 33, unit: 'Wickets', rank: 4, season: '2025' },
  { id: 'b5', category: 'bowler', player_name: 'Josh Hazlewood', team: 'Australia', sport: 'cricket', value: 31, unit: 'Wickets', rank: 5, season: '2025' },
  { id: 'b6', category: 'bowler', player_name: 'Mitchell Starc', team: 'Australia', sport: 'cricket', value: 29, unit: 'Wickets', rank: 6, season: '2025' },
  { id: 'b7', category: 'bowler', player_name: 'Ravindra Jadeja', team: 'India', sport: 'cricket', value: 28, unit: 'Wickets', rank: 7, season: '2025' },
  { id: 'b8', category: 'bowler', player_name: 'Trent Boult', team: 'New Zealand', sport: 'cricket', value: 26, unit: 'Wickets', rank: 8, season: '2025' },
];

export function getLeadersByCategory(category) {
  return LEADERS_SEED.filter((row) => row.category === category).sort((a, b) => a.rank - b.rank);
}
