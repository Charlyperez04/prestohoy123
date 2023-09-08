import { SvgUri } from "react-native-svg";
import React, { useEffect, useState, useCallback } from "react";
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
import * as Linking from "expo-linking";
import {
  View,
  Text,
  Image,
  ScrollView,
  Button,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Ellipse184 from "../../assets/Ellipse184.png";
import Group8777 from "../../assets/Group8777.png";
import logout from "../../assets/logout.png";
import Documents from "../../assets/Documents.png";
import arrow from "../../assets/arrow.png";
import logo from "../../assets/logo.png";
import api from "../../api/connection";
import * as Updates from "expo-updates";
import { useNavigation } from "@react-navigation/native";
import { log } from "react-native-reanimated";

function HomeScreenClient() {
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [client, setClient] = useState("");
  const [shops, setShops] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [fechaCorte, setFechaCorte] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [isModalTermsVisible, setModalTermsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logoutQuestion, setLogoutQuestion] = useState(false);
  const [modalMarginTop, setModalMarginTop] = useState(1000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const role = await AsyncStorage.getItem("userRole");
        const id = await AsyncStorage.getItem("userId");
        const tokenPush = await AsyncStorage.getItem("userTokenPush");
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
          let [responseClient, responseShops, responsePush] = await Promise.all([
            api.get(`/client/${id}`, { headers: { Authorization: token } }),
            api.get(`/owner/shops`, { headers: { Authorization: token } }),
            api.patch(
              `/client/tokenNotifications/${id}`,
              { token: tokenPush },
              { headers: { Authorization: token } }
            ),
          ]);
          setShops(responseShops.data);
          console.log(responsePush.data);
          await setClient(responseClient.data.client);
          setFechaCorte(responseClient.data.client.fechaCorte);
          setFechaPago(responseClient.data.client.fechaPago);

          // Actualizar el estado con los datos recibidos
        }
      } catch ({ error, response }) {
        if (
          response.data.status === "error" &&
          response.data.mensaje === "No se encontró al cliente con el ID proporcionado"
        ) {
          // Limpiar AsyncStorage y redirigir al usuario a la pantalla de inicio
          await AsyncStorage.clear();
          refreshData(true);
        }
        console.error(error);
        console.log(response.data);
      }
    };

    fetchData();
  }, [refreshData]);
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
  const [isModalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
        <View style={styles.clientBlock}>
          <Image source={{ uri: item.profilePhoto }} style={{ width: 50, height: 50 }} />
          <Text>{item.name}</Text>
          <Image source={arrow} style={{ width: 30, height: 30 }} />
        </View>
      </TouchableOpacity>
    ),
    []
  );

  return (
    <SafeAreaProvider>
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
        <View>
          <TouchableWithoutFeedback
            onPress={async () => {
              await navigation.replace("Main");
              AsyncStorage.clear();
            }}
          >
            <Image style={styles.menu} source={logout} />
          </TouchableWithoutFeedback>
        </View>
        <View>
          <TouchableWithoutFeedback onPress={() => setModalTermsVisible(true)}>
            <Image style={styles.terms} source={Documents} />
          </TouchableWithoutFeedback>
        </View>
        <Modal animationType="slide" transparent={true} visible={isModalTermsVisible}>
          <View style={styles.centeredView}>
            <ScrollView>
              <View style={styles.modalView1}>
                <Text style={styles.titleTerms}>TERMINOS Y CONDICIONES</Text>
                <Text style={styles.modalText}>
                  Los créditos ofrecidos a través de nuestra aplicación están sujetos a aprobación y
                  cumplimiento de requisitos específicos que se enumerarán a continuación. Por favor, léelos
                  atentamente antes de solicitar un crédito.
                </Text>
                <Text style={styles.modalText1}>Aprobación del Préstamo</Text>
                <Text style={styles.modalText}>
                  La aprobación de su solicitud de préstamo depende de la evaluación y verificación de su
                  información personal y financiera. Esto incluye, pero no se limita a, su historial e
                  ingresos. Se le notificará el resultado de su solicitud una vez que haya sido revisada.
                </Text>
                <Text style={styles.modalText1}>Costo Anual Total (CAT)</Text>
                <Text style={styles.modalText}>
                  El Costo Anual Total (CAT) para los créditos a través de nuestra aplicación es del 182.5%.
                  Esto incluye todos los costos relacionados con el crédito. Es importante tener en cuenta que
                  este porcentaje es una representación anual del coste del crédito.
                </Text>
                <Text style={styles.modalText1}>
                  Tasa de Porcentaje Anual (APR) e Información de Fechas de pago
                </Text>
                <Text style={styles.modalText}>
                  La Tasa de Porcentaje Anual (APR) en caso de no presentar retrasos en los pagos es de
                  182.5%. Además, podrás elegir la fecha de corte que mejor te convenga y la fecha de pago
                  será 10 días después de la fecha de corte seleccionada.
                </Text>
                <Text style={styles.modalText}>
                  Por favor, asegúrese de comprender plenamente estos términos antes de aceptar el préstamo.
                  Es importante entender todos estos términos y condiciones antes de solicitar un préstamo. Si
                  tienes alguna pregunta o necesitas más información, por favor contáctenos.
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalTermsVisible(!isModalTermsVisible)}
                >
                  <Text style={styles.textStyle}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
        <Text style={styles.welcomeText}>Bienvenido</Text>
        <Text style={styles.helloText}>¡Hola,</Text>
        <Text style={styles.username}>{client.name}!</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>{client.name}</Text>
          <Image style={styles.cardLogo} source={logo} />
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image source={{ uri: client.qrCode }} style={styles.qrCode} />
          </TouchableOpacity>

          <Modal animationType="slide" transparent={true} visible={isModalVisible}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Image style={styles.modalImage} source={{ uri: client.qrCode }} />
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(!isModalVisible)}>
                  <Text style={styles.textStyle}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Image style={styles.decorationLeftCard} source={Ellipse184} />
          <Image style={styles.decorationRightCard} source={Group8777} />
        </View>

        <View style={styles.creditBussines}>
          <Text
            style={{
              alignSelf: "center",
              marginTop: 5,
              fontSize: 14,
              marginBottom: 5,
              fontFamily: "Poppins_600SemiBold",
            }}
          >
            Tu monto por pagar es de {client.montoFinal ? "$" + client.montoFinal : "$" + 0}
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", flexDirection: "row" }}>
                Tu monto por pagar es de:
              </Text>
              <Text style={{ fontSize: 15, fontFamily: "Poppins_700Bold" }}>
                {client.montoFinal ? "$" + client.montoFinal : "$" + 0}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", flexDirection: "row" }}>
                Crédito restante:
              </Text>
              <Text style={{ fontSize: 15, fontFamily: "Poppins_700Bold", textAlign: "right" }}>
                ${client.maxCredit - client.usedCredit}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", flexDirection: "row" }}>
                Tu crédito es de:
              </Text>
              <Text style={{ fontSize: 15, fontFamily: "Poppins_700Bold" }}>${client.maxCredit}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", flexDirection: "row" }}>
                Has usado:
              </Text>
              <Text style={{ fontSize: 15, fontFamily: "Poppins_700Bold", textAlign: "right" }}>
                ${client.usedCredit}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", flexDirection: "row" }}>
                Fecha de corte:
              </Text>
              <Text style={{ fontSize: 15, fontFamily: "Poppins_700Bold" }}>{fechaCorte}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", flexDirection: "row" }}>
                Fecha limite de pago:
              </Text>
              <Text style={{ fontSize: 15, fontFamily: "Poppins_700Bold", textAlign: "right" }}>
                {fechaPago}
              </Text>
            </View>
          </View>
          <Text
            style={{
              alignSelf: "center",
              marginTop: 25,
              fontSize: 14,
              fontFamily: "Poppins_600SemiBold",
            }}
          >
            ¿Dónde quieres usar tu crédito?
          </Text>
          <FlatList data={shops} renderItem={renderItem} keyExtractor={(item) => item._id} />
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
  welcome: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: "#FF0083",
    alignItems: "center",
    justifyContent: "center",
  },
  titleTerms: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
  },
  welcomeText: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "white",
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },
  modalText1: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 17,
    lineHeight: 24,
    marginTop: 15,
    fontFamily: "Poppins_600SemiBold",
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
    marginTop: 5,
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
  terms: {
    position: "absolute",
    top: 10,
    right: 140,
    width: 35,
    height: 35,
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
    marginTop: 10,
    width: "100%",
    padding: 20,
    paddingTop: 10,
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
  modalView1: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
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
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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
  clientBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 8,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
export default HomeScreenClient;
