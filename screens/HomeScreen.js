import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import { UserType } from '../UserContext';

export default function HomeScreen() {

  const {userId,setUserId} = useContext(UserType)

  useEffect(() => {
    const fetchUsers = async () => {

        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        setUserId(userId);
  
    };
  
    fetchUsers();
  }, []);

  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  )
}

const styles = StyleSheet.create({})