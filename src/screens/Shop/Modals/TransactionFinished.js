import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

const TransactionFinished = ({
  clientName,
  storeName,
  amount,
  transactionModalFinished,
  setTransactionModalFinished,
}) => {
  useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={transactionModalFinished}
      onRequestClose={() => {
        setTransactionModalFinished(
          !transactionModalFinished
        );
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.smallText}>
            Transacción realizada
          </Text>
          <Text style={styles.largeText}>
            ¡Felicidades!
          </Text>
          <Image
            source={require("../../../assets/succes.png")}
            style={styles.image}
          />
          <Text style={styles.mediumText}>
            Monto
          </Text>
          <Text style={styles.largeText}>
            ${amount}
          </Text>
          <Text style={styles.mediumText}>
            {clientName} - {storeName}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              setTransactionModalFinished(false)
            }
          >
            <Text style={styles.buttonText}>
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
    justifyContent: "flex-end",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
  },
  smallText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    paddingBottom: 15,
  },
  mediumText: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    paddingBottom: 15,
  },
  largeText: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    paddingBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    margin: 10,
  },
  button: {
    width: "80%",
    padding: 5,
    borderRadius: 20,
    backgroundColor: "#FF0083",
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 17,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
    textAlign: "center",
  },
});

export default TransactionFinished;
