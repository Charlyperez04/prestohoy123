import React from 'react'
//import the dependencies for the code?
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BusinessesScreen from './ShopList';
import NotificationsScreen from './Notifications';
import HomeScreenClient from './Home';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function ClientScreens() {
  return (
      <Tab.Navigator
      initialRouteName='Inicio'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
    
            if (route.name === 'Negocios') {
              iconName = focused ? 'store' : 'store-outline';
            } else if (route.name === 'Inicio') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Notificaciones') {
              iconName = focused ? 'bell' : 'bell-outline';
            }
    
            // Si el tab está focused, el color será FF0083, si no, será rosa
            color = focused ? '#FF0083' : '#FF0083';
    
            // Puedes cambiar el tamaño aquí
            size = focused ? 40 : 32;
    
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF0083',  // Color cuando el tab está activo
          tabBarInactiveTintColor: 'pink',  // Color cuando el tab no está activo
          tabBarStyle: {
            shadowColor: 'transparent',  // elimina la sombra
            borderTopLeftRadius: 0,  // elimina el borde redondeado en la esquina superior izquierda
            borderTopRightRadius: 0,  // elimina el borde redondeado en la esquina superior derecha
          },        
          tabBarLabel:()=> null,  // Oculta el nombre de la sección
        })}
      >
        <Tab.Screen name="Negocios" component={BusinessesScreen}  options={{ headerShown: false }} />
        <Tab.Screen name="Inicio" component={HomeScreenClient} options={{ headerShown: false }} />
        <Tab.Screen name="Notificaciones" component={NotificationsScreen}  options={{ headerShown: false }}/>
      </Tab.Navigator>
  );
}