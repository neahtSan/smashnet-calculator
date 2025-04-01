import { Modal, Button, Typography, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';
import { PlayerStats } from '@/interface';

interface QRCodeModalProps {
  visible: boolean;
  onClose: () => void;
  promptPayNumber: string;
  qrPayload: string;
  isDownloading: boolean;
  onDownload: () => void;
  playerCosts: Array<{
    name: string;
    sharedCost: number;
    customExpenses: number;
    total: number;
  }>;
  totalCost: number;
}

export const QRCodeModal = ({
  visible,
  onClose,
  promptPayNumber,
  qrPayload,
  isDownloading,
  onDownload,
  playerCosts,
  totalCost
}: QRCodeModalProps) => {
  return (
    <Modal
      title="PromptPay QR Code"
      open={visible}
      closable={false}
      maskClosable={false}
      centered
      className="qr-code-modal"
      footer={
        <div className="flex justify-between">
          <Button danger onClick={onClose}>
            Close
          </Button>
          <Button 
            type="primary" 
            onClick={onDownload} 
            icon={isDownloading ? <Spin className="mr-2" /> : <DownloadOutlined />}
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download QR Code'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="mb-2">
            <Typography.Text type="secondary" className="text-sm">PromptPay Number:</Typography.Text>
            <Typography.Text strong className="ml-2">
              {promptPayNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
            </Typography.Text>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <QRCodeSVG
              id="qr-code-svg"
              value={qrPayload}
              size={256}
              level="L"
              includeMargin={true}
            />
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-lg">
          <Typography.Title level={5} className="!mb-3">Payment Details</Typography.Title>
          <div className="space-y-4">
            {playerCosts.map(cost => (
              <div key={cost.name} className="flex flex-col">
                <div className="flex justify-between items-center">
                  <Typography.Text strong>{cost.name}</Typography.Text>
                  <Typography.Text type="success" strong>฿{cost.total.toFixed(2)}</Typography.Text>
                </div>
                <div className="text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Shared Cost:</span>
                    <span>฿{cost.sharedCost.toFixed(2)}</span>
                  </div>
                  {cost.customExpenses > 0 && (
                    <div className="flex justify-between">
                      <span>Additional Expenses:</span>
                      <span>฿{cost.customExpenses.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="!my-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <Typography.Text strong>Total Cost:</Typography.Text>
                <Typography.Text type="success" strong>฿{totalCost.toFixed(2)}</Typography.Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}; 