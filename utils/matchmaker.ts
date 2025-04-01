import { Player, Match } from '@/types/interface';

export const calculateWinRate = (player: Player): number => {
  return player.matches === 0 ? 0 : player.wins / player.matches;
};

export const getRandomPlayer = (players: Player[], seed: number): Player => {
  const random = Math.sin(seed) * 10000;
  return players[Math.floor(Math.abs(random) % players.length)];
};

export const getRandomPlayers = (players: Player[], count: number, seed: number): Player[] => {
  const shuffled = [...players].sort(() => Math.sin(seed) - 0.5);
  return shuffled.slice(0, count);
};

export const groupPlayers = (players: Player[]): [Player[], Player[]] => {
  const groupings: Record<number, [number, number]> = {
    4: [2, 2],
    5: [3, 2],
    6: [3, 3],
    7: [4, 3]
  };

  const [group1Size, group2Size] = groupings[players.length] || [0, 0];
  return [players.slice(0, group1Size), players.slice(group1Size)];
};

export const findFirstMatch = (players: Player[]): [Player, Player, Player, Player] => {
  if (players.length < 4) throw new Error('Not enough players for a match');
  const baseSeed = Math.floor(Date.now() / 1000);
  const [group1, group2] = groupPlayers(players);

  const team1Player1 = getRandomPlayer(group1, baseSeed);
  const team1Player2 = getRandomPlayer(group2, baseSeed + 1);
  const team2Player1 = getRandomPlayer(group1.filter(p => p !== team1Player1), baseSeed + 2);
  const team2Player2 = getRandomPlayer(group2.filter(p => p !== team1Player2), baseSeed + 3);

  return [team1Player1, team1Player2, team2Player1, team2Player2];
};

export const findSecondMatch = (players: Player[], previousMatch: Match): [Player, Player, Player, Player] => {
  const baseSeed = Math.floor(Date.now() / 1000);
  const losingTeam = previousMatch.winner === 'team1' ? previousMatch.team2 : previousMatch.team1;

  if (losingTeam.length < 1) return findBestMatch(players, [previousMatch]);

  const losingTeamPlayer = getRandomPlayer(losingTeam, baseSeed);
  const remainingPlayers = players.filter(p => !previousMatch.team1.includes(p) && !previousMatch.team2.includes(p));
  const selectedPlayers = getRandomPlayers(remainingPlayers, 3, baseSeed + 1);

  return [selectedPlayers[0], losingTeamPlayer, selectedPlayers[1], selectedPlayers[2]];
};

export const findBestMatch = (players: Player[], previousMatches: Match[]): [Player, Player, Player, Player] => {
  if (players.length < 4) throw new Error('Not enough players for a match');

  const baseSeed = Math.floor(Date.now() / 1000);
  const sortedPlayers = [...players].sort((a, b) => a.matches - b.matches || calculateWinRate(a) - calculateWinRate(b));

  const [group1, group2] = groupPlayers(sortedPlayers);
  const team1Player1 = getRandomPlayer(group1, baseSeed);
  const team2Player1 = getRandomPlayer(group2, baseSeed + 1);
  
  const availablePlayers = sortedPlayers.filter(p => p !== team1Player1 && p !== team2Player1);
  const potentialTeams = availablePlayers.filter(p => !previousMatches.some(m => m.team1.includes(p) || m.team2.includes(p)));

  let team1Player2: Player;
  let team2Player2: Player;

  if (potentialTeams.length >= 2) {
    team1Player2 = potentialTeams[0];
    team2Player2 = potentialTeams[1];
  } else {
    const fallbackPlayers = getRandomPlayers(availablePlayers, 2, baseSeed + 2);
    team1Player2 = fallbackPlayers[0];
    team2Player2 = fallbackPlayers[1];
  }

  return [team1Player1, team1Player2, team2Player1, team2Player2];
};

export const updatePlayerStats = (
  players: Player[],
  match: Match,
  winner: 'team1' | 'team2'
): Player[] => {
  return players.map(player => {
    const isInTeam1 = match.team1.includes(player);
    const isInTeam2 = match.team2.includes(player);

    if (!isInTeam1 && !isInTeam2) return player;

    const isWinner = (winner === 'team1' && isInTeam1) || (winner === 'team2' && isInTeam2);

    return {
      ...player,
      matches: player.matches + 1,
      wins: isWinner ? player.wins + 1 : player.wins,
      losses: !isWinner ? player.losses + 1 : player.losses
    };
  });
};