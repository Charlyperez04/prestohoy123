import React, { useState } from 'react';
import { Modal, Text, TextInput, View, Image, StyleSheet, TouchableOpacity } from 'react-native';


const LoginScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Aquí iría tu lógica para manejar el inicio de sesión
    // dependiendo del rol establecido (comprador, vendedor o dueño)
  };

  return (
    <View style={styles.container}>
      {/* Aquí va el código existente para el resto de la pantalla... */}

      <Modal visible={modalVisible} animationType="slide">
        <Text style={styles.modalTitle}>Iniciar sesión</Text>
        <Text style={styles.modalSubtitle}>Ingresa tus credenciales de acceso</Text>

        <Text style={styles.inputLabel}>Nombre</Text>
        <TextInput 
          style={styles.inputField} 
          placeholder="Nombre completo" 
          onChangeText={setUsername} 
          value={username} 
        />

        <Text style={styles.inputLabel}>Contraseña</Text>
        <TextInput 
          style={styles.inputField} 
          placeholder="Contraseña123" 
          onChangeText={setPassword} 
          value={password} 
          secureTextEntry 
        />

        <TouchableOpacity onPress={() => { /* Aquí va la lógica para recuperar las credenciales */ }}>
          <Text style={styles.linkText}>¿Olvidaste tus credenciales? <Text style={styles.boldLinkText}>Recupéralas</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonPink} onPress={handleLogin}>
          <Text style={styles.buttonTextWhite}>Ingresar</Text>
        </TouchableOpacity>

        
        <TouchableOpacity style={styles.buttonGrey} onPress={() => setModalVisible(false)}>
          <Text style={styles.buttonTextGrey}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { /* Aquí va la lógica para recuperar las credenciales */ }}>
          <Text style={styles.linkText}>¿No tienes una cuenta? <Text style={styles.boldLinkText}>Registrate</Text></Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.termsTotal} onPress={() => { /* Aquí va la lógica para recuperar las credenciales */ }}>
          <Text style={styles.terms}>Al iniciar sesion, aceptas nuestros <Text style={styles.boldLinkText}>Términos y Condiciones</Text></Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    /* Aquí van los estilos existentes... */
  
    modalTitle: {
      fontFamily:'Poppins_800ExtraBold',
      marginTop: 50,
      fontSize: 29,
      marginBottom: 10,
      textAlign: 'center',
    },
    modalSubtitle: {
      fontFamily:'Poppins_300Light',
      fontSize: 15,
      marginBottom: 60,
      textAlign: 'center',
    },
    inputLabel: {
      fontFamily:'Poppins_300Light',
      fontSize: 12,
      marginBottom: -15,
      backgroundColor:'white',
      width: '21%',
      color: '#6E717C',
      alignSelf: 'center',
      marginRight: 160,
      textAlign: 'left',
      paddingLeft: 5,
      zIndex: 1,
    },
    inputField: {
      height: 50,
      borderColor: '#E6E7E8',
      borderWidth: 1,
      marginBottom: 30,
      width: '80%',
      alignSelf: 'center',
      borderRadius: 20,
      padding: 10,
      color: '#B4B4B4',
      backgroundColor:'#F9FAFC'
    },
    linkText: {
      color: '#4A3F3F',
      fontFamily:'Poppins_300Light',
      fontSize: 12,
      marginBottom: 20,
      textAlign: 'center',
      backgroundColor: 'transparent',
    },
    terms: {
      color: '#4A3F3F',
      fontFamily:'Poppins_300Light',
      fontSize: 12,
      marginTop: 20,
      textAlign: 'center',
      backgroundColor: 'transparent',
    },
    termsTotal: {
      marginTop: 60,
    },
    boldLinkText: {
      color: '#4A3F3F',
      textDecorationLine: 'underline',
      backgroundColor: 'transparent',
    },
    terms: {
      textAlign: 'center',
      flexDirection: 'row',
      color: '#4A3F3F',
      fontFamily:'Poppins_300Light',
    },
    checkboxContainer: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    checkbox: {
      alignSelf: 'center',
    },
    label: {
      margin: 8,
    },
    buttonPink: {
      backgroundColor: '#FF0083',
      marginTop: 60,
      alignSelf: 'center',
      padding: 8,
      width: '80%',
      borderRadius: 40,
      marginBottom: 35,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.25, 
      shadowRadius: 3.84,
      elevation: 5,
      
    },
    buttonGrey: {
      backgroundColor: '#E6E7E8',
      alignSelf: 'center',
      padding: 8,
      width: '80%',
      borderRadius: 20,
      marginBottom: 10,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.25, 
      shadowRadius: 3.84,
      elevation: 5
    },
    buttonTextWhite: {
      color: '#FFFFFF',
      textAlign: 'center',
      fontFamily:'Poppins_600SemiBold',
      fontSize: 18,
    },
    buttonTextGrey: {
      color: '#554E4E',
      textAlign: 'center',
      fontFamily:'Poppins_600SemiBold',
      fontSize: 18,
    },
  });
  export default LoginScreen;