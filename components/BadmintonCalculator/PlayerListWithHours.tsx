import { useState } from 'react';
import { Input, Button, List, Typography, Space, Switch, InputNumber } from 'antd';
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { PlayerStats } from '@/interface';

interface PlayerListWithHoursProps {
  players: PlayerStats[];
  onPlayersChange: (players: PlayerStats[]) => void;
}

export const PlayerListWithHours = ({ players, onPlayersChange }: PlayerListWithHoursProps) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [usePlayerHours, setUsePlayerHours] = useState(false);

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      onPlayersChange([...players, {
        name: newPlayerName.trim(),
        wins: 0,
        losses: 0,
        winRate: 0,
        totalMatches: 0,
        rank: players.length + 1,
        hours: 0
      }]);
      setNewPlayerName('');
    }
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
    </div>
  );
}; 