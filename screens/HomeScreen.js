import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import { UserType } from "../UserContext";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen() {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5010/api/get-posts");
      setPosts(response.data); // Set posts with response.data
    } catch (error) {
      console.log("🚀 ~ fetchPosts ~ error:", error);
    }
  };

  console.log(posts);

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `http://localhost:5010/api/post/${postId}/${userId}/like`
      );
      const updatedPost = response.data;

      const updatedPosts = posts?.map((post) =>
        post?._id === updatedPost._id ? updatedPost : post
      );

      setPosts(updatedPosts);
    } catch (error) {
      console.log("Error liking the post", error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await axios.put(
        `http://localhost:5010/api/post/${postId}/${userId}/unlike`
      );
      const updatedPost = response.data;
      const updatedPosts = posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
      console.log("updated",updatedPosts)
    
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  return (
    <ScrollView style={{ marginTop: 50, flex: 1, backgroundColor: "white" }}>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Image
          style={{
            width: 60,
            height: 40,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png",
          }}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        {posts?.map((post, index) => (
          <View key={index}>
            <View
              style={{
                padding: 15,
                borderColor: "#D0D0D0",
                borderTopWidth: 1,
                flexDirection: "row",
                gap: 10,
                marginVertical: 10,
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
            </View>
            <View style={{}}>
              <Text style={{fontSize:15,fontWeight:'bold',marginBottom:4}}>  {post?.user?.name}</Text>
              <Text>{post?.content}</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 15,
                }}
              >
                {post?.likes?.includes(userId) ? (
                  <AntDesign
                    onPress={() => handleDislike(post?._id)}
                    name="heart"
                    size={18}
                    color="red"
                  />
                ) : (
                  <AntDesign
                    onPress={() => handleLike(post?._id)}
                    name="hearto"
                    size={18}
                    color="black"
                  />
                )}

                <FontAwesome name="comment-o" size={18} color="black" />

                <Ionicons name="share-social-outline" size={18} color="black" />
              </View>

              <Text style={{ marginTop: 7, color: "gray" }}>
                {post?.likes?.length} likes • {post?.replies?.length} reply
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});