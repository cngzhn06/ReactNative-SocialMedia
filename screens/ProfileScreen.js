import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  Button,
  Alert,
} from "react-native";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;

const ProfileScreen = () => {
  const [user, setUser] = useState("");
  console.log("🚀 ~ ProfileScreen ~ user:", user.joinedDate)
  const [userPosts, setUserPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();
  const { userId } = useContext(UserType);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5010/api/profile/${userId}`
      );
      setUser(response.data.user);
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5010/api/user/${userId}/posts`
      );
      setUserPosts(response.data);
    } catch (error) {
      console.error("User posts fetch error:", error);
    }
  };

  const fetchFollowers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5010/api/followers/${userId}`
      );
      setFollowers(response.data);
    } catch (error) {
      console.error("Followers fetch error:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
    fetchFollowers();
  }, [userId]);

  const handleRefresh = () => {
    fetchProfile();
    fetchUserPosts();
    fetchFollowers();
  };

  const renderPostItem = ({ item }) => (
    <View style={styles.postItem}>
      <View style={{ flex: 1 }}>
        <Text>{item.content}</Text>
        <Text style={styles.dateText}>
          Oluşturulma Tarihi: {item.createdAt.substring(0, 10)}
        </Text>
        <Text style={styles.postLikesText}>{item?.likes?.length} Beğeni</Text>
      </View>
      <TouchableOpacity
        style={styles.dotIcon}
        onPress={() => {
          setSelectedPost(item);
          setIsMenuVisible(!isMenuVisible);
        }}
      >
        <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
      </TouchableOpacity>
      {isMenuVisible && selectedPost === item && (
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuOption} onPress={editPost}>
            <Text>Düzenle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuOption} onPress={deletePost}>
            <Text>Sil</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const deletePost = async () => {
    if (selectedPost) {
      try {
        await axios.delete(
          `http://localhost:5010/api/user/${userId}/posts/${selectedPost._id}`
        );
        setUserPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== selectedPost._id)
        );
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
    setIsMenuVisible(false);
  };

  const editPost = () => {
    setIsMenuVisible(false);
    Alert.alert('Düzenle')
  };

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
          <View style={{ position: "absolute", right: 0 }}>
            <TouchableOpacity onPress={handleRefresh}>
              <MaterialCommunityIcons name="refresh" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileRow}>
          <Image
            style={styles.profileImage}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
            }}
          />
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Text style={styles.followersText}>
              {followers.length} Takipçi
            </Text>

            <Text>
            </Text>
            
          </TouchableOpacity>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Takipçiler</Text>
          <FlatList
            data={followers}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Text style={styles.followerName}>{item.name}</Text>
            )}
          />
          <Button title="Kapat" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: windowWidth * 0.1,
    padding: windowWidth * 0.05,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: windowWidth * 0.04,
  },
  userName: {
    fontSize: windowWidth * 0.07,
    fontWeight: "bold",
  },
  userTag: {
    paddingHorizontal: windowWidth * 0.014,
    paddingVertical: windowWidth * 0.01,
    borderRadius: windowWidth * 0.02,
    backgroundColor: "#D0D0D0",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: windowWidth * 0.06,
    marginTop: windowWidth * 0.03,
  },
  profileImage: {
    width: windowWidth * 0.15,
    height: windowWidth * 0.15,
    borderRadius: windowWidth * 0.04,
    resizeMode: "contain",
  },
  followersText: {
    color: "gray",
    fontSize: windowWidth * 0.04,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: windowWidth * 0.03,
    marginTop: windowWidth * 0.04,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: windowWidth * 0.03,
    borderColor: "#D0D0D0",
    borderWidth: windowWidth * 0.005,
    borderRadius: windowWidth * 0.03,
  },
  myPostView: {
    marginTop: windowWidth * 0.02,
  },
  postItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: windowWidth * 0.05,
    borderWidth: windowWidth * 0.005,
    borderColor: "#ddd",
    borderRadius: windowWidth * 0.03,
    marginVertical: windowWidth * 0.02,
  },
  dateText: {
    marginVertical: windowWidth * 0.003,
    color: "gray",
  },
  dotIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    position: "absolute",
    right: windowWidth * 0.1,
    top: windowWidth * 0.01,
    backgroundColor: "white",
    borderRadius: windowWidth * 0.02,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuOption: {
    padding: windowWidth * 0.02,
  },
  postLikesText: {
    marginVertical: windowWidth * 0.003,
    color: "gray",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: windowWidth*0.14,
    backgroundColor: "white",
    padding: windowWidth*0.04,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  followerName: {
    fontSize: 18,
    padding: 5,
  },
});

export default ProfileScreen;
