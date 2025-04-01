import { Modal, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface VerificationModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  promptPayNumber: string;
}

export const VerificationModal = ({
  visible,
  onCancel,
  onConfirm,
  promptPayNumber
}: VerificationModalProps) => {
  return (
    <Modal
      title="Verify PromptPay Number"
      open={visible}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Confirm & Generate QR"
      cancelText="Cancel"
      centered
    >
      <div className="space-y-4">
        <Typography.Paragraph>
          Please verify your PromptPay number before generating the QR code:
        </Typography.Paragraph>

        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start">
            <ExclamationCircleOutlined className="text-yellow-500 mt-1" />
            <div className="ml-3">
              <Typography.Text strong className="text-lg block">
                {promptPayNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
              </Typography.Text>
              <Typography.Text type="warning" className="block mt-1">
                Please ensure this number is correct. The QR code will be generated for this PromptPay number.
              </Typography.Text>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}; 