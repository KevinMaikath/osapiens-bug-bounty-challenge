import i18n from "i18next";
import { cloneDeep } from "lodash";
import { initReactI18next, setDefaults } from "react-i18next";
import de from "./locales/de.json";
import en from "./locales/en.json";

export const FALLBACK_LANGUAGE = "en";

export interface Language {
  locale: string;
  name: string;
  icon: JSX.Element;
}

const getBrowserLanguage = () => {
  // @ts-ignore
  const userLang = navigator.language || navigator.userLanguage;

  return userLang ? userLang.split("-")[0] : FALLBACK_LANGUAGE;
};

const browserLanguage = getBrowserLanguage();

export const defaultTranslationModules = [
  { locale: "de", texts: de },
  { locale: "en", texts: en }
];
export const defaultLanguages = defaultTranslationModules.map((m) => m.locale);

const LANGUAGE_STORAGE_KEY = "i18nextLng";

const getLanguageFromLocalStorage = (): string | null => {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
};

// Decide the initial language. If the user has already selected a language before, prioritize it.
const pickInitialLanguage = (): string => {
  const candidates = [getLanguageFromLocalStorage(), browserLanguage];
  return (
    candidates.find((c): c is string => !!c && defaultLanguages.includes(c)) ??
    FALLBACK_LANGUAGE
  );
};

const resources = cloneDeep(
  Object.fromEntries(
    defaultTranslationModules.map((m) => [m.locale, {app: m.texts}])
  )
);

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)

  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    ns: ["common", "app"],
    defaultNS: "app",
    lng: pickInitialLanguage(),
    fallbackLng: FALLBACK_LANGUAGE,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

// Store the selected language in the local storage for persistence between sessions
i18n.on("languageChanged", (lang) => {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // localStorage unavailable. Skip silently.
  }
});

setDefaults({
  transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'b']
});

export default i18n;
