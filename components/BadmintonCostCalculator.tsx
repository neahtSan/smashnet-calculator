import { useState } from 'react';
import { Modal, Form, Input, Button, InputNumber, List, Typography, Space, Divider } from 'antd';
import { DeleteOutlined, PlusOutlined, QrcodeOutlined, ShareAltOutlined } from '@ant-design/icons';
import { PlayerStats } from '@/types/interface';

interface BadmintonCostCalculatorProps {
  isVisible: boolean;
  onClose: () => void;
  players: PlayerStats[];
}

interface CourtFee {
  hourlyRate: number;
  hours: number;
}

interface Shuttlecock {
  quantity: number;
  pricePerPiece: number;
}

interface CustomExpense {
  id: string;
  name: string;
  amount: number;
}

export const BadmintonCostCalculator = ({
  isVisible,
  onClose,
  players
}: BadmintonCostCalculatorProps) => {
  const [form] = Form.useForm();
  const [courtFee, setCourtFee] = useState<CourtFee>({
    hourlyRate: 0,
    hours: 0
  });
  const [shuttlecock, setShuttlecock] = useState<Shuttlecock>({
    quantity: 0,
    pricePerPiece: 0
  });
  const [customExpenses, setCustomExpenses] = useState<CustomExpense[]>([]);
  const [promptPayNumber, setPromptPayNumber] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const totalCourtFee = courtFee.hourlyRate * courtFee.hours;
  const totalShuttlecockCost = shuttlecock.quantity * shuttlecock.pricePerPiece;
  const totalCustomExpenses = customExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalCost = totalCourtFee + totalShuttlecockCost + totalCustomExpenses;
  const costPerPlayer = players.length > 0 ? totalCost / players.length : 0;

  const handleAddCustomExpense = () => {
    const newExpense: CustomExpense = {
      id: Date.now().toString(),
      name: 'Expense',
      amount: 0
    };
    setCustomExpenses([...customExpenses, newExpense]);
  };

  const handleDeleteCustomExpense = (id: string) => {
    setCustomExpenses(customExpenses.filter(expense => expense.id !== id));
  };

  const handleCustomExpenseChange = (id: string, field: 'name' | 'amount', value: string | number) => {
    setCustomExpenses(customExpenses.map(expense =>
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  const handleGenerateQR = () => {
    // TODO: Implement QR code generation
    console.log('Generating QR code for:', promptPayNumber, costPerPlayer);
  };

  return (
    <Modal
      title="Badminton Cost Calculator"
      open={isVisible}
      onCancel={onClose}
      width="90%"
      style={{ maxWidth: '800px', top: '20px' }}
      footer={null}
    >
      <div className="space-y-6">
        <div>
          <Typography.Title level={5}>Players ({players.length})</Typography.Title>
          <List
            size="small"
            dataSource={players}
            renderItem={player => (
              <List.Item>
                <Typography.Text>{player.name}</Typography.Text>
              </List.Item>
            )}
          />
        </div>

        <Divider />

        <div>
          <Typography.Title level={5}>Court Fee</Typography.Title>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Typography.Text className="mb-1 block text-sm">Court Rate per Hour</Typography.Text>
              <InputNumber
                placeholder="Enter court rate per hour"
                value={courtFee.hourlyRate || null}
                onChange={value => setCourtFee({ ...courtFee, hourlyRate: value || 0 })}
                className="w-full [&_input]:!outline-none [&_input]:!ring-0"
                prefix="฿"
                min={0}
                onFocus={(e) => {
                  e.target.select();
                  if (courtFee.hourlyRate === 0) {
                    setCourtFee({ ...courtFee, hourlyRate: 0 });
                  }
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    setCourtFee({ ...courtFee, hourlyRate: 0 });
                  }
                }}
              />
            </div>
            <div className="flex-1">
              <Typography.Text className="mb-1 block text-sm">Number of Hours</Typography.Text>
              <InputNumber
                placeholder="Enter number of hours"
                value={courtFee.hours || null}
                onChange={value => setCourtFee({ ...courtFee, hours: value || 0 })}
                className="w-full [&_input]:!outline-none [&_input]:!ring-0"
                min={0}
                step={0.5}
                onFocus={(e) => {
                  e.target.select();
                  if (courtFee.hours === 0) {
                    setCourtFee({ ...courtFee, hours: 0 });
                  }
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    setCourtFee({ ...courtFee, hours: 0 });
                  }
                }}
              />
            </div>
          </div>
          <div className="mt-2 text-right">
            <Typography.Text type="secondary">
              Total Court Fee: ฿{totalCourtFee.toFixed(2)}
            </Typography.Text>
          </div>
        </div>

        <Divider />

        <div>
          <Typography.Title level={5}>Shuttlecock</Typography.Title>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Typography.Text className="mb-1 block text-sm">Shuttlecock Price</Typography.Text>
              <InputNumber
                placeholder="Enter price per shuttlecock"
                value={shuttlecock.pricePerPiece || null}
                onChange={value => setShuttlecock({ ...shuttlecock, pricePerPiece: value || 0 })}
                className="w-full [&_input]:!outline-none [&_input]:!ring-0"
                prefix="฿"
                min={0}
                onFocus={(e) => {
                  e.target.select();
                  if (shuttlecock.pricePerPiece === 0) {
                    setShuttlecock({ ...shuttlecock, pricePerPiece: 0 });
                  }
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    setShuttlecock({ ...shuttlecock, pricePerPiece: 0 });
                  }
                }}
              />
            </div>
            <div className="flex-1">
              <Typography.Text className="mb-1 block text-sm">Number of Shuttlecocks</Typography.Text>
              <InputNumber
                placeholder="Enter number of shuttlecocks used"
                value={shuttlecock.quantity || null}
                onChange={value => setShuttlecock({ ...shuttlecock, quantity: value || 0 })}
                className="w-full [&_input]:!outline-none [&_input]:!ring-0"
                min={0}
                onFocus={(e) => {
                  e.target.select();
                  if (shuttlecock.quantity === 0) {
                    setShuttlecock({ ...shuttlecock, quantity: 0 });
                  }
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    setShuttlecock({ ...shuttlecock, quantity: 0 });
                  }
                }}
              />
            </div>
          </div>
          <div className="mt-2 text-right">
            <Typography.Text type="secondary">
              Total Shuttlecock Cost: ฿{totalShuttlecockCost.toFixed(2)}
            </Typography.Text>
          </div>
        </div>

        <Divider />

        <div>
          <Typography.Title level={5}>Additional Expenses</Typography.Title>
          {customExpenses.map(expense => (
            <div key={expense.id} className="flex items-center gap-2 mb-2">
              <Input
                placeholder="Enter expense name"
                value={expense.name}
                onChange={e => handleCustomExpenseChange(expense.id, 'name', e.target.value)}
                className="flex-1 [&_input]:!outline-none [&_input]:!ring-0"
                onFocus={(e) => {
                  e.target.select();
                  handleCustomExpenseChange(expense.id, 'name', '');
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    handleCustomExpenseChange(expense.id, 'name', 'Expense');
                  }
                }}
              />
              <InputNumber
                placeholder="Enter amount"
                value={expense.amount || null}
                onChange={value => handleCustomExpenseChange(expense.id, 'amount', value || 0)}
                className="w-32 [&_input]:!outline-none [&_input]:!ring-0"
                prefix="฿"
                min={0}
                onFocus={(e) => {
                  e.target.select();
                  if (expense.amount === 0) {
                    handleCustomExpenseChange(expense.id, 'amount', 0);
                  }
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    handleCustomExpenseChange(expense.id, 'amount', 0);
                  }
                }}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteCustomExpense(expense.id)}
              />
            </div>
          ))}
          <Button
            type="dashed"
            onClick={handleAddCustomExpense}
            icon={<PlusOutlined />}
            className="w-full mt-2"
          >
            Add Expense
          </Button>
          {customExpenses.length > 0 && (
            <div className="mt-2 text-right">
              <Typography.Text type="secondary">
                Total Additional Expenses: ฿{totalCustomExpenses.toFixed(2)}
              </Typography.Text>
            </div>
          )}
        </div>

        <Divider />

        <div>
          <Typography.Title level={5}>Summary</Typography.Title>
          <Space direction="vertical" className="w-full">
            <div className="flex justify-between">
              <Typography.Text>Court Fee:</Typography.Text>
              <Typography.Text>฿{totalCourtFee.toFixed(2)}</Typography.Text>
            </div>
            <div className="flex justify-between">
              <Typography.Text>Shuttlecock Cost:</Typography.Text>
              <Typography.Text>฿{totalShuttlecockCost.toFixed(2)}</Typography.Text>
            </div>
            {customExpenses.length > 0 && (
              <div className="flex justify-between">
                <Typography.Text>Additional Expenses:</Typography.Text>
                <Typography.Text>฿{totalCustomExpenses.toFixed(2)}</Typography.Text>
              </div>
            )}
            <Divider className="my-2" />
            <div className="flex justify-between">
              <Typography.Text strong>Total Cost:</Typography.Text>
              <Typography.Text strong>฿{totalCost.toFixed(2)}</Typography.Text>
            </div>
            <div className="flex justify-between">
              <Typography.Text strong type="success">Cost per Player:</Typography.Text>
              <Typography.Text strong type="success">฿{costPerPlayer.toFixed(2)}</Typography.Text>
            </div>
          </Space>
        </div>

        <Divider />

        <div>
          <Typography.Title level={5}>PromptPay QR Code</Typography.Title>
          <Space.Compact className="w-full">
            <Input
              placeholder="Enter your PromptPay number"
              value={promptPayNumber}
              onChange={e => setPromptPayNumber(e.target.value)}
            />
            <Button
              type="primary"
              icon={<QrcodeOutlined />}
              onClick={handleGenerateQR}
            >
              Generate QR
            </Button>
          </Space.Compact>
          {qrCodeUrl && (
            <div className="mt-4 text-center">
              <img src={qrCodeUrl} alt="PromptPay QR Code" className="mx-auto" />
              <Button
                type="link"
                icon={<ShareAltOutlined />}
                onClick={() => {/* TODO: Implement sharing */}}
              >
                Share QR Code
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}; 