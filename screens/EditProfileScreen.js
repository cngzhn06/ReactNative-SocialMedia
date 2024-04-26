import { Dimensions, Image, KeyboardAvoidingView, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { UserType } from '../UserContext';
import { MaterialCommunityIcons } from "@expo/vector-icons";



const windowWidth = Dimensions.get("window").width;

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const { userId, setUserId } = useContext(UserType);
  console.log("🚀 ~ EditProfileScreen ~ userId:", userId)

  
  const handleUpdate = () => {
    navigation.navigate("Home")
  }
  
  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.logoView}>
      <Image
        style={styles.logo}
        source={{
          uri: "https://vectorflags.s3.amazonaws.com/flags/lk-circle-01.png",
        }}
      />
    </View>

    <KeyboardAvoidingView>
      <View style={styles.textCont}>
        <Text style={styles.titleText}>Hesabınızla Güncelleyin</Text>
      </View>

      <View style={styles.inputCont}>
        <View style={styles.inputWrap}>
          <MaterialCommunityIcons
            style={styles.icon}
            name="email"
            size={windowWidth * 0.06}
            color="black"
          />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="gray"
          />
        </View>
        <View style={styles.inputWrap}>
          <MaterialCommunityIcons
            style={styles.icon}
            name="shield-lock"
            size={windowWidth * 0.06}
            color="black"
          />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            placeholder="Şifre"
            placeholderTextColor="gray"
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.buttonCont}>
        <Pressable style={styles.pressable} onPress={handleUpdate}>
          <Text style={styles.pressableText}>Onayla</Text>
        </Pressable>
      </View>

      <Pressable onPress={() => navigation.navigate("Register")}>

      </Pressable>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: "white",
  alignItems: "center",
},
logoView: {
  marginTop: windowWidth * 0.1,
},
logo: {
  width: windowWidth * 0.5,
  height: windowWidth * 0.4,
  resizeMode: "contain",
},
textCont: {
  justifyContent: "center",
  alignItems: "center",
},
titleText: {
  fontSize: windowWidth * 0.04,
  fontWeight: "bold",
  marginTop: windowWidth * 0.05,
},
inputCont: {
  marginTop: windowWidth * 0.2,
},
inputWrap: {
  flexDirection: "row",
  alignItems: "center",
  borderColor: "#D0D0D0",
  borderWidth: 1,
  paddingVertical: windowWidth * 0.02,
  borderRadius: windowWidth * 0.02,
  marginVertical: windowWidth * 0.02,
},
icon: {
  marginLeft: windowWidth * 0.02,
},
input: {
  color: "gray",
  width: windowWidth * 0.7,
  fontSize: 16,
},
buttonCont: {
  marginTop: windowWidth * 0.07,
  alignItems: "center",
},
pressable: {
  width: windowWidth * 0.5,
  backgroundColor: "black",
  padding: windowWidth * 0.02,
  borderRadius: windowWidth * 0.2,
},
pressableText: {
  textAlign: "center",
  fontWeight: "bold",
  fontSize: windowWidth * 0.06,
  color: "white",
},
registerText: {
  textAlign: "center",
  fontWeight: "bold",
  fontSize: windowWidth * 0.03,
  marginTop: windowWidth * 0.05,
},
});
