import React,{useState,useEffect} from "react";
import { Picker } from '@react-native-picker/picker';
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
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Linking,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import arrow from "../../assets/arrow.png";
import api from "../../api/connection";
import AsyncStorage from '@react-native-async-storage/async-storage'

const BusinessItem = ({ item }) => (
    <View style={styles.item}>
    <Image
      source={{ uri: item.profilePhoto }}
      style={styles.image}
      />
    <Text style={styles.title}>{item.name}</Text>
    <TouchableOpacity
      onPress={() => Linking.openURL(item.link)}
      >
      <Image
        source={arrow}
        style={styles.arrow}
        />
    </TouchableOpacity>
  </View>
);

function BusinessesScreen  () {

    const [userToken, setUserToken] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [shops,setShops]=useState('')

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
        Poppins_900Black
      });
    return(
    <View style={styles.container}>
    <Text style={styles.header}>
      Negocios Afiliados
    </Text>
    <Text style={styles.subtitle}>Conoce todos los lugares donde puedes usar tu credito PrestoHoy</Text>
    <FlatList
      style={styles.businessList}
      data={shops}
      renderItem={({ item }) => (
          <BusinessItem item={item} />
      )}
      keyExtractor={(item) => item._id}
    />
  </View>
)}

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
    textAlign:'center'
    },
  businessList: {
    width: "100%",
    paddingHorizontal: 20,
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
    borderWidth: 1,
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
});

export default BusinessesScreen;
