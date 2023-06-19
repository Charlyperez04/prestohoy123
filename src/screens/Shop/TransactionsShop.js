import React,{useState,useEffect} from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, FlatList,StyleSheet } from 'react-native';
import api from "../../api/connection";
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'



const TransactionsShop = () => {

  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [shop, setShop] = useState('');
  const [transactions, setTransactions] = useState([]);

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
          let [responseShop,responseTransactions] = await Promise.all([
            api.get(`/shop/${id}`, { headers: { Authorization: token } }), 
            api.get(`/shop/transactions/${id}`, { headers: { Authorization: token } }), 
          ]);
          setShop(responseShop.data);
          console.log(responseTransactions.data);
          setTransactions(responseTransactions.data.transactions)
          // Actualizar el estado con los datos recibidos
  
                }
      } catch (error) {
        console.error(error);
 
      }
    };
  
    fetchData();
  }, []);
  const renderItem = ({ item }) => (
    <View>
      <Text>{item.name}</Text>
      <Text>{item.date}</Text>
      <Text>{item.amount}</Text>
    </View>
  );


  return (
    <SafeAreaProvider>
    <View style={{paddingVertical:50,
        backgroundColor:'white',
    paddingHorizontal:20}}>
      <Text style={{
        fontSize:32,
        fontFamily:'Poppins_600SemiBold',
        textAlign:'center'
      }} >Historial de Transacciones</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.transactionBlock}>
            <View>
              <Text style={styles.transactionUser}>{item.clientName}</Text>
              <Text style={styles.transactionDate}>
                {moment(item.timestamp).subtract(1, "hour").format("YYYY-MM-DD HH:mm")}</Text>
            </View>
            <Text style={styles.transactionAmount}>${item.amount}</Text>
          </View>
        )}
      />
    </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
    transactionBlock: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical:10,
        backgroundColor: "white",
        borderRadius: 10,
       
      },
      transactionUser:{
        fontSize:12,
        fontFamily:'Poppins_400Regular'
      },
      transactionDate:{
        fontSize:12,
        fontFamily:'Poppins_300Light'
      },
      transactionAmount:{
        fontSize:15,
        fontFamily:'Poppins_700Bold',
        color:'#53D258'
      }
})

export default TransactionsShop;
