import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Linking
} from "react-native";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useFocusEffect } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  Easing,
  withTiming,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";



export default function Scan() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasBarcodePermission, setHasBarcodePermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [scanned, setScanned] = useState(false);
  const [camera, setCamera] = useState(false);
  const width = useSharedValue(200);
  const height = useSharedValue(200);
  const {t} = useTranslation()


  async function refreshCamera() {
    const { status: cameraStatus } =
      await Camera.requestCameraPermissionsAsync();
    const { status: barcodeStatus } =
      await BarCodeScanner.requestPermissionsAsync();

    setHasCameraPermission(cameraStatus === "granted");
    setHasBarcodePermission(barcodeStatus === "granted");
  }

  useFocusEffect(
    React.useCallback(() => {
      refreshCamera();
      setCamera(true);
      return () => {
        setHasBarcodePermission(null);
        setHasBarcodePermission(null);
      };
    }, [])
  );

  useEffect(() => {
    refreshCamera();
    const resizeAnimation = () => {
      width.value = withTiming(
        190,
        { duration: 500, easing: Easing.inOut(Easing.ease) },
        () => {
          width.value = withTiming(200, {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
          });
        }
      );

      height.value = withTiming(
        190,
        { duration: 500, easing: Easing.inOut(Easing.ease) },
        () => {
          height.value = withTiming(200, {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
          });
        }
      );
    };

    const intervalId = setInterval(resizeAnimation, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert(
      t("Alert Title"),
      `${t("Open Link")} "${data}"`,
      [
        {
          text: t("Close"),
          onPress: resetScanner
        },
        {
          text: t("Open"),
          onPress:async ()=>{
            resetScanner();
            try {
              if (await Linking.canOpenURL(data)) {
    
                await Linking.openURL(data);
              } else {
                const searchQuery = encodeURIComponent(data);
                await Linking.openURL(`https://www.google.com/search?q=${searchQuery}`);
              }
            } catch (error) {
              // Handle errors more gracefully
              Alert.alert('Error', 'Could not open the URL. Please try again.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(height.value),
      width: withSpring(width.value),
    };
  });

  const resetScanner = () => {
    setScanned(false);
  };

  if (hasCameraPermission === null || hasBarcodePermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasBarcodePermission === false) {
    return <Text>No access to camera or barcode scanner</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
        type={type}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <Animated.View style={[styles.box, animatedStyle]}></Animated.View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 200,
    height: 200,
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: "white",
  },
});
