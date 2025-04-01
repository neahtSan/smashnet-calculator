import { Typography, Space, Divider } from 'antd';
import { PlayerStats, CustomExpense } from '@/interface';

interface CostBreakdownProps {
  players: PlayerStats[];
  sharedCost: number;
  customExpenses: CustomExpense[];
  totalCost: number;
}

interface PlayerCost {
  name: string;
  sharedCost: number;
  customExpenses: number;
  total: number;
}

export const CostBreakdown = ({ 
  players, 
  sharedCost, 
  customExpenses, 
  totalCost 
}: CostBreakdownProps) => {
  const sharedCostPerPlayer = players.length > 0 ? sharedCost / players.length : 0;
  const totalCustomExpenses = customExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const playerCosts: PlayerCost[] = players.map(player => {
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

  return (
    <>
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
    </>
  );
}; 