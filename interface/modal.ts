import { PlayerStats } from './player';

export interface DeleteConfirmationProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface FinishConfirmationProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface RevertMatchConfirmationProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface TournamentResultsProps {
  isVisible: boolean;
  onClose: () => void;
  players: PlayerStats[];
  onRestart: () => void;
} 