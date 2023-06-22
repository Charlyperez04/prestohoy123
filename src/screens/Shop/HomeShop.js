import React, { useState, useEffect } from "react";
import { Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
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
import { BarCodeScanner } from "expo-barcode-scanner";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList,Modal,ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import logout from "../../assets/logout.png";
import arrow from "../../assets/arrow.png";
import QRModal from "./Modals/ScanQR";
import NipModal from "./Modals/GetNip";
import TransactionData from "./Modals/TransactionData";
import TransactionFinished from "./Modals/TransactionFinished";
import DenyTransaction from "./Modals/DenyTransaction";
import api from "../../api/connection";
import moment from "moment";

function HomeScreenShop({ navigation }) {
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [shop, setShop] = useState([]);
  const [isScannerVisible, setScannerVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [modalNipVisible, setModalNipVisible] = useState(false);
  const [transactionDataVisible, setTransactionDataVisible] = useState(false);
  const [transactionModalFinished, setTransactionModalFinished] = useState(false);
  const [transactionModalDenied, setTransactionModalDenied] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const[client,setClient]=useState('')
  const [amount, setAmount] = useState('')
  const [nip,setNip]=useState('')
  const [transactionData,setTransactionData]=useState('')
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
          let [responseShop, responseTransactions] = await Promise.all([
            api.get(`/shop/${id}`, { headers: { Authorization: token } }),
            api.get(`/shop/transactions/${id}`, { headers: { Authorization: token } }),
          ]);
          setShop(responseShop.data);
          console.log(responseTransactions.data);
          setTransactions(responseTransactions.data.transactions);
          // Actualizar el estado con los datos recibidos
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    setIsLoading(false)
  }, []);

  async function handleLogout() {
    
    await AsyncStorage.clear(); // this clears all data in async storage
    await Updates.reloadAsync(); // this restarts the JavaScript application
  }
  const handleBarCodeScanned = async ({ type, data }) => {
    
    try{
      setScanned(true);
      // Realizar la petición GET con Axios
      let [responseClient] = await Promise.all([
        api.get(`/client/${data}`, { headers: { Authorization: userToken } }), 
        
      ]);
      console.log(responseClient.data.client);
      setClient(responseClient.data.client)
      setScannerVisible(false); 
      await setModalNipVisible(true);
    } 
  catch({error,response}){
    Alert.alert(
      "Error",
      "El QR que intentas escanear no es valido",
      [
        {text: 'OK', onPress: () => setScannerVisible(false)}
      ],
      { cancelable: false }
    );
    
    console.error(error);
    console.log(response.data);
  }
  }
  const handleNipInput = (nip) => {
    setNip(nip)
    if(client.pin===nip){
      setModalNipVisible(false);
      setTransactionDataVisible(true);
    }else{
      Alert.alert(
        "Error",
        "El NIP no es valido",
        [
          {text: 'OK', onPress: () => setModalNipVisible(false)}
        ],
        { cancelable: false }
      );
      
    }
    // Aquí puedes manejar la validación del NIP y las acciones siguientes
  };
  const handleTransaction =async (amount) => {
    let concepto='transaccion'
    try{
      let [responseTransaction] = await Promise.all([
        api.post(`/shop/transactions`, { amount: amount, clientId:client._id,shopId:userId,pin:nip,concept:concepto}, { headers: { Authorization: userToken } }),
      ]);
      setTransactionDataVisible(false)
      console.log(responseTransaction.data);
      setTransactionData(responseTransaction.data.transaction)
      setTransactionModalFinished(true)
      
      
    }catch({e,response}){
     setTransactionModalDenied(true)
      console.error(e);
      console.log(response.data);
    }
  };
  
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
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

  const [isModalVisible, setModalVisible] = React.useState(false);

  return (
    <SafeAreaProvider>
      <View style={styles.welcome}>
        <TouchableOpacity onPress={handleLogout}>
          <Image style={styles.menu} source={logout} />
        </TouchableOpacity>
        <NipModal modalNipVisible={modalNipVisible}
        setModalNipVisible={setModalNipVisible}
        onNipInput={handleNipInput}/>
        <TransactionFinished
        transactionModalFinished={transactionModalFinished}
        setTransactionModalFinished={setTransactionModalFinished}
        clientName={transactionData.clientName}
        storeName={transactionData.shopName}
        amount={transactionData.amount}

        />
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
        <TransactionData clientName={client.name} maxCredit={client.maxCredit} usedCredit={client.usedCredit} transactionDataVisible={transactionDataVisible}
        setTransactionDataVisible={setTransactionDataVisible} amount={amount}
        setAmount={setAmount}
        handleTransaction={handleTransaction}/>
        <Text style={styles.welcomeText}>Bienvenido</Text>
        <Text style={styles.helloText}>¡Hola,</Text>
        <Text style={styles.username}>{shop.name}!</Text>
        <View
          style={{
            flexDirection: "row",
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
            width: "80%",
            padding: 12,
            backgroundColor: "white",
            borderRadius: 15,
            borderColor: "#E5E5E5",
            borderWidth: 1,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Poppins_600SemiBold",
              alignSelf: "center",
              marginLeft: "17%",
            }}
          >
            ESCANEAR QR
          </Text>
          <TouchableOpacity onPress={() => setScannerVisible(true)}>
            <Image source={arrow} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </View>
        <QRModal
          isScannerVisible={isScannerVisible}
          handleBarCodeScanned={handleBarCodeScanned}
          setScannerVisible={setScannerVisible}
          scanned={scanned}
          setScanned={setScanned}
        />

        <View style={styles.creditBussines}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Poppins_700Bold",
                  flexDirection: "row",
                }}
              >
                Transacciones
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Reloj")}>
              <Text
                style={{
                  marginTop: 5,
                  fontSize: 14,
                  fontFamily: "Poppins_600SemiBold",
                  color: "#FF0083",
                }}
              >
                Ver todas
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 25 }}>
           
            <DenyTransaction
              transactionModalDenied={transactionModalDenied}
              setTransactionModalDenied={setTransactionModalDenied}
            />
            <FlatList
              data={transactions}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.transactionBlock}>
                  <View>
                    <Text style={styles.transactionUser}>{item.clientName}</Text>
                    <Text style={styles.transactionDate}>
                      {moment(item.timestamp).subtract(1, "hour").format("YYYY-MM-DD HH:mm")}
                    </Text>
                  </View>
                  <Text style={styles.transactionAmount}>${item.amount}</Text>
                </View>
              )}
            />
          </View>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}></View>

          {/* Repite el View anterior para cada negocio */}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  welcome: {
    paddingTop: 60,
    flex: 1,
    backgroundColor: "#FF0083",
    alignItems: "center",
    justifyContent: "center",
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
  card: {
    marginTop: 20,
    width: "90%",
    height: 200,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    position: "relative", // para poder posicionar los elementos absolutos
  },
  cardText: {
    position: "absolute",
    top: 10,
    left: 10,
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
  cardLogo: {
    position: "absolute",
    bottom: 8,
    right: 0,
    width: 150,
    height: 30,
  },
  qrCode: {
    position: "relative",
    left: "50%",
    top: "100%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    width: 100,
    height: 100,
  },
  menu: {
    position: "absolute",
    top: 10,
    left: 140,
    width: 30,
    height: 30,
  },
  decorationLeftCard: {
    position: "absolute",
    bottom: 0,
    width: 70,
    height: 70,
    borderRadius: 4,
  },
  decorationRightCard: {
    position: "absolute",
    right: 0,
    width: 100,
    height: 100,
    borderRadius: 3,
  },
  creditBussines: {
    marginTop: 20,
    width: "100%",
    padding: 30,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20, // borde redondeado en la esquina superior izquierda
    borderTopRightRadius: 20, // borde redondeado en la esquina superior derecha
    borderBottomLeftRadius: 0, // elimina el borde redondeado en la esquina inferior izquierda
    borderBottomRightRadius: 0, // elimina el borde redondeado en la esquina inferior derecha
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalImage: {
    width: 300,
    height: 300,
    marginBottom: 15,
  },
  transactionBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  transactionUser: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: "Poppins_300Light",
  },
  transactionAmount: {
    fontSize: 15,
    fontFamily: "Poppins_700Bold",
    color: "#53D258",
  },
});
export default HomeScreenShop;
