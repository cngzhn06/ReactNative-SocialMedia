import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { UserType } from '../UserContext';

export default function EditProfileScreen() {
  const navigation = useNavigation();

  const { userId, setUserId } = useContext(UserType);
  console.log("🚀 ~ EditProfileScreen ~ userId:", userId)

  
  return (
    <SafeAreaView>
        <Text>deneme</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Main")}>
            <Text>onayla</Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})