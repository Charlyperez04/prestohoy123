import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Image, Button, StyleSheet } from 'react-native';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';

const RegistrationScreen = () => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [frontIneImage, setFrontIneImage] = useState(null);
  const [backIneImage, setBackIneImage] = useState(null);

  const selectImage = (setImage) => {
    ImagePicker.showImagePicker({}, response => {
      if (response.uri) {
        setImage(response.uri);
      }
    });
  };

  return (
    <ScrollView>
      <Image style={styles.image} source={require('../assets/logo.png')} />

      <Text style={styles.title}>Información de Registro</Text>

      <Text>Nombre</Text>
      <TextInput value={name} onChangeText={setName} />

      <Text>Fecha de Nacimiento</Text>
      <DatePicker date={birthDate} onDateChange={setBirthDate} format="DD-MM-YYYY" />

      <Text>Contraseña</Text>
      <TextInput secureTextEntry value={password} onChangeText={setPassword} />

      <Text>PIN</Text>
      <TextInput secureTextEntry value={pin} onChangeText={setPin} />

      <Text>Número de Teléfono</Text>
      <TextInput keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />

      <Text>Foto de la INE (Frente)</Text>
      <Button title="Subir foto" onPress={() => selectImage(setFrontIneImage)} />
      {frontIneImage && <Image style={styles.previewImage} source={{ uri: frontIneImage }} />}

      <Text>Foto de la INE (Atrás)</Text>
      <Button title="Subir foto" onPress={() => selectImage(setBackIneImage)} />
      {backIneImage && <Image style={styles.previewImage} source={{ uri: backIneImage }} />}

      <Button title="Confirma la solicitud" onPress={() => { /* Aquí iría tu lógica para manejar el envío del formulario */ }} />
      
      <Text style={styles.disclaimer}>Verifica que tu información sea correcta.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  previewImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  disclaimer: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
});

export default RegistrationScreen;
