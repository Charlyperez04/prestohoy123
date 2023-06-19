import React from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet,Image } from "react-native";

const ModalUserDeleted = ({ visible, onClose }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Usuario eliminado exitosamente</Text>
          <Image style={{width:90,height:90}} source={require('../../../assets/succes.png')}/>
          <TouchableOpacity style={styles.okButton} onPress={onClose}>
            <Text style={styles.buttonText}>Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Fondo sombreado
  },
  modalView: {
    width: "80%", // Ancho del modal
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    marginBottom: 0,
  },
  okButton: {
    backgroundColor: "#FF0083",
    padding: 10,
    borderRadius: 20,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "white",
  },
});

export default ModalUserDeleted;
