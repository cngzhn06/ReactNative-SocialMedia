import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import axios from "axios";

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
        navigation.navigate("Home"); // Başarılı olursa ana ekrana yönlendir
      } else {
        console.error("Hata:", response.data.message); // Hata durumunda konsola yaz
      }
    } catch (error) {
      console.error("API çağrısı sırasında hata:", error);
    }
  };

  const handleBack = async () => {
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
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
      <Pressable style={styles.button} onPress={handleBack}>
        <Text style={styles.buttonText}>geri</Text>
      </Pressable>
    </SafeAreaView>
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
    padding: windowWidth*0.02,
    marginBottom: windowWidth*0.04,
    width: windowWidth * 0.8,
    borderRadius:windowWidth*0.03
  },
  button: {
    backgroundColor: "black",
    padding: windowWidth*0.03,
    borderRadius: windowWidth*0.04,
  },
  buttonText: {
    color: "white",
    fontSize: windowWidth*0.05,
  },
});
