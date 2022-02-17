import dict from "./dictinary";

class Translate {
    static language = "pt";
    static setLanguage(lang) {}
    static convert(src) {
        if (Translate.language === "en") return src;
        return dict[Translate.language] && dict[Translate.language][src] ? dict[Translate.language][src] : src;
    }
}
export default Translate;
