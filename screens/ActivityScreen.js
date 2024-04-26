import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const windowWidth = Dimensions.get("window").width;
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { UserType } from "../UserContext";
import "core-js/stable/atob";
import User from "../components/User";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActivityScreen() {
  const [selectedButton, setSelctedButton] = useState("people");
  const [content, setContent] = useState("People Content");
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);

  const handleButtonClick = (buttonName) => {
    setSelctedButton(buttonName);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      axios
        .get(`http://localhost:5010/api/user/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log("error", error);
        });
    };

    fetchUsers();
  }, []);

  return (
    <ScrollView>
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.headerText}>Aktiviteler</Text>

          <View style={styles.buttonContainer}>
            <Text>Tanıyor olabileceğin kişiler</Text>
          </View>

          <View>
            {selectedButton === "people" && (
              <View style={{ marginTop: 20 }}>
                {users?.map((item, index) => (
                  <User key={index} item={item} />
                ))}
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: windowWidth * 0.02,
  },
  headerText: {
    fontSize: windowWidth * 0.08,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: windowWidth * 0.02,
  },
  button: {
    flex: 1,
    paddingVertical: windowWidth * 0.02,
    backgroundColor: "white",
    borderRadius: windowWidth * 0.022,
  },
  selectedButton: {
    backgroundColor: "black",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
  },
});
