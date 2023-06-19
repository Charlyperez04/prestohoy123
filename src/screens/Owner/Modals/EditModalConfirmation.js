import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

const EditModalConfirmation = ({
  visible,
  closeModal,
  refreshData,
  setRefreshData
}) => {
  const handleOkayPress = () => {
    setRefreshData(true); // Llamada a la función refreshData
    closeModal();
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            Se han actualizado los datos
          </Text>
          <Image
            source={require("../../../assets/succes.png")}
            style={styles.confirmationImage}
          />
          <TouchableOpacity
            style={styles.okayButton}
            onPress={handleOkayPress} // Llamada a la función handleOkayPress
          >
            <Text style={styles.okayButtonText}>
              Okay
            </Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 30,
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
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  confirmationImage: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  okayButton: {
    backgroundColor: "#FF0083",
    borderRadius: 15,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    elevation: 5,
    //shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  okayButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});

export default EditModalConfirmation;
