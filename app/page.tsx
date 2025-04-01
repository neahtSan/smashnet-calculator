'use client';

import { useState, useEffect } from 'react';
import { Input, Button, List, Card, Modal, Form, message, Avatar, Space, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, TrophyOutlined, ReloadOutlined, UndoOutlined } from '@ant-design/icons';
import { Player, Match, PlayerStats } from '@/types/interface';
import { findBestMatch, updatePlayerStats, findFirstMatch, findSecondMatch } from '@/utils/matchmaker';

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [form] = Form.useForm();
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  const [isMatchButtonDisabled, setIsMatchButtonDisabled] = useState(true);
  const [previousPlayerCount, setPreviousPlayerCount] = useState(0);
  const [isFinishModalVisible, setIsFinishModalVisible] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [isRevertModalVisible, setIsRevertModalVisible] = useState(false);
  const [matchToRevert, setMatchToRevert] = useState<string | null>(null);

  useEffect(() => {
    // Enable button and reset matches when player count changes
    if (players.length !== previousPlayerCount) {
      setIsMatchButtonDisabled(false);
      setMatches([]); // Reset matches when player count changes
      setPreviousPlayerCount(players.length);
    }
  }, [players.length]);

  const handleAddPlayer = (values: { name: string }) => {
    if (players.length >= 7) {
      message.error('Maximum 7 players allowed');
      return;
    }

    // Check for duplicate names
    const isDuplicateName = players.some(p => p.name.toLowerCase() === values.name.toLowerCase());
    if (isDuplicateName) {
      message.error('A player with this name already exists');
      return;
    }

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: values.name,
      wins: 0,
      losses: 0,
      matches: 0,
    };
    setPlayers([...players, newPlayer]);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    form.setFieldsValue({ name: player.name });
    setIsModalVisible(true);
  };

  const handleUpdatePlayer = (values: { name: string }) => {
    if (!editingPlayer) return;

    // Check for duplicate names, excluding the current player being edited
    const isDuplicateName = players.some(p => 
      p.id !== editingPlayer.id && 
      p.name.toLowerCase() === values.name.toLowerCase()
    );
    if (isDuplicateName) {
      message.error('A player with this name already exists');
      return;
    }

    setPlayers(players.map(p => 
      p.id === editingPlayer.id ? { ...p, name: values.name } : p
    ));
    setIsModalVisible(false);
    setEditingPlayer(null);
    form.resetFields();
  };

  const handleDeletePlayer = (playerId: string) => {
    const updatedPlayers = players.filter(p => p.id !== playerId);
    setPlayers(updatedPlayers);
  
    // If a player from an active match was removed, clear unfinished matches
    const updatedMatches = matches.filter(match => 
      match.team1.every(player => player.id !== playerId) &&
      match.team2.every(player => player.id !== playerId)
    );
    
    setMatches(updatedMatches);
  };
  

