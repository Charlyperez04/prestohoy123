import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
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
import MapView from "react-native-maps";
import Marker from "react-native-maps";
import { View, Text, StyleSheet, FlatList, Image, Linking, Modal, Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import arrow from "../../assets/arrow.png";
import api from "../../api/connection";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";

function BusinessesScreen() {
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [shops, setShops] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

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
          let [responseShops] = await Promise.all([
            api.get(`/owner/shops`, { headers: { Authorization: token } }),
          ]);
          setShops(responseShops.data);

          // Actualizar el estado con los datos recibidos
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  const [fontsLoaded] = useFonts({
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
  const handleClientPress = (shopId) => {
    try {
      const shop = shops.find((shop) => shop._id === shopId);
      setSelectedClient(shop);
    } catch (error) {
      console.error(error);
    }
  };
  const BusinessItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleClientPress(item._id)}>
      <Image source={{ uri: item.profilePhoto }} style={styles.image} />
      <Text style={styles.title}>{item.name}</Text>
      <View>
        <Image source={arrow} style={styles.arrow} />
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Negocios Afiliados</Text>
      <Text style={styles.subtitle}>Conoce todos los lugares donde puedes usar tu credito PrestoHoy</Text>
      <FlatList
        style={styles.businessList}
        data={shops}
        renderItem={({ item }) => <BusinessItem item={item} />}
        keyExtractor={(item) => item._id}
      />
      {selectedClient && (
        <Modal
          visible={!!selectedClient}
          animationType="slide"
          onRequestClose={() => setSelectedClient(null)}
        >
          <SafeAreaProvider>
            <ScrollView>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Icon
                    onPress={() => setSelectedClient(null)}
                    name="keyboard-backspace"
                    size={40}
                    color="#000"
                  />
                </View>
                <Image source={{ uri: selectedClient.profilePhoto }} style={styles.modalUserImage} />

                <Text style={styles.modalUserName}>{selectedClient.name}</Text>

                <View style={styles.userDataContainer}>
                  <View style={styles.userDataLine}>
                    <Text style={styles.userDataName}>Horario: </Text>
                    <Text style={styles.userDataText}>{selectedClient.name}</Text>
                  </View>
                  <View style={styles.userDataLine}>
                    <Text style={styles.userDataName}>Numero telefónico: </Text>
                    <Text style={styles.userDataText}>{selectedClient.number}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.seeLocationButton}
                  onPress={() => {
                    // Abre la ubicación de la tienda en Google Maps
                    const url = `https://www.google.es/maps?q=${20.539784},${-97.41905}`;
                    Linking.openURL(url);
                  }}
                >
                  <Text style={styles.sendNotificationButtonText}>Ver ubicación</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendNotificationButton}>
                  <Text style={styles.sendNotificationButtonText}>Ver menu</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaProvider>
        </Modal>
      )}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 20.539784,
          longitude: -97.41905,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: 20.539784,
            longitude: -97.41905,
          }}
          title="Tienda"
          description="Tienda"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Poppins_300Light",
    paddingBottom: 10,
    paddingHorizontal: 40,
    textAlign: "center",
  },
  businessList: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1.84,
    elevation: 5,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#E5E5E5",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  title: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    marginLeft: 10,
  },
  arrow: { width: 30, height: 30 },
  modalContainer: {
    ...Platform.select({
      ios: {
        flex: 1,
        backgroundColor: "white",
        marginTop: 50,
      },
      android: {
        lex: 1,
        backgroundColor: "white",
        marginTop: 20,
      },
    }),
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  modalUserImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    position: "absolute",
    alignSelf: "center",
  },
  modalUserName: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    marginTop: 20,
  },
  userDataContainer: {
    marginTop: 5,
    margin: 10,
    padding: 10,
    elevation: 5,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  userDataLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  userDataName: {
    fontFamily: "Poppins_600SemiBold",
    maxWidth: "50%",
    fontSize: 16,
  },
  userDataText: {
    maxWidth: "50%",
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    alignSelf: "center",
  },
  userDataImage: {
    width: 50,
    height: 50,
  },
  sendNotificationButton: {
    marginTop: 15,
    backgroundColor: "#FF0083",
    padding: 8,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },
  sendNotificationButtonText: {
    color: "white",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 17,
  },
  map: {
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 10,
    height: 300,
  },
  seeLocationButton: {
    marginTop: 15,
    backgroundColor: "#008CFF",
    padding: 8,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },
});

export default BusinessesScreen;
