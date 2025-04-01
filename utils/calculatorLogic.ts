import { PlayerStats, CourtFee, Shuttlecock, CustomExpense } from '@/interface';

interface PlayerCost {
  name: string;
  sharedCost: number;
  customExpenses: number;
  total: number;
}

export const calculateSharedCosts = (courtFee: CourtFee, shuttlecock: Shuttlecock): number => {
  const totalCourtFee = courtFee.hourlyRate * courtFee.hours;
  const totalShuttlecockCost = shuttlecock.quantity * shuttlecock.pricePerPiece;
  return totalCourtFee + totalShuttlecockCost;
};

export const calculatePlayerCosts = (
  players: PlayerStats[],
  sharedCost: number,
  customExpenses: CustomExpense[]
): PlayerCost[] => {
  const sharedCostPerPlayer = players.length > 0 ? sharedCost / players.length : 0;
  
  return players.map(player => {
    // Get expenses specifically assigned to this player
    const assignedExpenses = customExpenses
      .filter(expense => expense.assignedTo.includes(player.name))
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    // Get unassigned expenses
    const unassignedExpenses = customExpenses.filter(expense => expense.assignedTo.length === 0);
    
    // Calculate shared unassigned expenses
    const sharedUnassignedExpenses = unassignedExpenses
      .filter(expense => expense.isShared)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const sharedUnassignedExpensesPerPlayer = players.length > 0 ? sharedUnassignedExpenses / players.length : 0;
    
    // Calculate full unassigned expenses (each player pays full amount)
    const fullUnassignedExpenses = unassignedExpenses
      .filter(expense => !expense.isShared)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      name: player.name,
      sharedCost: sharedCostPerPlayer,
      customExpenses: assignedExpenses + sharedUnassignedExpensesPerPlayer + fullUnassignedExpenses,
      total: sharedCostPerPlayer + assignedExpenses + sharedUnassignedExpensesPerPlayer + fullUnassignedExpenses
    };
  });
};

export const calculateTotalCustomExpenses = (customExpenses: CustomExpense[], totalPlayers: number): number => {
  return customExpenses.reduce((sum, expense) => {
    // For unassigned expenses that are not shared, multiply by number of players
    if (expense.assignedTo.length === 0) {
      if (expense.isShared) {
        // For shared expenses, just add the amount once
        return sum + expense.amount;
      } else {
        // For non-shared expenses, multiply by number of players
        return sum + (expense.amount * totalPlayers);
      }
    }
    // For assigned expenses, just add the amount once
    return sum + expense.amount;
  }, 0);
};

export const calculateTotalCost = (sharedCost: number, customExpenses: CustomExpense[], totalPlayers: number): number => {
  const totalCustomExpenses = calculateTotalCustomExpenses(customExpenses, totalPlayers);
  return sharedCost + totalCustomExpenses;
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