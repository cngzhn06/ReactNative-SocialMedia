import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios"
const windowWidth = Dimensions.get("window").width;

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name,setName] = useState("");
  const navigation = useNavigation();

  const handleRegister = () => {
    const user = {
      name:name,
      email:email,
      password:password
    }

    axios.post("http://localhost:5010/api/register",user).then((response) => {
      Alert.alert(
        "Kayıt Başarılı",
        "Mail kutunuzu kontrol ediniz."
      );
      navigation.navigate('Login')
      setName("");
      setEmail("");
      setPassword("");
    }).catch((error) => {
      console.log("🚀 ~ axios.post ~ error:", error)
      Alert.alert("Kayıt Başarısız","Kayıt olurken bir hatayla karşılaşıldı")
      
    })

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
          <Text style={styles.text}>Kayıt Olun</Text>
        </View>

        <View style={styles.inputCont}>
          <View style={styles.inputWrap}>
            <MaterialCommunityIcons
              style={{ marginLeft: windowWidth * 0.02 }}
              name="account"
              size={windowWidth * 0.06}
              color="black"
            />
            <TextInput
            autoCapitalize="none"
              value={name}
              onChangeText={(input) => setName(input)}
              style={{
                color: "gray",
                marginVertical: windowWidth * 0.02,
                width: windowWidth * 0.7,
                fontSize: name ? 16 : 16,
              }}
              placeholder="Adınız"
              placeholderTextColor={"gray"}
            />
          </View>
        </View>

        <View style={{marginTop:windowWidth*0.03}}>
          <View style={styles.inputWrap}>
            <MaterialCommunityIcons
              style={{ marginLeft: windowWidth * 0.02 }}
              name="email"
              size={windowWidth * 0.06}
              color="black"
            />
            <TextInput
            autoCapitalize="none"
              value={email}
              onChangeText={(input) => setEmail(input)}
              style={{
                color: "gray",
                marginVertical: windowWidth * 0.02,
                width: windowWidth * 0.7,
                fontSize: email ? 16 : 16,
              }}
              placeholder="Email"
              placeholderTextColor={"gray"}
            />
          </View>
        </View>

        <View style={{ marginTop: windowWidth * 0.03 }}>
          <View style={styles.inputWrap}>
            <MaterialCommunityIcons
              style={{ marginLeft: windowWidth * 0.02 }}
              name="shield-lock"
              size={windowWidth * 0.06}
              color="black"
            />
            <TextInput
            autoCapitalize="none"
              value={password}
              onChangeText={(input) => setPassword(input)}
              style={{
                color: "gray",
                marginVertical: windowWidth * 0.02,
                width: windowWidth * 0.7,
                fontSize: password ? 16 : 16,
              }}
              placeholder="Şifre"
              placeholderTextColor={"gray"}
              secureTextEntry
            />
          </View>
        </View>

        <View style={{ marginTop: windowWidth * 0.07, alignItems: "center" }}>
          <Pressable style={styles.pressable} onPress={handleRegister}>
            <Text style={styles.pressableText}>Kayıt ol</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => navigation.navigate("Login")}
          style={{ marginTop: windowWidth * 0.05 }}
        >
          <Text style={styles.registerText}>Hesabınız var mı? Giriş yapın</Text>
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
  text: {
    fontSize: windowWidth * 0.04,
    fontWeight: "bold",
    marginTop: windowWidth * 0.05,
  },
  textCont: {
    justifyContent: "center",
    alignItems: "center",
  },
  inputCont: {
    marginTop: windowWidth * 0.07,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: windowWidth * 0.01,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    paddingVertical: windowWidth * 0.02,
    borderRadius: windowWidth * 0.02,
  },
  pressable: {
    width: windowWidth * 0.5,
    backgroundColor: "black",
    padding: windowWidth * 0.02,
    marginTop: windowWidth * 0.05,
    marginVertical: "auto",
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
  },
});
