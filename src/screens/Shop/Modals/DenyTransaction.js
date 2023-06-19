import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from 'react-native';
import {
    useFonts,
    Poppins_700Bold,
  } from "@expo-google-fonts/poppins";

const DenyTransaction = ({ transactionModalDenied, setTransactionModalDenied }) => {
  useFonts({
   Poppins_700Bold
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={transactionModalDenied}
      onRequestClose={() => {
        setTransactionModalDenied(!transactionModalDenied);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Saldo insuficiente</Text>
          <Text style={styles.iconX}>X</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setTransactionModalDenied(!transactionModalDenied)} // cierra el modal cuando se presiona
          >
            <Text style={styles.textCloseButton}>Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};



const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    paddingVertical:30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconX:{
    fontSize:50,
    color:'#FF0000',
    fontFamily:'Poppins_700Bold'
  },
  modalText:{
    fontSize:24,
    fontFamily:'Poppins_700Bold'
  },
    closeButton:{
        width: 170,
        padding: 5,
        borderRadius: 20,
        backgroundColor: "#E6E7E8",
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        },
        textCloseButton:{
        fontSize:18,
        fontFamily:'Poppins_600SemiBold',
        color:'#554E4E',
        textAlign:'center'
        }

});

export default DenyTransaction;
