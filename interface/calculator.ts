import { PlayerStats } from './player';

export interface CourtFee {
  hourlyRate: number;
  hours: number;
}

export interface Shuttlecock {
  quantity: number;
  pricePerPiece: number;
}

export interface CustomExpense {
  id: string;
  name: string;
  amount: number;
  assignedTo: string[];
}

export interface BadmintonCostCalculatorProps {
  isVisible: boolean;
  onClose: () => void;
  players: PlayerStats[];
  onBackToResults: () => void;
} 