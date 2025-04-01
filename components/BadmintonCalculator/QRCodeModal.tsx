import { Modal, Button, Typography, Spin, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';
import { PlayerStats } from '@/interface';
import { useState, useEffect } from 'react';

interface QRCodeModalProps {
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

export const QRCodeModal = ({
  visible,
  onClose,
  promptPayNumber,
  qrPayload,
  playerCosts,
  totalCost
}: QRCodeModalProps) => {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState<string>('');

  const handleDownload = () => {
    setShowDownloadModal(true);
  };

  useEffect(() => {
    if (showDownloadModal) {
      handleConfirmDownload();
    }
  }, [showDownloadModal]);

  const handleConfirmDownload = async () => {
    try {
      setIsDownloading(true);
      const svg = document.getElementById('qr-code-svg-instructions');
      if (!svg) {
        message.error('QR code not found');
        return;
      }

      // Create a canvas with padding and background
      const padding = 40;
      const canvas = document.createElement('canvas');
      const svgWidth = svg.clientWidth || 200;
      const svgHeight = svg.clientHeight || 200;
      canvas.width = svgWidth + (padding * 2);
      canvas.height = svgHeight + (padding * 2);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        message.error('Could not create image');
        return;
      }

      // Fill white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Convert SVG to image
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      
      // Create a promise to handle the image loading
      await new Promise((resolve, reject) => {
        img.onload = async () => {
          try {
            // Draw image with padding
            ctx.drawImage(img, padding, padding, svgWidth, svgHeight);
            
            // Convert to blob and handle download/share
            const blob = await new Promise<Blob | null>((resolve) => {
              canvas.toBlob(resolve, 'image/png');
            });

            if (!blob) {
              reject(new Error('Could not create image file'));
              return;
            }

            // Check if running on iOS
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            
            if (isIOS) {
              // For iOS: Create data URL for the image
              const imageUrl = URL.createObjectURL(blob);
              setQrCodeImageUrl(imageUrl);
            } else {
              // For other devices: Normal download
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `promptpay-${promptPayNumber}.png`;
              link.click();
              window.URL.revokeObjectURL(url);
              message.success('QR code downloaded successfully');
              setShowDownloadModal(false);
            }

            resolve(true);
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => reject(new Error('Failed to load QR code'));

        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.src = url;
        setTimeout(() => URL.revokeObjectURL(url), 100);
      });

    } catch (error) {
      console.error('Error downloading QR:', error);
      message.error('Failed to download QR code');
      setShowDownloadModal(false);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadModalClose = () => {
    if (qrCodeImageUrl) {
      URL.revokeObjectURL(qrCodeImageUrl);
    }
    setShowDownloadModal(false);
    setQrCodeImageUrl('');
  };

  const allPlayersHaveSameAmount = playerCosts.every(cost => cost.total === playerCosts[0].total);
  const individualAmount = allPlayersHaveSameAmount ? playerCosts[0].total : null;

  return (
    <>
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
                id="qr-code-svg"
                value={qrPayload}
                size={256}
                level="L"
                style={{ margin: '1rem' }}
              />
            </div>
            <Button 
              type="primary" 
              onClick={handleDownload}
              icon={isDownloading ? <Spin className="mr-2" /> : <DownloadOutlined />}
              disabled={isDownloading}
              className="w-48"
            >
              {isDownloading ? 'Downloading...' : 'Download QR Code'}
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

      <Modal
        title="Download QR Code"
        open={showDownloadModal}
        onCancel={handleDownloadModalClose}
        footer={[
          <Button 
            key="done" 
            type="primary" 
            onClick={handleDownloadModalClose}
            block
          >
            Done
          </Button>
        ]}
        centered
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          {qrCodeImageUrl ? (
            <img 
              src={qrCodeImageUrl} 
              alt="PromptPay QR Code" 
              style={{ 
                maxWidth: '100%', 
                height: 'auto',
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '8px'
              }}
            />
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg flex justify-center">
              <div 
                style={{ 
                  width: '200px', 
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  borderRadius: '8px'
                }}
              >
                <QRCodeSVG
                  id="qr-code-svg-instructions"
                  value={qrPayload}
                  size={180}
                  level="L"
                  style={{ margin: '1rem' }}
                />
              </div>
            </div>
          )}
          <Typography.Text strong className="text-center">
            Press and hold the QR code image, then tap "Save Image" to download it to your Photos.
          </Typography.Text>
        </div>
      </Modal>
    </>
  );
}; 