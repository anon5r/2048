import { Game2048 } from '../../game/Game2048';
import type { GameState } from '../../game/Game2048';

/**
 * Type for testing purposes that exposes private members of Game2048
 */
export type TestGame2048 = {
  // Expose the private state property
  state: GameState;
  // Expose the private checkGameOver method
  checkGameOver: () => boolean;
  // Include all public members from Game2048
} & Omit<Game2048, 'state' | 'checkGameOver'>;
