import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/connection";

import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import trash from "../../assets/trash.png";
import logout from "../../assets/logout.png";
import pending from "../../assets/pending.png";
import tick from "../../assets/tick.png";
import moment from "moment";

function HomeScreen({ navigation }) {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [buttonsVisible, setButtonsVisible] = useState([]);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [clientsLength, setClientsLength] = useState("");
  const [shopsLength, setShopsLength] = useState("");
  const [pendingTransactions, setPendingTransactions] = useState("");
  const [totalCredit, setTotalCredit] = useState("");
  const [transactions, setTransactions] = useState("");
  const [shops, setShops] = useState("");
  const [clients, setClients] = useState("");
  const [reloadScreen, setReloadScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);
  const [resetCounterModal, setResetCounterModal] = useState(false);
  const [logoutQuestion, setLogoutQuestion] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const role = await AsyncStorage.getItem("userRole");
        const id = await AsyncStorage.getItem("userId");
        const expiryDate = await AsyncStorage.getItem("tokenExpiry"); // obtienes la fecha de expiración
        if (token !== null) {
          const now = Date.now();
          const expiryTime = Number(expiryDate); // ya está en milisegundos, no necesitas convertir
          if (now >= expiryTime) {
            // si el token ha expirado
            await AsyncStorage.clear(); // this clears all data in async storage
            await Updates.reloadAsync(); // this restarts the JavaScript application
          } else {
            setUserToken(token);
          }
        }

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
          let [responseOwner, responseClients, responseShops, responseTransactions] = await Promise.all([
            api.get(`/owner/profile/${id}`, { headers: { Authorization: token } }),
            api.get(`/owner/clients`, { headers: { Authorization: token } }),
            api.get(`/owner/shops`, { headers: { Authorization: token } }),
            api.get(`/owner/transactions`, { headers: { Authorization: token } }),
          ]);

          // Actualizar el estado con los datos recibidos

          setUserName(responseOwner.data.name);
          setTransactions(responseTransactions.data);
          setShops(responseShops.data);
          setClients(responseClients.data);
          setPendingTransactions(responseTransactions.data.filter((obj) => obj.status === "pending").length);
          setTotalSpent(responseOwner.data.totalSpent);

          let totalMaxCredit = 0;

          for (let i = 0; i < responseClients.data.length; i++) {
            totalMaxCredit += responseClients.data[i].maxCredit;
          }

          setTotalCredit(totalMaxCredit);

          setClientsLength(responseClients.data.length);
          setShopsLength(responseShops.data.length);
        }
        setIsLoading(false);
      } catch ({ error, response }) {
        console.error(error);
        console.log(response);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [reloadScreen]);

  const handleLogout = () => {
    setIsLoading(true)
    setTimeout(() => {
      setLogoutQuestion(false)
      navigation.replace('Main')
      AsyncStorage.clear()
      setIsLoading(false)
    }, 800);
    
  };
  const handleResetSpent = useCallback(async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const id = await AsyncStorage.getItem("userId");
      console.log(userToken);
      const response =  await api.patch(
        `/owner/resetSpent/${id}`,
        { status: "done" },
        { headers: { Authorization: userToken } }
        );
        setTotalSpent(response.data.totalSpent);
        setResetCounterModal(false);
        console.log(response.data);
        setReloadScreen(true)
    } catch ({ error, response }) {
      console.error(error);
      console.log(response.data);
    }
  }, []);
  const handlePress = useCallback(
    async (transactionId, action, item) => {
      setSelectedTransaction(transactionId);
      const token = await AsyncStorage.getItem("userToken");
      // Crear una copia de los datos
      let newData = [...transactions];

      // Encontrar el índice de la transacción en el array
      let index = newData.findIndex((transaction) => transaction._id === transactionId);

      if (action === "done") {
        await api.put(
          `/owner/transactions/${transactionId}`,
          { status: "done" },
          { headers: { Authorization: userToken } }
        );
        setModalMessage("Marcada como hecha con éxito");
        // Cambiar el estado de la transacción en la copia de los datos
        newData[index].status = "done";
        // Cambiar el estado de la transacción en la copia de los datos
      } else if (action === "pending") {
        await api.put(
          `/owner/transactions/${transactionId}`,
          { status: "pending" },
          { headers: { Authorization: userToken } }
        );
        setModalMessage("Marcada como pendiente con éxito");
        // Cambiar el estado de la transacción en la copia de los datos
        newData[index].status = "pending";
      } else if (action === "delete") {
        await api.delete(`/owner/transactions/${transactionId}`, { headers: { Authorization: userToken } });
        setModalMessage("Borrada con éxito");
        // Eliminar la transacción de la copia de los datos
        newData.splice(index, 1);
      }

      // Actualizar el estado del componente con los nuevos datos
      setTransactions(newData);

      setModalVisible(true);
    },
    [transactions]
  );

  const handlePressTransaction = useCallback(
    (transactionId) => {
      if (selectedTransaction === transactionId) {
        setSelectedTransaction(null);
      } else {
        setSelectedTransaction(transactionId);
      }
    },
    [selectedTransaction]
  );

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
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
    <SafeAreaProvider>
      <Modal visible={logoutQuestion}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>¿Seguro que quieres cerrar sesión?</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <TouchableOpacity style={styles.buttonPink} onPress={handleLogout}>
                <Text style={styles.textStyle}>Si</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonGrey} onPress={() => setLogoutQuestion(false)}>
                <Text style={styles.textStyle}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
       <Modal transparent={true} animationType={"none"} visible={isLoading}>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: -30,
            right: 0,
            bottom: 0,
            width: "125%",
            height: "110%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <ActivityIndicator size="large" color="#FF0083" />
        </View>
      </Modal>
      <View style={styles.welcome}>
        <TouchableOpacity
          onPress={() => setLogoutQuestion(true)}
          style={{
            position: "absolute",
            right: 21,
            top: 66,
          }}
        >
          <Image style={styles.menu} source={logout} />
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Bienvenido</Text>
        <Text style={styles.helloText}>¡Hola,</Text>
        <Text style={styles.username}>{userName}!</Text>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-around",
            paddingHorizontal: 30,
          }}
        >
          <View style={styles.dataBlock}>
            <Text style={styles.dataTitleBlock}>Usuarios</Text>
            <Text style={styles.dataTextBlock}>{clientsLength}</Text>
          </View>
          <View style={styles.dataBlock}>
            <Text style={styles.dataTitleBlock}>Negocios</Text>
            <Text style={styles.dataTextBlock}>{shopsLength}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-around",
            paddingHorizontal: 30,
          }}
        >
       
          <View style={styles.dataBlock}>
            <Text style={styles.dataTitleBlock}>Total Otorgado</Text>
            <Text style={styles.dataTextBlock}>${totalCredit}</Text>
          </View>
          <View style={styles.dataBlock}>
            <Text style={styles.dataTitleBlock}>Pendientes</Text>
            <Text style={styles.dataTextBlock}>{pendingTransactions}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-around",
            paddingHorizontal: 30,
          }}
        >
          <Modal transparent={true} animationType={"slide"} visible={resetCounterModal}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>¿Seguro que quieres reiniciar el contador?</Text>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <TouchableOpacity style={styles.buttonPink} onPress={handleResetSpent}>
                    <Text style={styles.textStyle}>Si</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonGrey} onPress={() => setResetCounterModal(false)}>
                    <Text style={styles.textStyle}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <View style={styles.dataBlock}>
            <TouchableOpacity onPress={() => setResetCounterModal(true)}>
              <Text style={styles.dataTitleBlock}>Total gastado</Text>
              <Text style={styles.dataTextBlock}>${totalSpent}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.creditBussines}>
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Poppins_600SemiBold",
                  flexDirection: "row",
                  textAlign: "center",
                }}
              >
                Ultimas transacciones realizadas
              </Text>
            </View>
          </View>
          <View style={{ marginBottom: 25 }}>
            <FlatList
              data={transactions}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handlePressTransaction(item._id)}>
                  {selectedTransaction === item._id && (
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity onPress={() => handlePress(item._id, "done", item)}>
                        <Image style={styles.buttonImage} source={tick} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handlePress(item._id, "pending", item)}>
                        <Image style={styles.buttonImage} source={pending} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handlePress(item._id, "delete")}>
                        <Image style={styles.buttonImage} source={trash} />
                      </TouchableOpacity>
                    </View>
                  )}
                  <View style={styles.transactionBlock}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Image
                        style={styles.statusImage}
                        source={
                          item.status === "done"
                            ? require("../../assets/tick.png")
                            : require("../../assets/pending.png")
                        }
                      />
                      <View>
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily: "Poppins_600SemiBold",
                            color: "#0000009D",
                          }}
                        >
                          De:
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: "Poppins_400Regular",
                          }}
                        >
                          {item.clientName}
                        </Text>
                      </View>
                      <View style={{ justifyContent: "flex-start", width: "50%" }}>
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily: "Poppins_600SemiBold",

                            color: "#0000009D",
                            textAlign: "left",
                          }}
                        >
                          Monto:
                        </Text>
                        <Text
                          style={{
                            textAlign: "center",
                            fontFamily: "Poppins_600SemiBold",
                            fontSize: 14,
                            color: "#00A31A",
                          }}
                        >
                          ${item.amount}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <View>
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily: "Poppins_600SemiBold",
                            color: "#0000009D",
                            marginTop: 5,
                          }}
                        >
                          Para:
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: "Poppins_400Regular",
                          }}
                        >
                          {item.shopName}
                        </Text>
                      </View>
                      <View style={{ justifyContent: "flex-start", width: "50%" }}>
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily: "Poppins_600SemiBold",
                            color: "#0000009D",
                            textAlign: "center",
                          }}
                        >
                          Fecha y hora:
                        </Text>
                        <Text
                          style={{
                            textAlign: "center",
                            fontFamily: "Poppins_600SemiBold",
                            fontSize: 14,
                            color: "#CA2D0A",
                          }}
                        >
                          {moment(item.timestamp).subtract(1, "hour").format("YYYY-MM-DD HH:mm")}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleCloseModal}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{modalMessage}</Text>
                <Image source={require("../../assets/succes.png")} />
                <TouchableOpacity style={{ ...styles.openButton }} onPress={handleCloseModal}>
                  <Text style={styles.textStyle}>Vale</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  buttonPink: {
    backgroundColor: "#554E4E",
    padding: 10,
    width: "40%",
    marginRight: "10%",
    borderRadius: 40,
    marginBottom: 15,
  },
  buttonGrey: {
    backgroundColor: "#FF0083",
    padding: 10,
    width: "40%",
    marginLeft: "10%",
    borderRadius: 40,
    marginBottom: 15,
  },
  statusImage: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 20,
    height: 20,
  },
  buttonImage: {
    width: 40,
    height: 40,
    marginHorizontal: 12,
    margin: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#FF0083",
    borderRadius: 20,
    padding: 5,
    width: 130,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
  },

  welcome: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: "#FF0083",
    alignItems: "center",
    justifyContent: "center",
  },
  dataBlock: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 1.84,
    elevation: 5,
    marginHorizontal: 20,
    width: "49%",
    padding: 2,
    backgroundColor: "white",
    borderRadius: 15,
    borderColor: "#E5E5E5",
    borderWidth: 1,
  },
  dataTitleBlock: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
  },
  dataTextBlock: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "#FF0083",
    alignSelf:'center'
  },
  welcomeText: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "white",
  },
  helloText: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: "white",
  },
  username: {
    fontSize: 26,
    fontFamily: "Poppins_700Bold",
    color: "white",
  },
  creditBussines: {
    marginTop: 20,
    width: "100%",
    paddingBotom: 30,
    padding: 20,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20, // borde redondeado en la esquina superior izquierda
    borderTopRightRadius: 20, // borde redondeado en la esquina superior derecha
    borderBottomLeftRadius: 0, // elimina el borde redondeado en la esquina inferior izquierda
    borderBottomRightRadius: 0, // elimina el borde redondeado en la esquina inferior derecha
    flex: 1,
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalImage: {
    width: 300,
    height: 300,
    marginBottom: 15,
  },
  transactionBlock: {
    alignSelf: "center",
    width: "95%",
    padding: 5,
    marginBottom: 10,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
});
export default HomeScreen;
