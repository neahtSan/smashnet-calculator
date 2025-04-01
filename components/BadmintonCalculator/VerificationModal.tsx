import { Modal, Typography, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { VerificationModalProps } from '@/interface/qrcode';

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
      closable={false}
      maskClosable={false}
      centered
      className="verification-modal"
      footer={
        <div className="flex justify-between gap-4">
          <Button 
            danger 
            onClick={onCancel}
            className="px-8 h-10 text-base"
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            onClick={onConfirm}
            className="px-8 h-10 text-base"
          >
            Confirm
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined className="text-blue-500 text-xl" />
          <Typography.Text strong>Please verify your PromptPay number:</Typography.Text>
        </div>
        <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <div className="ml-3">
              <Typography.Title level={3} className="!mb-2 text-blue-600">
                {promptPayNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
              </Typography.Title>
              <Typography.Text className="block mt-1 text-blue-600">
                Make sure this is the correct number to receive payment
              </Typography.Text>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}; 