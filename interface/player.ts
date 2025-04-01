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

export interface PlayerFormProps {
  onSubmit: (name: string) => void;
  onCancel: () => void;
  initialName?: string;
} 