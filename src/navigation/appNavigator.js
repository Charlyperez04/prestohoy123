import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainScreen from '../screens/MainScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import LoginScreen from '../screens/LoginScreen';
import OwnerScreens from '../screens/Owner/NavigatorOwner';
import ClientScreens from '../screens/Client/NavigatorClient';
import ShopScreens from '../screens/Shop/NavigationShop';
import ClientHome from '../screens/Client/Home';
import ShopHome from '../screens/Shop/HomeShop'

const Stack = createStackNavigator();
const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState('Main');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      const userRole = await AsyncStorage.getItem('userRole');
      const userId = await AsyncStorage.getItem('userId');

      if (userToken && userRole && userId) {
        console.log(
          `User token: ${userToken}, user role: ${userRole}, user id: ${userId}`,
        );
        // Si se encuentran los datos almacenados, se establece la ruta inicial en función del rol
        if (userRole === 'client'&&userId) {
          setInitialRoute('ClientScreens');
        } else if (userRole==='shop' && userId){
          setInitialRoute('ShopScreens')
        } else if (userRole==='owner' && userId){
          setInitialRoute('OwnerScreens')
        }
      }
      
      setIsReady(true);
    };

    checkLoginStatus();
  }, []);

  if (!isReady) {
    return null; // Muestra un estado de carga o pantalla de inicio mientras se carga la información
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OwnerScreens" component={OwnerScreens} options={{ headerShown: false }} />
        <Stack.Screen name="ClientScreens" component={ClientScreens} options={{ headerShown: false }} />
        <Stack.Screen name="ClientHomeScreen" component={ClientHome} options={{ headerShown: false }} />
        <Stack.Screen name="ShopHomeScreen" component={ShopHome} options={{ headerShown: false }} />
        <Stack.Screen name="ShopScreens" component={ShopScreens} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
