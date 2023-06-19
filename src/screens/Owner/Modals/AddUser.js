import React, { useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native-gesture-handler";
import EditModalConfirmation from "./EditModalConfirmation";
import * as Updates from "expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../api/connection";

const AddUserModal = ({ visible, closeModal, refreshData, setRefreshData }) => {
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
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      let usedCredit = 0;
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
        throw new Error("Seleccione una frontal de ine");
      }

      const uriPartsFront = ineFrontImage.split(".");
      const fileTypeFront = uriPartsFront[uriPartsFront.length - 1];
      formData.append("frontIne", {
        uri: ineFrontImage,
        name: `photo.${fileTypeFront}`,
        type: `image/${fileTypeFront}`,
      });
      if (!ineBackImage) {
        throw new Error("Seleccione una trasera de ine");
      }
      const uriPartsBack = ineBackImage.split(".");
      const fileTypeBack = uriPartsBack[uriPartsBack.length - 1];
      formData.append("backIne", {
        uri: ineBackImage,
        name: `photo.${fileTypeBack}`,
        type: `image/${fileTypeBack}`,
      });

      await api.post(`/owner/registerClient/`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      setIsLoading(false);
      setConfirmationVisible(true);
    } catch ({ error, response }) {
      console.error(error);
      console.log(response);
      setIsLoading(false);
      //Alert.alert with the response
      Alert.alert(
        "Error",
        response
          ? response.data
            ? response.data.message
            : "Ocurrió un error al procesar la solicitud."
          : "Ocurrió un error al procesar la solicitud."
      );
    }
  };

  const handleOpenConfirmationModal = () => {
    setConfirmationVisible(true);
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
          <ScrollView>
            <Text style={styles.modalTitle}>Crear usuario</Text>
            <Text style={styles.modalSubtitle}>Llene todos los datos</Text>

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
              value={maxCredit}
              onChangeText={setMaxCredit}
            />

            <Text style={styles.textCamp}>Fecha de nacimiento:</Text>
            <TextInput
              placeholder="Fecha de nacimiento"
              style={styles.textInput}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
            />

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
              <Text style={styles.confirmButtonText}>Agregar usuario</Text>
            </TouchableOpacity>
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
    marginVertical: 20,
    width: "90%",
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
});

export default AddUserModal;
