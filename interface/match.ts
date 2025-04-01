import { Player } from './player';

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