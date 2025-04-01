import { useState, useEffect } from 'react';
import { Form, Input, Button, InputNumber, List, Typography, Space, Divider, Select, Modal } from 'antd';
import { DeleteOutlined, PlusOutlined, QrcodeOutlined, ShareAltOutlined, ArrowLeftOutlined, UserAddOutlined, UserDeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { PlayerStats, CourtFee, Shuttlecock, CustomExpense, BadmintonCostCalculatorProps } from '@/interface';
import { QRCodeSVG } from 'qrcode.react';
import generatePayload from 'promptpay-qr';

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
  const [promptPayNumber, setPromptPayNumber] = useState<string>('');
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<{ amount?: number; message?: string } | null>(null);
  const [isValidPromptPay, setIsValidPromptPay] = useState(false);
  const [verifyNumberVisible, setVerifyNumberVisible] = useState(false);

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

  const calculateTotalCost = (values: any) => {
    const courtFee = values.courtFee || { hourlyRate: 0, hours: 0 };
    const shuttlecock = values.shuttlecock || { quantity: 0, pricePerPiece: 0 };
    const customExpenses = values.customExpenses || [];

    const totalCourtFee = courtFee.hourlyRate * courtFee.hours;
    const totalShuttlecock = shuttlecock.quantity * shuttlecock.pricePerPiece;
    const totalCustomExpenses = customExpenses.reduce((sum: number, expense: CustomExpense) => sum + expense.amount, 0);

    return totalCourtFee + totalShuttlecock + totalCustomExpenses;
  };

  const calculatePlayerCost = (values: any, playerName: string) => {
    const totalCost = calculateTotalCost(values);
    const customExpenses = values.customExpenses || [];
    
    // Calculate player's share of custom expenses
    const playerCustomExpenses = customExpenses.reduce((sum: number, expense: CustomExpense) => {
      if (expense.assignedTo.includes(playerName)) {
        return sum + (expense.amount / expense.assignedTo.length);
      }
      return sum;
    }, 0);

    // Calculate player's share of common expenses (court fee and shuttlecock)
    const commonExpenses = totalCost - playerCustomExpenses;
    const commonExpenseShare = commonExpenses / players.length;

    return commonExpenseShare + playerCustomExpenses;
  };

  const handleGenerateQRCode = () => {
    // Show verification modal first
    setVerifyNumberVisible(true);
  };

  const handleVerifyAndGenerate = () => {
    setVerifyNumberVisible(false);
    
    // Check if all players have the same cost
    const hasDifferentCosts = playerCosts.some(cost => 
      Math.abs(cost.total - playerCosts[0].total) > 0.01
    );

    if (hasDifferentCosts) {
      const message = playerCosts.map(cost => 
        `${cost.name}: ${cost.total.toFixed(2)} THB`
      ).join('\n');
      
      setQrCodeData({ message });
    } else {
      setQrCodeData({ amount: playerCosts[0].total });
    }
    
    setQrCodeVisible(true);
  };

  const generateQRPayload = () => {
    if (!qrCodeData || !promptPayNumber) return '';
    
    if (qrCodeData.amount) {
      // Generate QR with amount
      return generatePayload(promptPayNumber, { amount: qrCodeData.amount });
    } else {
      // For different amounts, show 0 amount since players need to pay different amounts
      return generatePayload(promptPayNumber, { amount: 0 });
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'promptpay-qr.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const formatPhoneNumber = (input: string): string => {
    try {
      // Remove all non-digit characters
      const digitsOnly = input.replace(/\D/g, '');
      
      // If it starts with '66', replace with '0'
      if (digitsOnly.startsWith('66')) {
        return '0' + digitsOnly.slice(2);
      }
      
      // If it starts with '+66', replace with '0'
      if (digitsOnly.startsWith('66')) {
        return '0' + digitsOnly.slice(2);
      }
      
      return digitsOnly;
    } catch (error) {
      return input;
    }
  };

  const validatePromptPay = (number: string): boolean => {
    // Must be exactly 10 digits
    if (number.length !== 10) return false;

    // Must start with '0'
    if (!number.startsWith('0')) return false;

    // Second digit must be 6, 8, 9 for mobile numbers
    const secondDigit = parseInt(number[1]);
    if (![6, 8, 9].includes(secondDigit)) return false;

    // Must contain only digits
    if (!/^\d+$/.test(number)) return false;

    return true;
  };

  const handlePromptPayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPromptPayNumber(formattedNumber);
    setIsValidPromptPay(validatePromptPay(formattedNumber));
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
                  autoComplete="off"
                  autoFocus={false}
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
                onChange={handlePromptPayChange}
                status={promptPayNumber && !isValidPromptPay ? 'error' : undefined}
                maxLength={10}
                pattern="[0-9]*"
                type="tel"
              />
              <Button
                type="primary"
                icon={<QrcodeOutlined />}
                onClick={handleGenerateQRCode}
                disabled={!isValidPromptPay}
              >
                Generate QR Code
              </Button>
            </Space.Compact>
            {promptPayNumber && !isValidPromptPay && (
              <Typography.Text type="danger" className="mt-1 block text-sm">
                Please enter a valid Thai phone number
              </Typography.Text>
            )}
          </div>
        </div>
      </div>

      {/* Phone Number Verification Modal */}
      <Modal
        title="Verify PromptPay Number"
        open={verifyNumberVisible}
        onCancel={() => setVerifyNumberVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setVerifyNumberVisible(false)}>
            Cancel
          </Button>,
          <Button key="confirm" type="primary" onClick={handleVerifyAndGenerate}>
            Confirm & Generate QR
          </Button>
        ]}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ExclamationCircleOutlined className="text-warning text-xl" />
            <Typography.Text>Please verify your PromptPay number:</Typography.Text>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <Typography.Title level={3} className="!mb-1">
              {promptPayNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
            </Typography.Title>
            <Typography.Text type="secondary">
              Make sure this is the correct number to receive payment
            </Typography.Text>
          </div>
        </div>
      </Modal>

      {/* Existing QR Code Modal */}
      <Modal
        title="PromptPay QR Code"
        open={qrCodeVisible}
        onCancel={() => setQrCodeVisible(false)}
        footer={[
          <Button key="download" onClick={handleDownloadQR}>
            Download QR Code
          </Button>,
          <Button key="close" onClick={() => setQrCodeVisible(false)}>
            Close
          </Button>
        ]}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              PromptPay Number
            </label>
            <Input
              value={promptPayNumber}
              onChange={handlePromptPayChange}
              placeholder="Enter PromptPay number"
              maxLength={10}
              pattern="[0-9]*"
              type="tel"
              status={promptPayNumber && !isValidPromptPay ? 'error' : undefined}
            />
            {promptPayNumber && !isValidPromptPay && (
              <Typography.Text type="danger" className="mt-1 block text-sm">
                Please enter a valid Thai phone number
              </Typography.Text>
            )}
          </div>

          {promptPayNumber && isValidPromptPay && (
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg shadow-lg">
                <QRCodeSVG
                  id="qr-code-svg"
                  value={generateQRPayload()}
                  size={256}
                  level="L"
                  includeMargin={true}
                />
              </div>
            </div>
          )}

          {qrCodeData?.message && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <Typography.Title level={5}>Payment Details:</Typography.Title>
              <pre className="whitespace-pre-wrap">{qrCodeData.message}</pre>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}; 