import { Modal, Button, List, Avatar, Space, Typography } from 'antd';
import { UserOutlined, TrophyOutlined, ReloadOutlined } from '@ant-design/icons';
import { PlayerStats } from '@/types/interface';

interface TournamentResultsProps {
  isVisible: boolean;
  onClose: () => void;
  onRestart: () => void;
  playerStats: PlayerStats[];
  closable?: boolean;
}

export const TournamentResults = ({
  isVisible,
  onClose,
  onRestart,
  playerStats,
  closable = true
}: TournamentResultsProps) => {
  return (
    <Modal
      title="Tournament Results"
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button 
          key="restart" 
          type="primary" 
          danger 
          icon={<ReloadOutlined />}
          onClick={onRestart}
        >
          Restart Tournament
        </Button>
      ]}
      closable={closable}
      maskClosable={closable}
      width="90%"
      style={{ maxWidth: '800px', top: '20px' }}
    >
      <List
        dataSource={playerStats}
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
    </Modal>
  );
}; 