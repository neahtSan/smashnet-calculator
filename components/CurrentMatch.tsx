import { Card, Button } from 'antd';
import { UndoOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Match, CurrentMatchProps } from '@/interface';

export const CurrentMatch = ({
  match,
  matchNumber,
  selectedWinner,
  onSelectWinner,
  onConfirmWinner,
  onRevertMatch,
  showRevert = false,
}: CurrentMatchProps) => {
  if (!match.team1 || !match.team2 || 
      !match.team1[0] || !match.team1[1] || 
      !match.team2[0] || !match.team2[1]) {
    console.error('Invalid match data:', match);
    return null;
  }

  return (
    <Card 
      title={
        <div className="flex justify-between items-center">
          <span>Match {matchNumber}</span>
          {showRevert && !match.winner && (
            <Button
              icon={<UndoOutlined />}
              onClick={() => onRevertMatch?.(match.id)}
              type="text"
              className="text-gray-500 hover:text-blue-500"
            />
          )}
        </div>
      }
      className="shadow-md mb-4"
      bodyStyle={{ padding: '12px' }}
    >
      <div className="space-y-3">
        {/* Team 1 Selection */}
        <div 
          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            selectedWinner === 'team1' 
              ? 'bg-green-50 border-2 border-green-500' 
              : 'bg-gray-50 border-2 border-transparent hover:border-blue-300'
          }`}
          onClick={() => !match.winner && onSelectWinner('team1')}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 text-sm">Team 1</h3>
            {selectedWinner === 'team1' && (
              <CheckCircleFilled className="text-green-500 text-base" />
            )}
          </div>
          <p className="text-gray-600 text-sm mt-1">{match.team1[0].name} & {match.team1[1].name}</p>
        </div>

        {/* Team 2 Selection */}
        <div 
          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            selectedWinner === 'team2' 
              ? 'bg-green-50 border-2 border-green-500' 
              : 'bg-gray-50 border-2 border-transparent hover:border-blue-300'
          }`}
          onClick={() => !match.winner && onSelectWinner('team2')}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 text-sm">Team 2</h3>
            {selectedWinner === 'team2' && (
              <CheckCircleFilled className="text-green-500 text-base" />
            )}
          </div>
          <p className="text-gray-600 text-sm mt-1">{match.team2[0].name} & {match.team2[1].name}</p>
        </div>

        {/* Confirm Winner Button */}
        {!match.winner && (
          <Button 
            type="primary"
            onClick={() => onConfirmWinner(match.id)}
            disabled={!selectedWinner}
            className="w-full mt-3"
            style={{ 
              backgroundColor: selectedWinner ? '#52c41a' : undefined,
              opacity: selectedWinner ? 1 : 0.5
            }}
          >
            Confirm Winner
          </Button>
        )}

        {match.winner && (
          <div className="text-center text-green-600 font-semibold text-sm mt-3">
            {match.winner === 'team1' ? (
              <p>{match.team1[0].name} & {match.team1[1].name} won!</p>
            ) : (
              <p>{match.team2[0].name} & {match.team2[1].name} won!</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}; 