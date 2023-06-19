import { useNavigation } from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";
import * as Updates from 'expo-updates';
import React, { useState, useEffect } from "react";
import { Modal, Text, TouchableOpacity, View, TextInput, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native-gesture-handler";
import EditModalConfirmation from "./EditModalConfirmation";
import api from "../../../api/connection";

import AsyncStorage from "@react-native-async-storage/async-storage";

const EditShopModal = ({ visible, closeModal, idShop,refreshData,setRefreshData }) => {


  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [linkName, setLinkName] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [userToken, setUserToken] = useState("");

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
          let [responseShop] = await Promise.all([
            api.get(`/shop/${idShop}`, {
              headers: { Authorization: token },
            }),
          ]);
          setFullName(responseShop.data.name)
          setOwnerName(responseShop.data.bossName)
          setPhoneNumber(responseShop.data.number)
          setCardNumber(responseShop.data.cardNumber)
          setBankName(responseShop.data.bank)
          setFieldName(responseShop.data.giro)
          setLinkName(responseShop.data.link)
          setAddress(responseShop.data.address)
          setProfileImage(responseShop.data.profilePhoto)
          setPassword(responseShop.data.password)
        }
      } catch ({ error, response }) {
        console.error(error);
        console.log(response);
      }
    };

    fetchData();
  }, []);
  
  const handleConfirm = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      // Create a FormData object
      const formData = new FormData();

      // Add all the text data
      formData.append("name", fullName);
      formData.append("bossName", ownerName);
      formData.append("number", phoneNumber);
      formData.append("cardNumber", cardNumber);
      formData.append("bank", bankName);
      formData.append("giro", fieldName);
      formData.append("link", linkName);
      formData.append("address", address);
      formData.append("password", password);

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

      // Make the request
    
      const response = await api.put(`/owner/shops/${idShop}`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response);
      setConfirmationVisible(true);
      setRefreshData(!refreshData)
     
    } catch (error) {
      console.error(error);
      // Here you could handle errors from the request, or the error we threw if no image was selected
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
            <Text style={styles.modalTitle}>Editar negocio</Text>
            <Text style={styles.modalSubtitle}>Deje vacíos los campos que no va a editar</Text>

            <Text style={styles.textCamp}>Nombre del negocio:</Text>
            <TextInput
              placeholder="Nombre"
              style={styles.textInput}
              value={fullName}
              onChangeText={setFullName}
            />
            <Text style={styles.textCamp}>Nombre del propietario:</Text>
            <TextInput
              placeholder="Nombre del propietario"
              style={styles.textInput}
              value={ownerName}
              onChangeText={setOwnerName}
            />

            <Text style={styles.textCamp}>Número telefónico:</Text>
            <TextInput
              placeholder="Número telefónico"
              style={styles.textInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />

            <Text style={styles.textCamp}>Número de tarjeta o CLABE:</Text>
            <TextInput
              placeholder="1234 5678 9123 4569"
              style={styles.textInput}
              value={cardNumber}
              onChangeText={setCardNumber}
            />

            <Text style={styles.textCamp}>Banco:</Text>
            <TextInput
              placeholder="Nombre del banco"
              style={styles.textInput}
              value={bankName}
              onChangeText={setBankName}
            />

            <Text style={styles.textCamp}>Giro:</Text>
            <TextInput
              placeholder="Ej. Abarrotes"
              style={styles.textInput}
              value={fieldName}
              onChangeText={setFieldName}
            />
            <Text style={styles.textCamp}>Link:</Text>
            <TextInput
              placeholder="Link a la pagina o numero del negocio"
              style={styles.textInput}
              value={linkName}
              onChangeText={setLinkName}
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

            <Text style={styles.textCamp}>Foto de perfil:</Text>
            <TouchableOpacity style={styles.formInputFotos} onPress={() => selectImage(setProfileImage)}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.imagePreview} />
              ) : (
                <Text>Seleccionar foto de perfil</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirmar cambios</Text>
            </TouchableOpacity>

            <EditModalConfirmation visible={confirmationVisible} closeModal={handleCloseConfirmationModal} refreshData={refreshData} setRefreshData={setRefreshData} />
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
});

export default EditShopModal;
