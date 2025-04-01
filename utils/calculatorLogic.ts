import { PlayerStats, CourtFee, Shuttlecock, CustomExpense } from '@/interface';

interface PlayerCost {
  name: string;
  sharedCost: number;
  customExpenses: number;
  total: number;
  hours?: number;
}

export const calculateTotalPlayerHours = (players: PlayerStats[]): number => {
  return players.reduce((sum, player) => sum + (player.hours || 0), 0);
};

export const calculateSharedCosts = (courtFee: CourtFee, shuttlecock: Shuttlecock): number => {
  const totalCourtFee = courtFee.hourlyRate * courtFee.hours;
  const totalShuttlecockCost = shuttlecock.quantity * shuttlecock.pricePerPiece;
  return totalCourtFee + totalShuttlecockCost;
};

export const calculatePlayerCosts = (
  players: PlayerStats[],
  courtFee: CourtFee,
  shuttlecock: Shuttlecock,
  customExpenses: CustomExpense[]
): PlayerCost[] => {
  const totalPlayerHours = calculateTotalPlayerHours(players);
  const totalCourtFee = courtFee.hourlyRate * courtFee.hours;
  const courtCostPerPlayerHour = totalPlayerHours > 0 ? totalCourtFee / totalPlayerHours : 0;
  const totalShuttlecockCost = shuttlecock.quantity * shuttlecock.pricePerPiece;
  const shuttlecockCostPerPlayer = players.length > 0 ? totalShuttlecockCost / players.length : 0;
  
  return players.map(player => {
    const playerHours = player.hours || 0;
    const playerCourtCost = playerHours * courtCostPerPlayerHour;

    let totalCustomExpenses = 0;

    customExpenses.forEach(expense => {
      if (expense.assignedTo.length > 0) {
        // If expense is assigned to specific players
        if (expense.assignedTo.includes(player.name)) {
          if (expense.isShared) {
            // Left toggle: Divide expense among assigned players
            totalCustomExpenses += expense.amount / expense.assignedTo.length;
          } else {
            // Right toggle: Each assigned player pays the full amount
            totalCustomExpenses += expense.amount;
          }
        }
      } else {
        // For unassigned expenses (all players)
        if (expense.isShared) {
          // Left toggle: "Share Equally" - divide by number of players
          totalCustomExpenses += expense.amount / players.length;
        } else {
          // Right toggle: "Each Player Pays Full" - everyone pays full amount
          totalCustomExpenses += expense.amount;
        }
      }
    });

    return {
      name: player.name,
      hours: playerHours,
      sharedCost: playerCourtCost + shuttlecockCostPerPlayer,
      customExpenses: totalCustomExpenses,
      total: playerCourtCost + shuttlecockCostPerPlayer + totalCustomExpenses
    };
  });
};

export const calculateTotalCustomExpenses = (customExpenses: CustomExpense[], totalPlayers: number): number => {
  let total = 0;

  customExpenses.forEach(expense => {
    if (expense.assignedTo.length > 0) {
      if (expense.isShared) {
        // Left toggle: Just add the amount once
        total += expense.amount;
      } else {
        // Right toggle: Each assigned player pays full amount
        total += expense.amount * expense.assignedTo.length;
      }
    } else {
      if (expense.isShared) {
        // Left toggle: Just add the amount once
        total += expense.amount;
      } else {
        // Right toggle: Each player pays full amount
        total += expense.amount * totalPlayers;
      }
    }
  });

  return total;
};

export const calculateTotalCost = (courtFee: CourtFee, shuttlecock: Shuttlecock, customExpenses: CustomExpense[], totalPlayers: number): number => {
  const totalCourtFee = courtFee.hourlyRate * courtFee.hours;
  const totalShuttlecockCost = shuttlecock.quantity * shuttlecock.pricePerPiece;
  const totalCustomExpenses = calculateTotalCustomExpenses(customExpenses, totalPlayers);
  return totalCourtFee + totalShuttlecockCost + totalCustomExpenses;
};

export const checkAllPlayersHaveSameAmount = (playerCosts: PlayerCost[]): boolean => {
  if (playerCosts.length <= 1) return true;
  return playerCosts.every(cost => Math.abs(cost.total - playerCosts[0].total) < 0.01);
};

export const formatPhoneNumber = (input: string): string => {
  try {
    // Remove all non-digit characters
    const digitsOnly = input.replace(/\D/g, '');
    
    // If it starts with '66', replace with '0'
    if (digitsOnly.startsWith('66')) {
      return '0' + digitsOnly.slice(2);
    }
    
    // If it starts with '+66', replace with '0'
    if (digitsOnly.startsWith('66')) {
      return '0' + digitsOnly.slice(2);
    }
    
    return digitsOnly;
  } catch (error) {
    return input;
  }
};

export const validatePromptPay = (number: string): boolean => {
  // Must be exactly 10 digits
  if (number.length !== 10) return false;

  // Must start with '0'
  if (!number.startsWith('0')) return false;

  // Second digit must be 6, 8, 9 for mobile numbers
  const secondDigit = parseInt(number[1]);
  if (![6, 8, 9].includes(secondDigit)) return false;

  // Must contain only digits
  if (!/^\d+$/.test(number)) return false;

  return true;
}; 