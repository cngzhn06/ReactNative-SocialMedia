import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // AsyncStorage'deki kullanıcı bilgilerini temizle
      await AsyncStorage.removeItem('authToken');
      
      // Kullanıcıyı çıkış ekranına yönlendir
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logoutButton}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 20,
    color: 'blue',
  },
});
