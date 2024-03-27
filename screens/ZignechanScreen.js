import { Image, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";

export default function ZignechanScreen() {
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
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png",
          }}
        />

        <Text>zignechan</Text>
      </View>

      <View>
        <TextInput placeholder="Mesajınızı yazınız"/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
