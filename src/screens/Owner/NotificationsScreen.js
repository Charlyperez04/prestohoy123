import React, { useState, useEffect,useCallback} from "react";
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
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Modal,ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import api from '../../api/connection'
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from 'moment'
import trash from "../../assets/trash.png";
import logout from "../../assets/logout.png";
import pending from "../../assets/pending.png";
import tick from "../../assets/tick.png";

function HomeScreen() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [buttonsVisible, setButtonsVisible] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState(0);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null)
  const [userId, setUserId] = useState(null)
  const [isLoading,setIsLoading]=useState(false)
  

  useEffect(() => {
    setIsLoading(true)
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
          let [ responseTransactions] = await Promise.all([
   
            api.get(`/owner/transactions`, { headers: { Authorization: token } }),
          ]);

          // Actualizar el estado con los datos recibidos
          setTransactions(responseTransactions.data);
        }
      } catch ({ error, response }) {
        console.error(error);
        console.log(response);
      }
    };

    fetchData();
    setIsLoading(false)
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

  const handleCloseModal = () => {
    setModalVisible(false);
  };



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
       <Modal transparent={true} animationType={"none"} visible={isLoading}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <ActivityIndicator size="large" color="#FF0083" />
              </View>
            </Modal>
      <View style={styles.creditBussines}>
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 29,
              fontFamily: "Poppins_700Bold",
              flexDirection: "row",
              textAlign: "center",
            }}
          >
            Transacciones
          </Text>
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
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
    paddingTop: 60,
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
    width: "45%",
    padding: 5,
    backgroundColor: "white",
    borderRadius: 15,
    borderColor: "#E5E5E5",
    borderWidth: 1,
  },
  dataTitleBlock: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  dataTextBlock: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "#FF0083",
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
    paddingTop: 55,
    width: "100%",
    flex: 1,
    paddingBotom: 30,
    padding: 20,
    backgroundColor: "#FFF",
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
    width: "96%",
    alignSelf: "center",
    padding: 5,
    marginBottom: 10,
    borderRadius: 15,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    marginHorizontal: 5,
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
});
export default HomeScreen;
