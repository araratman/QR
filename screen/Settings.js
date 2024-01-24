import { View, Text, TouchableOpacity, Switch } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RadioButton } from "react-native-paper";
import i18n from "../constants/i18n.config";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { getMode } from "../state/features/mode/modeApi";

export default function Settings() {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.mode);
  const [isEnabled, setIsEnabled] = useState(false);
  const [lang, setLang] = useState([
    { id: 1, lang: "English (US)", selected: true, key: "en" },
    { id: 2, lang: "Русский", selected: false, key: "ru" },
    { id: 3, lang: "Հայերեն", selected: false, key: "am" },
  ]);

  const getLanguage = async () => {
    let data = await AsyncStorage.getItem("lang");
    data = JSON.parse(data);
    const updatedLang = lang.map((el) => {
      if (data.id == el.id) {
        return { ...el, selected: true };
      } else {
        return { ...el, selected: false };
      }
    });
    setLang(updatedLang);
  };
  const { t } = useTranslation();

  const toggleSwitch = async () => {
    setIsEnabled(!isEnabled);
    await AsyncStorage.setItem("mode", JSON.stringify(!isEnabled));
    dispatch(getMode());
  };

  useEffect(() => {
    getLanguage();
  }, []);

  useEffect(() => {
    setIsEnabled(mode);
  }, [mode]);

  const changeLang = (langItem) => {
    const updatedLang = lang.map((el) => {
      if (langItem.id == el.id) {
        AsyncStorage.setItem("lang", JSON.stringify(langItem));
        i18n.changeLanguage(langItem.key);
        return { ...el, selected: true };
      } else {
        return { ...el, selected: false };
      }
    });
    setLang(updatedLang);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: mode ? "white" : "black",
          }}
        >
          {t("Language")}
        </Text>
        {lang.map((el, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                changeLang(el);
              }}
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: 10,
              }}
            >
              <Text
                style={{ fontWeight: "600", color: mode ? "white" : "black" }}
              >
                {el.lang}
              </Text>
              <RadioButton
                color={mode ? "white" : "black"}
                value="first"
                status={el.selected && "checked"}
                onPress={() => {
                  changeLang(el);
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={{width: '100%', flexDirection:'row', justifyContent:'space-between',alignItems: "center",}}>
        <Text style={{color: mode ? 'white' : '#575757',}}>{t("Mode")}</Text>
        <Switch
          trackColor={{ false: "#767577", true: "silver" }}
          thumbColor={isEnabled ? "#767577" : "#767577"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
}
