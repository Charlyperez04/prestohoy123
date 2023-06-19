import {Buffer} from 'buffer'
import React, { useState } from "react";
import {
  Image,
  Modal,
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from "expo-local-authentication";
import api from "../api/connection";
import OwnerScreens from './Owner/NavigatorOwner';
import ShopScreens from './Shop/NavigationShop';
import ClientScreens from './Client/NavigatorClient';
import { ScrollView } from 'react-native-gesture-handler';

const LoginScreen = ({ navigation, route }) => {
  
  const { role } = route.params;
  const [modalVisible, setModalVisible] =
    useState(true);
  const [
    errorModalVisible,
    setErrorModalVisible,
  ] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const handleBiometricLogin = async () => {
    const hasHardware =
      await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      console.log(
        "No tiene hardware de autenticación biométrica"
      );
      return false;
    }

    const biometricType =
      await LocalAuthentication.supportedAuthenticationTypesAsync();
    const isFingerprint = biometricType.includes(
      LocalAuthentication.AuthenticationType
        .FINGERPRINT
    );
    const isFace = biometricType.includes(
      LocalAuthentication.AuthenticationType
        .FACIAL_RECOGNITION
    );

    if (!isFingerprint && !isFace) {
      console.log(
        "No se soporta la autenticación de huellas dactilares ni la facial"
      );
      return false;
    }

    const { success, error } =
      await LocalAuthentication.authenticateAsync(
        {
          promptMessage: "Por favor autentícate",
        }
      );

    if (success) {
      return true;
    } else {
      console.log(
        "La autenticación biométrica falló con error:",
        error
      );
      return false;
    }

    return success;
  };

  const handleLogin = async () => {
    console.log("El rol es:" + role);
    try {
      const endpoint =
        role === "client"
          ? "client/login"
          : "/shop/loginOwnerAndShop";
      const response = await api.post(endpoint, {
        name,
        password,
      });
  
      if (response.data.token) {
        console.log("SIUUUUUU");
        console.log(response.data);
  
        // Guardar el token y el rol en AsyncStorage
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userRole', response.data.role);
        await AsyncStorage.setItem('userId',response.data.id)
  
        // Extraer la fecha de expiración del token
        const tokenParts = response.data.token.split('.');
        const payload = tokenParts[1];
        const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
        const expiryDate = decodedPayload.exp;
  
        // Guardar la fecha de expiración en AsyncStorage
        await AsyncStorage.setItem('tokenExpiry', expiryDate.toString());
  
        // Si el rol del usuario es 'owner', solicitar autenticación biométrica
        if (response.data.role === "owner") {  // Aquí está el cambio
          const biometricSuccess = await handleBiometricLogin();
          if (!biometricSuccess) {
            // Aquí puedes manejar el caso en que la autenticación biométrica falla
            console.log("La autenticación biométrica falló");
          }
        }
        switch (response.data.role) {
          case 'owner':
            navigation.navigate('OwnerScreens');
            break;
          case 'shop':
            navigation.navigate('ShopScreens');
            break;
          case 'client':
            navigation.navigate('ClientScreens');
            break;
          default:
            navigation.navigate('Main');
        }
        testStorage()
      } else {
        // Aquí puedes manejar el caso en que el servidor no devuelva un token, lo que probablemente significa que las credenciales no son correctas
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        setErrorMessage(error.response.data.mensaje); // Asume que el mensaje de error viene en 'message'
        setErrorModalVisible(true);
      }
      console.log(error);
    }
  };
  
  
  const testStorage = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userRole = await AsyncStorage.getItem('userRole');
      const userId=await AsyncStorage.getItem('userId')
      
      console.log("Token almacenado: " + userToken);
      console.log("Rol almacenado: " + userRole);
      console.log('eL ID ES '+userId);
    } catch (error) {
      console.log(error);
    }
  };
  
  
  return (
    <View style={styles.container}>
      {/* Aquí va el código existente para el resto de la pantalla... */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={errorModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.notificationText}>
              {errorMessage}
            </Text>
            <TouchableOpacity
              style={styles.okButton}
              onPress={() =>
                setErrorModalVisible(false)
              }
            >
              <Text style={styles.okButtonText}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalVisible}
        animationType="slide"
      >
        <ScrollView>
        <Text style={styles.modalTitle}>
          Iniciar sesión
        </Text>
        <Text style={styles.modalSubtitle}>
          Ingresa tus credenciales de acceso
        </Text>

        <Text style={styles.inputLabel}>
          Nombre
        </Text>
        <TextInput
          style={styles.inputField}
          placeholder="Nombre completo"
          onChangeText={setName}
          value={name}
        />

        <Text style={styles.inputLabel}>
          Contraseña
        </Text>
        <TextInput
          style={styles.inputField}
          placeholder="Contraseña123"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={() => {
            /* Aquí va la lógica para recuperar las credenciales */
          }}
        >
          <Text style={styles.linkText}>
            ¿Olvidaste tus credenciales?{" "}
            <Text style={styles.boldLinkText}>
              Recupéralas
            </Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonPink}
          onPress={handleLogin}
        >
          <Text style={styles.buttonTextWhite}>
            Ingresar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonGrey}
          onPress={() =>
            navigation.navigate("Main")
          }
        >
          <Text style={styles.buttonTextGrey}>
            Cancelar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Registration", {
              role: "client",
            })
          }
        >
          <Text style={styles.linkText}>
            ¿No tienes una cuenta?{" "}
            <Text style={styles.boldLinkText}>
              Registrate
            </Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.termsTotal}
          onPress={() => {
            /* Aquí va la lógica para recuperar las credenciales */
          }}
        >
          <Text style={styles.terms}>
            Al iniciar sesion, aceptas nuestros{" "}
            <Text style={styles.boldLinkText}>
              Términos y Condiciones
            </Text>
          </Text>
        </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  /* Aquí van los estilos existentes... */
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // fondo sombreado
  },
  modalView: {
    backgroundColor: "white",
    width: "62%",
    borderRadius: 10,
    padding: 20,
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
  notificationText: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: 30,
    height: 30,
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: "#FF0083",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  okButtonText: {
    color: "white",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    textAlign: "center",
  },
  buttonGrey: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextGrey: {
    color: "#fff",
  },
  modalTitle: {
    fontFamily: "Poppins_800ExtraBold",
    marginTop: 50,
    fontSize: 29,
    marginBottom: 10,
    textAlign: "center",
  },
  modalSubtitle: {
    fontFamily: "Poppins_300Light",
    fontSize: 15,
    marginBottom: 60,
    textAlign: "center",
  },
  inputLabel: {
    fontFamily: "Poppins_300Light",
    fontSize: 12,
    marginBottom: -15,
    backgroundColor: "white",
    width: "21%",
    color: "#6E717C",
    alignSelf: "center",
    marginRight: 160,
    textAlign: "left",
    paddingLeft: 5,
    zIndex: 1,
  },
  inputField: {
    height: 50,
    borderColor: "#E6E7E8",
    color: "#pink",
    borderWidth: 1,
    marginBottom: 30,
    width: "80%",
    alignSelf: "center",
    borderRadius: 20,
    padding: 10,
    color: "black",
    backgroundColor: "#F9FAFC",
  },
  linkText: {
    color: "#4A3F3F",
    fontFamily: "Poppins_300Light",
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    backgroundColor: "transparent",
  },
  terms: {
    color: "#4A3F3F",
    fontFamily: "Poppins_300Light",
    fontSize: 12,
    marginTop: 20,
    textAlign: "center",
    backgroundColor: "transparent",
  },
  termsTotal: {
    marginTop: 60,
  },
  boldLinkText: {
    color: "#4A3F3F",
    textDecorationLine: "underline",
    backgroundColor: "transparent",
  },
  terms: {
    textAlign: "center",
    flexDirection: "row",
    color: "#4A3F3F",
    fontFamily: "Poppins_300Light",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
  buttonPink: {
    backgroundColor: "#FF0083",
    marginTop: 60,
    alignSelf: "center",
    padding: 8,
    width: "80%",
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
    alignSelf: "center",
    padding: 8,
    width: "80%",
    borderRadius: 20,
    marginBottom: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
export default LoginScreen;
