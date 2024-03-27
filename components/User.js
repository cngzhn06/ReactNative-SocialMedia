import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { UserType } from "../UserContext";

export default function User({ item }) {
  const { userId, setUserId } = useContext(UserType);
  console.log("🚀 ~ User ~ userId:", userId);
  const [requestSent, setRequestSent] = useState(false);

  const sendFollow = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch("http://localhost:5010/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });

      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("🚀 ~ sendFollow ~ error:", error);
    }
  };

  const handleUnfollow = async (targetId) => {
    try {
      const response = await fetch("http://localhost:5010/api/users/unfollow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          loggedInUserId:userId,
          targetUserId:targetId,
         }),
      })    

      if(response.ok){
        setRequestSent(false)
        console.log("takipten çıkma başarılı");
      }
    } catch (error) {
      console.log("🚀 ~ handleUnfollow ~ error:", error);
    }
  };

  return (
    <View style={{ marginTop: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />

        <Text style={{ fontSize: 15, fontWeight: "500", flex: 1 }}>
          {item?.name}
        </Text>

        {requestSent || item?.followers?.includes(userId) ? (
          <Pressable
            onPress={() => handleUnfollow(item?._id)}
            style={{
              borderColor: "#D0D0D0",
              borderWidth: 1,
              padding: 10,
              marginLeft: 10,
              width: 100,
              borderRadius: 8,
            }}
          >
            <Text
              style={{ textAlign: "center", fontSize: 15, fontWeight: "bold" }}
            >
              Following
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => sendFollow(userId, item._id)}
            style={{
              borderColor: "#D0D0D0",
              borderWidth: 1,
              padding: 10,
              marginLeft: 10,
              width: 100,
              borderRadius: 8,
            }}
          >
            <Text
              style={{ textAlign: "center", fontSize: 15, fontWeight: "bold" }}
            >
              Follow
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
