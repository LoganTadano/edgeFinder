const today = new Date().toISOString().split("T")[0];
const now = Date.now();

export const mockGames = [
  {
    game_id: 9001,
    home_team: "Boston Celtics",
    away_team: "Miami Heat",
    game_date: today,
    home_score: 114,
    away_score: 101,
    status: "Final",
  },
  {
    game_id: 9002,
    home_team: "Golden State Warriors",
    away_team: "Los Angeles Lakers",
    game_date: today,
    home_score: 88,
    away_score: 94,
    status: "in progress",
  },
  {
    game_id: 9003,
    home_team: "Milwaukee Bucks",
    away_team: "Philadelphia 76ers",
    game_date: today,
    home_score: null,
    away_score: null,
    status: "scheduled",
  },
  {
    game_id: 9004,
    home_team: "Oklahoma City Thunder",
    away_team: "Denver Nuggets",
    game_date: today,
    home_score: null,
    away_score: null,
    status: "scheduled",
  },
];

export const mockEdges = [
  {
    game_id: 9002,
    home_team: "Golden State Warriors",
    away_team: "Los Angeles Lakers",
    game_date: today,
    status: "in progress",
    model_home_prob: 0.712,
    home_win_prob: 0.538,
    edge: 0.174,
  },
  {
    game_id: 9003,
    home_team: "Milwaukee Bucks",
    away_team: "Philadelphia 76ers",
    game_date: today,
    status: "scheduled",
    model_home_prob: 0.634,
    home_win_prob: 0.571,
    edge: 0.063,
  },
];

export const mockOdds = [
  { snapshot_id: 1, game_id: 9002, timestamp: new Date(now - 3600000).toISOString(), home_win_prob: 0.51, away_win_prob: 0.49, source: "kalshi" },
  { snapshot_id: 2, game_id: 9002, timestamp: new Date(now - 3000000).toISOString(), home_win_prob: 0.505, away_win_prob: 0.495, source: "kalshi" },
  { snapshot_id: 3, game_id: 9002, timestamp: new Date(now - 2400000).toISOString(), home_win_prob: 0.522, away_win_prob: 0.478, source: "kalshi" },
  { snapshot_id: 4, game_id: 9002, timestamp: new Date(now - 1800000).toISOString(), home_win_prob: 0.531, away_win_prob: 0.469, source: "kalshi" },
  { snapshot_id: 5, game_id: 9002, timestamp: new Date(now - 1200000).toISOString(), home_win_prob: 0.536, away_win_prob: 0.464, source: "kalshi" },
  { snapshot_id: 6, game_id: 9002, timestamp: new Date(now - 600000).toISOString(), home_win_prob: 0.538, away_win_prob: 0.462, source: "kalshi" },
];

export const mockGameDetails = {
  9001: {
    game_id: 9001,
    home_team: "Boston Celtics",
    away_team: "Miami Heat",
    game_date: today,
    home_score: 114,
    away_score: 101,
    status: "Final",
    latest_odds: { home_win_prob: 0.68, away_win_prob: 0.32, source: "kalshi", timestamp: new Date(now - 7200000).toISOString() },
    latest_prediction: { model_home_prob: 0.701, model_away_prob: 0.299, edge: 0.021, timestamp: new Date(now - 7200000).toISOString() },
  },
  9002: {
    game_id: 9002,
    home_team: "Golden State Warriors",
    away_team: "Los Angeles Lakers",
    game_date: today,
    home_score: 88,
    away_score: 94,
    status: "in progress",
    latest_odds: { home_win_prob: 0.538, away_win_prob: 0.462, source: "kalshi", timestamp: new Date(now - 600000).toISOString() },
    latest_prediction: { model_home_prob: 0.712, model_away_prob: 0.288, edge: 0.174, timestamp: new Date(now - 900000).toISOString() },
  },
  9003: {
    game_id: 9003,
    home_team: "Milwaukee Bucks",
    away_team: "Philadelphia 76ers",
    game_date: today,
    home_score: null,
    away_score: null,
    status: "scheduled",
    latest_odds: { home_win_prob: 0.571, away_win_prob: 0.429, source: "kalshi", timestamp: new Date(now - 1800000).toISOString() },
    latest_prediction: { model_home_prob: 0.634, model_away_prob: 0.366, edge: 0.063, timestamp: new Date(now - 900000).toISOString() },
  },
  9004: {
    game_id: 9004,
    home_team: "Oklahoma City Thunder",
    away_team: "Denver Nuggets",
    game_date: today,
    home_score: null,
    away_score: null,
    status: "scheduled",
    latest_odds: { home_win_prob: 0.61, away_win_prob: 0.39, source: "kalshi", timestamp: new Date(now - 1800000).toISOString() },
    latest_prediction: { model_home_prob: 0.588, model_away_prob: 0.412, edge: -0.022, timestamp: new Date(now - 900000).toISOString() },
  },
};
