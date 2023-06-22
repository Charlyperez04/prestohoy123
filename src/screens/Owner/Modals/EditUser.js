import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState, useEffect } from "react";
import { Modal, Text, TouchableOpacity, View, TextInput, StyleSheet, Image,ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native-gesture-handler";
import EditModalConfirmation from "./EditModalConfirmation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../api/connection";
import * as Updates from "expo-updates";

const EditUserModal = ({ visible, closeModal, idClient, refreshData, setRefreshData }) => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [maxCredit, setMaxCredit] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [ineFrontImage, setIneFrontImage] = useState(null);
  const [ineBackImage, setIneBackImage] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [userToken, setUserToken] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [dateSet, setDateSet] = useState(false);
  const [mode, setMode] = useState("date");
  const [isLoading, setIsLoading] = useState(false);
  const[fechaCorte,setFechaCorte]=useState("")
  const [fechaPago,setFechaPago]=useState("")
  const [montoFinal,setMontoFinal]=useState("")
  const [usedCredit,setUsedCredit]=useState("")
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const role = await AsyncStorage.getItem("userRole");
        const id = await AsyncStorage.getItem("userId");
        
        if (token !== null) {
          setUserToken(token);
        }
        
        if (token !== null) {
          // Realizar la petición GET con Axios
          let [responseClient] = await Promise.all([
            api.get(`/client/${idClient}`, {
              headers: { Authorization: token },
            }),
          ]);
          setUsedCredit(responseClient.data.client.usedCredit);
          setFullName(responseClient.data.client.name);
          setPhoneNumber(responseClient.data.client.phoneNumber);
          setDateOfBirth(responseClient.data.client.bornDate);
          setAddress(responseClient.data.client.address);
          setPin(responseClient.data.client.pin);
          setMaxCredit(responseClient.data.client.maxCredit);
          setProfileImage(responseClient.data.client.profilePhoto);
          setIneFrontImage(responseClient.data.client.frontIne);
          setIneBackImage(responseClient.data.client.backIne);
          setPassword(responseClient.data.client.password);
          setFechaCorte(responseClient.data.client.fechaCorte)
          setFechaPago(responseClient.data.client.fechaPago)
          setMontoFinal(responseClient.data.client.montoFinal)
          
        }
      } catch ({ error, response }) {
        console.error(error);
        console.log(response.data);
      }
    };
    
    fetchData();
  }, []);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    setDateSet(true);
    
    setDateOfBirth(currentDate.toDateString());
  };
  const showDatepicker = () => {
    showMode("date");
  };
  const handleConfirm = async () => {
    setIsLoading(true);
    try {

      const token = await AsyncStorage.getItem("userToken");
      
      const formData = new FormData();
      
      // Add all the text data
      formData.append("name", fullName);
      formData.append("phoneNumber", phoneNumber);
      formData.append("address", address);
      formData.append("password", password);
      formData.append("pin", pin);
      formData.append("maxCredit", maxCredit);
      formData.append("bornDate", dateOfBirth);
      formData.append("usedCredit", usedCredit);
     if(fechaCorte&&fechaPago&&montoFinal){
      formData.append("fechaCorte", fechaCorte);
      formData.append("fechaPago", fechaPago);
      formData.append("montoFinal", montoFinal);
     }

      // Ensure that an image has been selected
      if (!profileImage) {
        throw new Error("Debe seleccionar una imagen antes de continuar.");
      }
      
      // Add the image
      const uriParts = profileImage.split(".");
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append("profilePhoto", {
        uri: profileImage,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
      if (!ineFrontImage) {
        Alert.alert(
          "Error",
          'Seleccione una foto frontal de INE'
        );
      }
      
      const uriPartsFront = ineFrontImage.split(".");
      const fileTypeFront = uriPartsFront[uriPartsFront.length - 1];
      formData.append("frontIne", {
        uri: ineFrontImage,
        name: `photo.${fileTypeFront}`,
        type: `image/${fileTypeFront}`,
      });
      if (!ineBackImage) {
        Alert.alert(
          "Error",
          'Seleccione una foto trasera de INE'
        );
      }
      const uriPartsBack = ineBackImage.split(".");
      const fileTypeBack = uriPartsBack[uriPartsBack.length - 1];
      formData.append("backIne", {
        uri: ineBackImage,
        name: `photo.${fileTypeBack}`,
        type: `image/${fileTypeBack}`,
      });

      let response=await api.put(`/owner/clients/${idClient}`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      setIsLoading(false)
      setConfirmationVisible(true);
      
} catch (error) {
  console.error(error);
  console.log(error.message);
  console.log(error.config);
  setIsLoading(false)
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  }
}

  };
  
  const handleOpenConfirmationModal = () => {
    setConfirmationVisible(true);
  };
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const handleCloseConfirmationModal = () => {
    setConfirmationVisible(false);
    closeModal();
  };
  
  const selectImage = async (setImage) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      alert("Se requiere acceso a la galería para seleccionar una imagen.");
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };
  const handleCloseModalEdit = () => {
    closeModal(); // Cierra el modal principal
    setConfirmationVisible(false); // Establece la visibilidad del modal de confirmación como falso
    // Código adicional para abrir el modal anterior
  };
  
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={closeModal}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
        <Modal transparent={true} animationType={"none"} visible={isLoading}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <ActivityIndicator size="large" color="#FF0083" />
              </View>
            </Modal>
          <ScrollView>
            <Text style={styles.modalTitle}>Editar usuario</Text>
            <Text style={styles.modalSubtitle}>Deje vacíos los campos que no va a editar</Text>

            <Text style={styles.textCamp}>Nombre completo:</Text>
            <TextInput
              placeholder="Nombre completo"
              style={styles.textInput}
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.textCamp}>Número telefónico:</Text>
            <TextInput
              placeholder="Número telefónico"
              style={styles.textInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />

            <Text style={styles.textCamp}>Crédito Máximo:</Text>
            <TextInput
              placeholder="Inserte solo numeros"
              style={styles.textInput}
              keyboardType="numeric"
              value={maxCredit.toString()}
              onChangeText={setMaxCredit}
            />
            <Text style={styles.textCamp}>Fecha de nacimiento:</Text>
            <TouchableOpacity onPress={showDatepicker} style={styles.formInputFotos}>
              <Text
                style={{
                  color: "black" 
                }}
              >
                {dateOfBirth}
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

            <Text style={styles.textCamp}>Dirección:</Text>
            <TextInput
              placeholder="Dirección"
              style={styles.textInput}
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.textCamp}>Contraseña:</Text>
            <TextInput
              placeholder="Contraseña"
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
            />

            <Text style={styles.textCamp}>Fecha de corte:</Text>
            <TextInput
              placeholder="Puede dejar vacio este campo"
              style={styles.textInput}
              value={fechaCorte.toString()}
              onChangeText={setFechaCorte}
            />
            <Text style={styles.textCamp}>Fecha limite de pago:</Text>
            <TextInput
              placeholder="Puede dejar vacio este campo"
              style={styles.textInput}
              value={fechaPago.toString()}
              onChangeText={setFechaPago}
            />
            <Text style={styles.textCamp}>Monto final con intereses:</Text>
            <TextInput
              placeholder="Puede dejar vacio este campo"
              style={styles.textInput}
              value={montoFinal.toString()}
              onChangeText={setMontoFinal}
            />

            <Text style={styles.textCamp}>PIN:</Text>
            <TextInput placeholder="PIN" style={styles.textInput} value={pin} onChangeText={setPin} />

            <Text style={styles.textCamp}>Foto de perfil:</Text>
            <TouchableOpacity style={styles.formInputFotos} onPress={() => selectImage(setProfileImage)}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.imagePreview} />
              ) : (
                <Text>Seleccionar foto de perfil</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.textCamp}>Foto INE frontal:</Text>
            <TouchableOpacity style={styles.formInputFotos} onPress={() => selectImage(setIneFrontImage)}>
              {ineFrontImage ? (
                <Image source={{ uri: ineFrontImage }} style={styles.imagePreview} />
              ) : (
                <Text>Seleccionar foto INE frontal</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.textCamp}>Foto INE trasera:</Text>
            <TouchableOpacity style={styles.formInputFotos} onPress={() => selectImage(setIneBackImage)}>
              {ineBackImage ? (
                <Image source={{ uri: ineBackImage }} style={styles.imagePreview} />
              ) : (
                <Text>Seleccionar foto INE trasera</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirmar cambios</Text>
            </TouchableOpacity>

            <EditModalConfirmation
              visible={confirmationVisible}
              closeModal={handleCloseConfirmationModal}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
            />
          </ScrollView>
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textCamp: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    marginTop: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    marginBottom: 20,
    textAlign: "center",
  },
  textInput: {
    height: 40,
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
  },
  confirmButton: {
    backgroundColor: "#FF0083",
    borderRadius: 15,
    padding: 10,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  confirmButtonText: {
    color: "white",
    fontFamily: "Poppins_700Bold",
    fontSize: 17,
  },
  formInputFotos: {
    padding: 10,
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    justifyContent: "center",
  },
  formInputsPhotos: {
    backgroundColor: "#E2E6EE",
    borderRadius: 10,
    padding: 12,
    marginBottom: 25,
    marginHorizontal: 20,
  },
});

export default EditUserModal;
