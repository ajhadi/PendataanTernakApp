import * as SQLite from 'expo-sqlite';
import { JenisTernak } from '../enums/JenisTernak';
import { JenisKelamin } from '../enums/JenisKelamin';

const db = SQLite.openDatabaseAsync('ternak.db');

export const createTable = async () => {
  await db;

  (await db).withTransactionAsync(async () => {
    (await db).execAsync(
      `CREATE TABLE IF NOT EXISTS ternak (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nama TEXT,
          jenis TEXT,
          umur INTEGER,
          jenis_kelamin TEXT
        )`
    );
  });
};

export const fetchTernak = async (): Promise<Array<{ id: number; nama: string; jenis: string; umur: number; jenis_kelamin: string }>> => {
  try {
    console.log('Start fetch Ternak');
    const result = (await db).getAllAsync<{ id: number; nama: string; jenis: string; umur: number; jenis_kelamin: string }>(
      'SELECT * FROM ternak;'
    );
    return result;
  } catch (error) {
    console.error('Failed to fetch ternak:', error);
    throw error;
  }
};

export const fetchSurveyJenisKelamin = async (): Promise<Array<{ jenis: string; jantan_total: number; jantan_percentage: string; betina_total: number; betina_percentage: string }>> => {
  const jenisTernak = Object.values(JenisTernak);
  const result: Array<{ jenis: string; jantan_total: number; jantan_percentage: string; betina_total: number; betina_percentage: string }> = [];
  
  try {
    for (const jenis of jenisTernak) {
      const data = await (await db).getAllAsync<{ jenis_kelamin: string; total: number }>(
        `SELECT jenis_kelamin, COUNT(*) AS total
         FROM ternak 
         WHERE jenis = ?
         GROUP BY jenis_kelamin;`,
        [jenis]
      );

      const jantanTotal = data.find(item => item.jenis_kelamin.trim() == JenisKelamin.Jantan)?.total || 0;
      const betinaTotal = data.find(item => item.jenis_kelamin.trim() == JenisKelamin.Betina)?.total || 0;
      // Calculate total and percentages
      const total = jantanTotal + betinaTotal;
      const jantanPercentage = total ? (jantanTotal / total) * 100 : 0;
      const betinaPercentage = total ? (betinaTotal / total) * 100 : 0;

      result.push({
        jenis: jenis,
        jantan_total: jantanTotal,
        jantan_percentage: jantanPercentage.toFixed(2) + '%',
        betina_total: betinaTotal,
        betina_percentage: betinaPercentage.toFixed(2) + '%',
      });
    }
  } catch (error) {
    console.error('Failed to fetch ternak:', error);
    throw error;
  }
  return result;
};

export const fetchTernakDetail = async (id: number): Promise<{ id: number; nama: string; jenis: string; umur: number; jenis_kelamin: string } | null> => {
  try {
    console.log('Start fetch Ternak');
    const result = (await db).getFirstAsync<{ id: number; nama: string; jenis: string; umur: number; jenis_kelamin: string }>(
      'SELECT * FROM ternak WHERE id = ?;',
      id
    );
    return result;
  } catch (error) {
    console.error('Failed to fetch ternak:', error);
    throw error;
  }
};

export const addTernak = async (nama: string, jenis: string, umur: number, jenis_kelamin: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = (await db).runAsync('INSERT INTO ternak (nama, jenis, umur, jenis_kelamin) VALUES (?, ?, ?, ?)', nama, jenis, umur, jenis_kelamin);
      resolve(result);
    } catch (error) {
      console.error('Failed Input Data', error);
      reject(error);
    }
  });
};

export const deleteTernak = async (id: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = (await db).runAsync('DELETE FROM ternak WHERE id = ?', id);
      resolve(result);
    } catch (error) {
      console.error('Failed Delete Data', error);
      reject(error);
    }
  });
};

export const dbExecute = db;