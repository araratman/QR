import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useRef } from "react";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import * as FileSystem from 'expo-file-system';
import { useTranslation } from "react-i18next";


export default function CreatedQR({navigation,route}) {
    const directoryPath = `${FileSystem.documentDirectory}QRs`
  const viewShotRef = useRef(null);
  const {t} = useTranslation()

  const saveQRCodeAsPNG = async () => {
    try {
      const uri = await viewShotRef.current.capture({
        format: "png",
        quality: 1,
      });

      const folderPath = `${FileSystem.documentDirectory}QRs/`;

      await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });

      const fileName = `QR_${Date.now()}.png`;

      const filePath = `${folderPath}${fileName}`;

      await FileSystem.moveAsync({ from: uri, to: filePath });
      navigation.navigate("QRList")
    } catch (error) {
      console.error("Error saving QR Code:", error);
    }
  };



  return (
    <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
        <ViewShot ref={viewShotRef} style={styles.qrCode}>
          <QRCode
            value={route.params}
            size={200}
            color="black"
            backgroundColor="transparent"
          />
        </ViewShot>
          <TouchableOpacity style={styles.button} onPress={saveQRCodeAsPNG}>
            <Text style={styles.buttonText}>{t("Save QR as PNG")}</Text>
          </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    button: {
      backgroundColor: '#3498DB',
      borderRadius: 5,
      padding: 15,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
    qrCode: {
      marginTop: 20,
      alignItems: 'center',
    },
  });
