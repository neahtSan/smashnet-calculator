import { List, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Player } from '@/types/interface';

interface PlayerListProps {
  players: Player[];
  onEditPlayer: (player: Player) => void;
  onDeletePlayer: (playerId: string) => void;
}

export const PlayerList = ({ players, onEditPlayer, onDeletePlayer }: PlayerListProps) => {
  return (
    <List
      className="mb-4"
      dataSource={players}
      renderItem={player => (
        <List.Item
          className="bg-white rounded-lg mb-2 shadow-sm hover:shadow-md transition-shadow duration-200 p-3"
        >
          <div className="w-full">
            <div className="flex items-center mb-3 relative">
              <div className="absolute left-1/2 -translate-x-1/2">
                <div className="font-semibold text-base text-gray-800">
                  {player.name}
                </div>
              </div>
              <div className="flex gap-2 w-[72px] ml-auto">
                <Button 
                  key="edit" 
                  icon={<EditOutlined style={{ fontSize: '16px' }} />} 
                  onClick={() => onEditPlayer(player)}
                  className="flex items-center justify-center !w-8 !h-8 !min-w-0"
                />
                <Button 
                  key="delete" 
                  danger 
                  icon={<DeleteOutlined style={{ fontSize: '16px' }} />} 
                  onClick={() => onDeletePlayer(player.id)}
                  className="flex items-center justify-center !w-8 !h-8 !min-w-0"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded-md p-2 text-center">
                  <div className="text-gray-500 text-xs mb-1">Wins</div>
                  <div className="text-gray-800">{player.wins}</div>
                </div>
                <div className="bg-gray-50 rounded-md p-2 text-center">
                  <div className="text-gray-500 text-xs mb-1">Losses</div>
                  <div className="text-gray-800">{player.losses}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded-md p-2 text-center">
                  <div className="text-gray-500 text-xs mb-1">Total</div>
                  <div className="text-gray-800">{player.matches}</div>
                </div>
                <div className="bg-gray-50 rounded-md p-2 text-center">
                  <div className="text-gray-500 text-xs mb-1">Win Rate</div>
                  <div className="text-gray-800">
                    {((player.wins / (player.matches || 1)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </List.Item>
      )}
    />
  );
}; 