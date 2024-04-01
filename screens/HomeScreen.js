import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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

const windowWidth = Dimensions.get("window").width;

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
      console.log("updated", updatedPosts);

      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Image
          style={styles.logoImage}
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png",
          }}
        />
      </View>

      <View>
        {posts?.map((post, index) => (
          <View key={index}>
            <View style={styles.postContainer}>
              <Image
                style={styles.postImage}
                source={require('../assets/indir.jpeg')}
              />
              <Text style={styles.postUserName}>{post?.user?.name}</Text>
            </View>
            <View style={styles.contentContainer}>
              <Text>{post?.content}</Text>
              <View style={styles.postActionsContainer}>
                {post?.likes?.includes(userId) ? (
                  <AntDesign
                    onPress={() => handleDislike(post?._id)}
                    name="heart"
                    size={18}
                    color="red"
                    style={styles.postActionsIconLiked}
                  />
                ) : (
                  <AntDesign
                    onPress={() => handleLike(post?._id)}
                    name="hearto"
                    size={18}
                    color="black"
                  />
                )}
              </View>

              <Text style={styles.postLikesText}>
                {post?.likes?.length} Beğeni 
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  scrollView: {
    marginTop: windowWidth * 0.124,
    flex: 1,
    backgroundColor: "white",
  },
  logoImage: {
    width: windowWidth * 0.2,
    height: windowWidth * 0.15,
    resizeMode: "contain",
  },
  postContainer: {
    flexDirection: "row",
    padding: windowWidth * 0.02,
    borderColor: "#D0D0D0",
    borderTopWidth: 1,
    gap: windowWidth * 0.01,
    marginVertical: windowWidth * 0.01,
    alignItems:'center',

  },
  postImage: {
    width: windowWidth*0.09,
    height: windowWidth*0.09,
    borderRadius: windowWidth*0.1,
    resizeMode: "contain",
  },
  postUserName: {
    fontSize: windowWidth*0.04,
    fontWeight: "bold",
    marginLeft:windowWidth*0.01
  },
  postActionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: windowWidth*0.02,
    marginTop: windowWidth*0.02,
  },
  postActionsIcon: {
    fontSize: windowWidth*0.045,
    color: "black",
  },
  postActionsIconLiked: {
    color: "red",
  },
  postLikesText: {
    marginVertical: windowWidth*0.02,
    color: "gray",
  },
  contentContainer:{
    marginLeft:windowWidth*0.02
  }
});
