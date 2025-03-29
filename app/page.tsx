'use client';

import { useState } from 'react';
import { Input, Button, List, Card, Modal, Form, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Player, Match } from '@/types';
import { findBestMatch, updatePlayerStats, findFirstMatch, findSecondMatch } from '@/utils/matchmaker';

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [form] = Form.useForm();
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);

  const handleAddPlayer = (values: { name: string }) => {
    if (players.length >= 7) {
      message.error('Maximum 7 players allowed');
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
    setPlayers(players.map(p => 
      p.id === editingPlayer.id ? { ...p, name: values.name } : p
    ));
    setIsModalVisible(false);
    setEditingPlayer(null);
    form.resetFields();
  };

  const handleDeletePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const handleCreateMatch = () => {
    if (players.length < 4) {
      message.error('Need at least 4 players to create a match');
      return;
    }

    try {
      let selectedPlayers: [Player, Player, Player, Player];
      
      // Use specific logic for first two matches
      if (matches.length === 0) {
        console.log('Creating first match');
        selectedPlayers = findFirstMatch(players);
      } else if (matches.length === 1 && matches[0].winner) {
        console.log('Creating second match');
        selectedPlayers = findSecondMatch(players, matches[0]);
      } else {
        console.log('Creating subsequent match');
        selectedPlayers = findBestMatch(players, matches);
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
              disabled={(matches.length > 0 && !matches[matches.length - 1].winner)}
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
                title={`Match ${matches.length}`}
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
      </div>

      <Modal
        title={editingPlayer ? "Edit Player" : "Add Player"}
        open={isModalVisible}
        onOk={form.submit}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingPlayer(null);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          onFinish={editingPlayer ? handleUpdatePlayer : handleAddPlayer}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Player Name"
            rules={[{ required: true, message: 'Please enter player name' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
