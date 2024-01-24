import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux'



export default function CreateQR({navigation}) {
    const [qrValue, setQRValue] = useState('');
    const [isActive, setIsActive] = useState(false);
    const directoryPath = `${FileSystem.documentDirectory}QRs`
    const {t} = useTranslation()
    const {mode} = useSelector((state) => state.mode)

    const generateQRCode = () => {
      if (!qrValue) return;
      setIsActive(true);
      navigation.navigate("CreatedQR", qrValue)
    };
    
  
  
    const handleInputChange = (text) => {
      setQRValue(text);
  
      if (!text) {
        setIsActive(false);
      }
    };
  
    const deleteQr = async (el) =>{
      await FileSystem.deleteAsync(`${directoryPath}/${el}`, { idempotent: true });
      getPNGFiles()
    }
  

  
    return (
      <View style={styles.container}>
        <View style={[styles.wrapper, {backgroundColor: mode ? '#35383F' : '#fff',}]}>
          <Text style={[styles.title, {color: mode ? 'white' : 'black'}]}>{t("QR Code Generator")}</Text>
          <Text style={[styles.description, {color: mode ? 'white' : '#575757',}]}>{t("Paste a URL or enter text to create a QR code")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("Enter text or URL")}
            value={qrValue}
            placeholderTextColor={mode ? 'white' : 'black'}
            onChangeText={handleInputChange}
          />
          <TouchableOpacity style={styles.button} onPress={generateQRCode}>
            <Text style={styles.buttonText}>{t("Generate QR Code")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: '#eee',
    },
    wrapper: {
      maxWidth: 300,
      borderRadius: 7,
      padding: 20,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 1,
      shadowRadius: 30,
    },
    title: {
      fontSize: 21,
      fontWeight: '500',
      marginBottom: 10,
    },
    description: {
      fontSize: 16,
      marginBottom: 20,
    },
    input: {
      fontSize: 18,
      padding: 17,
      borderWidth: 1,
      borderColor: '#999',
      borderRadius: 5,
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#3498DB',
      borderRadius: 5,
      padding: 15,
      alignItems: 'center',
      marginBottom: 10,
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