export interface Player {
  id: string;
  name: string;
  wins: number;
  losses: number;
  matches: number;
  lastTeam?: string; // To track last team played with
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