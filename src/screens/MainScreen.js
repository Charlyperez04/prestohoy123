import React, { useState } from "react";
import { Modal, Text, TextInput, View, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";

const MainScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleLogin = async () => {
    // Aquí iría tu lógica para manejar el inicio de sesión
    // dependiendo del rol establecido (comprador, vendedor o dueño)
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require("../assets/logo.png")} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Bienvenidos</Text>
        <Text style={styles.subtitle}>El credito del pueblo, para el pueblo</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonPink}
          onPress={() => navigation.navigate("Login", { role: "client" })}
        >
          <Text style={styles.buttonTextWhite}>Soy Comprador</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonPink}
          onPress={() => navigation.navigate("Login", { role: "shop" })}
        >
          <Text style={styles.buttonTextWhite}>Soy Vendedor</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonGrey} onPress={() => navigation.navigate("Registration")}>
          <Text style={styles.buttonTextGrey}>Regístrate Aquí</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.termsTotal}
          onPress={() => {
            Linking.openURL(
              'https://charlyperez04.github.io/politicaPrestoHoy/terms.html'
            );
          }}
        >
          <Text style={styles.terms}>
            Conoce nuestros <Text style={styles.boldLinkText}>Términos y Condiciones</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  imageContainer: {
    flex: 1,
    marginTop: 80,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    marginBottom: 100,
  },
  image: {
    width: 360,
    height: 61,
  },
  title: {
    fontFamily: "Poppins_800ExtraBold",
    fontSize: 28,
    marginVertical: 10,
    marginBottom: 30,
  },
  subtitle: {
    fontFamily: "Poppins_500Medium",
    textAlign: "center",
    paddingHorizontal: 70,
    fontSize: 24,
    marginBottom: 20,
  },
  buttonPink: {
    backgroundColor: "#FF0083",
    padding: 10,
    width: "70%",
    borderRadius: 40,
    marginBottom: 35,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonGrey: {
    backgroundColor: "#E6E7E8",
    padding: 10,
    width: "70%",
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  terms: {
    color: "#4A3F3F",
    fontFamily: "Poppins_300Light",
    fontSize: 12,
    marginTop: 20,
    textAlign: "center",
    backgroundColor: "transparent",
  },
  termsTotal: {},
  boldLinkText: {
    color: "#4A3F3F",
    textDecorationLine: "underline",
    backgroundColor: "transparent",
  },
  buttonTextWhite: {
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  },
  buttonTextGrey: {
    color: "#554E4E",
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  },
});

export default MainScreen;
