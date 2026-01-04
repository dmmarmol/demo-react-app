import { getServerFirestore } from '@/firebase/server';
import { getSeasonsHandler } from './get-season';
import { getPlayersHandler, GetPlayersResponse } from './get-players';
import { NotFoundError } from '@/lib/errors/api-error';

// Mock the Firebase server module
jest.mock('@/firebase/server', () => ({
  getServerFirestore: jest.fn(),
}));

jest.mock('./get-season', () => ({
  getSeasonsHandler: jest.fn(),
}));

describe('getPlayersHandler', () => {
  let mockFirestore: {
    collection: jest.Mock;
  };
  let mockCollection: jest.Mock;
  let mockDoc: jest.Mock;
  let mockGet: jest.Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create mock functions
    mockGet = jest.fn();
    mockDoc = jest.fn(() => ({ get: mockGet }));
    mockCollection = jest.fn(() => ({ doc: mockDoc }));

    // Setup the Firestore mock
    mockFirestore = {
      collection: mockCollection,
    };

    (getServerFirestore as jest.Mock).mockReturnValue(mockFirestore);
    (getSeasonsHandler as jest.Mock).mockResolvedValue({ value: '2025-2026' });
  });

  describe('successful data retrieval', () => {
    it('should return players with correct count when data exists', async () => {
      const mockPlayers = {
        'guid-1': {
          name: 'John Doe',
          position: 'Forward',
          nationality: 'England',
          team: 'Arsenal',
          shirtNumber: 10,
          age: 28,
          appearances: 20,
          goals: 15,
          assists: 5,
          yellowCards: 2,
          minutesPlayed: 1800,
        },
        'guid-2': {
          name: 'Jane Smith',
          position: 'Midfielder',
          nationality: 'France',
          team: 'Manchester United',
          shirtNumber: 8,
          age: 26,
          appearances: 18,
          goals: 5,
          assists: 8,
          yellowCards: 1,
          minutesPlayed: 1600,
        },
      };

      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({ players: mockPlayers }),
      });

      const result: GetPlayersResponse = await getPlayersHandler();

      expect(result.count).toBe(2);
      expect(result.results).toHaveLength(2);
      expect(result.season).toBe('2025-2026');
    });

    it('should transform GUID-indexed players into an array', async () => {
      const mockPlayers = {
        'guid-1': {
          name: 'John Doe',
          position: 'Forward',
          nationality: 'England',
          team: 'Arsenal',
          shirtNumber: 10,
          age: 28,
          appearances: 20,
          goals: 15,
          assists: 5,
          yellowCards: 2,
          minutesPlayed: 1800,
        },
      };

      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({ players: mockPlayers }),
      });

      const result = await getPlayersHandler();

      expect(result.results[0].id).toBe('guid-1');
      expect(result.results[0].name).toBe('John Doe');
      expect(Array.isArray(result.results)).toBe(true);
    });

    it('should include all player properties in results', async () => {
      const mockPlayers = {
        'guid-1': {
          name: 'John Doe',
          position: 'Forward',
          nationality: 'England',
          team: 'Arsenal',
          shirtNumber: 10,
          age: 28,
          appearances: 20,
          goals: 15,
          assists: 5,
          yellowCards: 2,
          minutesPlayed: 1800,
        },
      };

      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({ players: mockPlayers }),
      });

      const result = await getPlayersHandler();
      const player = result.results[0];

      expect(player).toHaveProperty('id');
      expect(player).toHaveProperty('name');
      expect(player).toHaveProperty('position');
      expect(player).toHaveProperty('nationality');
      expect(player).toHaveProperty('team');
      expect(player).toHaveProperty('shirtNumber');
      expect(player).toHaveProperty('age');
      expect(player).toHaveProperty('appearances');
      expect(player).toHaveProperty('goals');
      expect(player).toHaveProperty('assists');
      expect(player).toHaveProperty('yellowCards');
      expect(player).toHaveProperty('minutesPlayed');
    });

    it('should handle multiple players correctly', async () => {
      const mockPlayers = {
        'guid-1': {
          name: 'Alice',
          position: 'Forward',
          nationality: 'England',
          team: 'Arsenal',
          shirtNumber: 10,
          age: 28,
          appearances: 20,
          goals: 15,
          assists: 5,
          yellowCards: 2,
          minutesPlayed: 1800,
        },
        'guid-2': {
          name: 'Bob',
          position: 'Midfielder',
          nationality: 'France',
          team: 'Manchester United',
          shirtNumber: 8,
          age: 26,
          appearances: 18,
          goals: 5,
          assists: 8,
          yellowCards: 1,
          minutesPlayed: 1600,
        },
        'guid-3': {
          name: 'Charlie',
          position: 'Defender',
          nationality: 'Spain',
          team: 'Barcelona',
          shirtNumber: 4,
          age: 30,
          appearances: 25,
          goals: 2,
          assists: 3,
          yellowCards: 4,
          minutesPlayed: 2200,
        },
      };

      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({ players: mockPlayers }),
      });

      const result = await getPlayersHandler();

      expect(result.count).toBe(3);
      expect(result.results).toHaveLength(3);
      expect(result.results.map((p) => p.name)).toEqual(expect.arrayContaining(['Alice', 'Bob', 'Charlie']));
    });

    it('should sort players by team name', async () => {
      const mockPlayers = {
        'guid-1': {
          name: 'Charlie',
          position: 'Defender',
          nationality: 'Spain',
          team: 'Barcelona',
          shirtNumber: 4,
          age: 30,
          appearances: 25,
          goals: 2,
          assists: 3,
          yellowCards: 4,
          minutesPlayed: 2200,
        },
        'guid-2': {
          name: 'Alice',
          position: 'Forward',
          nationality: 'England',
          team: 'Arsenal',
          shirtNumber: 10,
          age: 28,
          appearances: 20,
          goals: 15,
          assists: 5,
          yellowCards: 2,
          minutesPlayed: 1800,
        },
      };

      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({ players: mockPlayers }),
      });

      const result = await getPlayersHandler();

      // Players should be sorted by team: Arsenal before Barcelona
      expect(result.results[0].team).toBe('Arsenal');
      expect(result.results[1].team).toBe('Barcelona');
    });
  });

  describe('empty or missing data', () => {
    it('should throw NotFoundError when document does not exist', async () => {
      mockGet.mockResolvedValue({
        exists: false,
      });

      await expect(getPlayersHandler()).rejects.toThrow(NotFoundError);
      await expect(getPlayersHandler()).rejects.toThrow('No players were found');
    });

    it('should return empty results when players field is missing', async () => {
      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({}), // No players field
      });

      const result = await getPlayersHandler();

      expect(result.count).toBe(0);
      expect(result.results).toHaveLength(0);
      expect(result.results).toEqual([]);
    });

    it('should return empty results when players field is empty object', async () => {
      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({ players: {} }),
      });

      const result = await getPlayersHandler();

      expect(result.count).toBe(0);
      expect(result.results).toHaveLength(0);
      expect(result.results).toEqual([]);
    });

    it('should return empty results when players field is null', async () => {
      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({ players: null }),
      });

      const result = await getPlayersHandler();

      expect(result.count).toBe(0);
      expect(result.results).toHaveLength(0);
      expect(result.results).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('should propagate Firestore connection errors', async () => {
      const connectionError = new Error('Firestore connection failed');
      mockGet.mockRejectedValue(connectionError);

      await expect(getPlayersHandler()).rejects.toThrow('Firestore connection failed');
    });

    it('should handle malformed player data gracefully', async () => {
      const mockPlayers = {
        'guid-1': {
          name: 'John Doe',
          position: 'Forward',
          // Missing other required fields
        },
      };

      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({ players: mockPlayers }),
      });

      const result = await getPlayersHandler();

      // Should still transform even with incomplete data
      expect(result.results).toHaveLength(1);
      expect(result.results[0].id).toBe('guid-1');
      expect(result.results[0].name).toBe('John Doe');
    });

    it('should handle invalid data types in player objects', async () => {
      const mockPlayers = {
        'guid-1': {
          name: 'John Doe',
          position: 'Forward',
          nationality: 'England',
          team: 'Arsenal',
          shirtNumber: '10', // String instead of number
          age: 'twenty-eight', // String instead of number
          appearances: 20,
          goals: 15,
          assists: 5,
          yellowCards: 2,
          minutesPlayed: 1800,
        },
      };

      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({ players: mockPlayers }),
      });

      const result = await getPlayersHandler();

      // Should still return the player with the data as-is
      expect(result.results).toHaveLength(1);
      expect(result.results[0]).toBeDefined();
    });
  });

  describe('Firestore interaction', () => {
    it('should call collection with correct collection name', async () => {
      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({ players: {} }),
      });

      await getPlayersHandler();

      expect(mockCollection).toHaveBeenCalledWith('EXAMPLE_REACT_APP');
    });

    it('should call doc with correct document name', async () => {
      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({ players: {} }),
      });

      await getPlayersHandler();

      expect(mockDoc).toHaveBeenCalledWith('collections');
    });

    it('should call get on the document reference', async () => {
      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({ players: {} }),
      });

      await getPlayersHandler();

      expect(mockGet).toHaveBeenCalledTimes(1);
    });

    it('should call getSeasonsHandler to get current season', async () => {
      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({ players: {} }),
      });

      await getPlayersHandler();

      expect(getSeasonsHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('data transformation', () => {
    it('should preserve all player properties during transformation', async () => {
      const mockPlayers = {
        'guid-1': {
          name: 'John Doe',
          position: 'Forward',
          nationality: 'England',
          team: 'Arsenal',
          shirtNumber: 10,
          age: 28,
          appearances: 20,
          goals: 15,
          assists: 5,
          yellowCards: 2,
          minutesPlayed: 1800,
        },
      };

      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({ players: mockPlayers }),
      });

      const result = await getPlayersHandler();
      const player = result.results[0];

      expect(player.name).toBe('John Doe');
      expect(player.position).toBe('Forward');
      expect(player.nationality).toBe('England');
      expect(player.team).toBe('Arsenal');
      expect(player.shirtNumber).toBe(10);
      expect(player.age).toBe(28);
      expect(player.appearances).toBe(20);
      expect(player.goals).toBe(15);
      expect(player.assists).toBe(5);
      expect(player.yellowCards).toBe(2);
      expect(player.minutesPlayed).toBe(1800);
    });

    it('should use GUID as the id property', async () => {
      const mockPlayers = {
        'unique-guid-12345': {
          name: 'John Doe',
          position: 'Forward',
          nationality: 'England',
          team: 'Arsenal',
          shirtNumber: 10,
          age: 28,
          appearances: 20,
          goals: 15,
          assists: 5,
          yellowCards: 2,
          minutesPlayed: 1800,
        },
        'another-guid-67890': {
          name: 'Jane Smith',
          position: 'Midfielder',
          nationality: 'France',
          team: 'Paris',
          shirtNumber: 7,
          age: 26,
          appearances: 18,
          goals: 8,
          assists: 10,
          yellowCards: 1,
          minutesPlayed: 1600,
        },
      };

      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({ players: mockPlayers }),
      });

      const result = await getPlayersHandler();

      expect(result.results[0].id).toBe('unique-guid-12345');
      expect(result.results[1].id).toBe('another-guid-67890'); // Paris comes before Arsenal alphabetically
    });

    it('should handle numeric and string player properties correctly', async () => {
      const mockPlayers = {
        'guid-1': {
          name: 'John Doe',
          position: 'Forward',
          nationality: 'England',
          team: 'Arsenal',
          shirtNumber: 10,
          age: 28,
          appearances: 20,
          goals: 15,
          assists: 5,
          yellowCards: 2,
          minutesPlayed: 1800,
        },
      };

      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({ players: mockPlayers }),
      });

      const result = await getPlayersHandler();
      const player = result.results[0];

      // String properties
      expect(typeof player.name).toBe('string');
      expect(typeof player.position).toBe('string');
      expect(typeof player.nationality).toBe('string');
      expect(typeof player.team).toBe('string');

      // Numeric properties
      expect(typeof player.shirtNumber).toBe('number');
      expect(typeof player.age).toBe('number');
      expect(typeof player.appearances).toBe('number');
      expect(typeof player.goals).toBe('number');
      expect(typeof player.assists).toBe('number');
      expect(typeof player.yellowCards).toBe('number');
      expect(typeof player.minutesPlayed).toBe('number');
    });
  });
});
