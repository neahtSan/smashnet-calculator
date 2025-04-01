import { Modal } from 'antd';

interface RevertMatchConfirmationProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const RevertMatchConfirmation = ({
  isVisible,
  onClose,
  onConfirm,
}: RevertMatchConfirmationProps) => {
  return (
    <Modal
      title="Revert Match"
      open={isVisible}
      onOk={onConfirm}
      onCancel={onClose}
      okText="Yes, Revert"
      cancelText="No, Keep Match"
      okButtonProps={{ danger: true }}
    >
      <p>Are you sure you want to revert to the previous match? This will:</p>
      <ul className="list-disc ml-6 mt-2">
        <li>Remove the current match</li>
        <li>Return to the previous match state</li>
        <li>This action cannot be undone</li>
      </ul>
    </Modal>
  );
}; 