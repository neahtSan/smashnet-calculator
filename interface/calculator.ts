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
  isShared: boolean;
}

export interface BadmintonCostCalculatorProps {
  isVisible: boolean;
  onClose: () => void;
  players: PlayerStats[];
  onBackToResults: () => void;
}

export interface ShuttlecockSectionProps {
  shuttlecock: Shuttlecock;
  onShuttlecockChange: (shuttlecock: Shuttlecock) => void;
}

export interface CostBreakdownProps {
  players: PlayerStats[];
  courtFee: CourtFee;
  shuttlecock: Shuttlecock;
  customExpenses: CustomExpense[];
  totalCost: number;
}

export interface AdditionalExpensesProps {
  customExpenses: CustomExpense[];
  players: PlayerStats[];
  onCustomExpensesChange: (expenses: CustomExpense[]) => void;
}

export interface PlayerCost {
  name: string;
  sharedCost: number;
  customExpenses: number;
  total: number;
  hours?: number;
}

export interface CourtFeeSectionProps {
  courtFee: CourtFee;
  onCourtFeeChange: (courtFee: CourtFee) => void;
} 