import { useState } from 'react';
import { Input, Button, List, Typography, Space } from 'antd';
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { PlayerStats } from '@/interface';

interface PlayerListProps {
  players: PlayerStats[];
  onPlayersChange: (players: PlayerStats[]) => void;
}

export const PlayerList = ({ players, onPlayersChange }: PlayerListProps) => {
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      onPlayersChange([...players, {
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
    onPlayersChange(players.filter(player => player.name !== playerName));
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
  );
}; 