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

export interface PlayerFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (player: Player) => void;
  initialValues?: Partial<Player>;
  title?: string;
} 