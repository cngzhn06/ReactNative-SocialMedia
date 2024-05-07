import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList,
  Dimensions,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;

const ProfileScreen = () => {
  const [user, setUser] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
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

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [userId]);

  const handleRefresh = () => {
    fetchProfile();
    fetchUserPosts();
  };

  const renderPostItem = ({ item }) => (
    <View style={styles.postItem}>
      <View style={{ flex: 1 }}>
        <Text>{item.content}</Text>
        <Text style={styles.dateText}>
          Oluşturulma Tarihi: {item.createdAt.substring(0, 10)}
        </Text>
      </View>
      <Pressable
        style={styles.dotIcon}
        onPress={() => {
          setSelectedPost(item);
          setModalVisible(true);
        }}
      >
        <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
      </Pressable>
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
    setModalVisible(false);
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

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("Home", { post: selectedPost });
                  }}
                >
                  <Text>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={deletePost}
                >
                  <Text>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginVertical: 5,
  },
  dateText: {
    color: "gray",
  },
  dotIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 150,
  },
  modalOption: {
    padding: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
});

export default ProfileScreen;
