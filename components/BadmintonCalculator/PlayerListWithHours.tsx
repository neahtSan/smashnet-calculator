import { useState } from 'react';
import { Button, List, Typography, Space, Switch, InputNumber } from 'antd';
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { PlayerStats } from '@/interface';
import { PlayerForm } from '../PlayerForm';

interface PlayerListWithHoursProps {
  players: PlayerStats[];
  onPlayersChange: (players: PlayerStats[]) => void;
}

export const PlayerListWithHours = ({ players, onPlayersChange }: PlayerListWithHoursProps) => {
  const [usePlayerHours, setUsePlayerHours] = useState(false);
  const [isAddPlayerModalVisible, setIsAddPlayerModalVisible] = useState(false);

  const handleAddPlayer = (name: string) => {
    onPlayersChange([...players, {
      name: name.trim(),
      wins: 0,
      losses: 0,
      winRate: 0,
      totalMatches: 0,
      rank: players.length + 1,
      hours: 0
    }]);
    setIsAddPlayerModalVisible(false);
  };

  const handleRemovePlayer = (playerName: string) => {
    onPlayersChange(players.filter(player => player.name !== playerName));
  };

  const handleHoursChange = (playerName: string, hours: number | null) => {
    onPlayersChange(players.map(player =>
      player.name === playerName ? { ...player, hours: hours || 0 } : player
    ));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Typography.Title level={5}>Players</Typography.Title>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setIsAddPlayerModalVisible(true)}
        >
          Add
        </Button>
      </div>
      <List
        size="small"
        dataSource={players}
        renderItem={player => (
          <List.Item
            actions={[
              usePlayerHours && (
                <InputNumber
                  key="hours"
                  placeholder="Hours"
                  value={player.hours || null}
                  onChange={value => handleHoursChange(player.name, value)}
                  className="w-24 [&_input]:!outline-none [&_input]:!ring-0"
                  min={0}
                  step={0.5}
                  pattern="[0-9]*"
                  type="number"
                  controls={false}
                  inputMode="decimal"
                  onKeyPress={(e) => {
                    if (!/[\d.]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              ),
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
      <div className="mt-2 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Switch
            checked={usePlayerHours}
            onChange={setUsePlayerHours}
            checkedChildren="Different hours"
            unCheckedChildren="Same hours"
          />
        </div>
        <Typography.Text type="secondary">
          Total of {players.length} Players
        </Typography.Text>
      </div>

      <PlayerForm
        isVisible={isAddPlayerModalVisible}
        onClose={() => setIsAddPlayerModalVisible(false)}
        onSubmit={handleAddPlayer}
        players={players.map(p => ({ id: p.name, name: p.name, wins: p.wins, losses: p.losses, matches: p.totalMatches }))}
      />
    </div>
  );
}; 