import React, {useState} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const {Navigator, Screen} = createMaterialTopTabNavigator();

import {Pet, Payment, Medicine} from '../index';

import {PetContext} from '../../contexts';

import './styles';

export default function Dashboard(props: any) {
  const [pet,setPet] = useState({});
  
  return (
    <PetContext.Provider value={{pet,setPet}}>
      <Navigator
        initialRouteName="Pet"
        screenOptions={{
          tabBarActiveTintColor: '#EE7600',
          tabBarInactiveTintColor: '#555',
          tabBarPressColor: 'red',
          tabBarShowLabel:false,
          tabBarIndicatorStyle: { backgroundColor:'#EE7600'},
          tabBarStyle: { backgroundColor: '#fefefe' },
        }}
      >
        <Screen
          name="Pet"
          component={Pet}
          options={{
            tabBarLabel: 'Pets',
            tabBarIcon: ({color}: any) => (
              <FontAwesome5 name="dog" color={color} size={25} />
            ),
          }}
        />
        <Screen
          name="Payment"
          component={Payment}
          options={{
            tabBarLabel: 'Gastos',
            tabBarIcon: ({color}: any) => (
              <FontAwesome name="dollar" color={color} size={25} />
            ),
          }}
        />
        <Screen
          name="Medicine"
          component={Medicine}
          options={{
            tabBarLabel: 'Medicamentos',
            tabBarIcon: ({color}: any) => (
              <AntDesign name="medicinebox" color={color} size={25} />
            ),
          }}
        />
      </Navigator>
    </PetContext.Provider>
  );
}
