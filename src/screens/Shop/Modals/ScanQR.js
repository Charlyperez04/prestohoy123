import React from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function QRModal({ isScannerVisible, handleBarCodeScanned, setScannerVisible, scanned, setScanned }) {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isScannerVisible}
      >
        <View style={styles.centeredView}>
          {isScannerVisible && (
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setScannerVisible(false);
              setScanned(false);
            }}
          >
            <Text style={styles.closeButtonText}>
              Cerrar
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
  

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
      },
    
      closeButtonText: {
        color: "white",
        fontSize: 20,
      },
      closeButton: {
        position: "absolute",
        bottom: 10,
        alignSelf:'center',
        backgroundColor: "#FF0083",
        borderRadius: 20,
        padding: 15,
        elevation: 2,
      },
});
