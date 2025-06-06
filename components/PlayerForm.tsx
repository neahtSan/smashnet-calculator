import { Modal, Form, Input, Button, message } from 'antd';
import { Player, PlayerFormComponentProps } from '@/interface';
import { MAX_PLAYERS } from '@/utils/groupPlayer';

export const PlayerForm = ({
  isVisible,
  onClose,
  onSubmit,
  editingPlayer,
  players
}: PlayerFormComponentProps) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: { name: string }) => {
    onSubmit(values.name);
    form.resetFields(); // Reset form after submission
  };

  return (
    <Modal
      title={editingPlayer ? "Edit Player" : "Add Player"}
      open={isVisible}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{ name: editingPlayer?.name }}
      >
        <Form.Item
          name="name"
          rules={[
            { required: true, message: 'Please enter player name' },
            { max: 16, message: 'Name cannot exceed 16 characters' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const isDuplicate = players.some(
                  p => p.name.toLowerCase() === value.toLowerCase() && p.id !== editingPlayer?.id
                );
                if (isDuplicate) {
                  return Promise.reject('A player with this name already exists');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Input
            placeholder="Enter player name"
            maxLength={16}
            showCount
            status={form.getFieldError('name').length > 0 ? 'error' : undefined}
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {editingPlayer ? "Update" : "Add"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}; 