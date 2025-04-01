import { Typography, Space, Divider } from 'antd';
import { PlayerStats, CustomExpense, CourtFee, Shuttlecock, CostBreakdownProps } from '@/interface';
import { calculateTotalPlayerHours, calculateTotalCustomExpenses, calculatePlayerCosts } from '@/utils/calculatorLogic';

export const CostBreakdown = ({ 
  players, 
  courtFee,
  shuttlecock,
  customExpenses, 
  totalCost 
}: CostBreakdownProps) => {
  const totalPlayerHours = calculateTotalPlayerHours(players);
  const totalCustomExpenses = calculateTotalCustomExpenses(customExpenses, players.length);
  const playerCosts = calculatePlayerCosts(players, courtFee, shuttlecock, customExpenses);
  const totalCourtFee = courtFee.hourlyRate * courtFee.hours;

  return (
    <>
      <div>
        <Typography.Title level={5}>Cost Breakdown</Typography.Title>
        <Space direction="vertical" className="w-full">
          {totalPlayerHours > 0 && (
            <div className="flex justify-between">
              <Typography.Text>Total Player Hours:</Typography.Text>
              <Typography.Text>{totalPlayerHours.toFixed(1)} hours</Typography.Text>
            </div>
          )}
          <div className="flex justify-between">
            <Typography.Text>Court Cost:</Typography.Text>
            <Typography.Text>฿{totalCourtFee.toFixed(2)}</Typography.Text>
          </div>
          <div className="flex justify-between">
            <Typography.Text>Shuttlecock Cost:</Typography.Text>
            <Typography.Text>฿{(shuttlecock.quantity * shuttlecock.pricePerPiece).toFixed(2)}</Typography.Text>
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
                {cost.hours !== undefined && cost.hours > 0 && (
                  <Typography.Text type="secondary" className="ml-2">
                    ({cost.hours} hrs)
                  </Typography.Text>
                )}
                {cost.customExpenses > 0 && (
                  <Typography.Text type="secondary" className="ml-2">
                    (+฿{cost.customExpenses.toFixed(2)})
                  </Typography.Text>
                )}
              </div>
              <Typography.Text strong type="success">
                ฿{Math.ceil(cost.total)}
              </Typography.Text>
            </div>
          ))}
          <Divider className="my-2" />
          <div className="flex justify-between items-center">
            <Typography.Text strong>Total Cost (Round up):</Typography.Text>
            <Typography.Text strong type="success">
              ฿{playerCosts.reduce((sum, cost) => sum + Math.ceil(cost.total), 0)}
            </Typography.Text>
          </div>
        </Space>
      </div>
    </>
  );
}; 