const handleCreateMatch = () => {
  if (players.length < 4) {
    message.error('Need at least 4 players to create a match');
    return;
  }

  try {
    let selectedPlayers: [Player, Player, Player, Player];

    if (matches.length === 0) {
      console.log('Creating first match');
      selectedPlayers = findFirstMatch(players);
    } else if (matches.length === 1 && matches[0].winner) {
      console.log('Creating second match');
      selectedPlayers = findSecondMatch(players, matches[0]);
    } else {
      console.log('Creating subsequent match');
      
      // Get players who haven't played in recent matches
      const recentMatches = matches.slice(-3); // Look at last 3 matches
      const availablePlayers = players.filter(p => 
        !recentMatches.some(match => 
          match.team1.includes(p) || match.team2.includes(p)
        )
      );

      // If we have enough players who haven't played recently, prioritize them
      if (availablePlayers.length >= 4) {
        console.log('Using players who haven\'t played recently');
        selectedPlayers = findFirstMatch(availablePlayers);
      } else {
        // If not enough available players, try to find the best match
        // while still considering player history and win rates
        console.log('Finding best match with all players');
        selectedPlayers = findBestMatch(players, matches);
      }
    }

    console.log('Selected players:', { 
      team1Player1: selectedPlayers[0], 
      team1Player2: selectedPlayers[1], 
      team2Player1: selectedPlayers[2], 
      team2Player2: selectedPlayers[3] 
    });

    const newMatch: Match = {
      id: Date.now().toString(),
      team1: [selectedPlayers[0], selectedPlayers[1]],
      team2: [selectedPlayers[2], selectedPlayers[3]],
      winner: null,
      timestamp: Date.now(),
    };

    console.log('New match:', newMatch);
    setMatches([...matches, newMatch]);
    setIsCreatingMatch(false);
    setIsMatchButtonDisabled(true); // Disable button after creating a match
  } catch (error) {
    console.error('Error creating match:', error);
    message.error('Error creating match');
    setIsCreatingMatch(false);
  }
};

  const handleUpdateMatchResult = (matchId: string, winner: 'team1' | 'team2') => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    // Create a new array with the updated match
    const updatedMatches = matches.map(m => 
      m.id === matchId ? { ...m, winner } : m
    );
    
    // Update matches state first
    setMatches(updatedMatches);
    
    // Update player stats
    const updatedPlayers = updatePlayerStats(players, { ...match, winner }, winner);
    setPlayers(updatedPlayers);

    // Automatically create a new match after a short delay
    setTimeout(() => {
      setIsCreatingMatch(true);
      handleCreateMatch();
    }, 1000);
  };

  const handleFinishPlaying = () => {
    setIsFinishModalVisible(true);
  };

  const handleConfirmFinish = () => {
    // Calculate player statistics
    const stats = players.map(player => {
      const totalGames = player.wins + player.losses;
      const winRate = totalGames > 0 ? (player.wins / totalGames) * 100 : 0;

      return {
        name: player.name,
        wins: player.wins,
        losses: player.losses,
        winRate,
        totalMatches: player.matches
      };
    });

    // Sort by win rate (descending), then total matches (descending), then name (ascending)
    const sortedStats = stats.sort((a, b) => {
      // Different win rates - sort by win rate
      if (b.winRate !== a.winRate) {
        return b.winRate - a.winRate;
      }
      // Same win rate - sort by total matches
      if (b.totalMatches !== a.totalMatches) {
        return b.totalMatches - a.totalMatches;
      }
      // Same win rate and total matches - sort by name
      return a.name.localeCompare(b.name);
    });

    // Calculate ranks (only rank 1 can be shared)
    const highestWinRate = sortedStats[0].winRate;
    let currentRank = 1;
    const statsWithRanks = sortedStats.map((player, index) => {
      if (index === 0 || (player.winRate === highestWinRate)) {
        // First place or tied for first
        return { ...player, rank: 1 };
      } else {
        // Count how many players are tied for first
        const tiedForFirstCount = sortedStats.filter(p => p.winRate === highestWinRate).length;
        // For players not in first place, their rank starts after all tied first place players
        return { ...player, rank: index + 1 };
      }
    });

    setPlayerStats(statsWithRanks);
    setIsFinishModalVisible(false);
    setIsResultsVisible(true);

    // Save to localStorage
    localStorage.setItem('smashnet_matches', JSON.stringify(matches));
    localStorage.setItem('smashnet_players', JSON.stringify(players));
    localStorage.setItem('smashnet_stats', JSON.stringify(statsWithRanks));
  };

  const handleRestartTournament = () => {
    setMatches([]);
    setPlayers([]);
    setPlayerStats([]);
    setIsResultsVisible(false);
    localStorage.removeItem('smashnet_matches');
    localStorage.removeItem('smashnet_players');
    localStorage.removeItem('smashnet_stats');
  };

  const handleRevertMatch = (matchId: string) => {
    const matchIndex = matches.findIndex(m => m.id === matchId);
    if (matchIndex <= 0) return; // Cannot revert match 1

    setMatchToRevert(matchId);
    setIsRevertModalVisible(true);
  };

  const handleConfirmRevert = () => {
    if (!matchToRevert) return;

    const matchIndex = matches.findIndex(m => m.id === matchToRevert);
    if (matchIndex <= 0) return; // Safety check

    // Get all matches from the revert point onwards
    const matchesToRevert = matches.slice(matchIndex);
    
    // Create a copy of players to revert their stats
    let updatedPlayers = [...players];

    // Revert stats for each match that will be removed
    matchesToRevert.forEach(match => {
      if (match.winner) {
        // Find all players in the match
        const allPlayers = [...match.team1, ...match.team2];
        
        // Revert stats for each player
        updatedPlayers = updatedPlayers.map(player => {
          const isInMatch = allPlayers.some(p => p.id === player.id);
          if (!isInMatch) return player;

          const isInWinningTeam = 
            (match.winner === 'team1' && match.team1.some(p => p.id === player.id)) ||
            (match.winner === 'team2' && match.team2.some(p => p.id === player.id));

          return {
            ...player,
            wins: isInWinningTeam ? player.wins - 1 : player.wins,
            losses: !isInWinningTeam ? player.losses - 1 : player.losses,
            matches: player.matches - 1
          };
        });
      }
    });

    // Remove all matches after and including the reverted match
    const updatedMatches = matches.slice(0, matchIndex);

    // Check if the last remaining match has a winner
    const lastMatch = updatedMatches[updatedMatches.length - 1];
    const shouldEnableCreateButton = !lastMatch || lastMatch.winner !== null;

    // Update state
    setPlayers(updatedPlayers);
    setMatches(updatedMatches);
    setMatchToRevert(null);
    setIsRevertModalVisible(false);
    setIsMatchButtonDisabled(!shouldEnableCreateButton);

    message.success('Match reverted successfully');
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Badminton Matchmaker</h1>
          
          <div className="flex justify-center">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setIsModalVisible(true)}
              className="w-full max-w-xs mb-6"
              disabled={players.length >= 7}
            >
              Add Player
            </Button>
          </div>

          <List
            className="mb-6"
            dataSource={players}
            renderItem={(player: Player) => (
              <List.Item
                className="bg-white rounded-lg mb-3 shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
              >
                <div className="w-full">
                  <div className="font-semibold text-lg text-gray-800 mb-3 text-center">
                    {player.name}
                  </div>
                  <div className="text-sm flex flex-col gap-2">
                    <div className="flex gap-2">
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <div className="bg-gray-50 rounded-md p-2 text-center">
                          <div className="text-gray-500 text-xs mb-1">Wins</div>
                          <div className="text-gray-800 font-medium">{player.wins}</div>
                        </div>
                        <div className="bg-gray-50 rounded-md p-2 text-center">
                          <div className="text-gray-500 text-xs mb-1">Losses</div>
                          <div className="text-gray-800 font-medium">{player.losses}</div>
                        </div>
                      </div>
                      <Button 
                        key="edit" 
                        icon={<EditOutlined style={{ fontSize: '18px' }} />} 
                        onClick={() => handleEditPlayer(player)}
                        className="flex items-center justify-center !w-9 !h-9 self-center"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <div className="bg-gray-50 rounded-md p-2 text-center">
                          <div className="text-gray-500 text-xs mb-1">Total Matches</div>
                          <div className="text-gray-800 font-medium">{player.matches}</div>
                        </div>
                        <div className="bg-gray-50 rounded-md p-2 text-center">
                          <div className="text-gray-500 text-xs mb-1">Win Rate</div>
                          <div className="text-gray-800 font-medium">
                            {((player.wins / (player.matches || 1)) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <Button 
                        key="delete" 
                        danger 
                        icon={<DeleteOutlined style={{ fontSize: '18px' }} />} 
                        onClick={() => handleDeletePlayer(player.id)}
                        className="flex items-center justify-center !w-9 !h-9 self-center"
                      />
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />

          {players.length >= 4 && (
            <Button 
              type="primary" 
              onClick={handleCreateMatch}
              className="w-full mb-6"
              disabled={isMatchButtonDisabled}
            >
              {isCreatingMatch ? 'Creating Match...' : 'Create New Match'}
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {matches.length > 0 && (() => {
            const currentMatch = matches[matches.length - 1];
            
            // Safety check for team members
            if (!currentMatch.team1 || !currentMatch.team2 || 
                !currentMatch.team1[0] || !currentMatch.team1[1] || 
                !currentMatch.team2[0] || !currentMatch.team2[1]) {
              console.error('Invalid match data:', currentMatch);
              return null;
            }

            return (
              <Card 
                key={currentMatch.id} 
                title={
                  <div className="flex justify-between items-center">
                    <span>Match {matches.length}</span>
                    {matches.length > 1 && !currentMatch.winner && (
                      <Button
                        icon={<UndoOutlined />}
                        onClick={() => handleRevertMatch(currentMatch.id)}
                        type="text"
                        className="text-gray-500 hover:text-blue-500"
                      />
                    )}
                  </div>
                }
                className="shadow-md"
              >
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">Team 1</h3>
                    <p className="text-gray-600">{currentMatch.team1[0].name} & {currentMatch.team1[1].name}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">Team 2</h3>
                    <p className="text-gray-600">{currentMatch.team2[0].name} & {currentMatch.team2[1].name}</p>
                  </div>
                  {!currentMatch.winner && (
                    <div className="flex gap-2">
                      <Button 
                        type="primary" 
                        onClick={() => handleUpdateMatchResult(currentMatch.id, 'team1')}
                        className="flex-1"
                      >
                        Team 1 Wins
                      </Button>
                      <Button 
                        type="primary" 
                        onClick={() => handleUpdateMatchResult(currentMatch.id, 'team2')}
                        className="flex-1"
                      >
                        Team 2 Wins
                      </Button>
                    </div>
                  )}
                  {currentMatch.winner && (
                    <div className="text-center text-green-600 font-semibold">
                      {currentMatch.winner === 'team1' ? (
                        <p>{currentMatch.team1[0].name} & {currentMatch.team1[1].name} won!</p>
                      ) : (
                        <p>{currentMatch.team2[0].name} & {currentMatch.team2[1].name} won!</p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })()}
        </div>

        {matches.length > 0 && (
          <Button
            type="primary"
            onClick={handleFinishPlaying}
            className="w-full mt-4"
            style={{ backgroundColor: '#52c41a' }}
          >
            Finish Tournament
          </Button>
        )}
      </div>

      <Modal
        title={editingPlayer ? "Edit Player" : "Add Player"}
        open={isModalVisible}
        onOk={() => {
          form.validateFields().then(() => {
            form.submit();
          }).catch(() => {
            // Validation failed, do nothing
          });
        }}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingPlayer(null);
          form.resetFields();
        }}
        okButtonProps={{
          disabled: form.getFieldsError().some(({ errors }) => errors.length > 0),
          loading: form.getFieldsError().some(({ errors }) => errors.length > 0)
        }}
      >
        <Form
          form={form}
          onFinish={editingPlayer ? handleUpdatePlayer : handleAddPlayer}
          layout="vertical"
          validateTrigger={['onChange', 'onBlur']}
        >
          <Form.Item
            name="name"
            label="Player Name"
            rules={[
              { required: true, message: 'Please enter player name' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  
                  if (value.length >= 32) {
                    return Promise.reject('Player name cannot exceed 32 characters');
                  }

                  const isDuplicateName = players.some(p => 
                    (editingPlayer ? p.id !== editingPlayer.id : true) && 
                    p.name.toLowerCase() === value.toLowerCase()
                  );
                  
                  return isDuplicateName ? Promise.reject('A player with this name already exists') : Promise.resolve();
                },
                validateTrigger: ['onChange', 'onBlur']
              }
            ]}
          >
            <Input maxLength={32} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Finish Playing Confirmation Modal */}
      <Modal
        title="Finish Playing"
        open={isFinishModalVisible}
        onOk={handleConfirmFinish}
        onCancel={() => setIsFinishModalVisible(false)}
      >
        <p>Are you sure you want to finish playing? This will save the current match data and show the tournament results.</p>
      </Modal>

      {/* Tournament Results Modal */}
      <Modal
        title="Tournament Results"
        open={isResultsVisible}
        onCancel={() => setIsResultsVisible(false)}
        footer={[
          <Button 
            key="restart" 
            type="primary" 
            danger 
            icon={<ReloadOutlined />}
            onClick={handleRestartTournament}
          >
            Restart Tournament
          </Button>
        ]}
        width={800}
      >
        <List
          dataSource={playerStats}
          renderItem={(player: PlayerStats & { rank: number }, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <div className="relative">
                    {player.rank === 1 && (
                      <div 
                        className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10"
                        style={{ color: '#eb2f96' }}
                      >
                        👑
                      </div>
                    )}
                    <Avatar 
                      size="large" 
                      icon={<UserOutlined />}
                      style={{ backgroundColor: player.rank === 1 ? '#eb2f96' : '#1890ff' }}
                    />
                  </div>
                }
                title={
                  <Space>
                    <span className="text-lg font-semibold">
                      {player.rank}. {player.name}
                    </span>
                    {player.rank === 1 && <TrophyOutlined style={{ color: '#eb2f96' }} />}
                  </Space>
                }
                description={
                  <Space size="large">
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

      {/* Revert Match Confirmation Modal */}
      <Modal
        title="Revert Match"
        open={isRevertModalVisible}
        onOk={handleConfirmRevert}
        onCancel={() => {
          setIsRevertModalVisible(false);
          setMatchToRevert(null);
        }}
        okText="Yes, Revert"
        cancelText="No, Keep Current"
      >
        <p>Are you sure you want to revert this match? This will:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>Remove this match and any matches after it</li>
          <li>Revert all player statistics for these matches</li>
          <li>This action cannot be undone</li>
        </ul>
      </Modal>
    </main>
  );
}
