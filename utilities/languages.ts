import { CodeLanguage } from '@prisma/client'

type LanguagesType = { [key in CodeLanguage]: { familly: string; name: string; code: string; en: string } }

const languages: LanguagesType = {
    AB: { familly: 'Northwest Caucasian', name: 'Аԥсуа бызшәа', en: 'Abkhazian', code: 'ab' },
    AA: { familly: 'Afro-Asiatic', name: 'Qafaraf', en: 'Afar', code: 'aa' },
    AF: { familly: 'Indo-European', name: 'Afrikaans', en: 'Afrikaans', code: 'af' },
    SQ: { familly: 'Indo-European', name: 'Shqipja', en: 'Albanian', code: 'sq' },
    AM: { familly: 'Afro-Asiatic', name: 'አማርኛ', en: 'Amharic', code: 'am' },
    AR: { familly: 'Afro-Asiatic', name: 'الْعَرَبِيَّة', en: 'Arabic', code: 'ar' },
    AN: { familly: 'Indo-European', name: 'Aragonés', en: 'Aragonese', code: 'an' },
    HY: { familly: 'Indo-European', name: 'հայերեն', en: 'Armenian', code: 'hy' },
    AS: { familly: 'Indo-European', name: 'অসমীয়া', en: 'Assamese', code: 'as' },
    AY: { familly: 'Aymaran', name: 'Aymar aru', en: 'Aymara', code: 'ay' },
    AZ: { familly: 'Turkic', name: 'آذربایجان دیلی', en: 'Azerbaijani', code: 'az' },
    BA: { familly: 'Turkic', name: 'Башҡортса', en: 'Bashkir', code: 'ba' },
    EU: { familly: 'Language isolate', name: 'Euskara', en: 'Basque', code: 'eu' },
    BN: { familly: 'Indo-European', name: 'বাংলা', en: 'Bengali (Bangla)', code: 'bn' },
    DZ: { familly: 'Sino-Tibetan', name: 'རྫོང་ཁ་', en: 'Bhutani', code: 'dz' },
    BH: { familly: 'Indo-European', name: 'भोजपुरी', en: 'Bihari', code: 'bh' },
    BI: { familly: 'Creole', name: 'Bislama', en: 'Bislama', code: 'bi' },
    BR: { familly: 'Indo-European', name: 'Brezhoneg', en: 'Breton', code: 'br' },
    BG: { familly: 'Indo-European', name: 'български език', en: 'Bulgarian', code: 'bg' },
    MY: { familly: 'Sino-Tibetan', name: 'မြန်မာဘာသာ', en: 'Burmese', code: 'my' },
    BE: { familly: 'Indo-European', name: 'беларуская мова', en: 'Byelorussian (Belarusian)', code: 'be' },
    KM: { familly: 'Austro-Asiatic', name: 'ភាសាខ្មែរ', en: 'Cambodian (Khmer)', code: 'km' },
    CA: { familly: 'Indo-European', name: 'català', en: 'Catalan', code: 'ca' },
    ZH: { familly: 'Sino-Tibetan', name: '中文', en: 'Chinese', code: 'zh' },
    CO: { familly: 'Indo-European', name: 'Corsu', en: 'Corsican', code: 'co' },
    HR: { familly: 'Indo-European', name: 'Hrvatski', en: 'Croatian', code: 'hr' },
    CS: { familly: 'Indo-European', name: 'Čeština', en: 'Czech', code: 'cs' },
    DA: { familly: 'Indo-European', name: 'Dansk', en: 'Danish', code: 'da' },
    NL: { familly: 'Indo-European', name: 'Nederlands', en: 'Dutch', code: 'nl' },
    EN: { familly: 'Indo-European', name: 'English', en: 'English (American)', code: 'en' },
    EO: { familly: 'Constructed', name: '', en: 'Esperanto', code: 'eo' },
    ET: { familly: 'Uralic', name: '', en: 'Estonian', code: 'et' },
    FO: { familly: 'Indo-European', name: '', en: 'Faeroese', code: 'fo' },
    FA: { familly: 'Indo-European', name: '', en: 'Farsi', code: 'fa' },
    FJ: { familly: 'Austronesian', name: '', en: 'Fiji', code: 'fj' },
    FI: { familly: 'Uralic', name: '', en: 'Finnish', code: 'fi' },
    FR: { familly: 'Indo-European', name: 'Français', en: 'French', code: 'fr' },
    FY: { familly: 'Indo-European', name: '', en: 'Frisian', code: 'fy' },
    GD: { familly: 'Indo-European', name: '', en: 'Gaelic (Scottish)', code: 'gd' },
    GV: { familly: 'Indo-European', name: '', en: 'Gaelic (Manx)', code: 'gv' },
    GL: { familly: 'Indo-European', name: '', en: 'Galician', code: 'gl' },
    KA: { familly: 'South Caucasian', name: '', en: 'Georgian', code: 'ka' },
    DE: { familly: 'Indo-European', name: '', en: 'German', code: 'de' },
    EL: { familly: 'Indo-European', name: '', en: 'Greek', code: 'el' },
    KL: { familly: 'Eskimo-Aleut', name: '', en: 'Kalaallisut (Greenlandic)', code: 'kl' },
    GN: { familly: 'Tupian', name: '', en: 'Guarani', code: 'gn' },
    GU: { familly: 'Indo-European', name: '', en: 'Gujarati', code: 'gu' },
    HT: { familly: 'Creole', name: '', en: 'Haitian Creole', code: 'ht' },
    HA: { familly: 'Afro-Asiatic', name: '', en: 'Hausa', code: 'ha' },
    HE: { familly: 'Afro-Asiatic', name: '', en: 'Hebrew', code: 'he' },
    HI: { familly: 'Indo-European', name: '', en: 'Hindi', code: 'hi' },
    HU: { familly: 'Uralic', name: '', en: 'Hungarian', code: 'hu' },
    IS: { familly: 'Indo-European', name: '', en: 'Icelandic', code: 'is' },
    IO: { familly: 'Constructed', name: '', en: 'Ido', code: 'io' },
    ID: { familly: 'Austronesian', name: '', en: 'Indonesian', code: 'id' },
    IA: { familly: 'Constructed', name: '', en: 'Interlingua', code: 'ia' },
    IE: { familly: 'Constructed', name: '', en: 'Interlingue', code: 'ie' },
    IU: { familly: 'Eskimo-Aleut', name: '', en: 'Inuktitut', code: 'iu' },
    IK: { familly: 'Eskimo-Aleut', name: '', en: 'Inupiak', code: 'ik' },
    GA: { familly: 'Indo-European', name: '', en: 'Irish', code: 'ga' },
    IT: { familly: 'Indo-European', name: '', en: 'Italian', code: 'it' },
    JA: { familly: 'Japonic', name: '', en: 'Japanese', code: 'ja' },
    JV: { familly: 'Austronesian', name: '', en: 'Javanese', code: 'jv' },
    KN: { familly: 'Dravidian', name: '', en: 'Kannada', code: 'kn' },
    KS: { familly: 'Indo-European', name: '', en: 'Kashmiri', code: 'ks' },
    KK: { familly: 'Turkic', name: '', en: 'Kazakh', code: 'kk' },
    RW: { familly: 'Niger-Congo', name: '', en: 'Kinyarwanda (Ruanda)', code: 'rw' },
    KY: { familly: 'Turkic', name: '', en: 'Kirghiz', code: 'ky' },
    RN: { familly: 'Niger-Congo', name: '', en: 'Kirundi (Rundi)', code: 'rn' },
    KO: { familly: 'Language isolate', name: '', en: 'Korean', code: 'ko' },
    KU: { familly: 'Indo-European', name: '', en: 'Kurdish', code: 'ku' },
    LO: { familly: 'Tai-Kadai', name: '', en: 'Laothian', code: 'lo' },
    LA: { familly: 'Indo-European', name: '', en: 'Latin', code: 'la' },
    LV: { familly: 'Indo-European', name: '', en: 'Latvian (Lettish)', code: 'lv' },
    LI: { familly: 'Indo-European', name: '', en: 'Limburgish (Limburger)', code: 'li' },
    LN: { familly: 'Niger-Congo', name: '', en: 'Lingala', code: 'ln' },
    LT: { familly: 'Indo-European', name: '', en: 'Lithuanian', code: 'lt' },
    MK: { familly: 'Indo-European', name: '', en: 'Macedonian', code: 'mk' },
    MG: { familly: 'Austronesian', name: '', en: 'Malagasy', code: 'mg' },
    MS: { familly: 'Austronesian', name: '', en: 'Malay', code: 'ms' },
    ML: { familly: 'Austronesian', name: '', en: 'Malayalam', code: 'ml' },
    MT: { familly: 'Afro-Asiatic', name: '', en: 'Maltese', code: 'mt' },
    MI: { familly: 'Austronesian', name: '', en: 'Maori', code: 'mi' },
    MR: { familly: 'Indo-European', name: '', en: 'Marathi', code: 'mr' },
    MO: { familly: 'Indo-European', name: '', en: 'Moldavian', code: 'mo' },
    MN: { familly: 'Mongolic', name: '', en: 'Mongolian', code: 'mn' },
    NA: { familly: 'Austronesian', name: '', en: 'Nauru', code: 'na' },
    NE: { familly: 'Indo-European', name: '', en: 'Nepali', code: 'ne' },
    NO: { familly: 'Indo-European', name: '', en: 'Norwegian', code: 'no' },
    OC: { familly: 'Indo-European', name: '', en: 'Occitan', code: 'oc' },
    OR: { familly: 'Indo-European', name: '', en: 'Oriya', code: 'or' },
    OM: { familly: 'Afro-Asiatic', name: '', en: 'Oromo (Afan, Galla)', code: 'om' },
    PS: { familly: 'Indo-European', name: '', en: 'Pashto (Pushto)', code: 'ps' },
    PL: { familly: 'Indo-European', name: '', en: 'Polish', code: 'pl' },
    PT: { familly: 'Indo-European', name: '', en: 'Portuguese', code: 'pt' },
    PA: { familly: 'Indo-European', name: '', en: 'Punjabi', code: 'pa' },
    QU: { familly: 'Quechuan', name: '', en: 'Quechua', code: 'qu' },
    RM: { familly: 'Indo-European', name: '', en: 'Rhaeto-Romance', code: 'rm' },
    RO: { familly: 'Indo-European', name: '', en: 'Romanian', code: 'ro' },
    RU: { familly: 'Indo-European', name: '', en: 'Russian', code: 'ru' },
    SM: { familly: 'Austronesian', name: '', en: 'Samoan', code: 'sm' },
    SG: { familly: 'Creole', name: '', en: 'Sango', code: 'sg' },
    SA: { familly: 'Indo-European', name: '', en: 'Sanskrit', code: 'sa' },
    SR: { familly: 'Indo-European', name: '', en: 'Serbian', code: 'sr' },
    SH: { familly: 'Indo-European', name: '', en: 'Serbo-Croatian', code: 'sh' },
    ST: { familly: 'Niger-Congo', name: '', en: 'Sesotho', code: 'st' },
    TN: { familly: 'Niger-Congo', name: '', en: 'Setswana', code: 'tn' },
    SN: { familly: 'Niger-Congo', name: '', en: 'Shona', code: 'sn' },
    II: { familly: 'Sino-Tibetan', name: '', en: 'Sichuan Yi', code: 'ii' },
    SD: { familly: 'Indo-European', name: '', en: 'Sindhi', code: 'sd' },
    SI: { familly: 'Indo-European', name: '', en: 'Sinhalese', code: 'si' },
    SS: { familly: 'Niger-Congo', name: '', en: 'Siswati', code: 'ss' },
    SK: { familly: 'Indo-European', name: '', en: 'Slovak', code: 'sk' },
    SL: { familly: 'Indo-European', name: '', en: 'Slovenian', code: 'sl' },
    SO: { familly: 'Afro-Asiatic', name: '', en: 'Somali', code: 'so' },
    ES: { familly: 'Indo-European', name: '', en: 'Spanish', code: 'es' },
    SU: { familly: 'Austronesian', name: '', en: 'Sundanese', code: 'su' },
    SW: { familly: 'Niger-Congo', name: '', en: 'Swahili (Kiswahili)', code: 'sw' },
    SV: { familly: 'Indo-European', name: '', en: 'Swedish', code: 'sv' },
    TL: { familly: 'Austronesian', name: '', en: 'Tagalog', code: 'tl' },
    TG: { familly: 'Indo-European', name: '', en: 'Tajik', code: 'tg' },
    TA: { familly: 'Dravidian', name: '', en: 'Tamil', code: 'ta' },
    TT: { familly: 'Turkic', name: '', en: 'Tatar', code: 'tt' },
    TE: { familly: 'Dravidian', name: '', en: 'Telugu', code: 'te' },
    TH: { familly: 'Tai-Kadai', name: '', en: 'Thai', code: 'th' },
    BO: { familly: 'Sino-Tibetan', name: '', en: 'Tibetan', code: 'bo' },
    TI: { familly: 'Afro-Asiatic', name: '', en: 'Tigrinya', code: 'ti' },
    TO: { familly: 'Austronesian', name: '', en: 'Tonga', code: 'to' },
    TS: { familly: 'Niger-Congo', name: '', en: 'Tsonga', code: 'ts' },
    TR: { familly: 'Turkic', name: '', en: 'Turkish', code: 'tr' },
    TK: { familly: 'Turkic', name: '', en: 'Turkmen', code: 'tk' },
    TW: { familly: 'Niger-Congo', name: '', en: 'Twi', code: 'tw' },
    UG: { familly: 'Turkic', name: '', en: 'Uighur', code: 'ug' },
    UK: { familly: 'Indo-European', name: '', en: 'Ukrainian', code: 'uk' },
    UR: { familly: 'Indo-European', name: '', en: 'Urdu', code: 'ur' },
    UZ: { familly: 'Turkic', name: '', en: 'Uzbek', code: 'uz' },
    VI: { familly: 'Austro-Asiatic', name: '', en: 'Vietnamese', code: 'vi' },
    VO: { familly: 'Constructed', name: '', en: 'Volapük', code: 'vo' },
    WA: { familly: 'Indo-European', name: '', en: 'Wallon', code: 'wa' },
    CY: { familly: 'Indo-European', name: '', en: 'Welsh', code: 'cy' },
    WO: { familly: 'Niger-Congo', name: '', en: 'Wolof', code: 'wo' },
    XH: { familly: 'Niger-Congo', name: '', en: 'Xhosa', code: 'xh' },
    YI: { familly: 'Indo-European', name: '', en: 'Yiddish', code: 'yi' },
    YO: { familly: 'Niger-Congo', name: '', en: 'Yoruba', code: 'yo' },
    ZU: { familly: 'Niger-Congo', name: '', en: 'Zulu', code: 'zu' },
}

export default languages
