export interface QRCodeModalProps {
  visible: boolean;
  onClose: () => void;
  promptPayNumber: string;
  qrPayload: string;
  playerCosts: Array<{
    name: string;
    sharedCost: number;
    customExpenses: number;
    total: number;
  }>;
  totalCost: number;
}

export interface VerificationModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  promptPayNumber: string;
}

export interface PromptPaySectionProps {
  playerCosts: Array<{
    name: string;
    sharedCost: number;
    customExpenses: number;
    total: number;
  }>;
  totalCost: number;
} 