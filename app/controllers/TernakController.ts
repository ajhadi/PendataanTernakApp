// src/controllers/TernakController.ts
import { addTernak, fetchTernak, fetchSurveyJenisKelamin, fetchTernakDetail, deleteTernak } from '../models/Database'; // Pastikan path ini sesuai
import { JenisTernak } from '../enums/JenisTernak';
import { JenisKelamin } from '../enums/JenisKelamin';

export const TernakController = {
    fetchAllTernak: async () => {
      try {
        const data = await fetchTernak();
        return data;
      } catch (error) {
        console.error('Error fetching ternak:', error);
        throw error;
      }
    },
    fetchSurveyJenisKelamin: async () => {
      try {
        const data = await fetchSurveyJenisKelamin();
        return data;
      } catch (error) {
        console.error('Error fetching ternak:', error);
        throw error;
      }
    },

  fetchTernakDetail: async (id: number) => {
    try {
      const data = await fetchTernakDetail(id);
      return data;
    } catch (error) {
      console.error('Error fetching ternak:', error);
      throw error;
    }
  },
  
  addNewTernak: async (nama: string, jenis: JenisTernak, umur: number, jenisKelamin: JenisKelamin) => {
    try {
      await addTernak(nama, jenis, umur, jenisKelamin);
    } catch (error) {
      console.error('Error adding ternak:', error);
      throw error;
    }
  },

  deleteTernak: async (id: number) => {
    try {
      await deleteTernak(id);
    } catch (error) {
      console.error('Error deleting ternak:', error);
      throw error;
    }
  },
};
