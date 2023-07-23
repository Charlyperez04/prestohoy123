import React,{useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';

const NipModal = ({ modalNipVisible, setModalNipVisible, onNipInput}) => {
  const [nip, setNip] = useState('');
  useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold
  });
  const handleButtonPress = () => {
    onNipInput(nip);
    setModalNipVisible(!modalNipVisible);
    setNip('')
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalNipVisible}
      onRequestClose={() => {
        setModalNipVisible(!modalNipVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>NIP</Text>
          <TextInput
            style={styles.TextInput}
            placeholder='1234'
            keyboardType='numeric' // solo permitirá la entrada de números
            onChangeText={text => setNip(text)}
            value={nip}
            secureTextEntry={true}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleButtonPress} // cierra el modal cuando se presiona
          >
            <Text style={styles.textCloseButton}>Listo</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    paddingVertical:30,
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
  modalText:{
    fontSize:16,
    fontFamily:'Poppins_400Regular'
  },
  TextInput:{
    width:200,
    height:40,
    textAlign:'center',
    borderRadius:10,
    padding:10,
    marginTop:5,
    marginBottom:15,
    backgroundColor:'#E2E6EE'
    },
    closeButton:{
        width:100,
        height:40,
        borderRadius:20,
        backgroundColor:'rgba(255, 0, 131, 0.7)',
        justifyContent:'center',
        alignItems:'center',
       
        },
        textCloseButton:{
        fontSize:18,
        fontFamily:'Poppins_600SemiBold',
        color:'#fff',
        textAlign:'center'
        }

  
});

export default NipModal;
