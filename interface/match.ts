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

export interface CurrentMatchProps {
  match: Match;
  matchNumber: number;
  selectedWinner: 'team1' | 'team2' | null;
  onSelectWinner: (team: 'team1' | 'team2') => void;
  onConfirmWinner: (matchId: string) => void;
  onRevertMatch?: (matchId: string) => void;
  showRevert?: boolean;
} 