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
    Poppins_400Regular,
    Poppins_600SemiBold,
  } from "@expo-google-fonts/poppins";

const RegisterModal = ({ registerModal, setRegisterModal }) => {
  useFonts({
    Poppins_400Regular,
  Poppins_600SemiBold,
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={registerModal}
      onRequestClose={() => {
        setRegisterModal(!registerModal);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>¡Tu información ha sido enviada exitosamente!</Text>
          <Text style={styles.iconX}>En un lapso de 48 horas nos comunicaremos contigo</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setRegisterModal(!registerModal)} // cierra el modal cuando se presiona
          >
            <Text style={styles.textCloseButton}>Entendido</Text>
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
    fontSize:12,
    paddingHorizontal:20,
    paddingVertical:15,
    textAlign:'center',
    fontFamily:'Poppins_400Regular'
  },
  modalText:{
    textAlign:'center',
    paddingHorizontal:10,
    fontSize:18,
    fontFamily:'Poppins_600SemiBold'
  },
    closeButton:{
        width: 170,
        padding: 5,
        borderRadius: 20,
        backgroundColor: "#FF0083",
        marginVertical: 15,
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
        color:'#E2E6EE',
        textAlign:'center'
        }

});

export default RegisterModal;
