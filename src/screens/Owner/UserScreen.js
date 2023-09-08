import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import arrow from "../../assets/arrow.png";
import ModalSendNotification from "./Modals/SendNotification";
import ModalNotificationSent from "./Modals/SentNotification";
import ModalDeleteUser from "./Modals/UserDelete";
import EditUserModal from "./Modals/EditUser";
import AddUserModal from "./Modals/AddUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/connection";
import ModalFrontIne from "./Modals/FrontIne";
import ModalBackIne from "./Modals/BackIne";
import ModalProfilePhoto from "./Modals/ProfilePhoto";
import EditModalConfirmation from "./Modals/EditModalConfirmation";

const UsersScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [modalSendNotification, setModalSendNotification] = useState(false);
  const [modalDeleteUser, setModalDeleteUser] = useState(false);
  const [modalEditUser, setModalEditUser] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [isModalAddUserVisible, setIsModalAddUserVisible] = useState(false);
  const [shops, setShops] = useState([]);
  const [shopToken, setShopToken] = useState(null);
  const [shopRole, setShopRole] = useState(null);
  const [shopId, setShopId] = useState(null);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalFrontIneVisible, setModalFrontIneVisible] = useState(false);
  const [isModalBackIneVisible, setModalBackIneVisible] = useState(false);
  const [isModalProfilePhotoVisible, setModalProfilePhotoVisible] = useState(false);
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
          const responseClients = await api.get(`/owner/clients`, { headers: { Authorization: token } });
          setClients(responseClients.data);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    };

    fetchData();
  }, [refreshData]);

  const handleOpenModalAddUser = () => {
    setIsModalAddUserVisible(true);
  };

  const handleCloseModalAddUser = () => {
    setIsModalAddUserVisible(false);
  };

  const handleConfirmChanges = () => {
    setEditModalVisible(false);
    setConfirmModalVisible(true);
  };

  const handleConfirmModalClose = () => {
    setConfirmModalVisible(false);
  };

  const handleOpenModalEdit = () => {
    setModalEditUser(true);
  };

  const handleCloseModalEdit = () => {
    setModalEditUser(false);
  };

  const openModalDeleteUser = () => {
    setModalDeleteUser(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmationVisible(false);
    handleCloseModalEdit();
  };
  const closeModalDeleteUser = () => {
    setModalDeleteUser(false);
  };

  const openModalNotification = () => {
    setModalSendNotification(true);
  };

  const closeModalNotification = () => {
    setModalSendNotification(false);
  };

  const handleDeleteUser = async () => {
    try {
      closeModalDeleteUser();
      setSelectedClient(null);

      const shopId = selectedClient._id;
      await api.delete(`/owner/clients/${shopId}`, {
        headers: { Authorization: shopToken },
      });

      const updatedClients = clients.filter((client) => client._id !== shopId);
      setClients(updatedClients);

      console.log("Cliente eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el negocio:", error);
    }
  };
  const handleDeleteCutDate = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");

      const formData = new FormData();

      formData.append("fechaCorte", "Por definir");

      let response = await api.put(`/owner/clients/${selectedClient._id}`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      setIsLoading(false);
      setConfirmationVisible(true);
      setRefreshData(true);
    } catch (error) {
      console.error(error);
      console.log(error.message);
      console.log(error.config);
      setIsLoading(false);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  const handleDeletePayDate = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");

      const formData = new FormData();

      formData.append("fechaPago", "Por definir");

      let response = await api.put(`/owner/clients/${selectedClient._id}`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      setIsLoading(false);
      setConfirmationVisible(true);
      setRefreshData(true);
    } catch (error) {
      console.error(error);
      console.log(error.message);
      console.log(error.config);
      setIsLoading(false);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };
  const handleClientPress = (clientId) => {
    try {
      const client = clients.find((client) => client._id === clientId);
      setSelectedClient(client);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    try {
      setSelectedClient(null);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleClientPress(item._id)}>
      <View style={styles.clientBlock}>
        <Image source={{ uri: item.profilePhoto }} style={{ width: 50, height: 50 }} />
        <Text>{item.name}</Text>
        <Image source={arrow} style={{ width: 30, height: 30 }} />
      </View>
    </TouchableOpacity>
  );

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.titleText}>Usuarios</Text>
        <EditModalConfirmation
          visible={confirmationVisible}
          closeModal={handleCloseConfirmationModal}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
        />
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
        <TouchableOpacity
          onPress={handleOpenModalAddUser}
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

        <AddUserModal
          visible={isModalAddUserVisible}
          closeModal={handleCloseModalAddUser}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
        />
        <FlatList data={filteredClients} renderItem={renderItem} keyExtractor={(item) => item._id} />

        {selectedClient && (
          <Modal visible={!!selectedClient} animationType="slide" onRequestClose={handleCloseModal}>
            <ScrollView>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Icon onPress={handleCloseModal} name="keyboard-backspace" size={40} color="#000" />
                  <TouchableOpacity onPress={() => setModalProfilePhotoVisible(true)}>
                    <Image source={{ uri: selectedClient.profilePhoto }} style={styles.modalUserImage} />
                  </TouchableOpacity>
                  <Icon onPress={handleOpenModalEdit} name="account-edit" size={40} color="#FF0083" />
                  <EditUserModal
                    visible={modalEditUser}
                    closeModal={handleCloseModalEdit}
                    idClient={selectedClient._id}
                    refreshData={refreshData}
                    setRefreshData={setRefreshData}
                  />
                </View>
                <ModalProfilePhoto
                  isModalProfilePhotoVisible={isModalProfilePhotoVisible}
                  setModalProfilePhotoVisible={setModalProfilePhotoVisible}
                  uri={selectedClient.profilePhoto}
                />
                <Text style={styles.modalUserName}>{selectedClient.name}</Text>

                <View style={styles.creditDataContainer}>
                  <View style={styles.creditDataBlock}>
                    <Text style={styles.creditDataTitle}>Crédito total:</Text>
                    <Text style={styles.creditDataText}>${selectedClient.maxCredit}</Text>
                  </View>
                  <View style={styles.creditDataBlock}>
                    <Text style={styles.creditDataTitle}>Crédito usado:</Text>
                    <Text style={styles.creditDataText}>${selectedClient.usedCredit}</Text>
                  </View>
                </View>
                <View style={styles.creditDataContainer}>
                  <View style={styles.creditDataBlock}>
                    <Text style={styles.creditDataTitle}>Monto por pagar:</Text>
                    <Text style={styles.creditDataText}>
                      ${selectedClient.montoFinal ? selectedClient.montoFinal : "0"}
                    </Text>
                  </View>
                  <View style={styles.creditDataBlock}>
                    <Text style={styles.creditDataTitle}>Crédito restante:</Text>
                    <Text style={styles.creditDataText}>
                      ${parseFloat((selectedClient.maxCredit - selectedClient.usedCredit).toFixed(2))}
                    </Text>
                  </View>
                </View>

                <Text style={styles.sectionTitle}>Datos del usuario</Text>

                <View style={styles.userDataContainer}>
                  <ScrollView>
                    <View style={styles.userDataLine}>
                      <Text style={styles.userDataName}>Nombre: </Text>
                      <Text style={styles.userDataText}>{selectedClient.name}</Text>
                    </View>
                    <View style={styles.userDataLine}>
                      <Text style={styles.userDataName}>Dirección: </Text>
                      <Text style={styles.userDataText}>{selectedClient.address}</Text>
                    </View>
                    <View style={styles.userDataLine}>
                      <Text style={styles.userDataName}>Fecha de nacimiento: </Text>
                      <Text style={styles.userDataText}>{selectedClient.bornDate}</Text>
                    </View>
                    <View style={styles.userDataLine}>
                      <Text style={styles.userDataName}>Número: </Text>
                      <Text style={styles.userDataText}>{selectedClient.phoneNumber}</Text>
                    </View>
                    <View style={styles.userDataLine}>
                      <Text style={styles.userDataName}>PIN: </Text>
                      <Text style={styles.userDataText}>{selectedClient.pin}</Text>
                    </View>
                    <View style={styles.userDataLine}>
                      <Text style={styles.userDataName}>Fecha de corte: </Text>
                      <Text style={styles.userDataText}>
                        {selectedClient.fechaCorte.length >= 2
                          ? selectedClient.fechaCorte
                          : "Fecha por definir"}
                      </Text>
                    </View>
                    <View style={styles.userDataLine}>
                      <Text style={styles.userDataName}>Fecha limite de pago: </Text>
                      <Text style={styles.userDataText}>
                        {selectedClient.fechaPago.length >= 2
                          ? selectedClient.fechaPago
                          : "Fecha por definir"}
                      </Text>
                    </View>
                    <View style={styles.userDataLine}>
                      <Text style={styles.userDataName}>Contraseña: </Text>
                      <Text style={styles.userDataText}>{selectedClient.password}</Text>
                    </View>
                    <View style={styles.userDataLine}>
                      <Text style={styles.userDataName}>Imagen INE frontal: </Text>
                      <TouchableOpacity onPress={() => setModalFrontIneVisible(true)}>
                        <Image source={{ uri: selectedClient.frontIne }} style={styles.userDataImage} />
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                  <ModalFrontIne
                    isModalFrontIneVisible={isModalFrontIneVisible}
                    setModalFrontIneVisible={setModalFrontIneVisible}
                    uri={selectedClient.frontIne}
                  />
                  <View style={styles.userDataLine}>
                    <Text style={styles.userDataName}>Imagen INE trasera: </Text>
                    <TouchableOpacity onPress={() => setModalBackIneVisible(true)}>
                      <Image source={{ uri: selectedClient.backIne }} style={styles.userDataImage} />
                    </TouchableOpacity>
                  </View>
                </View>
                <ModalBackIne
                  isModalBackIneVisible={isModalBackIneVisible}
                  setModalBackIneVisible={setModalBackIneVisible}
                  uri={selectedClient.backIne}
                />

                <TouchableOpacity style={styles.sendNotificationButton} onPress={openModalNotification}>
                  <Text style={styles.sendNotificationButtonText}>Enviar notificación</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteUserButton} onPress={openModalDeleteUser}>
                  <Text style={styles.deleteUserButtonText}>Borrar usuario</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteUserButton1} onPress={handleDeleteCutDate}>
                  <Text style={styles.deleteUserButtonText}>Borrar fecha de corte</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteUserButton2} onPress={handleDeletePayDate}>
                  <Text style={styles.deleteUserButtonText}>Borrar fecha de pago</Text>
                </TouchableOpacity>

                <ModalSendNotification
                  visible={modalSendNotification}
                  onClose={closeModalNotification}
                  idClient={selectedClient._id}
                  tokenPush={selectedClient.tokenNotifications}
                />

                <ModalDeleteUser
                  visible={modalDeleteUser}
                  onConfirm={handleDeleteUser}
                  onCancel={closeModalDeleteUser}
                  idClient={selectedClient._id}
                />
              </View>
            </ScrollView>
          </Modal>
        )}
      </View>
    </SafeAreaProvider>
  );
};

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
    ...Platform.select({
      ios: {
        flex: 1,
        backgroundColor: "white",
        marginTop: 50,
      },
      android: {
        lex: 1,
        backgroundColor: "white",
        marginTop: 20,
      },
    }),
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  modalUserImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  modalUserName: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    marginBottom: 10,
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
    alignSelf: "flex-start",
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
    marginBottom: 15,
  },
  deleteUserButton1: {
    backgroundColor: "#690000",
    padding: 8,
    borderRadius: 10,
    marginTop: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    marginBottom: 15,
  },
  deleteUserButton2: {
    backgroundColor: "#9C1E1E",
    padding: 8,
    borderRadius: 10,
    marginTop: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    marginBottom: 15,
  },
  deleteUserButtonText: {
    color: "white",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 17,
  },
});

export default UsersScreen;
