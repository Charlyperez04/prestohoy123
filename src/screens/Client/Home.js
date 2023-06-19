import { SvgUri } from 'react-native-svg';
import React, { useEffect ,useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts,    
  Poppins_100Thin,
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black
} from '@expo-google-fonts/poppins';
import * as Linking from 'expo-linking';
import {
  View,
  Text,
  Image,
  ScrollView,
  Button,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { NavigationContainer } from "@react-navigation/native";
import BusinessesScreen from './ShopList'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NotificationsScreen from './Notifications'
import { SafeAreaProvider } from "react-native-safe-area-context";
import Ellipse184 from "../../assets/Ellipse184.png";
import Group8777 from "../../assets/Group8777.png";
import logout from "../../assets/logout.png";
import arrow from "../../assets/arrow.png";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import logo from "../../assets/logo.png";
import api from "../../api/connection";
import * as Updates from "expo-updates";



function HomeScreenClient() {

  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [client, setClient] = useState('');
  const [shops, setShops] = useState([]);
  const [refreshData, setRefreshData] = useState(false);


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
          let [responseClient,responseShops] = await Promise.all([
            api.get(`/client/${id}`, { headers: { Authorization: token } }), 
            api.get(`/owner/shops`, { headers: { Authorization: token } }), 

          ]);
          setShops(responseShops.data);
          setClient(responseClient.data.client)
  
          // Actualizar el estado con los datos recibidos
  
                }
      } catch ({error,response}) {
        console.error(error);
        console.log(response.data);
 
      }
    }
  
    fetchData();
  }, [refreshData]);
  const [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black
  });
  const [isModalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    async function handleLogout() {
      await AsyncStorage.clear(); // this clears all data in async storage
      await Updates.reloadAsync(); // this restarts the JavaScript application
      setRefreshData(!refreshData)
    }
    
    const renderItem = ({ item }) => (
      <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
        <View style={styles.clientBlock}>
          <Image source={{ uri: item.profilePhoto }} style={{ width: 50, height: 50 }} />
          <Text>{item.name}</Text>
          <Image source={arrow} style={{ width: 30, height: 30 }} />
        </View>
      </TouchableOpacity>
    );

  return (
    <SafeAreaProvider>
      <View style={styles.welcome}>
        <TouchableOpacity onPress={handleLogout}>
          <Image
            style={styles.menu}
            source={logout}
          />
        </TouchableOpacity>
        <Text style={styles.welcomeText}>
          Bienvenido
        </Text>
        <Text style={styles.helloText}>
          ¡Hola,
        </Text>
        <Text style={styles.username}>
          {client.name}!
        </Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            {client.name}
          </Text>
          <Image
            style={styles.cardLogo}
            source={logo}
          />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
        source={{uri:client.qrCode}}
        style={styles.qrCode}
        />
        
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={styles.modalImage}
              source={{uri:client.qrCode}}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!isModalVisible)}
            >
              <Text style={styles.textStyle}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
          <Image
            style={styles.decorationLeftCard}
            source={Ellipse184}
          />
          <Image
            style={styles.decorationRightCard}
            source={Group8777}
          />
        </View>

        <View style={styles.creditBussines}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <View>
          <Text style={{ fontSize: 14, fontFamily:'Poppins_600SemiBold', flexDirection:'row'}}>Tu crédito es de:</Text>
          <Text style={{fontSize:16, fontFamily:'Poppins_700Bold'}}>
           ${client.maxCredit}
          </Text>
          </View>
          <Text style={{marginTop:20, fontSize:13, fontFamily:'Poppins_400Regular'}}>Has usado ${client.usedCredit}</Text>
          </View>
          <Text style={{alignSelf:'center',
        marginTop:25,
        fontSize:14,
        marginBottom:10,
        fontFamily:'Poppins_600SemiBold'
        }}>
            ¿Dónde quieres usar tu crédito?
          </Text>
          <FlatList data={shops} renderItem={renderItem} keyExtractor={(item) => item._id} />


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
    width:150,
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
    borderTopLeftRadius: 20,  // borde redondeado en la esquina superior izquierda
    borderTopRightRadius: 20,  // borde redondeado en la esquina superior derecha
    borderBottomLeftRadius: 0,  // elimina el borde redondeado en la esquina inferior izquierda
    borderBottomRightRadius: 0,  // elimina el borde redondeado en la esquina inferior derecha
    flex:1
}, centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalImage: {
    width: 300,
    height: 300,
    marginBottom: 15
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
export default HomeScreenClient