import { useState } from 'react';
import { Form, Input, Button, InputNumber, List, Typography, Space, Divider, Select } from 'antd';
import { DeleteOutlined, PlusOutlined, QrcodeOutlined, ShareAltOutlined, ArrowLeftOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { PlayerStats, CourtFee, Shuttlecock, CustomExpense, BadmintonCostCalculatorProps } from '@/interface';

export const BadmintonCostCalculator = ({
  isVisible,
  onClose,
  players: initialPlayers,
  onBackToResults
}: BadmintonCostCalculatorProps) => {
  const [form] = Form.useForm();
  const [players, setPlayers] = useState<PlayerStats[]>(initialPlayers);
  const [newPlayerName, setNewPlayerName] = useState('');
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
  const sharedCost = totalCourtFee + totalShuttlecockCost;
  const sharedCostPerPlayer = players.length > 0 ? sharedCost / players.length : 0;
  
  // Calculate individual costs including custom expenses
  const playerCosts = players.map(player => {
    const playerCustomExpenses = customExpenses
      .filter(expense => expense.assignedTo.includes(player.name))
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      name: player.name,
      sharedCost: sharedCostPerPlayer,
      customExpenses: playerCustomExpenses,
      total: sharedCostPerPlayer + playerCustomExpenses
    };
  });

  const totalCustomExpenses = customExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalCost = sharedCost + totalCustomExpenses;

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, {
        name: newPlayerName.trim(),
        wins: 0,
        losses: 0,
        winRate: 0,
        totalMatches: 0,
        rank: players.length + 1
      }]);
      setNewPlayerName('');
    }
  };

  const handleRemovePlayer = (playerName: string) => {
    setPlayers(players.filter(player => player.name !== playerName));
  };

  const handleAddCustomExpense = () => {
    const newExpense: CustomExpense = {
      id: Date.now().toString(),
      name: 'Expense',
      amount: 0,
      assignedTo: []
    };
    setCustomExpenses([...customExpenses, newExpense]);
  };

  const handleDeleteCustomExpense = (id: string) => {
    setCustomExpenses(customExpenses.filter(expense => expense.id !== id));
  };

  const handleCustomExpenseChange = (
    id: string,
    field: 'name' | 'amount' | 'assignedTo',
    value: string | number | string[]
  ) => {
    setCustomExpenses(customExpenses.map(expense =>
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  const handleGenerateQR = () => {
    // TODO: Implement QR code generation
    console.log('Generating QR code for:', promptPayNumber, totalCost);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onBackToResults}
              className="!p-0"
            />
            <Typography.Title level={5} className="!m-0">Badminton Cost Calculator</Typography.Title>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Typography.Title level={5}>Players</Typography.Title>
              <Space>
                <Input
                  placeholder="New player name"
                  value={newPlayerName}
                  onChange={e => setNewPlayerName(e.target.value)}
                  className="w-40"
                  onPressEnter={handleAddPlayer}
                />
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={handleAddPlayer}
                >
                  Add
                </Button>
              </Space>
            </div>
            <List
              size="small"
              dataSource={players}
              renderItem={player => (
                <List.Item
                  actions={[
                    <Button
                      key="delete"
                      type="text"
                      danger
                      icon={<UserDeleteOutlined />}
                      onClick={() => handleRemovePlayer(player.name)}
                    />
                  ]}
                >
                  <Typography.Text>{player.name}</Typography.Text>
                </List.Item>
              )}
            />
            <div className="mt-2 text-center">
              <Typography.Text type="secondary">
                Total of {players.length} Players
              </Typography.Text>
            </div>
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
              <div key={expense.id} className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2">
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
                <Select
                  mode="multiple"
                  placeholder="Assign to players (optional)"
                  value={expense.assignedTo}
                  onChange={value => handleCustomExpenseChange(expense.id, 'assignedTo', value)}
                  className="w-full"
                  allowClear
                >
                  {players.map(player => (
                    <Select.Option key={player.name} value={player.name}>
                      {player.name}
                    </Select.Option>
                  ))}
                </Select>
                {expense.assignedTo.length > 0 && (
                  <Typography.Text type="secondary" className="text-sm">
                    Each selected player will pay ฿{expense.amount.toFixed(2)}
                  </Typography.Text>
                )}
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
            <Typography.Title level={5}>Cost Breakdown</Typography.Title>
            <Space direction="vertical" className="w-full">
              <div className="flex justify-between">
                <Typography.Text>Shared Costs:</Typography.Text>
                <Typography.Text>฿{sharedCost.toFixed(2)}</Typography.Text>
              </div>
              <div className="flex justify-between">
                <Typography.Text>Shared Cost per Player:</Typography.Text>
                <Typography.Text>฿{sharedCostPerPlayer.toFixed(2)}</Typography.Text>
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
            </Space>
          </div>

          <Divider />

          <div>
            <Typography.Title level={5}>Individual Costs</Typography.Title>
            <Space direction="vertical" className="w-full">
              {playerCosts.map(cost => (
                <div key={cost.name} className="flex justify-between items-center">
                  <div>
                    <Typography.Text strong>{cost.name}</Typography.Text>
                    {cost.customExpenses > 0 && (
                      <Typography.Text type="secondary" className="ml-2">
                        (+฿{cost.customExpenses.toFixed(2)})
                      </Typography.Text>
                    )}
                  </div>
                  <Typography.Text strong type="success">
                    ฿{cost.total.toFixed(2)}
                  </Typography.Text>
                </div>
              ))}
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
      </div>
    </div>
  );
}; 