import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import ModalShopDeleted from "./ShopDeleted";

const ModalDeleteShop = ({ visible, onConfirm, onCancel }) => {
  const [modalShopDeleted, setModalShopDeleted] = useState(false);

  const openModalShopDeleted = () => {
    setModalShopDeleted(true);
  };

  const closeModalShopDeleted = () => {
    setModalShopDeleted(false);
  };

  const handleConfirm = () => {
    onConfirm(); // Lógica adicional para eliminar el usuario si es necesario
    closeModalShopDeleted();
    openModalShopDeleted();
  };

  return (
    <React.Fragment>
      <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onCancel}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>¿Seguro que deseas eliminar este negocio?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.buttonText}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ModalShopDeleted visible={modalShopDeleted} onClose={closeModalShopDeleted} />
    </React.Fragment>
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
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 20,
    width: "45%",
    alignItems: "center",
    justifyContent:'center',
    elevation:5,
    //add shadow
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    
  },
  cancelButton: {
    backgroundColor: "#FF0083",
    padding: 5,
    borderRadius: 20,
    width: "45%",
    alignItems: "center",
    justifyContent:'center',
    elevation:5,
    //add shadow
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "white",
  },
});

export default ModalDeleteShop;
