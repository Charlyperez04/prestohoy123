import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreenShop from './HomeShop';
import NotificationsShop from './TransactionsShop';
import TransactionsShop from './TransactionsShop';


 

const Tab = createBottomTabNavigator();

export default function ShopScreens() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        initialRouteName="Inicio"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
    
            if (route.name === 'Reloj') {
              iconName = focused ? 'clock' : 'clock-outline';
            } else if (route.name === 'Inicio') {
              iconName = focused ? 'home' : 'home-outline';
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
        <Tab.Screen name="Reloj" component={TransactionsShop}  options={{ headerShown: false }} />
        <Tab.Screen name="Inicio" component={HomeScreenShop} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
