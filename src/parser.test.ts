import { describe, it, expect } from 'vitest';
import { LogParser } from './logParser';

describe('LogParser', () => {
  it('should parse kill events correctly', () => {
    const parser = new LogParser();
    
    const testLog = [
      '0:00 InitGame:',
      '0:00 Kill: 1022 2 22: <world> killed Isgalamido by MOD_TRIGGER_HURT',
      '0:15 Kill: 3 2 10: Isgalamido killed Dono da Bola by MOD_RAILGUN',
      '1:00 Kill: 3 2 10: Isgalamido killed Zeh by MOD_RAILGUN',
      '1:30 ShutdownGame:'
    ];

    testLog.forEach(line => parser.parseLine(line));
    const games = parser.getGames();
    const game1 = games.game_1;

    expect(game1.total_kills).toBe(3);
    expect(game1.players).toContain('Isgalamido');
    expect(game1.players).toContain('Dono da Bola');
    expect(game1.players).toContain('Zeh');
    expect(game1.kills['Isgalamido']).toBe(2);
    expect(game1.kills_by_means['MOD_TRIGGER_HURT']).toBe(1);
    expect(game1.kills_by_means['MOD_RAILGUN']).toBe(2);
  });
}); 