import { StyleSheet, Text, View, Image, Pressable, FlatList, Dimensions } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
const windowWidth = Dimensions.get("window").width;

const ProfileScreen = () => {
  const [user, setUser] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const navigation = useNavigation();
  const { userId } = useContext(UserType);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5010/api/profile/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:5010/api/user/${userId}/posts`);
        setUserPosts(response.data);
      } catch (error) {
        console.error("User posts fetch error:", error);
      }
    };

    fetchProfile();
    fetchUserPosts();
  }, [userId]); 

  const renderPostItem = ({ item }) => (
    <View style={styles.postItem}>
      <Text>{item.content}</Text>
      <Text style={styles.dateText}>Oluşturulma Tarihi: {item.createdAt.substring(0, 10)}</Text>
    </View>
  );

  const logout = async () => {
    await AsyncStorage.removeItem("authToken");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.headerRow}>
          <Text style={styles.userName}>{user?.name}</Text>
          <View style={styles.userTag}>
            <Text>zignechan.io</Text>
          </View>
        </View>

        <View style={styles.profileRow}>
          <Image
            style={styles.profileImage}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
            }}
          />
          <Text style={styles.followersText}>
            {user?.followers?.length} followers
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("Edit")}
          >
            <Text>Profili Düzenle</Text>
          </Pressable>

          <Pressable onPress={logout} style={styles.button}>
            <Text>Çıkış Yap</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.myPostView}>
        <FlatList
          data={userPosts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={<Text>Henüz bir gönderi yok.</Text>} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 55,
    padding: 15,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  userTag: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#D0D0D0",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "contain",
  },
  followersText: {
    color: "gray",
    fontSize: 15,
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    borderRadius: 5,
  },
  myPostView: {
    marginTop: windowWidth * 0.02,
  },
  postItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginVertical: 5,
  },
  dateText: {
    color: "gray",
  },
});

export default ProfileScreen;
