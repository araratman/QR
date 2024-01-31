import React, { useState, useEffect } from "react";
import { View, Image, Button, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import jsQR from "jsqr";
import { useTranslation } from "react-i18next";


export default function ScanImage({navigation}) {
  const [image, setImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const {t} = useTranslation()


  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const pickImage = async () => {
    if(ImagePicker.MediaTypeOptions.Images){    
        let result = await ImagePicker?.launchImageLibraryAsync({
            mediaTypes: ImagePicker?.MediaTypeOptions?.Images,
            allowsEditing: true,
            aspect: [5, 5],
            quality: 1,
          });
          if (!result.cancelled) {
            setImage(result);
            setScanned(false);
          }
    }  
  };

  const handleImageLoad = async (loadedImage) => {
    if (loadedImage.assets[0].uri) {
      try {
        const response = await fetch(loadedImage.assets[0].uri);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onloadend = async () => {
          const arrayBuffer = reader.result;
          const uint8Array = new Uint8Array(arrayBuffer);

          const { data, width, height } = jsQR(uint8Array, loadedImage.assets[0].width, loadedImage.assets[0].height);
          if (data) {
            console.log("QR Code decoded successfully:", data);
            setScanned(true);
          } else {
            console.log("No QR Code found in the image");
          }
        };

        reader.readAsArrayBuffer(blob);
      } catch (error) {
        console.error("Error loading image:", error);
      }
    } else {
      console.log("Image URI is undefined");
    }
  };

  useEffect(() => {
    if (image) {
      handleImageLoad(image);
    }
  }, [image]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {image && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Image
            source={{ uri: image.assets[0].uri }}
            style={{ width: 200, height: 200, marginBottom: 20 }}
          />
          <Button title={t("Pick Another Image")} onPress={() => setImage(null)} />
          {scanned && <Text style={{ marginTop: 10 }}>QR Code Scanned!</Text>}
        </View>
      )}
      {!image && (
        <Button title={t("Pick an Image from Gallery")} onPress={pickImage} />
      )}
    </View>
  );
}
