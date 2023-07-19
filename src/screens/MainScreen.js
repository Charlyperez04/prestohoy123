import React, { useState } from "react";
import { Modal, Text, TextInput, View, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

const MainScreen = ({ navigation }) => {
  const [isModalTermsVisible, setModalTermsVisible] = useState(false);
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
          onPress={() => setModalTermsVisible(true)}
        >
          <Text style={styles.terms}>
            Conoce nuestros <Text style={styles.boldLinkText}>Términos y Condiciones</Text>
          </Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalTermsVisible}
          onRequestClose={() => {
            setModalTermsVisible(!isModalTermsVisible);
          }}
        >
          <View style={styles.centeredView}>
            <ScrollView>
              <View style={styles.modalView1}>
                <Text style={styles.titleTerms}>TERMINOS Y CONDICIONES</Text>
                <Text style={styles.modalText}>
                  Los créditos ofrecidos a través de nuestra aplicación están sujetos a aprobación y
                  cumplimiento de requisitos específicos que se enumerarán a continuación. Por favor, léelos
                  atentamente antes de solicitar un crédito.
                </Text>
                <Text style={styles.modalText1}>Aprobación del Préstamo</Text>
                <Text style={styles.modalText}>
                  La aprobación de su solicitud de préstamo depende de la evaluación y verificación de su
                  información personal y financiera. Esto incluye, pero no se limita a, su historial e
                  ingresos. Se le notificará el resultado de su solicitud una vez que haya sido revisada.
                </Text>
                <Text style={styles.modalText1}>Costo Anual Total (CAT)</Text>
                <Text style={styles.modalText}>
                  El Costo Anual Total (CAT) para los créditos a través de nuestra aplicación es del 182.5%.
                  Esto incluye todos los costos relacionados con el crédito. Es importante tener en cuenta que
                  este porcentaje es una representación anual del coste del crédito.
                </Text>
                <Text style={styles.modalText1}>
                  Tasa de Porcentaje Anual (APR) e Información de Fechas de pago
                </Text>
                <Text style={styles.modalText}>
                  La Tasa de Porcentaje Anual (APR) en caso de no presentar retrasos en los pagos es de
                  182.5%. Además, podrás elegir la fecha de corte que mejor te convenga y la fecha de pago
                  será 10 días después de la fecha de corte seleccionada.
                </Text>
                <Text style={styles.modalText}>
                  Por favor, asegúrese de comprender plenamente estos términos antes de aceptar el préstamo.
                  Es importante entender todos estos términos y condiciones antes de solicitar un préstamo. Si
                  tienes alguna pregunta o necesitas más información, por favor contáctenos.
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalTermsVisible(!isModalTermsVisible)}
                >
                  <Text style={styles.textStyle}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },
  titleTerms: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
  },
  modalText1: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 17,
    lineHeight: 24,
    marginTop: 15,
    fontFamily: "Poppins_600SemiBold",
  },
  modalView1: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
