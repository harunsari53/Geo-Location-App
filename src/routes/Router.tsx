import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HealtyNavigator from './healthy-navigator';

export default function Router() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="HealtyNavigator" component={HealtyNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
