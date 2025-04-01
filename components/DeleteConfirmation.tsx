import { Modal } from 'antd';

interface DeleteConfirmationProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmation = ({
  isVisible,
  onClose,
  onConfirm,
}: DeleteConfirmationProps) => {
  return (
    <Modal
      title="Delete Player"
      open={isVisible}
      onOk={onConfirm}
      onCancel={onClose}
      okText="Yes, Delete"
      cancelText="No, Keep Player"
      okButtonProps={{ danger: true }}
    >
      <p>Are you sure you want to delete this player? This will:</p>
      <ul className="list-disc ml-6 mt-2">
        <li>Remove the player from the tournament</li>
        <li>Remove any unfinished matches they are part of</li>
        <li>This action cannot be undone</li>
      </ul>
    </Modal>
  );
}; 