import React, {
  useState,
  useEffect,
} from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import {
  useFonts,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import AppLoading from "expo-app-loading";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RegisterModal from "./RegisterModal";

const RegistrationScreen = () => {
  const [registerModal,setRegisterModal]=useState(false)
  let [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
  });

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(
    new Date()
  );
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [phoneNumber, setPhoneNumber] =
    useState("");
  const [frontIneImage, setFrontIneImage] =
    useState(null);
  const [backIneImage, setBackIneImage] =
    useState(null);
  const [mode, setMode] = useState("date");
  const [imageProfile, setImageProfile] =
    useState(null);
  const [imageIne1, setImageIne1] =
    useState(null);
  const [imageIne2, setImageIne2] =
    useState(null);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateSet, setDateSet] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    setDateSet(true);
  };

  const pickImageProfile = async () => {
    let result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

    if (!result.canceled) {
      setImageProfile(result.assets[0].uri);
    }
  };

  const pickImageIne1 = async () => {
    let result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

    if (!result.canceled) {
      setImageIne1(result.assets[0].uri);
    }
  };

  const pickImageIne2 = async () => {
    let result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

    if (!result.canceled) {
      setImageIne2(result.assets[0].uri);
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  return (
    <SafeAreaProvider>
      <View style={styles.area}>
        <Image
          style={styles.image}
          source={require("../assets/logo.png")}
        />

        <Text style={styles.title}>
          Información de Registro
        </Text>

        <ScrollView>
          <Text style={styles.formParts}>
            Nombre Completo
          </Text>
          <TextInput
            value={name}
            placeholder="Alex Smith"
            onChangeText={setName}
            style={styles.formInputs}
          />

          <Text style={styles.formParts}>
            Imagen de perfil
          </Text>
          <TouchableOpacity
            onPress={pickImageProfile}
            style={styles.formInputsPhotos}
          >
            {imageProfile ? (
              <Image
                source={{ uri: imageProfile }}
                style={{ width: 50, height: 50 }}
              />
            ) : (
              <Text style={{ color: "grey" }}>
                Elige una imagen para tu perfil
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.formParts}>
            Fecha de Nacimiento
          </Text>
          <TouchableOpacity
            onPress={showDatepicker}
            style={styles.formInputsPhotos}
          >
            <Text
              style={{
                color: dateSet ? "black" : "grey",
              }}
            >
              {date.toLocaleDateString()}
            </Text>

            {show && (
              <DateTimePicker
                style={styles.datePicker}
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.formParts}>
            Contraseña
          </Text>
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.formInputs}
            MediaTypeOptions="password"
            placeholder="********"
          />

          <Text style={styles.formParts}>
            PIN
          </Text>
          <TextInput
            secureTextEntry
            value={pin}
            onChangeText={setPin}
            style={styles.formInputs}
            placeholder="1234"
          />

          <Text style={styles.formParts}>
            Número de Teléfono
          </Text>
          <TextInput
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.formInputs}
            placeholder="55 1234 5678"
          />

          <Text style={styles.formParts}>
            Imagen de la INE (Frente)
          </Text>
          <TouchableOpacity
            onPress={pickImageIne1}
            style={styles.formInputsPhotos}
          >
            {imageIne1 ? (
              <Image
                source={{ uri: imageIne1 }}
                style={{ width: 50, height: 50 }}
              />
            ) : (
              <Text style={{ color: "grey" }}>
                Elige una imagen para la INE
                (Frente)
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.formParts}>
            Imagen de la INE (Atrás)
          </Text>
          <TouchableOpacity
            onPress={pickImageIne2}
            style={styles.formInputsPhotos}
          >
            {imageIne2 ? (
              <Image
                source={{ uri: imageIne2 }}
                style={{ width: 50, height: 50 }}
              />
            ) : (
              <Text style={{ color: "grey" }}>
                Elige una imagen para la INE
                (Atrás)
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>setRegisterModal(true)}
            style={styles.buttonPink}
          >
            <Text style={styles.buttonTextWhite}>
              Confirma la solicitud
            </Text>
          </TouchableOpacity>
          <RegisterModal registerModal={registerModal} setRegisterModal={setRegisterModal}/>

          <Text style={styles.disclaimer}>
            Verifica que tu información sea
            correcta.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    margin: 10,
    marginTop: 55,
    padding: 10,
    backgroundColor: "white",
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
  image: {
    width: "80%",
    height: 100,
    marginTop: 30,
    alignSelf: "center",
  },
  formParts: {
    fontSize: 16,
    fontFamily: "Roboto",
    marginBottom: 5,
    marginLeft: 24,
  },
  formInputs: {
    backgroundColor: "#E2E6EE",
    borderRadius: 10,
    padding: 8,
    marginBottom: 25,
    marginHorizontal: 20,
  },
  formInputsPhotos: {
    backgroundColor: "#E2E6EE",
    borderRadius: 10,
    padding: 12,
    marginBottom: 25,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  previewImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  disclaimer: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  datePicker: {
    resizeMode: "cover",
  },
  buttonPink: {
    backgroundColor: "#FF0083",
    marginTop: 10,
    alignSelf: "center",
    padding: 8,
    width: "80%",
    borderRadius: 10,
    marginBottom: 20,
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
});

export default RegistrationScreen;
