import { Typography, Input, Button, Space, Modal } from 'antd';
import { QrcodeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { VerificationModal } from './VerificationModal';
import { QRCodeModal } from './QRCodeModal';
import generatePayload from 'promptpay-qr';

interface PromptPaySectionProps {
  playerCosts: Array<{
    name: string;
    sharedCost: number;
    customExpenses: number;
    total: number;
  }>;
  totalCost: number;
}

export const PromptPaySection = ({ playerCosts, totalCost }: PromptPaySectionProps) => {
  const [promptPayNumber, setPromptPayNumber] = useState<string>('');
  const [isValidPromptPay, setIsValidPromptPay] = useState(false);
  const [verifyNumberVisible, setVerifyNumberVisible] = useState(false);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<{ amount?: number; message?: string } | null>(null);

  const formatPhoneNumber = (input: string): string => {
    try {
      // Remove all non-digit characters
      const digitsOnly = input.replace(/\D/g, '');
      
      // If it starts with '66', replace with '0'
      if (digitsOnly.startsWith('66')) {
        return '0' + digitsOnly.slice(2);
      }
      
      // If it starts with '+66', replace with '0'
      if (digitsOnly.startsWith('66')) {
        return '0' + digitsOnly.slice(2);
      }
      
      return digitsOnly;
    } catch (error) {
      return input;
    }
  };

  const validatePromptPay = (number: string): boolean => {
    // Must be exactly 10 digits
    if (number.length !== 10) return false;

    // Must start with '0'
    if (!number.startsWith('0')) return false;

    // Second digit must be 6, 8, 9 for mobile numbers
    const secondDigit = parseInt(number[1]);
    if (![6, 8, 9].includes(secondDigit)) return false;

    // Must contain only digits
    if (!/^\d+$/.test(number)) return false;

    return true;
  };

  const handlePromptPayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPromptPayNumber(formattedNumber);
    setIsValidPromptPay(validatePromptPay(formattedNumber));
  };

  const handleGenerateQRCode = () => {
    setVerifyNumberVisible(true);
  };

  const handleVerifyAndGenerate = () => {
    setVerifyNumberVisible(false);
    
    // Check if all players have the same cost
    const hasDifferentCosts = playerCosts.some(cost => 
      Math.abs(cost.total - playerCosts[0].total) > 0.01
    );

    if (hasDifferentCosts) {
      const message = playerCosts.map(cost => 
        `${cost.name}: ${cost.total.toFixed(2)} THB`
      ).join('\n');
      
      setQrCodeData({ message });
    } else {
      setQrCodeData({ amount: playerCosts[0].total });
    }
    
    setQrCodeVisible(true);
  };

  const generateQRPayload = () => {
    if (!qrCodeData || !promptPayNumber) return '';
    
    if (qrCodeData.amount) {
      // Generate QR with amount
      return generatePayload(promptPayNumber, { amount: qrCodeData.amount });
    } else {
      // For different amounts, show 0 amount since players need to pay different amounts
      return generatePayload(promptPayNumber, { amount: 0 });
    }
  };

  return (
    <>
      <div>
        <Typography.Title level={5}>PromptPay QR Code</Typography.Title>
        <Space.Compact className="w-full">
          <Input
            placeholder="Enter your PromptPay number"
            value={promptPayNumber}
            onChange={handlePromptPayChange}
            status={promptPayNumber && !isValidPromptPay ? 'error' : undefined}
            maxLength={10}
            pattern="[0-9]*"
            type="tel"
          />
          <Button
            type="primary"
            icon={<QrcodeOutlined />}
            onClick={handleGenerateQRCode}
            disabled={!isValidPromptPay}
          >
            Generate QR Code
          </Button>
        </Space.Compact>
        {promptPayNumber && !isValidPromptPay && (
          <Typography.Text type="danger" className="mt-1 block text-sm">
            Please enter a valid Thai phone number
          </Typography.Text>
        )}
      </div>

      <VerificationModal
        visible={verifyNumberVisible}
        onCancel={() => setVerifyNumberVisible(false)}
        onConfirm={handleVerifyAndGenerate}
        promptPayNumber={promptPayNumber}
      />

      <QRCodeModal
        visible={qrCodeVisible}
        onClose={() => setQrCodeVisible(false)}
        promptPayNumber={promptPayNumber}
        qrPayload={generateQRPayload()}
        playerCosts={playerCosts}
        totalCost={totalCost}
      />
    </>
  );
}; 