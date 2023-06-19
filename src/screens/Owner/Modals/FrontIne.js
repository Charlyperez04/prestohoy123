
import React from 'react';
import { Modal, View, Image, TouchableOpacity, Text,StyleSheet } from 'react-native';

const ModalFrontIne = ({ isModalFrontIneVisible,setModalFrontIneVisible, uri }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={isModalFrontIneVisible}
    onRequestClose={() => setModalFrontIneVisible(!isModalFrontIneVisible)}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Image style={styles.modalImage} source={{ uri: uri }} />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalFrontIneVisible(!isModalFrontIneVisible)}
        >
          <Text style={styles.textStyle}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({

    centeredView: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      closeButton: {
        backgroundColor: "#2196F3",
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalImage: {
        width: 300,
        height: 300,
        marginBottom: 15
      },
})

export default ModalFrontIne;
