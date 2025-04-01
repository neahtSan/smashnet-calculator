'use client';

import { useState, useEffect } from 'react';
import { Input, Button, List, Card, Modal, Form, message, Avatar, Space, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, TrophyOutlined, ReloadOutlined, UndoOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Player, Match, PlayerStats } from '@/types/interface';
import { findBestMatch, updatePlayerStats, findFirstMatch, findSecondMatch } from '@/utils/matchmaker';
import { MIN_PLAYERS, MAX_PLAYERS } from '@/utils/groupPlayer';
import { PlayerList } from '@/components/PlayerList';
import { CurrentMatch } from '@/components/CurrentMatch';
import { TournamentResults } from '@/components/TournamentResults';
import { PlayerForm } from '@/components/PlayerForm';
import { DeleteConfirmation } from '@/components/DeleteConfirmation';
import { RevertMatchConfirmation } from '@/components/RevertMatchConfirmation';
import { FinishConfirmation } from '@/components/FinishConfirmation';

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | undefined>(undefined);
  const [form] = Form.useForm();
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  const [isMatchButtonDisabled, setIsMatchButtonDisabled] = useState(true);
  const [previousPlayerCount, setPreviousPlayerCount] = useState(0);
  const [isFinishModalVisible, setIsFinishModalVisible] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [isRevertModalVisible, setIsRevertModalVisible] = useState(false);
  const [matchToRevert, setMatchToRevert] = useState<string | null>(null);
  const [selectedWinner, setSelectedWinner] = useState<'team1' | 'team2' | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<string | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isFinishConfirmVisible, setIsFinishConfirmVisible] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('tournamentData');
    if (savedData) {
      const { players: savedPlayers, matches: savedMatches } = JSON.parse(savedData);
      setPlayers(savedPlayers);
      setMatches(savedMatches);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tournamentData', JSON.stringify({ players, matches }));
  }, [players, matches]);

  useEffect(() => {
    // Enable button and reset matches when player count changes
    if (players.length !== previousPlayerCount) {
      setIsMatchButtonDisabled(false);
      setMatches([]); // Reset matches when player count changes
      setPreviousPlayerCount(players.length);
    }
  }, [players.length]);

  const handleAddPlayer = (name: string) => {
    if (players.length >= MAX_PLAYERS) {
      message.error(`Maximum ${MAX_PLAYERS} players allowed`);
      return;
    }

    // Check for duplicate names
    const isDuplicateName = players.some(p => p.name.toLowerCase() === name.toLowerCase());
    if (isDuplicateName) {
      message.error('A player with this name already exists');
      return;
    }

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: name,
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

  const handleUpdatePlayer = (name: string) => {
    if (!editingPlayer) return;

    // Check for duplicate names, excluding the current player being edited
    const isDuplicateName = players.some(p => 
      p.id !== editingPlayer.id && 
      p.name.toLowerCase() === name.toLowerCase()
    );
    if (isDuplicateName) {
      message.error('A player with this name already exists');
      return;
    }

    setPlayers(players.map(p => 
      p.id === editingPlayer.id ? { ...p, name: name } : p
    ));
    setIsModalVisible(false);
    setEditingPlayer(undefined);
    form.resetFields();
  };

  const handleDeleteClick = (playerId: string) => {
    setPlayerToDelete(playerId);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (!playerToDelete) return;
    
    const updatedPlayers = players.filter(p => p.id !== playerToDelete);
    setPlayers(updatedPlayers);
  
    // If a player from an active match was removed, clear unfinished matches
    const updatedMatches = matches.filter(match => 
      match.team1.every(player => player.id !== playerToDelete) &&
      match.team2.every(player => player.id !== playerToDelete)
    );
    
    setMatches(updatedMatches);
    setIsDeleteModalVisible(false);
    setPlayerToDelete(null);
  };

  const handleCreateMatch = () => {
    if (players.length < MIN_PLAYERS) {
      message.error(`Need at least ${MIN_PLAYERS} players to create a match`);
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

      // Save to localStorage
      localStorage.setItem('tournamentData', JSON.stringify({
        players,
        matches: [...matches, newMatch],
        stats: playerStats
      }));
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
    // Calculate player statistics
    const stats = players.map(player => ({
      ...player,
      winRate: (player.wins / (player.matches || 1)) * 100,
      totalMatches: player.matches
    }));

    // Sort by win rate (descending), then total matches (descending), then name (ascending)
    const sortedStats = stats.sort((a, b) => {
      // Different win rates - sort by win rate
      if (b.winRate !== a.winRate) {
        return b.winRate - a.winRate;
      }
      // Same win rate - sort by total matches
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      return a.losses - b.losses;
    });

    // Calculate ranks (only rank 1 can be shared)
    const highestWinRate = sortedStats[0].winRate;
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
    setIsResultsVisible(true);

    // Save to localStorage
    localStorage.setItem('tournamentData', JSON.stringify({ 
      players, 
      matches,
      stats: statsWithRanks 
    }));
  };

  const handleRestartTournament = () => {
    setMatches([]);
    setPlayers([]);
    setPlayerStats([]);
    setIsResultsVisible(false);
    localStorage.removeItem('tournamentData');
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

  const handleSelectWinner = (team: 'team1' | 'team2') => {
    setSelectedWinner(team);
  };

  const handleConfirmWinner = (matchId: string) => {
    if (!selectedWinner) return;
    handleUpdateMatchResult(matchId, selectedWinner);
    setSelectedWinner(null);
  };

  const handleFinishClick = () => {
    setIsFinishConfirmVisible(true);
  };

  const handleConfirmFinish = () => {
    setIsFinishConfirmVisible(false);
    handleFinishPlaying();
  };

  return (
    <main className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="w-full max-w-md mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h1 className="text-xl font-bold text-center text-gray-800 mb-4">Smashnet Matchmaker</h1>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <p className="text-sm text-blue-700 text-center">
              {players.length < MIN_PLAYERS ? (
                <>Please add at least {MIN_PLAYERS} players to start a match.</>
              ) : (
                <>You have enough players to start a match!</>
              )}
              {players.length >= MAX_PLAYERS ? (
                <span className="block mt-1">Maximum of {MAX_PLAYERS} players reached.</span>
              ) : (
                <span className="block mt-1">You can add up to {MAX_PLAYERS} players.</span>
              )}
            </p>
          </div>
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsModalVisible(true)}
            className="w-full mb-4"
            disabled={players.length >= MAX_PLAYERS}
          >
            Add Player
          </Button>

          <PlayerList 
            players={players}
            onEditPlayer={handleEditPlayer}
            onDeletePlayer={handleDeleteClick}
          />

          {players.length >= MIN_PLAYERS && (
            <Button 
              type="primary" 
              onClick={handleCreateMatch}
              className="w-full mb-4"
              disabled={isMatchButtonDisabled}
            >
              {isCreatingMatch ? 'Creating Match...' : 'Create New Match'}
            </Button>
          )}
        </div>

        {matches.length > 0 && (() => {
          const currentMatch = matches[matches.length - 1];
          
          if (!currentMatch.team1 || !currentMatch.team2 || 
              !currentMatch.team1[0] || !currentMatch.team1[1] || 
              !currentMatch.team2[0] || !currentMatch.team2[1]) {
            console.error('Invalid match data:', currentMatch);
            return null;
          }

          return (
            <CurrentMatch
              match={currentMatch}
              matchNumber={matches.length}
              selectedWinner={selectedWinner}
              onSelectWinner={handleSelectWinner}
              onConfirmWinner={handleConfirmWinner}
              onRevertMatch={handleRevertMatch}
              showRevert={matches.length > 1}
            />
          );
        })()}

        {matches.length > 0 && (
          <Button
            type="primary"
            onClick={handleFinishClick}
            className="w-full"
            disabled={matches.length === 1 && !matches[0].winner}
          >
            Finish Tournament
          </Button>
        )}
      </div>

      <PlayerForm
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingPlayer(undefined);
        }}
        onSubmit={editingPlayer ? handleUpdatePlayer : handleAddPlayer}
        editingPlayer={editingPlayer}
        players={players}
      />

      <DeleteConfirmation
        isVisible={isDeleteModalVisible}
        onClose={() => {
          setIsDeleteModalVisible(false);
          setPlayerToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      <RevertMatchConfirmation
        isVisible={isRevertModalVisible}
        onClose={() => {
          setIsRevertModalVisible(false);
          setMatchToRevert(null);
        }}
        onConfirm={handleConfirmRevert}
      />

      <FinishConfirmation
        isVisible={isFinishConfirmVisible}
        onClose={() => setIsFinishConfirmVisible(false)}
        onConfirm={handleConfirmFinish}
      />

      <TournamentResults
        isVisible={isResultsVisible}
        onClose={() => {}}
        onRestart={handleRestartTournament}
        playerStats={playerStats}
        closable={false}
      />
    </main>
  );
}
