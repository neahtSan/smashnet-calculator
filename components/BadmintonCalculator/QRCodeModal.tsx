import { Modal, Button, Typography, Spin, message } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';
import { QRCodeModalProps } from '@/interface/qrcode';
import { useState } from 'react';

export const QRCodeModal = ({
  visible,
  onClose,
  promptPayNumber,
  qrPayload,
  playerCosts,
  totalCost
}: QRCodeModalProps) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    try {
      setIsSharing(true);
      const canvas = document.createElement('canvas');
      const svg = document.querySelector('#qr-code-main');
      if (!svg) {
        message.error('QR code not found');
        return;
      }

      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fill white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        try {
          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Failed to create blob'));
            }, 'image/png', 1.0);
          });

          const file = new File([blob], `promptpay-${promptPayNumber}.png`, { type: 'image/png' });
          if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'PromptPay QR Code',
            });
            message.success('QR code shared successfully');
          } else {
            // Fallback for browsers that don't support sharing files
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `promptpay-${promptPayNumber}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            message.success('QR code downloaded successfully');
          }
        } catch (error) {
          console.error('Error sharing:', error);
          message.error('Failed to share QR code');
        }
      };

      img.src = url;
    } catch (error) {
      console.error('Error preparing share:', error);
      message.error('Failed to prepare QR code');
    } finally {
      setIsSharing(false);
    }
  };

  const allPlayersHaveSameAmount = playerCosts.every(cost => cost.total === playerCosts[0].total);
  const individualAmount = allPlayersHaveSameAmount ? playerCosts[0].total : null;

  return (
    <Modal
      title="PromptPay QR Code"
      open={visible}
      closable={false}
      maskClosable={false}
      centered
      className="qr-code-modal !w-screen !max-w-none !min-h-screen !m-0 !p-0"
      rootClassName="!p-0"
      style={{ top: 0, padding: 0, margin: 0 }}
      footer={null}
    >
      <div className="space-y-6 px-4 py-2">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="mb-2">
            <Typography.Text type="secondary" className="text-sm">PromptPay Number:</Typography.Text>
            <Typography.Text strong className="ml-2">
              {promptPayNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
            </Typography.Text>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <QRCodeSVG
              id="qr-code-main"
              value={qrPayload}
              size={256}
              level="L"
              style={{ margin: '1rem' }}
            />
          </div>
          <Button 
            type="primary" 
            onClick={handleShare}
            icon={isSharing ? <Spin className="mr-2" /> : <ShareAltOutlined />}
            disabled={isSharing}
            className="w-48"
          >
            {isSharing ? 'Saving...' : 'Save to Photos'}
          </Button>
        </div>

        <div className="p-6 bg-gray-50 rounded-lg">
          <Typography.Title level={5} className="!mb-3">Payment Details</Typography.Title>
          <div className="space-y-4">
            {allPlayersHaveSameAmount ? (
              <>
                <div className="flex justify-between items-center">
                  <Typography.Text strong>Amount per person:</Typography.Text>
                  <Typography.Text type="success" strong>฿{individualAmount?.toFixed(2)}</Typography.Text>
                </div>
                <div className="flex justify-between items-center">
                  <Typography.Text strong>Number of players:</Typography.Text>
                  <Typography.Text strong>{playerCosts.length}</Typography.Text>
                </div>
              </>
            ) : (
              playerCosts.map(cost => (
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
              ))
            )}
            <div className="!my-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <Typography.Text strong>Total Cost:</Typography.Text>
                <Typography.Text type="success" strong>฿{totalCost.toFixed(2)}</Typography.Text>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pb-4">
          <Button danger onClick={onClose} className="w-48">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};