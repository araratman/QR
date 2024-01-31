import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useRef } from "react";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import { useTranslation } from "react-i18next";
import * as MediaLibrary from "expo-media-library";
import { useSelector } from 'react-redux'


export default function CreatedQR({ navigation, route }) {
  const viewShotRef = useRef(null);
  const { t } = useTranslation();
  const {mode} = useSelector((state) => state.mode)
  useEffect(() => {
    saveHistory();
  }, []);

  const saveHistory = async () => {
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
    } catch (error) {
      console.error("Error saving QR Code:", error);
    }
  };

  const saveQRCodeAsPNG = async () => {
    const uri = await viewShotRef.current.capture({
      format: "png",
      quality: 1,
    });
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      await MediaLibrary.saveToLibraryAsync(uri);
      navigation.navigate("QRList")
      console.log("Image successfully saved");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ViewShot ref={viewShotRef} style={styles.qrCode}>
        <QRCode
          value={route.params}
          size={200}
          color="black"
          backgroundColor="white"
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
    backgroundColor: "#3498DB",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  qrCode: {
    marginTop: 20,
    alignItems: "center",
  },
});
