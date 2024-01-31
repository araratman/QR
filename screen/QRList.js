import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";

export default function QRList() {
  const [pngFiles, setPngFiles] = useState("");
  const [modal, setModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState({});
  const directoryPath = `${FileSystem.documentDirectory}QRs`;
  const { t } = useTranslation();
  const { mode } = useSelector((state) => state.mode);

  const getPNGFiles = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(directoryPath);
      const pngFiles = files.filter((file) => file.endsWith(".png"));
      setPngFiles(pngFiles);
    } catch (error) {
      console.error("Error reading directory:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getPNGFiles();
    }, [])
  );

  const deleteQr = async (el) => {
    await FileSystem.deleteAsync(`${directoryPath}/${el}`, {
      idempotent: true,
    });
    getPNGFiles();
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ margin: 5 }}
        data={pngFiles}
        numColumns={2}
        keyExtractor={(item, index) => item}
        renderItem={(item) => (
          <TouchableOpacity
            onPress={() => {
              setModal(true);
              setSelectedImage(item);
            }}
            style={{ flex: 0.5, height: 150, margin: 10 }}
          >
            <Image
              style={{
                flex: 1,
                objectFit: "contain",
                backgroundColor: "white",
              }}
              source={{ uri: `${directoryPath}/${item.item}` }}
            />
            <TouchableOpacity
              style={{
                width: "100%",
                backgroundColor: "#BA0C2F",
                padding: 5,
                borderRadius: 5,
                marginTop: 10,
              }}
              onPress={() => deleteQr(item.item)}
            >
              <Text style={{ textAlign: "center", color: "white" }}>
                {t("remove")}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
      {modal && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            flex: 1,
            backgroundColor: "red",
          }}
        >
          <TouchableOpacity
          onPress={()=>{
            setModal(false);
              setSelectedImage({});
          }}
            style={{ right: 10, top: 10, position: "absolute",zIndex: 1 }}
          >
            <Ionicons
              name={"close"}
              size={38}
              color={mode ? "white" : "black"}
            />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              style={{
                flex: 1,
                objectFit: "contain",
                backgroundColor: "white",
              }}
              source={{ uri: `${directoryPath}/${selectedImage.item}` }}
            />
          )}
        </View>
      )}
    </View>
  );
}
