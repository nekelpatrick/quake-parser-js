interface KillsByMeans {
  [key: string]: number;
}

interface PlayerKills {
  [playerName: string]: number;
}

class GameStats {
  private kills: number;
  private totalKills: number;
  private players: Set<string>;
  private killsByMeans: KillsByMeans;
  private playerKills: PlayerKills;

  constructor() {
    this.kills = 0;
    this.totalKills = 0;
    this.players = new Set<string>();
    this.killsByMeans = {};
    this.playerKills = {};
  }

  addPlayer(player: string): void {
    if (player !== '<world>') {
      this.players.add(player);
      if (!(player in this.playerKills)) {
        this.playerKills[player] = 0;
      }
    }
  }

  addKill(killer: string, victim: string, method: string): void {
    this.totalKills++;
    this.killsByMeans[method] = (this.killsByMeans[method] || 0) + 1;

    if (killer === '<world>') {
      // Decrease victim's kills when killed by world
      this.playerKills[victim] = (this.playerKills[victim] || 0) - 1;
    } else {
      // Increment killer's kills
      this.playerKills[killer] = (this.playerKills[killer] || 0) + 1;
    }
  }

  getStats() {
    return {
      total_kills: this.totalKills,
      players: Array.from(this.players),
      kills: this.playerKills,
      kills_by_means: this.killsByMeans
    };
  }
}

export default GameStats; 