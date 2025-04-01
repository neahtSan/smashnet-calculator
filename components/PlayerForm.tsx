import { Modal, Form, Input } from 'antd';
import { Player } from '@/types/interface';
import { MAX_PLAYERS } from '@/utils/groupPlayer';

interface PlayerFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  editingPlayer?: Player;
  players: Player[];
}

export const PlayerForm = ({ isVisible, onClose, onSubmit, editingPlayer, players }: PlayerFormProps) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit(values.name);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={editingPlayer ? 'Edit Player' : 'Add Player'}
      open={isVisible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okButtonProps={{
        disabled: !editingPlayer && players.length >= MAX_PLAYERS
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ name: editingPlayer?.name || '' }}
      >
        <Form.Item
          name="name"
          label="Player Name"
          rules={[
            { required: true, message: 'Please enter a name' },
            { max: 16, message: 'Name cannot exceed 16 characters' },
            {
              validator: (_, value) => {
                if (!value || editingPlayer?.name === value) return Promise.resolve();
                const nameExists = players.some(p => p.name === value);
                return nameExists
                  ? Promise.reject('This name is already taken')
                  : Promise.resolve();
              }
            }
          ]}
        >
          <Input 
            maxLength={16} 
            style={{ fontSize: '16px' }}
            showCount
            status={form.getFieldError('name').length > 0 ? 'error' : ''}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}; 