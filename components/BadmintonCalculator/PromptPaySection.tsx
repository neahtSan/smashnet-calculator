import { Typography, Input, Button, Space } from 'antd';
import { QrcodeOutlined } from '@ant-design/icons';

interface PromptPaySectionProps {
  promptPayNumber: string;
  isValidPromptPay: boolean;
  onPromptPayChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateQR: () => void;
}

export const PromptPaySection = ({
  promptPayNumber,
  isValidPromptPay,
  onPromptPayChange,
  onGenerateQR
}: PromptPaySectionProps) => {
  return (
    <div>
      <Typography.Title level={5}>PromptPay QR Code</Typography.Title>
      <Space.Compact className="w-full">
        <Input
          placeholder="Enter your PromptPay number"
          value={promptPayNumber}
          onChange={onPromptPayChange}
          status={promptPayNumber && !isValidPromptPay ? 'error' : undefined}
          maxLength={10}
          pattern="[0-9]*"
          type="tel"
        />
        <Button
          type="primary"
          icon={<QrcodeOutlined />}
          onClick={onGenerateQR}
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
  );
}; 