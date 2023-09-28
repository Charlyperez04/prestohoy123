import React, { useEffect, useState } from "react";
import {
  useFonts,
  Poppins_100Thin,
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/connection";
import moment from "moment";

const NotificationItem = ({ item }) => (
  <View style={styles.item}>
    <Icon name="bell-outline" style={styles.icon} size={30} color="#FF0083" />
    <View style={styles.content}>
      <Text style={styles.title}>{item.message}</Text>
      <Text style={styles.body}>{moment(item.date).subtract(1, "hour").format("YYYY-MM-DD HH:mm")}</Text>
    </View>
  </View>
);
function NotificationsScreen() {
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsSorted, setNotificationsSorted] = useState([]);

  const sortNotifications = () => {
    setNotificationsSorted(notifications.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const role = await AsyncStorage.getItem("userRole");
        const id = await AsyncStorage.getItem("userId");

        if (token !== null) {
          setUserToken(token);
        }
        if (role !== null) {
          setUserRole(role);
        }
        if (id !== null) {
          setUserId(id);
        }
        if (token !== null && id !== null) {
          // Realizar la petición GET con Axios
          let [response] = await Promise.all([
            api.get(`/client/notifications/${id}`, { headers: { Authorization: token } }),
          ]);
          console.log(response.data.notifications);
          setNotifications(response.data.notifications);
          sortNotifications();

          // Actualizar el estado con los datos recibidos
        }
      } catch ({ error, response }) {
        console.error(error);
        console.log(response);
      }
    };

    fetchData();
  }, []);
  useFonts({
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notificaciones</Text>
      <FlatList
        style={styles.notificationsList}
        data={notificationsSorted}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
    paddingBottom: 10,
  },
  notificationsList: {
    width: "100%",
    paddingHorizontal: 20,
  },
  item: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#E3E3E3",
    flexDirection: "row",
    borderRadius: 20,
  },
  icon: {
    marginRight: 10,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignContent: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
  body: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
});
export default NotificationsScreen;
