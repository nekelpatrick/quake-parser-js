import GameStats from './parser';

interface Games {
  [game: string]: ReturnType<GameStats['getStats']>;
}

export class LogParser {
  private games: Games = {};
  private currentGame: GameStats | null = null;
  private currentGameNumber = 0;

  private parseKillLine(line: string): { killer: string; victim: string; method: string } | null {
    const killRegex = /Kill: \d+ \d+ \d+: (.+) killed (.+) by (.+)$/;
    const match = line.match(killRegex);
    
    if (match) {
      const [, killer, victim, method] = match;
      return { killer, victim, method };
    }
    return null;
  }

  parseLine(line: string): void {
    if (line.includes('InitGame:')) {
      this.currentGameNumber++;
      this.currentGame = new GameStats();
    } else if (line.includes('Kill:') && this.currentGame) {
      const killInfo = this.parseKillLine(line);
      if (killInfo) {
        const { killer, victim, method } = killInfo;
        this.currentGame.addPlayer(killer);
        this.currentGame.addPlayer(victim);
        this.currentGame.addKill(killer, victim, method);
      }
    } else if (line.includes('ShutdownGame:') && this.currentGame) {
      this.games[`game_${this.currentGameNumber}`] = this.currentGame.getStats();
    }
  }

  getGames(): Games {
    return this.games;
  }

  generateRanking(): string {
    const playerTotalKills: { [player: string]: number } = {};
    
    Object.values(this.games).forEach(game => {
      Object.entries(game.kills).forEach(([player, kills]) => {
        playerTotalKills[player] = (playerTotalKills[player] || 0) + kills;
      });
    });

    return Object.entries(playerTotalKills)
      .sort(([, a], [, b]) => b - a)
      .map(([player, kills], index) => `${index + 1}. ${player} - ${kills} kills`)
      .join('\n');
  }
} 