import { useState } from 'react';
import { Input, Button, List, Typography, Space, Divider } from 'antd';
import { ArrowLeftOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { PlayerStats, CourtFee, Shuttlecock, CustomExpense, BadmintonCostCalculatorProps } from '@/interface';
import { CostBreakdown } from './BadmintonCalculator/CostBreakdown';
import { AdditionalExpenses } from './BadmintonCalculator/AdditionalExpenses';
import { CourtFeeSection } from './BadmintonCalculator/CourtFeeSection';
import { ShuttlecockSection } from './BadmintonCalculator/ShuttlecockSection';
import { PromptPaySection } from './BadmintonCalculator/PromptPaySection';

export const BadmintonCostCalculator = ({
  isVisible,
  onClose,
  players: initialPlayers,
  onBackToResults
}: BadmintonCostCalculatorProps) => {
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

  const totalCourtFee = courtFee.hourlyRate * courtFee.hours;
  const totalShuttlecockCost = shuttlecock.quantity * shuttlecock.pricePerPiece;
  const sharedCost = totalCourtFee + totalShuttlecockCost;
  const sharedCostPerPlayer = players.length > 0 ? sharedCost / players.length : 0;
  
  // Calculate individual costs including custom expenses and unassigned expenses
  const playerCosts = players.map(player => {
    // Get expenses specifically assigned to this player
    const assignedExpenses = customExpenses
      .filter(expense => expense.assignedTo.includes(player.name))
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    // Get unassigned expenses
    const unassignedExpenses = customExpenses.filter(expense => expense.assignedTo.length === 0);
    
    // Calculate shared unassigned expenses
    const sharedUnassignedExpenses = unassignedExpenses
      .filter(expense => expense.isShared)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const sharedUnassignedExpensesPerPlayer = players.length > 0 ? sharedUnassignedExpenses / players.length : 0;
    
    // Calculate full unassigned expenses (each player pays full amount)
    const fullUnassignedExpenses = unassignedExpenses
      .filter(expense => !expense.isShared)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      name: player.name,
      sharedCost: sharedCostPerPlayer,
      customExpenses: assignedExpenses + sharedUnassignedExpensesPerPlayer + fullUnassignedExpenses,
      total: sharedCostPerPlayer + assignedExpenses + sharedUnassignedExpensesPerPlayer + fullUnassignedExpenses
    };
  });

  const totalCustomExpenses = customExpenses.reduce((sum, expense) => {
    // For unassigned expenses that are not shared, multiply by number of players
    if (expense.assignedTo.length === 0 && !expense.isShared) {
      return sum + (expense.amount * players.length);
    }
    return sum + expense.amount;
  }, 0);
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

          <CourtFeeSection 
            courtFee={courtFee}
            onCourtFeeChange={setCourtFee}
          />

          <Divider />

          <ShuttlecockSection 
            shuttlecock={shuttlecock}
            onShuttlecockChange={setShuttlecock}
          />

          <Divider />

          <AdditionalExpenses
            customExpenses={customExpenses}
            players={players}
            onCustomExpensesChange={setCustomExpenses}
          />

          <Divider />

          <CostBreakdown
            players={players}
            sharedCost={sharedCost}
            customExpenses={customExpenses}
            totalCost={totalCost}
          />

          <Divider />

          <PromptPaySection
            playerCosts={playerCosts}
            totalCost={totalCost}
          />
        </div>
      </div>
    </div>
  );
}; 