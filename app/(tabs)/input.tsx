import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { TernakController } from '../controllers/TernakController';
import { JenisTernak } from '../enums/JenisTernak';
import { JenisKelamin } from '../enums/JenisKelamin';

export default function InputDataScreen() {
  const [nama, setNama] = useState('');
  const [umur, setUmur] = useState('');
  const [jenis, setJenis] = useState<JenisTernak | null>(null);
  const [jenisKelamin, setJenisKelamin] = useState<JenisKelamin | null>(null);

  const handleSubmit = async () => {
    if (!nama || !umur || !jenis || !jenisKelamin) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    try {
      await TernakController.addNewTernak(nama, jenis, parseInt(umur), jenisKelamin);
      Alert.alert('Success', 'Ternak added successfully');
      // Reset form
      setNama('');
      setUmur('');
      setJenis(null);
      setJenisKelamin(null);
    } catch (error) {
      console.error('Failed to add ternak:', error);
      Alert.alert('Error', 'Failed to add ternak');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nama Ternak:</Text>
      <TextInput
        value={nama}
        onChangeText={setNama}
        placeholder="Masukkan nama ternak"
        style={styles.input}
      />
      <Text style={styles.label}>Umur Ternak:</Text>
      <TextInput
        value={umur}
        onChangeText={setUmur}
        placeholder="Masukkan umur ternak"
        keyboardType="numeric"
        style={styles.input}
      />
      <Text style={styles.label}>Jenis Ternak:</Text>
      <View style={styles.radioGroup}>
        {Object.values(JenisTernak).map((jenisTernak) => (
          <TouchableOpacity 
            key={jenisTernak} 
            style={styles.radioContainer} 
            onPress={() => setJenis(jenisTernak)}
          >
            <View style={[styles.radioButton, jenis === jenisTernak && styles.selectedRadio]} />
            <Text style={styles.radioLabel}>{jenisTernak}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Jenis Kelamin:</Text>
      <View style={styles.radioGroup}>
        {Object.values(JenisKelamin).map((kelamin) => (
          <TouchableOpacity 
            key={kelamin} 
            style={styles.radioContainer} 
            onPress={() => setJenisKelamin(kelamin)}
          >
            <View style={[styles.radioButton, jenisKelamin === kelamin && styles.selectedRadio]} />
            <Text style={styles.radioLabel}>{kelamin}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Tambah Ternak" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginTop: 10,
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  selectedRadio: {
    backgroundColor: '#007BFF', // Warna saat terpilih
  },
  radioLabel: {
    fontSize: 16,
  },
});
