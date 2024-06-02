import React, { useContext, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { UserType } from "../UserContext";
import axios from "axios";


export default function ZignechanScreen() {
  const [content, setContent] = useState("");
  const { userId, setUserId } = useContext(UserType);

  const handlePostSub = () => {
    const postData = {
      userId,
    };

    if (content) {
      postData.content = content;
    }

    axios
      .post("http://localhost:5010/api/create-post", postData)
      .then((response) => {
        setContent("");
      })
      .catch((error) => {
        console.log("🚀 ~ .then ~ error:", error);
      });
  };

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 10,
        }}
      >
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={require('../assets/zignechan.png')}
        />
        <Text>zignechan</Text>
      </View>

      <View style={{ flexDirection: "row", marginLeft: 10 }}>
        <TextInput
          placeholder="Mesajınızı yazınız"
          placeholderTextColor={"black"}
          value={content}
          onChangeText={(text) => setContent(text)}
          multiline
        />
      </View>

      <View style={{ marginTop: 40, alignItems: "center" }}>
        <TouchableOpacity
          onPress={handlePostSub}
          style={{ backgroundColor: "lightblue", padding: 10, borderRadius: 5 }}
        >
          <Text style={{ fontWeight: "bold" }}>Post Paylaş</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
