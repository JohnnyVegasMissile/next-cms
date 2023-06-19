export const locales = [
    'af',
    'sq',
    'ar',
    'eu',
    'be',
    'bg',
    'ca',
    'zh',
    'hr',
    'cs',
    'da',
    'nl',
    'en',
    'et',
    'fo',
    'fa',
    'fi',
    'fr',
    'gd',
    'de',
    'el',
    'he',
    'hi',
    'hu',
    'is',
    'id',
    'ga',
    'it',
    'ja',
    'ko',
    'ku',
    'lv',
    'lt',
    'mk',
    'ml',
    'ms',
    'mt',
    'no',
    'nb',
    'nn',
    'pl',
    'pt',
    'pa',
    'rm',
    'ro',
    'ru',
    'sr',
    'sk',
    'sl',
    'sb',
    'es',
    'sv',
    'th',
    'ts',
    'tn',
    'tr',
    'ua',
    'ur',
    've',
    'vi',
    'cy',
    'xh',
    'ji',
    'zu',
]

export type LanguageKey =
    | 'AF'
    | 'SQ'
    | 'AR'
    | 'EU'
    | 'BE'
    | 'BG'
    | 'CA'
    | 'ZH'
    | 'HR'
    | 'CS'
    | 'DA'
    | 'NL'
    | 'EN'
    | 'ET'
    | 'FO'
    | 'FA'
    | 'FI'
    | 'FR'
    | 'GD'
    | 'DE'
    | 'EL'
    | 'HE'
    | 'HI'
    | 'HU'
    | 'IS'
    | 'ID'
    | 'GA'
    | 'IT'
    | 'JA'
    | 'KO'
    | 'KU'
    | 'LV'
    | 'LT'
    | 'MK'
    | 'ML'
    | 'MS'
    | 'MT'
    | 'NO'
    | 'NB'
    | 'NN'
    | 'PL'
    | 'PT'
    | 'PA'
    | 'RM'
    | 'RO'
    | 'RU'
    | 'SR'
    | 'SK'
    | 'SL'
    | 'SB'
    | 'ES'
    | 'SV'
    | 'TH'
    | 'TS'
    | 'TN'
    | 'TR'
    | 'UA'
    | 'UR'
    | 'VE'
    | 'VI'
    | 'CY'
    | 'XH'
    | 'JI'
    | 'ZU'

type LanguagesType = { [key in LanguageKey]: { name: string; code: string; en: string } }

