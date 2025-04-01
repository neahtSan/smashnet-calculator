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
  hours?: number;
}

export interface PlayerFormComponentProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  editingPlayer?: Player;
  players: Player[];
}

export interface PlayerListProps {
  players: Player[];
  onEditPlayer: (player: Player) => void;
  onDeletePlayer: (playerId: string) => void;
}

export interface PlayerListWithHoursProps {
  players: PlayerStats[];
  onPlayersChange: (players: PlayerStats[]) => void;
} 