export interface Player {
  id: string;
  name: string;
  wins: number;
  losses: number;
  matches: number;
}

export interface PlayerStats {
  name: string;
  wins: number;
  losses: number;
  winRate: number;
  totalMatches: number;
  rank: number;
}

export interface Match {
  id: string;
  team1: [Player, Player];
  team2: [Player, Player];
  winner: 'team1' | 'team2' | null;
  timestamp: number;
}

export interface MatchHistory {
  matches: Match[];
  players: Player[];
} 