import { Modal, Button, List, Avatar, Space, Typography, Spin } from 'antd';
import { UserOutlined, TrophyOutlined } from '@ant-design/icons';
import { PlayerStats, TournamentResultsProps } from '@/interface';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const TournamentResults = ({
  isVisible,
  onClose,
  players,
  onRestart
}: TournamentResultsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculateCosts = () => {
    setIsLoading(true);
    // Get the original player order from localStorage
    const savedData = localStorage.getItem('tournamentData');
    if (savedData) {
      const { players: originalPlayers } = JSON.parse(savedData);
      // Map the original player order to include the stats from the results
      const orderedPlayers = originalPlayers.map((originalPlayer: any) => {
        const playerStats = players.find(p => p.name === originalPlayer.name);
        return {
          name: originalPlayer.name,
          wins: playerStats?.wins || 0,
          losses: playerStats?.losses || 0,
          winRate: playerStats?.winRate || 0,
          totalMatches: playerStats?.totalMatches || 0,
          rank: playerStats?.rank || 0
        };
      });
      localStorage.setItem('calculatorPlayers', JSON.stringify(orderedPlayers));
    }
    router.push('/calculator');
  };

  return (
    <Modal
      title="Tournament Results"
      open={isVisible}
      onCancel={onClose}
      width="90%"
      style={{ maxWidth: '800px' }}
      footer={
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="primary"
            danger
            onClick={onRestart}
            className="w-full sm:w-auto order-2 sm:order-1"
            disabled={isLoading}
          >
            Restart Tournament
          </Button>
          <Button
            type="primary"
            onClick={handleCalculateCosts}
            className="w-full sm:w-auto order-1 sm:order-2"
            loading={isLoading}
          >
            Calculate Costs
          </Button>
        </div>
      }
    >
      <Spin spinning={isLoading}>
        <List
          dataSource={players}
          renderItem={(player) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <div className="relative">
                    {player.rank === 1 && (
                      <div 
                        className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10 text-sm"
                        style={{ color: '#eb2f96' }}
                      >
                        👑
                      </div>
                    )}
                    <Avatar 
                      size="default"
                      icon={<UserOutlined />}
                      style={{ backgroundColor: player.rank === 1 ? '#eb2f96' : '#1890ff' }}
                    />
                  </div>
                }
                title={
                  <Space className="text-sm">
                    <span className="font-semibold">
                      {player.rank}. {player.name}
                    </span>
                    {player.rank === 1 && <TrophyOutlined style={{ color: '#eb2f96' }} />}
                  </Space>
                }
                description={
                  <Space size="small" className="text-xs">
                    <Typography.Text 
                      type="secondary"
                      style={{ color: player.winRate >= 50 ? '#3f8600' : '#cf1322' }}
                    >
                      Win Rate: {player.winRate.toFixed(1)}%
                    </Typography.Text>
                    <Typography.Text 
                      type="secondary"
                      style={{ color: '#3f8600' }}
                    >
                      Wins: {player.wins}
                    </Typography.Text>
                    <Typography.Text 
                      type="secondary"
                      style={{ color: '#cf1322' }}
                    >
                      Losses: {player.losses}
                    </Typography.Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Spin>
    </Modal>
  );
}; 