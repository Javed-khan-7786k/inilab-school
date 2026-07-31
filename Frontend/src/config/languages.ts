export interface Language {
  code: string;
  name: string;
  flagUrl: string;
}

export const LANGUAGES: Language[] = [
  { code: "ar", name: "Arabic", flagUrl: "https://flagcdn.com/dz.svg" },
  { code: "bn", name: "Bengali", flagUrl: "https://flagcdn.com/bd.svg" },
  { code: "zh", name: "Chinese", flagUrl: "https://flagcdn.com/cn.svg" },
  { code: "en", name: "English", flagUrl: "https://flagcdn.com/gb.svg" },
  { code: "fr", name: "French", flagUrl: "https://flagcdn.com/fr.svg" },
  { code: "de", name: "German", flagUrl: "https://flagcdn.com/de.svg" },
];
