import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translate/en.json";
import ru from "./translate/ru.json";
import am from "./translate/am.json";

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  am: { translation: am },
};

i18n.use(initReactI18next).init({
  resources,
  compatibilityJSON: "v3",
  lng: "en",
  fallbackLng: "en",
});

export default i18n;
