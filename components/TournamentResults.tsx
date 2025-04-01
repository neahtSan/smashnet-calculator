import { Modal, Button, List, Avatar, Space, Typography } from 'antd';
import { UserOutlined, TrophyOutlined, ReloadOutlined, CalculatorOutlined } from '@ant-design/icons';
import { PlayerStats } from '@/types/interface';
import { useState } from 'react';
import { BadmintonCostCalculator } from './BadmintonCostCalculator';

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
  const [isCalculatorVisible, setIsCalculatorVisible] = useState(false);

  return (
    <>
      <Modal
        title="Tournament Results"
        open={isVisible}
        onCancel={onClose}
        footer={
          <div className="flex justify-between gap-2">
            <Button
              type="primary"
              danger
              icon={<ReloadOutlined />}
              onClick={onRestart}
              className="flex-1"
            >
              Restart
            </Button>
            <Button
              type="primary"
              icon={<CalculatorOutlined />}
              onClick={() => setIsCalculatorVisible(true)}
              className="flex-1"
            >
              Calculate
            </Button>
          </div>
        }
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

      <BadmintonCostCalculator
        isVisible={isCalculatorVisible}
        onClose={() => setIsCalculatorVisible(false)}
        players={playerStats}
      />
    </>
  );
}; 