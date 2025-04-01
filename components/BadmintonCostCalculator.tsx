import { useState } from 'react';
import { Input, Button, List, Typography, Space, Divider } from 'antd';
import { ArrowLeftOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { PlayerStats, CourtFee, Shuttlecock, CustomExpense, BadmintonCostCalculatorProps } from '@/interface';
import { CostBreakdown } from './BadmintonCalculator/CostBreakdown';
import { AdditionalExpenses } from './BadmintonCalculator/AdditionalExpenses';
import { CourtFeeSection } from './BadmintonCalculator/CourtFeeSection';
import { ShuttlecockSection } from './BadmintonCalculator/ShuttlecockSection';
import { PromptPaySection } from './BadmintonCalculator/PromptPaySection';
import { PlayerListWithHours } from './BadmintonCalculator/PlayerListWithHours';
import { calculatePlayerCosts, calculateTotalCost } from '@/utils/calculatorLogic';

export const BadmintonCostCalculator = ({
  isVisible,
  onClose,
  players: initialPlayers,
  onBackToResults
}: BadmintonCostCalculatorProps) => {
  const [players, setPlayers] = useState<PlayerStats[]>(initialPlayers);
  const [courtFee, setCourtFee] = useState<CourtFee>({
    hourlyRate: 0,
    hours: 0
  });
  const [shuttlecock, setShuttlecock] = useState<Shuttlecock>({
    quantity: 0,
    pricePerPiece: 0
  });
  const [customExpenses, setCustomExpenses] = useState<CustomExpense[]>([]);

  const playerCosts = calculatePlayerCosts(players, courtFee, shuttlecock, customExpenses);
  const totalCost = calculateTotalCost(courtFee, shuttlecock, customExpenses, players.length);

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
          <PlayerListWithHours
            players={players}
            onPlayersChange={setPlayers}
          />

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
            courtFee={courtFee}
            shuttlecock={shuttlecock}
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