const languages: LanguagesType = {
    AF: { name: 'Afrikaans', code: 'af', en: 'Afrikaans' },
    SQ: { name: 'Albanian', code: 'sq', en: 'Albanian' },
    AR: { name: 'Arabic', code: 'ar', en: 'Arabic' },
    EU: { name: 'Basque', code: 'eu', en: 'Basque' },
    BE: { name: 'Belarusian', code: 'be', en: 'Belarusian' },
    BG: { name: 'Bulgarian', code: 'bg', en: 'Bulgarian' },
    CA: { name: 'Catalan', code: 'ca', en: 'Catalan' },
    ZH: { name: 'Chinese', code: 'zh', en: 'Chinese' },
    HR: { name: 'Croatian', code: 'hr', en: 'Croatian' },
    CS: { name: 'Czech', code: 'cs', en: 'Czech' },
    DA: { name: 'Danish', code: 'da', en: 'Danish' },
    NL: { name: 'Dutch', code: 'nl', en: 'Dutch' },
    EN: { name: 'English', code: 'en', en: 'English' },
    ET: { name: 'Estonian', code: 'et', en: 'Estonian' },
    FO: { name: 'Faeroese', code: 'fo', en: 'Faeroese' },
    FA: { name: 'Farsi', code: 'fa', en: 'Farsi' },
    FI: { name: 'Finnish', code: 'fi', en: 'Finnish' },
    FR: { name: 'French', code: 'fr', en: 'French' },
    GD: { name: 'Gaelic', code: 'gd', en: 'Gaelic' },
    DE: { name: 'German', code: 'de', en: 'German' },
    EL: { name: 'Greek', code: 'el', en: 'Greek' },
    HE: { name: 'Hebrew', code: 'he', en: 'Hebrew' },
    HI: { name: 'Hindi', code: 'hi', en: 'Hindi' },
    HU: { name: 'Hungarian', code: 'hu', en: 'Hungarian' },
    IS: { name: 'Icelandic', code: 'is', en: 'Icelandic' },
    ID: { name: 'Indonesian', code: 'id', en: 'Indonesian' },
    GA: { name: 'Irish', code: 'ga', en: 'Irish' },
    IT: { name: 'Italian', code: 'it', en: 'Italian' },
    JA: { name: 'Japanese', code: 'ja', en: 'Japanese' },
    KO: { name: 'Korean', code: 'ko', en: 'Korean' },
    KU: { name: 'Kurdish', code: 'ku', en: 'Kurdish' },
    LV: { name: 'Latvian', code: 'lv', en: 'Latvian' },
    LT: { name: 'Lithuanian', code: 'lt', en: 'Lithuanian' },
    MK: { name: 'Macedonian (FYROM)', code: 'mk', en: 'Macedonian (FYROM)' },
    ML: { name: 'Malayalam', code: 'ml', en: 'Malayalam' },
    MS: { name: 'Malaysian', code: 'ms', en: 'Malaysian' },
    MT: { name: 'Maltese', code: 'mt', en: 'Maltese' },
    NO: { name: 'Norwegian', code: 'no', en: 'Norwegian' },
    NB: { name: 'Norwegian (Bokmål)', code: 'nb', en: 'Norwegian (Bokmål)' },
    NN: { name: 'Norwegian (Nynorsk)', code: 'nn', en: 'Norwegian (Nynorsk)' },
    PL: { name: 'Polish', code: 'pl', en: 'Polish' },
    PT: { name: 'Portuguese', code: 'pt', en: 'Portuguese' },
    PA: { name: 'Punjabi', code: 'pa', en: 'Punjabi' },
    RM: { name: 'Rhaeto-Romanic', code: 'rm', en: 'Rhaeto-Romanic' },
    RO: { name: 'Romanian', code: 'ro', en: 'Romanian' },
    RU: { name: 'Russian', code: 'ru', en: 'Russian' },
    SR: { name: 'Serbian', code: 'sr', en: 'Serbian' },
    SK: { name: 'Slovak', code: 'sk', en: 'Slovak' },
    SL: { name: 'Slovenian', code: 'sl', en: 'Slovenian' },
    SB: { name: 'Sorbian', code: 'sb', en: 'Sorbian' },
    ES: { name: 'Spanish', code: 'es', en: 'Spanish' },
    SV: { name: 'Swedish', code: 'sv', en: 'Swedish' },
    TH: { name: 'Thai', code: 'th', en: 'Thai' },
    TS: { name: 'Tsonga', code: 'ts', en: 'Tsonga' },
    TN: { name: 'Tswana', code: 'tn', en: 'Tswana' },
    TR: { name: 'Turkish', code: 'tr', en: 'Turkish' },
    UA: { name: 'Ukrainian', code: 'ua', en: 'Ukrainian' },
    UR: { name: 'Urdu', code: 'ur', en: 'Urdu' },
    VE: { name: 'Venda', code: 've', en: 'Venda' },
    VI: { name: 'Vietnamese', code: 'vi', en: 'Vietnamese' },
    CY: { name: 'Welsh', code: 'cy', en: 'Welsh' },
    XH: { name: 'Xhosa', code: 'xh', en: 'Xhosa' },
    JI: { name: 'Yiddish', code: 'ji', en: 'Yiddish' },
    ZU: { name: 'Zulu', code: 'zu', en: 'Zulu' },
}

export default languages
