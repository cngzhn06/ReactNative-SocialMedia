import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { userId } = useContext(UserType);
  const [newUsername, setNewUsername] = useState("");

  const handleUpdateUsername = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5010/api/update-username",
        {
          userId,
          newUsername,
        }
      );

      if (response.status === 200) {
        console.log("Kullanıcı adı güncellendi:", response.data.user);
        navigation.goBack();
      } else {
        console.error("Hata:", response.data.message);
      }
    } catch (error) {
      console.error("API çağrısı sırasında hata:", error);
    }
  };

  const handleBack = () => {
    console.log("geri dön");
    navigation.goBack();
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View
          style={{
            position: "absolute",
            top: windowWidth * 0.15,
            right: windowWidth * 0.05,
          }}
        >
          <Pressable onPress={handleBack}>
            <MaterialCommunityIcons
              name="window-close"
              size={44}
              color="black"
            />
          </Pressable>
        </View>
        <TextInput
          style={styles.input}
          value={newUsername}
          onChangeText={setNewUsername}
          autoCapitalize="none"
          placeholder="Yeni kullanıcı adı"
        />
        <Pressable style={styles.button} onPress={handleUpdateUsername}>
          <Text style={styles.buttonText}>Güncelle</Text>
        </Pressable>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: windowWidth * 0.02,
    marginBottom: windowWidth * 0.04,
    width: windowWidth * 0.8,
    borderRadius: windowWidth * 0.03,
  },
  button: {
    backgroundColor: "gray",
    padding: windowWidth * 0.03,
    borderRadius: windowWidth * 0.04,
  },
  buttonText: {
    color: "white",
    fontSize: windowWidth * 0.05,
  },
});
