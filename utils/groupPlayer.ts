export const GROUP_CONFIGS: Record<number, [number, number]> = {
  4: [2, 2],
  5: [3, 2],
  6: [3, 3],
  7: [4, 3],
  8: [4, 4],
  9: [5, 4],
  10: [5, 5],
  11: [6, 5],
  12: [6, 6]
};

export const MIN_PLAYERS = 4;
export const MAX_PLAYERS = 7;

export function getGroupSizes(playerCount: number): [number, number] {
  return GROUP_CONFIGS[playerCount] || [4, 4];
} 