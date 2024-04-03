import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { UserType } from "../UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
const windowWidth = Dimensions.get("window").width;


export default function User({ item }) {
  const { userId, setUserId } = useContext(UserType);
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
          loggedInUserId: userId,
          targetUserId: targetId,
        }),
      });

      if (response.ok) {
        setRequestSent(false);
        console.log("takipten çıkma başarılı");
      }
    } catch (error) {
      console.log("🚀 ~ handleUnfollow ~ error:", error);
    }
  };

  return (
     <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image
          style={styles.avatar}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />

        <Text style={styles.userName}>
          {item?.name}
        </Text>

        {requestSent || item?.followers?.includes(userId) ? (
          <Pressable
            onPress={() => handleUnfollow(item?._id)}
            style={styles.button}
          >
            <Text
              style={styles.buttonText}
            >
              Takibi bırak
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => sendFollow(userId, item._id)}
            style={styles.button}
          >
            <Text
              style={styles.buttonText}
            >
              Takip et
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop:windowWidth*0.02
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: windowWidth*0.02,
  },
  avatar: {
    width:windowWidth*0.1,
    height: windowWidth*0.1,
    borderRadius: windowWidth*0.1,
    resizeMode: "contain",
  },
  userName: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },
  button: {
    borderColor: "#D0D0D0",
    borderWidth: windowWidth*0.004,
    padding: windowWidth*0.02,
    marginLeft: windowWidth*0.02,
    width: windowWidth*0.3,
    borderRadius: windowWidth*0.02,
  },
  followButton: {
    backgroundColor: "white",
  },
  unfollowButton: {
    backgroundColor: "black",
  },
  buttonText: {
    textAlign: "center",
    fontSize: windowWidth*0.04,
    fontWeight: "bold",
  },
});
