import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import ModalNotificationSent from "./SentNotification";
import { TextInput } from "react-native-gesture-handler";
import api from '../../../api/connection'
import AsyncStorage from "@react-native-async-storage/async-storage";

const ModalSendNotification = ({ visible, onClose ,idClient,whatIs,tokenPush}) => {
  const [notificationSent, setNotificationSent] = useState(false);
  const [e,setE]=useState('')

  const handleSendNotification =async  () => {
    try{
    const token = await AsyncStorage.getItem("userToken");
    if(whatIs==='shop'){
      const message = {
        to: tokenPush,
        sound: 'default',
        title: 'PrestoHoy',
        body: e,
      };
    
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      console.log(idClient);
      const response = await api.post(
        `/owner/notificationsShop/${idClient}`,
        {
          message: e,
        },
        {
          headers: {
            Authorization:token,
          },
  
        }
      );
      console.log(response.data);
    setNotificationSent(true);
    }else{
      const message = {
        to: tokenPush,
        sound: 'default',
        title: 'PrestoHoy',
        body: e,
      };
    
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    const response = await api.post(
      `/owner/notifications/${idClient}`,
      {
        message: e,
      },
      {
        headers: {
          Authorization:token,
        },

      }
    );
console.log(response.data);
    setNotificationSent(true);
  }
    }catch(e){
      console.log(e)
    }
  };

  const handleCloseNotificationSent = () => {
    // Cerrar el modal de notificación enviada exitosamente
    setNotificationSent(false);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Inserte el mensaje a enviar</Text>
            <TextInput placeholder="Mensaje aqui..." style={{
                height: 50,
                width: '100%',
                padding:10,
                backgroundColor:'#E5E5E5',
                borderRadius: 10,
                marginBottom:10
                
            }}
            value={e}
            onChangeText={setE}
            />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendNotification}>
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
      {notificationSent && (
        <ModalNotificationSent visible={notificationSent} onClose={handleCloseNotificationSent} />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Fondo sombreado
  },
  modalView: {
    width: "80%", // Ancho del modal
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
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
  closeButton: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  closeButtonText: {
    fontSize: 20,
    fontFamily: "Poppins_900Black",
    textAlign: "center",
    color: "red",
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: "#FF0083",
    padding: 10,
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    color: "white",
  },
});

export default ModalSendNotification;
