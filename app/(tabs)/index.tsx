import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TernakController } from '../controllers/TernakController';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [ternak, setTernak] = useState<Array<{ id: number; nama: string; jenis: string; umur: number; jenis_kelamin: string }>>([]);
  const [surveyData, setSurveyData] = useState<{ jenis: string; jantan_total: number; jantan_percentage: string; betina_total: number; betina_percentage: string }[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        try {
          console.log('Query ternak');
          const data = await TernakController.fetchAllTernak();
          setTernak(data);
          const surveyData = await TernakController.fetchSurveyJenisKelamin(); // Fetch gender survey data
          setSurveyData(surveyData);
        } catch (error) {
          console.error('Failed to fetch data', error);
        }
      };

      loadData();
    }, [])
  );

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Konfirmasi",
      "Apakah Anda yakin ingin menghapus ternak ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          onPress: async () => {
            try {
              await TernakController.deleteTernak(id);
              setTernak(prevTernak => prevTernak.filter(item => item.id !== id));
              const surveyData = await TernakController.fetchSurveyJenisKelamin();
              setSurveyData(surveyData);
              Alert.alert("Berhasil", "Ternak berhasil dihapus.");
            } catch (error) {
              console.error("Gagal menghapus ternak:", error);
              Alert.alert("Error", "Gagal menghapus ternak.");
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: { id: number; nama: string; jenis: string; umur: number; jenis_kelamin: string } }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity 
        // onPress={() => navigation.navigate('Detail', { item })}
        >
        <Text style={styles.itemText}>{item.nama} - {item.jenis} - Umur: {item.umur} tahun</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Title for the survey section */}
      <Text style={styles.surveyHeader}>Data Ternak</Text>
      
      {/* Display Gender Distribution */}
      {surveyData.map((survey, index) => (
        <View key={index} style={styles.surveyContainer}>
          <Text style={styles.surveyTitle}>Jenis Ternak: {survey.jenis}</Text>
          <Text>Total Jantan: {survey.jantan_total} ({survey.jantan_percentage})</Text>
          <Text>Total Betina: {survey.betina_total} ({survey.betina_percentage})</Text>
        </View>
      ))}

      <FlatList
        data={ternak}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={<Text style={styles.header}>Daftar Ternak</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  itemContainer: {
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    flexDirection: 'row', // Menambahkan flexDirection untuk mengatur layout item
    justifyContent: 'space-between', // Memisahkan antara text dan tombol delete
    alignItems: 'center', // Menyelaraskan secara vertikal
  },
  itemText: {
    fontSize: 16,
    flex: 1, // Mengatur itemText untuk mengambil ruang yang tersedia
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deleteButton: {
    paddingLeft: 10, // Menambah jarak padding untuk tombol delete
  },
  surveyContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  surveyHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  surveyTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
