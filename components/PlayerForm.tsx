import { Modal, Form, Input } from 'antd';
import { Player } from '@/types/interface';

interface PlayerFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string }) => void;
  editingPlayer: Player | null;
  players: Player[];
}

export const PlayerForm = ({
  isVisible,
  onClose,
  onSubmit,
  editingPlayer,
  players,
}: PlayerFormProps) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title={editingPlayer ? "Edit Player" : "Add Player"}
      open={isVisible}
      onOk={() => {
        form.validateFields().then(values => {
          form.resetFields();
          onSubmit(values);
        });
      }}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      okText={editingPlayer ? "Save Changes" : "Add Player"}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={editingPlayer ? { name: editingPlayer.name } : undefined}
      >
        <Form.Item
          name="name"
          label="Player Name"
          rules={[
            { required: true, message: 'Please enter player name' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                
                if (value.length >= 32) {
                  return Promise.reject('Player name cannot exceed 32 characters');
                }

                const isDuplicateName = players.some(p => 
                  (editingPlayer ? p.id !== editingPlayer.id : true) && 
                  p.name.toLowerCase() === value.toLowerCase()
                );
                
                return isDuplicateName ? Promise.reject('A player with this name already exists') : Promise.resolve();
              },
              validateTrigger: ['onChange', 'onBlur']
            }
          ]}
        >
          <Input 
            maxLength={32} 
            className="text-base" 
            style={{ fontSize: '16px' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}; 