import { Modal } from 'antd';
import { FinishConfirmationProps } from '@/interface';

export const FinishConfirmation = ({ isVisible, onClose, onConfirm }: FinishConfirmationProps) => {
  return (
    <Modal
      title="Finish Tournament"
      open={isVisible}
      onCancel={onClose}
      onOk={onConfirm}
      okText="Yes, Finish Tournament"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
    >
      <p className="text-lg font-bold mb-2">Are you sure you want to finish the tournament?</p>
      <p className="font-bold mb-2">This will:</p>
      <ul className="list-none pl-0">
        <li className="flex items-center mb-2">
          <span className="text-lg mr-2">•</span>
          <strong>Calculate final rankings</strong>&nbsp;for all players
        </li>
        <li className="flex items-center mb-2">
          <span className="text-lg mr-2">•</span>
          <strong>Show the tournament results</strong>&nbsp;with statistics
        </li>
        <li className="flex items-center mb-2">
          <span className="text-lg mr-2">•</span>
          <strong>Stop any further matches</strong>&nbsp;in this tournament
        </li>
      </ul>
    </Modal>
  );
}; 