import { useNavigation } from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Image, StyleSheet } from "react-native";
import arrow from "../../assets/arrow.png";
import ModalSendNotification from "./Modals/SendNotification";
import ModalNotificationSent from "./Modals/SentNotification";
import ModalDeleteShop from "./Modals/ShopDelete";
import EditShopModal from "./Modals/EditShop";
import api from "../../api/connection";
import AddShopModal from "./Modals/AddShop";
import { ScrollView } from "react-native-gesture-handler";

function ShopScreen({navigation}) {
  const [searchText, setSearchText] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalSendNotification, setModalSendNotification] = useState(false);
  const [modalDeleteShop, setModalDeleteShop] = useState(false);
  const [modalEditShop, setModalEditShop] = useState(false);
  const [isModalAddShopVisible, setIsModalAddShopVisible] = useState(false);
  const [shopToken, setShopToken] = useState(null);
  const [shopRole, setShopRole] = useState(null);
  const [shopId, setShopId] = useState(null);
  const [shops, setShops] = useState(false);
  const [filteredShops, setFilteredShops] = useState(shops);
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    const filterShops = () => {
      if (searchText.trim() === "") {
        setFilteredShops(shops);
      } else {
        const filtered = shops.filter((shop) => shop.name.toLowerCase().includes(searchText.toLowerCase()));
        setFilteredShops(filtered);
      }
    };

    filterShops();
  }, [searchText, shops]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const role = await AsyncStorage.getItem("userRole");
        const id = await AsyncStorage.getItem("userId");

        if (token !== null) {
          setShopToken(token);
        }
        if (role !== null) {
          setShopRole(role);
        }
        if (id !== null) {
          setShopId(id);
        }
        if (token !== null && id !== null) {
          // Realizar la petición GET con Axios
          let [responseShops] = await Promise.all([
          
            api.get(`/owner/shops`, { headers: { Authorization: token } }),
          ,
          ]);

          // Actualizar el estado con los datos recibidos

          setShops(responseShops.data);
        }
      } catch ({ error, response }) {
        console.error(error);
        console.log(response);
      }
    };

    fetchData();
  }, [refreshData]);

  const handleOpenModalAddShop = () => {
    setIsModalAddShopVisible(true);
  };

  const handleCloseModalAddShop = () => {
    setIsModalAddShopVisible(false);
  };

  const handleConfirmChanges = () => {
    setEditModalVisible(false);
    setConfirmModalVisible(true);
  };

  const handleConfirmModalClose = () => {
    setConfirmModalVisible(false);
  };

  const handleOpenModalEdit = () => {
    setModalEditShop(true);
  };

  const handleCloseModalEdit = () => {
    setModalEditShop(false);
  };

  const openModalDeleteShop = () => {
    setModalDeleteShop(true);
  };

  const closeModalDeleteShop = () => {
    setModalDeleteShop(false);
  };

  const openModalNotification = () => {
    setModalSendNotification(true);
  };

  const closeModalNotification = () => {
    setModalSendNotification(false);
  };

  const handleDeleteShop = async () => {
    try {
      closeModalDeleteShop();
      setSelectedClient(null);

      const shopId = selectedClient._id;
      await api.delete(`/owner/shops/${shopId}`, {
        headers: { Authorization: shopToken },
      });

      // Elimina el negocio de la lista actualizada
      const updatedShops = shops.filter((shop) => shop._id !== shopId);
      setShops(updatedShops);

      // El negocio se eliminó exitosamente
      console.log("Negocio eliminado correctamente");
    } catch (error) {
      // Hubo un error al eliminar el negocio
      console.error("Error al eliminar el negocio:", error);
      // Muestra un mensaje de error o realiza cualquier acción de manejo de errores necesaria
    }
  };

  const handleClientPress = (shopId) => {
    try {
      setRefreshData(!refreshData)
      const shop = shops.find((shop) => shop._id === shopId);
      setSelectedClient(shop);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    try {
      setSelectedClient(null);
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleClientPress(item._id) }>
      <View style={styles.clientBlock}>
        <Image source={{ uri: item.profilePhoto }} style={{ width: 50, height: 50 }} />
        <Text>{item.name}</Text>
        <Image source={arrow} style={{ width: 30, height: 30 }} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.titleText}>Comercios</Text>

        <View style={styles.searchSection}>
          <TextInput
            style={styles.input}
            placeholder="Buscar..."
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              /* Implementar la lógica de búsqueda aquí... */
            }}
          >
            <Icon name="magnify" size={30} color="#000" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleOpenModalAddShop}
          style={{
            backgroundColor: "#FF0083",
            width: 40,
            height: 40,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: 20,
            right: 20,
            zIndex: 1,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 30,
              fontWeight: "bold",
              alignSelf: "center",
              padding: 5,
              bottom: 7, // ajusta este valor según sea necesario
            }}
          >
            +
          </Text>
        </TouchableOpacity>

        <AddShopModal visible={isModalAddShopVisible} closeModal={handleCloseModalAddShop} refreshData={refreshData} setRefreshData={setRefreshData}/>
        <FlatList data={filteredShops} renderItem={renderItem} keyExtractor={(item) => item._id} />

        {selectedClient && (
          <Modal visible={!!selectedClient} animationType="slide" onRequestClose={handleCloseModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Icon onPress={handleCloseModal} name="keyboard-backspace" size={40} color="#000" />
              </View>
              <Image source={{ uri: selectedClient.profilePhoto }} style={styles.modalUserImage} />

              <Text style={styles.modalUserName}>{selectedClient.name}</Text>

              <Text style={styles.sectionTitle}>Datos del negocio</Text>

              <ScrollView style={styles.userDataContainer}>
                <View style={styles.userDataLine}>
                  <Text style={styles.userDataName}>Dueño: </Text>
                  <Text style={styles.userDataText}>{selectedClient.bossName}</Text>
                </View>
                <View style={styles.userDataLine}>
                  <Text style={styles.userDataName}>Nombre: </Text>
                  <Text style={styles.userDataText}>{selectedClient.name}</Text>
                </View>
                <View style={styles.userDataLine}>
                  <Text style={styles.userDataName}>Dirección: </Text>
                  <Text style={styles.userDataText}>{selectedClient.address}</Text>
                </View>
                <View style={styles.userDataLine}>
                  <Text style={styles.userDataName}>Número de tarjeta: </Text>
                  <Text style={styles.userDataText}>{selectedClient.cardNumber}</Text>
                </View>
                <View style={styles.userDataLine}>
                  <Text style={styles.userDataName}>Banco: </Text>
                  <Text style={styles.userDataText}>{selectedClient.bank}</Text>
                </View>
                <View style={styles.userDataLine}>
                  <Text style={styles.userDataName}>Giro: </Text>
                  <Text style={styles.userDataText}>{selectedClient.giro}</Text>
                </View>
                <View style={styles.userDataLine}>
                  <Text style={styles.userDataName}>Link: </Text>
                  <Text style={styles.userDataText}>{selectedClient.link}</Text>
                </View>
                <View style={styles.userDataLine}>
                  <Text style={styles.userDataName}>Contraseña: </Text>
                  <Text style={styles.userDataText}>{selectedClient.password}</Text>
                </View>
                <View style={styles.userDataLine}>
                  <Text style={styles.userDataName}>Número telefónico: </Text>
                  <Text style={styles.userDataText}>{selectedClient.number}</Text>
                </View>
              </ScrollView>

              <TouchableOpacity onPress={handleOpenModalEdit} style={styles.sendNotificationButton}>
                <EditShopModal
                  visible={modalEditShop}
                  closeModal={handleCloseModalEdit}
                  idShop={selectedClient._id}
                  refreshData={refreshData}
                  setRefreshData={setRefreshData}
                />
                <Text style={styles.sendNotificationButtonText}>Editar datos de negocio</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteUserButton} onPress={openModalDeleteShop}>
                <Text style={styles.deleteUserButtonText}>Borrar negocio</Text>
              </TouchableOpacity>

              <ModalSendNotification visible={modalSendNotification} onClose={closeModalNotification} />

              <ModalDeleteShop
                visible={modalDeleteShop}
                onConfirm={handleDeleteShop}
                onCancel={closeModalDeleteShop}
              />
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 35,
    flex: 1,
    backgroundColor: "white",
  },
  titleText: {
    fontSize: 29,
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  searchSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E5E5",
    padding: 5,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    padding: 5,
  },
  searchButton: {
    padding: 5,
  },
  clientBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 8,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  modalUserImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    position: "absolute",
    alignSelf: "center",
  },
  modalUserName: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 25,
  },
  creditDataContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  creditDataBlock: {
    padding: 7,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    backgroundColor: "white",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  creditDataBlock2: {
    padding: 7,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    width: "50%",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  creditDataTitle: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
  creditDataText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
  remainingCreditContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  remainingCreditTitle: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
  remainingCreditText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    marginTop: 20,
  },
  userDataContainer: {
    marginTop: 5,
    margin: 10,
    padding: 10,
    elevation: 5,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    maxHeight:350
  },
  userDataLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  userDataName: {
    fontFamily: "Poppins_600SemiBold",
    maxWidth: "50%",
    fontSize: 16,
  },
  userDataText: {
    maxWidth: "50%",
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    alignSelf: "center",

  },
  userDataImage: {
    width: 50,
    height: 50,
  },
  sendNotificationButton: {
    backgroundColor: "#FF0083",
    padding: 8,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },
  sendNotificationButtonText: {
    color: "white",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 17,
  },
  deleteUserButton: {
    backgroundColor: "#FE0000",
    padding: 8,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },
  deleteUserButtonText: {
    color: "white",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 17,
  },
});

export default ShopScreen;
