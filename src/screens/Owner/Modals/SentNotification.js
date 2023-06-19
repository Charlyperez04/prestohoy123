import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const ModalNotificationSent = ({ visible, onClose }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.notificationText}>Notificación enviada exitosamente</Text>
          <Image source={require('../../../assets/succes.png')} style={styles.image} />
          <TouchableOpacity style={styles.okButton} onPress={onClose}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // fondo sombreado
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
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
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: '#FF0083',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  okButtonText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ModalNotificationSent;
