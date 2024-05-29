import React, { useState } from "react";
import Property from "./Property";
import {
  Button, Menu,
  MenuItem,
  Paper,
  Typography
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ClearIcon from "@mui/icons-material/Clear";
import {
  setForm
} from "../../../../../utils/redux/reducers/csvxapiReducer";

const FormLanguageMap = (props) => {
  const { columnDefs, name, type, index } = props;

  const dispatch = useDispatch();
  const form = useSelector((state) => state.csvxapiReducer.form);

  //RFC5646 language tags taken from: https://gist.github.com/msikma/8912e62ed866778ff8cd
  const languages = [
    { English: "Afrikaans", alpha2: "af" },
    { English: "Afrikaans (South Africa)", alpha2: "af-ZA" },
    { English: "Arabic", alpha2: "ar" },
    { English: "Arabic (U.A.E.)", alpha2: "ar-AE" },
    { English: "Arabic (Bahrain)", alpha2: "ar-BH" },
    { English: "Arabic (Algeria)", alpha2: "ar-DZ" },
    { English: "Arabic (Egypt)", alpha2: "ar-EG" },
    { English: "Arabic (Iraq)", alpha2: "ar-IQ" },
    { English: "Arabic (Jordan)", alpha2: "ar-JO" },
    { English: "Arabic (Kuwait)", alpha2: "ar-KW" },
    { English: "Arabic (Lebanon)", alpha2: "ar-LB" },
    { English: "Arabic (Libya)", alpha2: "ar-LY" },
    { English: "Arabic (Morocco)", alpha2: "ar-MA" },
    { English: "Arabic (Oman)", alpha2: "ar-OM" },
    { English: "Arabic (Qatar)", alpha2: "ar-QA" },
    { English: "Arabic (Saudi Arabia)", alpha2: "ar-SA" },
    { English: "Arabic (Syria)", alpha2: "ar-SY" },
    { English: "Arabic (Tunisia)", alpha2: "ar-TN" },
    { English: "Arabic (Yemen)", alpha2: "ar-YE" },
    { English: "Azeri (Latin)", alpha2: "az" },
    { English: "Azeri (Latin) (Azerbaijan)", alpha2: "az-AZ" },
    { English: "Azeri (Cyrillic) (Azerbaijan)", alpha2: "az-Cyrl-AZ" },
    { English: "Belarusian", alpha2: "be" },
    { English: "Belarusian (Belarus)", alpha2: "be-BY" },
    { English: "Bulgarian", alpha2: "bg" },
    { English: "Bulgarian (Bulgaria)", alpha2: "bg-BG" },
    { English: "Bosnian (Bosnia and Herzegovina)", alpha2: "bs-BA" },
    { English: "Catalan", alpha2: "ca" },
    { English: "Catalan (Spain)", alpha2: "ca-ES" },
    { English: "Czech", alpha2: "cs" },
    { English: "Czech (Czech Republic)", alpha2: "cs-CZ" },
    { English: "Welsh", alpha2: "cy" },
    { English: "Welsh (United Kingdom)", alpha2: "cy-GB" },
    { English: "Danish", alpha2: "da" },
    { English: "Danish (Denmark)", alpha2: "da-DK" },
    { English: "German", alpha2: "de" },
    { English: "German (Austria)", alpha2: "de-AT" },
    { English: "German (Switzerland)", alpha2: "de-CH" },
    { English: "German (Germany)", alpha2: "de-DE" },
    { English: "German (Liechtenstein)", alpha2: "de-LI" },
    { English: "German (Luxembourg)", alpha2: "de-LU" },
    { English: "Divehi", alpha2: "dv" },
    { English: "Divehi (Maldives)", alpha2: "dv-MV" },
    { English: "Greek", alpha2: "el" },
    { English: "Greek (Greece)", alpha2: "el-GR" },
    { English: "English", alpha2: "en" },
    { English: "English (Australia)", alpha2: "en-AU" },
    { English: "English (Belize)", alpha2: "en-BZ" },
    { English: "English (Canada)", alpha2: "en-CA" },
    { English: "English (Caribbean)", alpha2: "en-CB" },
    { English: "English (United Kingdom)", alpha2: "en-GB" },
    { English: "English (Ireland)", alpha2: "en-IE" },
    { English: "English (Jamaica)", alpha2: "en-JM" },
    { English: "English (New Zealand)", alpha2: "en-NZ" },
    { English: "English (Republic of the Philippines)", alpha2: "en-PH" },
    { English: "English (Trinidad and Tobago)", alpha2: "en-TT" },
    { English: "English (United States)", alpha2: "en-US" },
    { English: "English (South Africa)", alpha2: "en-ZA" },
    { English: "English (Zimbabwe)", alpha2: "en-ZW" },
    { English: "Esperanto", alpha2: "eo" },
    { English: "Spanish", alpha2: "es" },
    { English: "Spanish (Argentina)", alpha2: "es-AR" },
    { English: "Spanish (Bolivia)", alpha2: "es-BO" },
    { English: "Spanish (Chile)", alpha2: "es-CL" },
    { English: "Spanish (Colombia)", alpha2: "es-CO" },
    { English: "Spanish (Costa Rica)", alpha2: "es-CR" },
    { English: "Spanish (Dominican Republic)", alpha2: "es-DO" },
    { English: "Spanish (Ecuador)", alpha2: "es-EC" },
    { English: "Spanish (Spain)", alpha2: "es-ES" },
    { English: "Spanish (Guatemala)", alpha2: "es-GT" },
    { English: "Spanish (Honduras)", alpha2: "es-HN" },
    { English: "Spanish (Mexico)", alpha2: "es-MX" },
    { English: "Spanish (Nicaragua)", alpha2: "es-NI" },
    { English: "Spanish (Panama)", alpha2: "es-PA" },
    { English: "Spanish (Peru)", alpha2: "es-PE" },
    { English: "Spanish (Puerto Rico)", alpha2: "es-PR" },
    { English: "Spanish (Paraguay)", alpha2: "es-PY" },
    { English: "Spanish (El Salvador)", alpha2: "es-SV" },
    { English: "Spanish (Uruguay)", alpha2: "es-UY" },
    { English: "Spanish (Venezuela)", alpha2: "es-VE" },
    { English: "Estonian", alpha2: "et" },
    { English: "Estonian (Estonia)", alpha2: "et-EE" },
    { English: "Basque", alpha2: "eu" },
    { English: "Basque (Spain)", alpha2: "eu-ES" },
    { English: "Farsi", alpha2: "fa" },
    { English: "Farsi (Iran)", alpha2: "fa-IR" },
    { English: "Finnish", alpha2: "fi" },
    { English: "Finnish (Finland)", alpha2: "fi-FI" },
    { English: "Faroese", alpha2: "fo" },
    { English: "Faroese (Faroe Islands)", alpha2: "fo-FO" },
    { English: "French", alpha2: "fr" },
    { English: "French (Belgium)", alpha2: "fr-BE" },
    { English: "French (Canada)", alpha2: "fr-CA" },
    { English: "French (Switzerland)", alpha2: "fr-CH" },
    { English: "French (France)", alpha2: "fr-FR" },
    { English: "French (Luxembourg)", alpha2: "fr-LU" },
    { English: "French (Principality of Monaco)", alpha2: "fr-MC" },
    { English: "Galician", alpha2: "gl" },
    { English: "Galician (Spain)", alpha2: "gl-ES" },
    { English: "Gujarati", alpha2: "gu" },
    { English: "Gujarati (India)", alpha2: "gu-IN" },
    { English: "Hebrew", alpha2: "he" },
    { English: "Hebrew (Israel)", alpha2: "he-IL" },
    { English: "Hindi", alpha2: "hi" },
    { English: "Hindi (India)", alpha2: "hi-IN" },
    { English: "Croatian", alpha2: "hr" },
    { English: "Croatian (Bosnia and Herzegovina)", alpha2: "hr-BA" },
    { English: "Croatian (Croatia)", alpha2: "hr-HR" },
    { English: "Hungarian", alpha2: "hu" },
    { English: "Hungarian (Hungary)", alpha2: "hu-HU" },
    { English: "Armenian", alpha2: "hy" },
    { English: "Armenian (Armenia)", alpha2: "hy-AM" },
    { English: "Indonesian", alpha2: "id" },
    { English: "Indonesian (Indonesia)", alpha2: "id-ID" },
    { English: "Icelandic", alpha2: "is" },
    { English: "Icelandic (Iceland)", alpha2: "is-IS" },
    { English: "Italian", alpha2: "it" },
    { English: "Italian (Switzerland)", alpha2: "it-CH" },
    { English: "Italian (Italy)", alpha2: "it-IT" },
    { English: "Japanese", alpha2: "ja" },
    { English: "Japanese (Japan)", alpha2: "ja-JP" },
    { English: "Georgian", alpha2: "ka" },
    { English: "Georgian (Georgia)", alpha2: "ka-GE" },
    { English: "Kazakh", alpha2: "kk" },
    { English: "Kazakh (Kazakhstan)", alpha2: "kk-KZ" },
    { English: "Kannada", alpha2: "kn" },
    { English: "Kannada (India)", alpha2: "kn-IN" },
    { English: "Korean", alpha2: "ko" },
    { English: "Korean (Korea)", alpha2: "ko-KR" },
    { English: "Konkani", alpha2: "kok" },
    { English: "Konkani (India)", alpha2: "kok-IN" },
    { English: "Kyrgyz", alpha2: "ky" },
    { English: "Kyrgyz (Kyrgyzstan)", alpha2: "ky-KG" },
    { English: "Lithuanian", alpha2: "lt" },
    { English: "Lithuanian (Lithuania)", alpha2: "lt-LT" },
    { English: "Latvian", alpha2: "lv" },
    { English: "Latvian (Latvia)", alpha2: "lv-LV" },
    { English: "Maori", alpha2: "mi" },
    { English: "Maori (New Zealand)", alpha2: "mi-NZ" },
    { English: "FYRO Macedonian", alpha2: "mk" },
    { English: "FYRO Macedonian (Former Yugoslav Republic of Macedonia)", alpha2: "mk-MK" },
    { English: "Mongolian", alpha2: "mn" },
    { English: "Mongolian (Mongolia)", alpha2: "mn-MN" },
    { English: "Marathi", alpha2: "mr" },
    { English: "Marathi (India)", alpha2: "mr-IN" },
    { English: "Malay", alpha2: "ms" },
    { English: "Malay (Brunei Darussalam)", alpha2: "ms-BN" },
    { English: "Malay (Malaysia)", alpha2: "ms-MY" },
    { English: "Maltese", alpha2: "mt" },
    { English: "Maltese (Malta)", alpha2: "mt-MT" },
    { English: "Norwegian (Bokm?l)", alpha2: "nb" },
    { English: "Norwegian (Bokm?l) (Norway)", alpha2: "nb-NO" },
    { English: "Dutch", alpha2: "nl" },
    { English: "Dutch (Belgium)", alpha2: "nl-BE" },
    { English: "Dutch (Netherlands)", alpha2: "nl-NL" },
    { English: "Norwegian (Nynorsk) (Norway)", alpha2: "nn-NO" },
    { English: "Northern Sotho", alpha2: "ns" },
    { English: "Northern Sotho (South Africa)", alpha2: "ns-ZA" },
    { English: "Punjabi", alpha2: "pa" },
    { English: "Punjabi (India)", alpha2: "pa-IN" },
    { English: "Polish", alpha2: "pl" },
    { English: "Polish (Poland)", alpha2: "pl-PL" },
    { English: "Pashto", alpha2: "ps" },
    { English: "Pashto (Afghanistan)", alpha2: "ps-AR" },
    { English: "Portuguese", alpha2: "pt" },
    { English: "Portuguese (Brazil)", alpha2: "pt-BR" },
    { English: "Portuguese (Portugal)", alpha2: "pt-PT" },
    { English: "Quechua", alpha2: "qu" },
    { English: "Quechua (Bolivia)", alpha2: "qu-BO" },
    { English: "Quechua (Ecuador)", alpha2: "qu-EC" },
    { English: "Quechua (Peru)", alpha2: "qu-PE" },
    { English: "Romanian", alpha2: "ro" },
    { English: "Romanian (Romania)", alpha2: "ro-RO" },
    { English: "Russian", alpha2: "ru" },
    { English: "Russian (Russia)", alpha2: "ru-RU" },
    { English: "Sanskrit", alpha2: "sa" },
    { English: "Sanskrit (India)", alpha2: "sa-IN" },
    { English: "Sami", alpha2: "se" },
    { English: "Sami (Finland)", alpha2: "se-FI" },
    { English: "Sami (Norway)", alpha2: "se-NO" },
    { English: "Sami (Sweden)", alpha2: "se-SE" },
    { English: "Slovak", alpha2: "sk" },
    { English: "Slovak (Slovakia)", alpha2: "sk-SK" },
    { English: "Slovenian", alpha2: "sl" },
    { English: "Slovenian (Slovenia)", alpha2: "sl-SI" },
    { English: "Albanian", alpha2: "sq" },
    { English: "Albanian (Albania)", alpha2: "sq-AL" },
    { English: "Serbian (Latin) (Bosnia and Herzegovina)", alpha2: "sr-BA" },
    { English: "Serbian (Cyrillic) (Bosnia and Herzegovina)", alpha2: "sr-Cyrl-BA" },
    { English: "Serbian (Latin) (Serbia and Montenegro)", alpha2: "sr-SP" },
    { English: "Serbian (Cyrillic) (Serbia and Montenegro)", alpha2: "sr-Cyrl-SP" },
    { English: "Swedish", alpha2: "sv" },
    { English: "Swedish (Finland)", alpha2: "sv-FI" },
    { English: "Swedish (Sweden)", alpha2: "sv-SE" },
    { English: "Swahili", alpha2: "sw" },
    { English: "Swahili (Kenya)", alpha2: "sw-KE" },
    { English: "Syriac", alpha2: "syr" },
    { English: "Syriac (Syria)", alpha2: "syr-SY" },
    { English: "Tamil", alpha2: "ta" },
    { English: "Tamil (India)", alpha2: "ta-IN" },
    { English: "Telugu", alpha2: "te" },
    { English: "Telugu (India)", alpha2: "te-IN" },
    { English: "Thai", alpha2: "th" },
    { English: "Thai (Thailand)", alpha2: "th-TH" },
    { English: "Tagalog", alpha2: "tl" },
    { English: "Tagalog (Philippines)", alpha2: "tl-PH" },
    { English: "Tswana", alpha2: "tn" },
    { English: "Tswana (South Africa)", alpha2: "tn-ZA" },
    { English: "Turkish", alpha2: "tr" },
    { English: "Turkish (Turkey)", alpha2: "tr-TR" },
    { English: "Tatar", alpha2: "tt" },
    { English: "Tatar (Russia)", alpha2: "tt-RU" },
    { English: "Tsonga", alpha2: "ts" },
    { English: "Ukrainian", alpha2: "uk" },
    { English: "Ukrainian (Ukraine)", alpha2: "uk-UA" },
    { English: "Urdu", alpha2: "ur" },
    { English: "Urdu (Islamic Republic of Pakistan)", alpha2: "ur-PK" },
    { English: "Uzbek (Latin)", alpha2: "uz" },
    { English: "Uzbek (Latin) (Uzbekistan)", alpha2: "uz-UZ" },
    { English: "Uzbek (Cyrillic) (Uzbekistan)", alpha2: "uz-Cyrl-UZ" },
    { English: "Vietnamese", alpha2: "vi" },
    { English: "Vietnamese (Viet Nam)", alpha2: "vi-VN" },
    { English: "Xhosa", alpha2: "xh" },
    { English: "Xhosa (South Africa)", alpha2: "xh-ZA" },
    { English: "Chinese", alpha2: "zh" },
    { English: "Chinese (S)", alpha2: "zh-CN" },
    { English: "Chinese (Hong Kong)", alpha2: "zh-HK" },
    { English: "Chinese (Macau)", alpha2: "zh-MO" },
    { English: "Chinese (Singapore)", alpha2: "zh-SG" },
    { English: "Chinese (T)", alpha2: "zh-TW" },
    { English: "Zulu", alpha2: "zu" },
    { English: "Zulu (South Africa)", alpha2: "zu-ZA" },

  ];

  const [openAddLangMenu, setOpenAddLangMenu] = useState(null);

  const [maps, setMaps] = useState([]);

  const [additionalLanguages, setAdditionalLanguages] = useState([]);
  const handleAddLanguage = (langAbbr) => {
    //const langPropName = "verb.display." + langAbbr;
    setMaps([...maps, { abbr: langAbbr }]);
    // setAdditionalLanguages([...additionalLanguages, { abbr: langAbbr }]);
    // console.log(maps);
    // setMaps({ ...maps, [langAbbr]: [] });
    // console.log(maps);
    let arr = [];
    switch (name) {
      case "verb.display":
        dispatch(
          setForm({
            ...form,
            verb: {
              ...form.verb,
              display: {selected: true, languages: { ...form.verb.display.languages, [langAbbr]: [] }},
            },
          })
        );
        break;
      case "object.definition.name":
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionName: {
                selected: true,
                languages: {
                  ...form.object.definitionName.languages,
                  [langAbbr]: [],
                },
              },
            },
          })
        );
        break;
      case "object.definition.description":
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionDescription: {
                selected: true,
                languages: {
                  ...form.object.definitionDescription.languages,
                  [langAbbr]: [],
                },
              },
            },
          })
        );
        break;
      case "context.activities.object.definition.name":
        switch (type) {
          case "parent":
            arr = form.context.contextActivitiesParent.array;
            arr[index].definitionName = {
              selected: true,
              languages: {
                ...arr[index].definitionName.languages,
                [langAbbr]: [],
              },
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesParent: { selected: true, array: arr },
                },
              })
            );
            break;
          case "grouping":
            arr = form.context.contextActivitiesGrouping.array;
            arr[index].definitionName = {
              selected: true,
              languages: {
                ...arr[index].definitionName.languages,
                [langAbbr]: [],
              },
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesGrouping: { selected: true, array: arr },
                },
              })
            );
            break;
          case "category":
            arr = form.context.contextActivitiesCategory.array;
            arr[index].definitionName = {
              selected: true,
              languages: {
                ...arr[index].definitionName.languages,
                [langAbbr]: [],
              },
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesCategory: { selected: true, array: arr },
                },
              })
            );
            break;
          case "other":
            arr = form.context.contextActivitiesOther.array;
            arr[index].definitionName = {
              selected: true,
              languages: {
                ...arr[index].definitionName.languages,
                [langAbbr]: [],
              },
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesOther: { selected: true, array: arr },
                },
              })
            );
            break;
          default:
        }
        break;
      case "context.activities.object.definition.description":
        switch (type) {
          case "parent":
            arr = form.context.contextActivitiesParent.array;
            arr[index].definitionDescription = {
              selected: true,
              languages: {
                ...arr[index].definitionDescription.languages,
                [langAbbr]: [],
              },
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesParent: { selected: true, array: arr },
                },
              })
            );
            break;
          case "grouping":
            arr = form.context.contextActivitiesGrouping.array;
            arr[index].definitionDescription = {
              selected: true,
              languages: {
                ...arr[index].definitionDescription.languages,
                [langAbbr]: [],
              },
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesGrouping: { selected: true, array: arr },
                },
              })
            );
            break;
          case "category":
            arr = form.context.contextActivitiesCategory.array;
            arr[index].definitionDescription = {
              selected: true,
              languages: {
                ...arr[index].definitionDescription.languages,
                [langAbbr]: [],
              },
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesCategory: { selected: true, array: arr },
                },
              })
            );
            break;
          case "other":
            arr = form.context.contextActivitiesOther.array;
            arr[index].definitionDescription = {
              selected: true,
              languages: {
                ...arr[index].definitionDescription.languages,
                [langAbbr]: [],
              },
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesOther: { selected: true, array: arr },
                },
              })
            );
            break;
          default:
        }
        break;
      case "attachments.display":
        arr = form.attachments.array;
        arr[index].display = {
          selected: true,
          languages: {
            ...form.attachments.array[index].display.languages,
            [langAbbr]: [],
          },
        };
        dispatch(
          setForm({
            ...form,
            attachments: {
              selected: true, array: arr
            },
          })
        );
        break;
      case "attachments.description":
        arr = form.attachments.array;
        arr[index].description = {
          selected: true,
          languages: {
            ...form.attachments.array[index].description.languages,
            [langAbbr]: [],
          },
        };
        break;
      default:
    }

    if (openAddLangMenu) setOpenAddLangMenu(null);
  };

  const handleDeleteLanguage = (index, abbr) => {
    // let obj = { ...maps };
    // delete obj[abbr];
    // setMaps(obj);
    let tempMaps = maps;
    setMaps([]);

    let langs = {};
    let arr = [];

    switch (name) {
      case "verb.display":
        langs = form.verb.display.languages;
        delete langs[abbr];
        dispatch(
          setForm({
            ...form,
            verb: {
              ...form.verb,
              display: {selected: true, languages: langs},
            },
          })
        );
        break;
      case "object.definition.name":
        langs = form.object.definitionName.languages;
        delete langs[abbr];
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionName: {
                selected: true,
                languages: langs,
              },
            },
          })
        );
        break;
      case "object.definition.description":
        langs = form.object.definitionDescription.languages;
        delete langs[abbr];
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionDescription: {
                selected: true,
                languages: langs,
              },
            },
          })
        );
        break;
      case "context.activities.object.definition.name":
        switch (type) {
          case "parent":
            arr = form.context.contextActivitiesParent.array;
            langs = arr[index].definitionName.languages;
            delete langs[abbr];
            arr[index].definitionName = {
              selected: true,
              languages: langs,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesParent: { selected: true, array: arr },
                },
              })
            );
            break;
          case "grouping":
            arr = form.context.contextActivitiesGrouping.array;
            langs = arr[index].definitionName.languages;
            delete langs[abbr];
            arr[index].definitionName = {
              selected: true,
              languages: langs,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesGrouping: { selected: true, array: arr },
                },
              })
            );
            break;
          case "category":
            arr = form.context.contextActivitiesCategory.array;
            langs = arr[index].definitionName.languages;
            delete langs[abbr];
            arr[index].definitionName = {
              selected: true,
              languages: langs,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesCategory: { selected: true, array: arr },
                },
              })
            );
            break;
          case "other":
            arr = form.context.contextActivitiesOther.array;
            langs = arr[index].definitionName.languages;
            delete langs[abbr];
            arr[index].definitionName = {
              selected: true,
              languages: langs,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesOther: { selected: true, array: arr },
                },
              })
            );
            break;
          default:
        }
        break;
      case "context.activities.object.definition.description":
        switch (type) {
          case "parent":
            arr = form.context.contextActivitiesParent.array;
            langs = arr[index].definitionDescription.languages;
            delete langs[abbr];
            arr[index].definitionDescription = {
              selected: true,
              languages: langs,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesParent: { selected: true, array: arr },
                },
              })
            );
            break;
          case "grouping":
            arr = form.context.contextActivitiesGrouping.array;
            langs = arr[index].definitionDescription.languages;
            delete langs[abbr];
            arr[index].definitionDescription = {
              selected: true,
              languages: langs,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesGrouping: { selected: true, array: arr },
                },
              })
            );
            break;
          case "category":
            arr = form.context.contextActivitiesCategory.array;
            langs = arr[index].definitionDescription.languages;
            delete langs[abbr];
            arr[index].definitionDescription = {
              selected: true,
              languages: langs,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesCategory: { selected: true, array: arr },
                },
              })
            );
            break;
          case "other":
            arr = form.context.contextActivitiesOther.array;
            langs = arr[index].definitionDescription.languages;
            delete langs[abbr];
            arr[index].definitionDescription = {
              selected: true,
              languages: langs,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesOther: { selected: true, array: arr },
                },
              })
            );
            break;
          default:
        }
        break;
      case "attachments.display":
        langs = form.attachments.display.languages;
        delete langs[abbr];
        dispatch(
          setForm({
            ...form,
            attachments: {
              ...form.attachments,
              display: {
                selected: true,
                languages: langs,
              },
            },
          })
        );
        break;
      case "attachments.description":
        langs = form.attachments.description.languages;
        delete langs[abbr];
        dispatch(
          setForm({
            ...form,
            attachments: {
              ...form.attachments,
              description: {
                selected: true,
                languages: langs,
              },
            },
          })
        );
        break;
      default:
    }
    setAdditionalLanguages((langs) => {
      return langs.filter((_, i) => i !== index);
    });

    let filterMaps = tempMaps.filter((_, i) => i !== index);
    console.log(filterMaps);
    setMaps(filterMaps);

    // setMaps((m) => {
    //   return m.filter((_, i) => i !== index);
    // });

    afterDelete();

  };

  const afterDelete = () => {
    console.log(maps);
  };

  return (
    <>
      {/* <Property name={prefix + ".name"} type={type} index={index} /> */}
      {/* <Paper sx={{ overflowX: "auto", height: 150 }}>
             <Property name="verb.display" abbr="en" /> 
          </Paper> */}
      {maps?.map((lang, index) => {
        return (
          <>
            <Paper sx={{ overflowX: "auto" }}>
              <ClearIcon
                fontSize="medium"
                onClick={() => handleDeleteLanguage(index, lang.abbr)}
              />
              <Property
                columnDefs={columnDefs}
                name={name}
                abbr={lang.abbr}
                type={type}
              />
            </Paper>
          </>
        );
      })}
      <Button
        startIcon={<AddIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        onClick={(event) => setOpenAddLangMenu(event.currentTarget)}
      >
        Add Language
      </Button>
      <Menu
        open={Boolean(openAddLangMenu)}
        anchorEl={openAddLangMenu}
        onClose={() => setOpenAddLangMenu(null)}
      >
        {languages.map(
          (lang, index) => {
            return (
              <MenuItem
                key={index}
                value={lang.alpha2}
                // label={lang.alpha2 + '(' + lang.English + ')'}
                //onClick={handleAddLanguage(event.target.value)}
                onClick={() => {
                  handleAddLanguage(lang.alpha2);
                }}
              >
                <Typography>
                  {lang.alpha2 + " (" + lang.English + ")"}
                </Typography>
              </MenuItem>
            );
          }
        )}
      </Menu>
    </>
  );
};

export default FormLanguageMap;
