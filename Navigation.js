import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Drawer from "./app/tabs/drawer/_layout";
import { StatusBar } from "react-native";
import CreatedQR from "./screen/CreatedQR";
import { useSelector, useDispatch } from 'react-redux'
import { getMode } from './state/features/mode/modeApi';

const Stack = createNativeStackNavigator();


export default function Navigation() {
  const { mode } = useSelector((state) => state.mode)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getMode())
  }, [])

  const MyTheme = mode
    ? {
      dark: true,
      colors: {
        primary: "silver",
        background: "#181A20",
        card: "#181A20",
        text: "#9E9E9E",
        border: "#181A20",
        notification: "umber",
      },
    }
    : {
      dark: false,
      colors: {
        primary: "silver",
        background: "rgb(242, 242, 242)",
        card: "rgb(255, 255, 255)",
        text: "rgb(28, 28, 30)",
        border: "rgb(199, 199, 204)",
        notification: "rgb(255, 69, 58)",
      },
    };

  return (
    <NavigationContainer theme={MyTheme}>
      <StatusBar hidden />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Drawer" component={Drawer} />
        <Stack.Screen name="CreatedQR" component={CreatedQR} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}