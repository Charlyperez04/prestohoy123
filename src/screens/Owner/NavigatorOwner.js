import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text } from 'react-native';
import UserScreen from './UserScreen';
import HomeScreen from './HomeScreen';
import ShopsScreen from './ShopsScreen';
import NotificationsScreen from './NotificationsScreen';

const Tab = createBottomTabNavigator();

export default function OwnerScreens() {
  return (
      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
    
            if (route.name === 'Usuario') {
              iconName = focused ? 'account-circle' : 'account-circle-outline';
            } else if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Tiendas') {
              iconName = focused ? 'store' : 'store-outline';
            } else if (route.name === 'Notificaciones') {
              iconName = focused ? 'bell' : 'bell-outline';
            }
    
            color = focused ? '#FF0083' : '#FF0083';
            size = focused ? 40 : 32;
    
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF0083',
          tabBarInactiveTintColor: 'pink',
          tabBarStyle: {
            shadowColor: 'transparent',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          },        
          tabBarLabel:()=> null,
        })}
      >
        <Tab.Screen name="Usuario" component={UserScreen}  options={{ headerShown: false }} />
        <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Tiendas" component={ShopsScreen}  options={{ headerShown: false }}/>
        <Tab.Screen name="Notificaciones" component={NotificationsScreen}  options={{ headerShown: false }}/>
      </Tab.Navigator>
  );
}
