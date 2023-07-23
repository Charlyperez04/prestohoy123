import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

const TransactionData = ({
  clientName,
  maxCredit,
  usedCredit,
  transactionDataVisible,
  setTransactionDataVisible,
  amount,
  setAmount,
  handleTransaction,
}) => {
  useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={transactionDataVisible}
      onRequestClose={() => {
        setTransactionDataVisible(
          !transactionDataVisible
        );
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.text}>
            Nombre: {clientName}
          </Text>
          <Text style={styles.text}>
            Crédito Disponible: ${maxCredit - usedCredit}
          </Text>
          <Text style={styles.text}>
            Monto a cobrar:
          </Text>
          <TextInput
      style={styles.TextInput}
      keyboardType="numeric"
      placeholder="Introduce solo numeros"
      value={amount}
      onChangeText={(text) => setAmount(text)}
    />
    <TouchableOpacity
      style={styles.buttonSend}
      onPress={() => handleTransaction(amount)}
    >
            <Text style={styles.textSendButton}>
              Cobrar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() =>
              setTransactionDataVisible(false)
            }
          >
            <Text style={styles.textCloseButton}>
              Cancelar
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
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
  text: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    paddingTop: 20,
  },
  TextInput: {
    width: 250,
    height: 40,
    textAlign: "center",
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: "#E2E6EE",
  },
  buttonSend: {
    width: 120,
    padding: 5,
    borderRadius: 20,
    backgroundColor: "#FF0083",
    marginBottom: 15,
  },
  closeButton: {
    width: 120,
    borderRadius: 20,
    padding: 5,
    marginBottom:20,
    backgroundColor: "#E6E7E8",
    justifyContent: "center",
    alignItems: "center",
  },
  textSendButton: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
    textAlign: "center",
  },
  textCloseButton: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "#554E4E",
    textAlign: "center",
  },
});

export default TransactionData;
