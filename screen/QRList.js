import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";


export default function QRList() {
  const [pngFiles, setPngFiles] = useState("");
  const directoryPath = `${FileSystem.documentDirectory}QRs`;
  const {t} = useTranslation()

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
        getPNGFiles()
    }, [])
  );

  const deleteQr = async (el) =>{
    await FileSystem.deleteAsync(`${directoryPath}/${el}`, { idempotent: true });
    getPNGFiles()
  }

  return (
    <View>
      <FlatList
        style={{ margin: 5}}
        data={pngFiles}
        numColumns={2}
        keyExtractor={(item, index) => item}
        renderItem={(item) => (
            <View style={{flex:0.5, height: 150, margin: 10}} >
                  <Image style={{flex:1, objectFit:'contain', backgroundColor:'white'}} source={{uri: `${directoryPath}/${item.item}`}} />
                  <TouchableOpacity style={{width: '100%',backgroundColor:'#BA0C2F', padding: 5,borderRadius: 5,marginTop: 10,}} onPress={()=>deleteQr(item.item)}>
                    <Text style={{textAlign:'center', color:'white'}}>{t("remove")}</Text>
                  </TouchableOpacity>
                </View>
        )}
      />
    </View>
  );
}
