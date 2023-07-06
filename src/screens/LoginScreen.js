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
  Linking,
  Alert,
  Platform,
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
      
        // Guardar el token y el rol en AsyncStorage
        const asyncStorageOperations = [
          AsyncStorage.setItem('userToken', response.data.token),
          AsyncStorage.setItem('userRole', response.data.role),
          AsyncStorage.setItem('userId',response.data.id),
        ];
      
        // Extraer la fecha de expiración del token
        const tokenParts = response.data.token.split('.');
        const payload = tokenParts[1];
        const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
        const expiryDate = decodedPayload.exp;
        const expiryDateInMilliseconds = expiryDate * 1000;
        // Guardar la fecha de expiración en AsyncStorage
        asyncStorageOperations.push(AsyncStorage.setItem('tokenExpiry', expiryDateInMilliseconds.toString()));
      
        // Si el rol del usuario es 'owner', solicitar autenticación biométrica
        if (response.data.role === "owner") {  // Aquí está el cambio
          const biometricSuccess = await handleBiometricLogin();
          if (!biometricSuccess) {
            // Aquí puedes manejar el caso en que la autenticación biométrica falla
            console.log("La autenticación biométrica falló");
          }
        }
      
        // Espera hasta que todos los datos se guarden en AsyncStorage
        await Promise.all(asyncStorageOperations);
        switch (response.data.role) {
          case 'owner':
            navigation.replace('OwnerScreens');
            break;
          case 'shop':
            navigation.replace('ShopScreens');
            break;
          case 'client':
            navigation.replace('ClientScreens');
            break;
          default:
            navigation.replace('Main');
        }
        testStorage();
  
      } else {      
        // Aquí puedes manejar el caso en que el servidor no devuelva un token, lo que probablemente significa que las credenciales no son correctas
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        setErrorMessage(error.response.data.mensaje); // Asume que el mensaje de error viene en 'message'
  
        if (Platform.OS === 'ios') {
          Alert.alert('Error', error.response.data.mensaje);
        } else {
          setErrorModalVisible(true);
        }
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
            Linking.openURL('https://api.whatsapp.com/send?phone=5519557355&text=Hola,%20he%20olvidado%20mis%20credenciales%20de%20acceso');
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
            Linking.openURL('https://presto-hoy.s3.us-west-1.amazonaws.com/Documento.pdf?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMSJHMEUCIQCVa2Y5%2FQni037a6sseVz3qFbW72MUqCPO7rX%2BwVeiM2gIgAnZbcvgGpa%2BUh1GsG2Ce8xtP9YMo6lu3zA7dbIP%2FrjEq5AIIVhAAGgwxNTkyOTI4ODI1OTAiDEuO1eKoYJoHWY%2B54SrBAgvN7igZ27kl955hgf2dJRn6g2RZNw46ZLxHp45%2BDX7Zk%2FsUOGURoh82C8ToZDwwem61XfCs%2Fvuve4iZKTnVWYReZKKUJdQSd1ZmnBB5X%2F6B33lzb20iGBzJFERhZX8zrxcqEfJuQQ4HQvxNmw7rl%2BgTkI1z1CPbofeU0YDzzGEiHGhkO9YX8ul2CzoGZLmCguwjAlBXA9sPj4qT9RlpV0mmkBJP%2BW%2BSIWqLQknfxwDNuULBl8zifMJD8BEzSMapKwuD6%2BddvstGrykghvQMUeSL1B7%2FscphZ%2F5tsPNGnh4Iv0xZo%2Fh3Nr%2BEUQG7%2FrVoj7GcEQ5j7hIxVv%2Bz7XL96s5j6lGE6LXSy3zzCVsS48UPV%2FQQaJg31mTooOUF5XodadtKlI2QgLx4M52kuGdtSDAUwh8g5tZSCn8nM33XErvZATD8yOmkBjqzAj71i7cC5Guq8RCqjLfTrXuYBx309fwQUlH1XwZgW2mnmdXdPjJeZvp%2FOtJu9KWmWsbkwN%2FwEDYw5pgMzyRp9GXnOjTURhHJzoYVrdGnq6srWpoH84VLewjUiuoPEZU4btL0%2B%2B65d6S4YlXUJYJi8wku636FNfyZybXR0TR3YZ5GWIByeFqJlol87GfOy7CNyYjt5Yjfj1pc7yLgV9U1KJap3X6HECo3mDOOyv4XmXNp9Uf9R2%2BTuJY9CZMP2kWw%2Bo0YH3IRukONy%2BzWDSGw65tGSkjZQVpQULEAIzl5hGLLdUd3ThwQrqRLDAbEEXOPWbhdkUEbwGmZvxQGwchYOuuubwMII6URDkOAFT8v%2BMMoWsLbiFARxE50Jz434OKYHPVkVm82TYoL9LDhXwgk0wAksKQ%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230627T050532Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIASKFUYP2PHKJDFWHH%2F20230627%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Signature=8e9a272b2c1a48d63f2db19030990cb8a4aad3caa25fae243c9c99a185329764');
          }}
        >
          <Text style={styles.terms}>
            Al iniciar sesion, aceptas nuestro{" "}
            <Text style={styles.boldLinkText}>
              Aviso de Privacidad
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
