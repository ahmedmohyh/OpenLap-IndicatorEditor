import React, { useState, useEffect } from "react";
import Property from "./Property";
import SelectionProperty from "./SelectionProperty";
import {
  Button,
  Checkbox,
  Grid,
  Menu,
  MenuItem,
  Paper,
  Typography,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setForm } from "../../../../../utils/redux/reducers/csvxapiReducer";

import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ClearIcon from "@mui/icons-material/Clear";

const FormInteractionType = (props) => {
  const { interactionType, type, index, prefix } = props;
  const dispatch = useDispatch();

  const form = useSelector((state) => state.csvxapiReducer.form);
  const columnDefs = useSelector(
    (state) => state.csvxapiReducer.data.columnDefs
  );

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


  useEffect(() => {

    setCorrectResponses([]);

   }, [interactionType]);


  const [openAddListItemMenu, setOpenAddListItemMenu] = useState(null);

  const [openAddListLangMenu, setOpenAddListLangMenu] = useState(null);

  const [correctResponses, setCorrectResponses] = useState([]);

  const handleAddCorrectResponse = (idx) => {
    setCorrectResponses([...correctResponses, idx]);

    let parentArr = [];

    switch (type) {
      case "object":
        let arr = form.object.definitionCorrectresponses.array;
        arr.push({
          selected: true,
          stringParts: [],
          components: [],
          case_matters: false,
          order_matters: true,
          lang: "",
        });
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionCorrectresponses: { selected: true, array: arr },
            },
          })
        );
        break;
      case "parent":
        parentArr = form.context.contextActivitiesParent.array;
        parentArr[index].definitionCorrectresponses.selected = true;
        parentArr[index].definitionCorrectresponses.array.push({
          selected: true,
          stringParts: [],
          components: [],
          case_matters: false,
          order_matters: true,
          lang: "",
        });
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "grouping":
        parentArr = form.context.contextActivitiesGrouping.array;
        parentArr[index].definitionCorrectresponses.selected = true;
        parentArr[index].definitionCorrectresponses.array.push({
          selected: true,
          stringParts: [],
          components: [],
          case_matters: false,
          order_matters: true,
          lang: "",
        });
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "category":
        parentArr = form.context.contextActivitiesCategory.array;
        parentArr[index].definitionCorrectresponses.selected = true;
        parentArr[index].definitionCorrectresponses.array.push({
          selected: true,
          stringParts: [],
          components: [],
          case_matters: false,
          order_matters: true,
          lang: "",
        });
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "other":
        parentArr = form.context.contextActivitiesOther.array;
        parentArr[index].definitionCorrectresponses.selected = true;
        parentArr[index].definitionCorrectresponses.array.push({
          selected: true,
          stringParts: [],
          components: [],
          case_matters: false,
          order_matters: true,
          lang: "",
        });
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: { selected: true, array: parentArr },
            },
          })
        );
        break;
      default:
    }
  };
  const handleDeleteCorrectResponse = (index) => {
    let arr = [];
    let newArr = [];
    switch (type) {
      case "object":
        arr = form.object.definitionCorrectresponses.array;
        arr = arr.filter((str, i) => i !== index);
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionCorrectresponses: { selected: true, array: arr },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        newArr = arr[props.index].definitionCorrectresponses.array.filter(
          (str, i) => i !== index
        );
        arr[props.index].definitionCorrectresponses.array = newArr;
        dispatch(
          setForm({
            ...form,
            contextActivitiesParent: { selected: true, array: arr },
          })
        );
        break;
      case "grouping":
        arr = form.context.contextActivitiesGrouping.array;
        newArr = arr[props.index].definitionCorrectresponses.array.filter(
          (str, i) => i !== index
        );
        arr[props.index].definitionCorrectresponses.array = newArr;
        dispatch(
          setForm({
            ...form,
            contextActivitiesGrouping: { selected: true, array: arr },
          })
        );
        break;
      case "category":
        arr = form.context.contextActivitiesCategory.array;
        newArr = arr[props.index].definitionCorrectresponses.array.filter(
          (str, i) => i !== index
        );
        arr[props.index].definitionCorrectresponses.array = newArr;
        dispatch(
          setForm({
            ...form,
            contextActivitiesCategory: { selected: true, array: arr },
          })
        );
        break;
      case "other":
        arr = form.context.contextActivitiesOther.array;
        newArr = arr[props.index].definitionCorrectresponses.array.filter(
          (str, i) => i !== index
        );
        arr[props.index].definitionCorrectresponses.array = newArr;
        dispatch(
          setForm({
            ...form,
            contextActivitiesOther: { selected: true, array: arr },
          })
        );
        break;
      default:
    }
    setCorrectResponses((str) => {
      return str.filter((_, i) => i !== index);
    });
  };

  const setCaseMatters = (bool, idx) => {
    let arr = [];
    let arr2 = [];
    switch (type) {
      case "object":
        arr = form.object.definitionCorrectresponses.array;
        arr[idx].case_matters = bool;
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionCorrectresponses: {
                ...form.object.definitionCorrectresponses,
                array: arr,
              },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        arr2 = arr[index].definitionCorrectresponses.array;
        arr2[idx].case_matters = bool;
        arr[index].definitionCorrectresponses.array = arr2;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: {
                ...form.context.contextActivitiesParent,
                array: arr,
              },
            },
          })
        );
        break;
      case "grouping":
        arr = form.context.contextActivitiesGrouping.array;
        arr2 = arr[index].definitionCorrectresponses.array;
        arr2[idx].case_matters = bool;
        arr[index].definitionCorrectresponses.array = arr2;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: {
                ...form.context.contextActivitiesGrouping,
                array: arr,
              },
            },
          })
        );
        break;
      case "category":
        arr = form.context.contextActivitiesCategory.array;
        arr2 = arr[index].definitionCorrectresponses.array;
        arr2[idx].case_matters = bool;
        arr[index].definitionCorrectresponses.array = arr2;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: {
                ...form.context.contextActivitiesCategory,
                array: arr,
              },
            },
          })
        );
        break;
      case "other":
        arr = form.context.contextActivitiesOther.array;
        arr2 = arr[index].definitionCorrectresponses.array;
        arr2[idx].case_matters = bool;
        arr[index].definitionCorrectresponses.array = arr2;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: {
                ...form.context.contextActivitiesOther,
                array: arr,
              },
            },
          })
        );
        break;
      default:
    }
  };

  const setOrderMatters = (bool, idx) => {
    let arr = [];
    let arr2 = [];
    switch (type) {
      case "object":
        arr = form.object.definitionCorrectresponses.array;
        arr[idx].order_matters = bool;
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionCorrectresponses: {
                ...form.object.definitionCorrectresponses,
                array: arr,
              },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        arr2 = arr[index].definitionCorrectresponses.array;
        arr2[idx].order_matters = bool;
        arr[index].definitionCorrectresponses.array = arr2;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: {
                ...form.context.contextActivitiesParent,
                array: arr,
              },
            },
          })
        );
        break;
      case "grouping":
        arr = form.context.contextActivitiesGrouping.array;
        arr2 = arr[index].definitionCorrectresponses.array;
        arr2[idx].order_matters = bool;
        arr[index].definitionCorrectresponses.array = arr2;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: {
                ...form.context.contextActivitiesGrouping,
                array: arr,
              },
            },
          })
        );
        break;
      case "category":
        arr = form.context.contextActivitiesCategory.array;
        arr2 = arr[index].definitionCorrectresponses.array;
        arr2[idx].order_matters = bool;
        arr[index].definitionCorrectresponses.array = arr2;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: {
                ...form.context.contextActivitiesCategory,
                array: arr,
              },
            },
          })
        );
        break;
      case "other":
        arr = form.context.contextActivitiesOther.array;
        arr2 = arr[index].definitionCorrectresponses.array;
        arr2[idx].order_matters = bool;
        arr[index].definitionCorrectresponses.array = arr2;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: {
                ...form.context.contextActivitiesOther,
                array: arr,
              },
            },
          })
        );
        break;
      default:
    }
  };

  const onLangSelected = (lang, idx) => {
    let arr = [];
    let arr2 = [];
    switch (type) {
      case "object":
        arr = form.object.definitionCorrectresponses.array;
        arr[idx].lang = lang;
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionCorrectresponses: {
                ...form.object.definitionCorrectresponses,
                array: arr,
              },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        arr2 = arr[index].definitionCorrectresponses.array;
        arr2[idx].lang = lang;
        arr[index].definitionCorrectresponses.array = arr2;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: {
                ...form.context.contextActivitiesParent,
                array: arr,
              },
            },
          })
        );
        break;
      case "grouping":
        arr = form.context.contextActivitiesGrouping.array;
        arr2 = arr[index].definitionCorrectresponses.array;
        arr2[idx].lang = lang;
        arr[index].definitionCorrectresponses.array = arr2;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: {
                ...form.context.contextActivitiesGrouping,
                array: arr,
              },
            },
          })
        );
        break;
      case "category":
        arr = form.context.contextActivitiesCategory.array;
        arr2 = arr[index].definitionCorrectresponses.array;
        arr2[idx].lang = lang;
        arr[index].definitionCorrectresponses.array = arr2;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: {
                ...form.context.contextActivitiesCategory,
                array: arr,
              },
            },
          })
        );
        break;
      case "other":
        arr = form.context.contextActivitiesOther.array;
        arr2 = arr[index].definitionCorrectresponses.array;
        arr2[idx].lang = lang;
        arr[index].definitionCorrectresponses.array = arr2;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: {
                ...form.context.contextActivitiesOther,
                array: arr,
              },
            },
          })
        );
        break;
      default:
    }
  };

  const onScaleSelected = (selected, idx) => {
    let arr = [];

    switch (type) {
      case "object":
        arr = form.object.definitionCorrectresponses.array;
        arr[idx] = {
          selected: true,
          stringParts: { scales: selected },
        };
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionCorrectresponses: { selected: true, array: arr },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        arr[index].definitionCorrectresponses.array[idx].stringParts = {
          scales: selected,
        };
        dispatch(
          setForm({
            ...form,
            contextActivitiesParent: {
              selected: true,
              array: arr,
            },
          })
        );
        break;
      case "grouping":
        arr = form.context.contextActivitiesGrouping.array;
        arr[index].definitionCorrectresponses.array[idx].stringParts = {
          scales: selected,
        };
        dispatch(
          setForm({
            ...form,
            contextActivitiesGrouping: {
              selected: true,
              array: arr,
            },
          })
        );
        break;
      case "category":
        arr = form.context.contextActivitiesCategory.array;
        arr[index].definitionCorrectresponses.array[idx].stringParts = {
          scales: selected,
        };
        dispatch(
          setForm({
            ...form,
            contextActivitiesCategory: {
              selected: true,
              array: arr,
            },
          })
        );
        break;
      case "other":
        arr = form.context.contextActivitiesOther.array;
        arr[index].definitionCorrectresponses.array[idx].stringParts = {
          scales: selected,
        };
        dispatch(
          setForm({
            ...form,
            contextActivitiesOther: {
              selected: true,
              array: arr,
            },
          })
        );
        break;
      default:
    }
  };

  const [correctChoices, setCorrectChoices] = useState([]);

  const addCorrectChoice = (newIndex, idx) => {
    let newCorrectChoices = correctChoices;
    newCorrectChoices.push({ newIndex });
    setCorrectChoices(newCorrectChoices);

    let arr = [];
    let ccArray = [];

    switch (type) {
      case "object":
        arr = form.object.definitionCorrectresponses.array;
        ccArray = arr[idx].components;
        ccArray.push(-1);
        arr[idx] = {
          selected: true,
          stringParts: [],
          components: ccArray,
        };
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionCorrectresponses: { selected: true, array: arr },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        ccArray = arr[index].definitionCorrectresponses.array[idx].components;
        ccArray.push(-1);
        arr[index].definitionCorrectresponses.array[idx].components = ccArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "grouping":
        arr = form.context.contextActivitiesGrouping.array;
        ccArray = arr[index].definitionCorrectresponses.array[idx].components;
        ccArray.push(-1);
        arr[index].definitionCorrectresponses.array[idx].components = ccArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "category":
        arr = form.context.contextActivitiesCategory.array;
        ccArray = arr[index].definitionCorrectresponses.array[idx].components;
        ccArray.push(-1);
        arr[index].definitionCorrectresponses.array[idx].components = ccArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "other":
        arr = form.context.contextActivitiesOther.array;
        ccArray = arr[index].definitionCorrectresponses.array[idx].components;
        ccArray.push(-1);
        arr[index].definitionCorrectresponses.array[idx].components = ccArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      default:
    }
  };

  const removeCorrectChoice = (ccidx, idx) => {
    setCorrectChoices((choices) => {
      return choices.filter((_, i) => i !== ccidx);
    });

    let arr = [];
    let ccArray = [];

    switch (type) {
      case "object":
        arr = form.object.definitionCorrectresponses.array;
        ccArray = arr[idx].components;
        ccArray = ccArray.filter((_, i) => i !== ccidx);
        arr[idx] = {
          selected: true,
          stringParts: [],
          components: ccArray,
        };
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionCorrectresponses: { selected: true, array: arr },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        ccArray = arr[index].definitionCorrectresponses.array[idx].components;
        ccArray = ccArray.filter((_, i) => i !== ccidx);
        arr[index].definitionCorrectresponses.array[idx].components = ccArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "grouping":
        arr = form.context.contextActivitiesGrouping.array;
        ccArray = arr[index].definitionCorrectresponses.array[idx].components;
        ccArray = ccArray.filter((_, i) => i !== ccidx);
        arr[index].definitionCorrectresponses.array[idx].components = ccArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "category":
        arr = form.context.contextActivitiesCategory.array;
        ccArray = arr[index].definitionCorrectresponses.array[idx].components;
        ccArray = ccArray.filter((_, i) => i !== ccidx);
        arr[index].definitionCorrectresponses.array[idx].components = ccArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "other":
        arr = form.context.contextActivitiesOther.array;
        ccArray = arr[index].definitionCorrectresponses.array[idx].components;
        ccArray = ccArray.filter((_, i) => i !== ccidx);
        arr[index].definitionCorrectresponses.array[idx].components = ccArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      default:
    }
  };

  const onChoiceSelected = (selected, idx, cc) => {
    let arr = [];
    let arr2 = [];
    let ccArray = [];
    switch (type) {
      case "object":
        arr = form.object.definitionCorrectresponses.array;
        ccArray = arr[idx].components;
        ccArray[cc] = selected;
        arr[idx] = {
          selected: true,
          stringParts: [],
          components: ccArray,
        };
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionCorrectresponses: { selected: true, array: arr },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        ccArray = arr[index].definitionCorrectresponses.array[idx].components;
        ccArray[cc] = selected;
        arr[index].definitionCorrectresponses.array[idx].components = ccArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "grouping":
        arr = form.context.contextActivitiesGrouping.array;
        ccArray = arr[index].definitionCorrectresponses.array[idx].components;
        ccArray[cc] = selected;
        arr[index].definitionCorrectresponses.array[idx].components = ccArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "category":
        arr = form.context.contextActivitiesCategory.array;
        ccArray = arr[index].definitionCorrectresponses.array[idx].components;
        ccArray[cc] = selected;
        arr[index].definitionCorrectresponses.array[idx].components = ccArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "other":
        arr = form.context.contextActivitiesOther.array;
        ccArray = arr[index].definitionCorrectresponses.array[idx].components;
        ccArray[cc] = selected;
        arr[index].definitionCorrectresponses.array[idx].components = ccArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      default:
    }
  };

  const [correctMatches, setCorrectMatches] = useState([]);

  const addCorrectMatch = (newIndex, idx) => {
    let newCorrectMatches = correctMatches;
    newCorrectMatches.push({ newIndex });
    setCorrectMatches(newCorrectMatches);

    let arr = [];
    let cmArray = [];

    switch (type) {
      case "object":
        arr = form.object.definitionCorrectresponses.array;
        cmArray = arr[idx].components;
        cmArray.push({ source: -1, target: -1 });
        arr[idx] = {
          selected: true,
          stringParts: [],
          components: cmArray,
        };
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionCorrectresponses: { selected: true, array: arr },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        cmArray = arr[index].definitionCorrectresponses.array[idx].components;
        cmArray.push({ source: -1, target: -1 });
        arr[index].definitionCorrectresponses.array[idx].components = cmArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "grouping":
        arr = form.context.contextActivitiesGrouping.array;
        cmArray = arr[index].definitionCorrectresponses.array[idx].components;
        cmArray.push({ source: -1, target: -1 });
        arr[index].definitionCorrectresponses.array[idx].components = cmArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "category":
        arr = form.context.contextActivitiesCategory.array;
        cmArray = arr[index].definitionCorrectresponses.array[idx].components;
        cmArray.push({ source: -1, target: -1 });
        arr[index].definitionCorrectresponses.array[idx].components = cmArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "other":
        arr = form.context.contextActivitiesOther.array;
        cmArray = arr[index].definitionCorrectresponses.array[idx].components;
        cmArray.push({ source: -1, target: -1 });
        arr[index].definitionCorrectresponses.array[idx].components = cmArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      default:
    }
  };

  const removeCorrectMatch = (cmidx, idx) => {
    setCorrectMatches((matches) => {
      return matches.filter((_, i) => i !== cmidx);
    });

    let arr = [];
    let cmArray = [];

    switch (type) {
      case "object":
        arr = form.object.definitionCorrectresponses.array;
        cmArray = arr[idx].components;
        cmArray = cmArray.filter((_, i) => i !== cmidx);
        arr[idx] = {
          selected: true,
          stringParts: [],
          components: cmArray,
        };
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionCorrectresponses: { selected: true, array: arr },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        cmArray = arr[index].definitionCorrectresponses.array[idx].components;
        cmArray = cmArray.filter((_, i) => i !== cmidx);
        arr[index].definitionCorrectresponses.array[idx].components = cmArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "grouping":
        arr = form.context.contextActivitiesGrouping.array;
        cmArray = arr[index].definitionCorrectresponses.array[idx].components;
        cmArray = cmArray.filter((_, i) => i !== cmidx);
        arr[index].definitionCorrectresponses.array[idx].components = cmArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "category":
        arr = form.context.contextActivitiesCategory.array;
        cmArray = arr[index].definitionCorrectresponses.array[idx].components;
        cmArray = cmArray.filter((_, i) => i !== cmidx);
        arr[index].definitionCorrectresponses.array[idx].components = cmArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "other":
        arr = form.context.contextActivitiesOther.array;
        cmArray = arr[index].definitionCorrectresponses.array[idx].components;
        cmArray = cmArray.filter((_, i) => i !== cmidx);
        arr[index].definitionCorrectresponses.array[idx].components = cmArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      default:
    }
  };

  const onSourceSelected = (selected, idx, cm) => {
    let arr = [];
    let arr2 = [];
    let cmArray = [];
    switch (type) {
      case "object":
        arr = form.object.definitionCorrectresponses.array;
        cmArray = arr[idx].components;
        cmArray[cm] = { ...cmArray[cm], source: selected };
        arr[idx] = {
          selected: true,
          stringParts: [],
          components: cmArray,
        };
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionCorrectresponses: { selected: true, array: arr },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        cmArray = arr[index].definitionCorrectresponses.array[idx].components;
        cmArray[cm] = { ...cmArray[cm], source: selected };
        arr[index].definitionCorrectresponses.array[idx].components = cmArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "grouping":
        arr = form.context.contextActivitiesGrouping.array;
        cmArray = arr[index].definitionCorrectresponses.array[idx].components;
        cmArray[cm] = { ...cmArray[cm], source: selected };
        arr[index].definitionCorrectresponses.array[idx].components = cmArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "category":
        arr = form.context.contextActivitiesCategory.array;
        cmArray = arr[index].definitionCorrectresponses.array[idx].components;
        cmArray[cm] = { ...cmArray[cm], source: selected };
        arr[index].definitionCorrectresponses.array[idx].components = cmArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "other":
        arr = form.context.contextActivitiesOther.array;
        cmArray = arr[index].definitionCorrectresponses.array[idx].components;
        cmArray[cm] = { ...cmArray[cm], source: selected };
        arr[index].definitionCorrectresponses.array[idx].components = cmArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      default:
    }
  };

  const onTargetSelected = (selected, idx, cm) => {
    let arr = [];
    let arr2 = [];
    let cmArray = [];
    switch (type) {
      case "object":
        arr = form.object.definitionCorrectresponses.array;
        cmArray = arr[idx].components;
        cmArray[cm] = { ...cmArray[cm], target: selected };
        arr[idx] = {
          selected: true,
          stringParts: [],
          components: cmArray,
        };
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionCorrectresponses: { selected: true, array: arr },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        cmArray = arr[index].definitionCorrectresponses.array[idx].components;
        cmArray[cm] = { ...cmArray[cm], target: selected };
        arr[index].definitionCorrectresponses.array[idx].components = cmArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "grouping":
        arr = form.context.contextActivitiesGrouping.array;
        cmArray = arr[index].definitionCorrectresponses.array[idx].components;
        cmArray[cm] = { ...cmArray[cm], target: selected };
        arr[index].definitionCorrectresponses.array[idx].components = cmArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "category":
        arr = form.context.contextActivitiesCategory.array;
        cmArray = arr[index].definitionCorrectresponses.array[idx].components;
        cmArray[cm] = { ...cmArray[cm], target: selected };
        arr[index].definitionCorrectresponses.array[idx].components = cmArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "other":
        arr = form.context.contextActivitiesOther.array;
        cmArray = arr[index].definitionCorrectresponses.array[idx].components;
        cmArray[cm] = { ...cmArray[cm], target: selected };
        arr[index].definitionCorrectresponses.array[idx].components = cmArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      default:
        arr = form.object.definitionCorrectresponses.array;
        cmArray = arr[idx].components;
        cmArray[cm] = { ...cmArray[cm], target: selected };
        arr[idx] = {
          selected: true,
          stringParts: [],
          components: cmArray,
        };
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionCorrectresponses: { selected: true, array: arr },
            },
          })
        );
    }
  };

  const [correctPerformances, setCorrectPerformances] = useState([]);

  const addCorrectPerformance = (newIndex, idx) => {
    let newCorrectPerformances = correctPerformances;
    newCorrectPerformances.push({ newIndex });
    setCorrectPerformances(newCorrectPerformances);

    let arr = [];
    let cpArray = [];

    switch (type) {
      case "object":
        arr = form.object.definitionCorrectresponses.array;
        cpArray = arr[idx].components;
        cpArray.push({ step: -1, stringParts: [] });
        arr[idx] = {
          selected: true,
          stringParts: [],
          components: cpArray,
          case_matters: false,
          order_matters: true,
          lang: "",
        };
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionCorrectresponses: { selected: true, array: arr },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        cpArray = arr[index].definitionCorrectresponses.array[idx].components;
        cpArray.push({ step: -1, stringParts: [] });
        arr[index].definitionCorrectresponses.array[idx].components = cpArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "grouping":
        arr = form.context.contextActivitiesGrouping.array;
        cpArray = arr[index].definitionCorrectresponses.array[idx].components;
        cpArray.push({ step: -1, stringParts: [] });
        arr[index].definitionCorrectresponses.array[idx].components = cpArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "category":
        arr = form.context.contextActivitiesCategory.array;
        cpArray = arr[index].definitionCorrectresponses.array[idx].components;
        cpArray.push({ step: -1, stringParts: [] });
        arr[index].definitionCorrectresponses.array[idx].components = cpArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "other":
        arr = form.context.contextActivitiesOther.array;
        cpArray = arr[index].definitionCorrectresponses.array[idx].components;
        cpArray.push({ step: -1, stringParts: [] });
        arr[index].definitionCorrectresponses.array[idx].components = cpArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      default:
    }
  };

  const removeCorrectPerformance = (cpidx, idx) => {
    setCorrectPerformances((performances) => {
      return performances.filter((_, i) => i !== cpidx);
    });

    let arr = [];
    let cpArray = [];

    switch (type) {
      case "object":
        arr = form.object.definitionCorrectresponses.array;
        cpArray = arr[idx].components;
        cpArray = cpArray.filter((_, i) => i !== cpidx);
        arr[idx] = {
          selected: true,
          stringParts: [],
          components: cpArray,
        };
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionCorrectresponses: { selected: true, array: arr },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        cpArray = arr[index].definitionCorrectresponses.array[idx].components;
        cpArray = cpArray.filter((_, i) => i !== cpidx);
        arr[index].definitionCorrectresponses.array[idx].components = cpArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "grouping":
        arr = form.context.contextActivitiesGrouping.array;
        cpArray = arr[index].definitionCorrectresponses.array[idx].components;
        cpArray = cpArray.filter((_, i) => i !== cpidx);
        arr[index].definitionCorrectresponses.array[idx].components = cpArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "category":
        arr = form.context.contextActivitiesCategory.array;
        cpArray = arr[index].definitionCorrectresponses.array[idx].components;
        cpArray = cpArray.filter((_, i) => i !== cpidx);
        arr[index].definitionCorrectresponses.array[idx].components = cpArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "other":
        arr = form.context.contextActivitiesOther.array;
        cpArray = arr[index].definitionCorrectresponses.array[idx].components;
        cpArray = cpArray.filter((_, i) => i !== cpidx);
        arr[index].definitionCorrectresponses.array[idx].components = cpArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      default:
    }
  };

  const onStepSelected = (selected, idx, cp) => {
    let arr = [];
    let arr2 = [];
    let cpArray = [];
    switch (type) {
      case "object":
        arr = form.object.definitionCorrectresponses.array;
        cpArray = arr[idx].components;
        cpArray[cp] = { ...cpArray[cp], step: selected };
        arr[idx] = {
          ...arr[idx],
          components: cpArray,
        };
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionCorrectresponses: { selected: true, array: arr },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        cpArray = arr[index].definitionCorrectresponses.array[idx].components;
        cpArray[cp] = { ...cpArray[cp], step: selected };
        arr[index].definitionCorrectresponses.array[idx].components = cpArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "grouping":
        arr = form.context.contextActivitiesGrouping.array;
        cpArray = arr[index].definitionCorrectresponses.array[idx].components;
        cpArray[cp] = { ...cpArray[cp], step: selected };
        arr[index].definitionCorrectresponses.array[idx].components = cpArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "category":
        arr = form.context.contextActivitiesCategory.array;
        cpArray = arr[index].definitionCorrectresponses.array[idx].components;
        cpArray[cp] = { ...cpArray[cp], step: selected };
        arr[index].definitionCorrectresponses.array[idx].components = cpArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      case "other":
        arr = form.context.contextActivitiesOther.array;
        cpArray = arr[index].definitionCorrectresponses.array[idx].components;
        cpArray[cp] = { ...cpArray[cp], step: selected };
        arr[index].definitionCorrectresponses.array[idx].components = cpArray;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: {
                selected: true,
                array: arr,
              },
            },
          })
        );
        break;
      default:
    }
  };

  const [choices, setChoices] = useState([]);

  const handleAddChoice = (newIndex) => {
    let newChoices = choices;
    newChoices.push({ newIndex });
    setChoices(newChoices);

    let arr = [];
    let desc = {};
    listLanguages.forEach((lang) => {
      desc = { ...desc, [lang.abbr]: [] };
    });

    let parentArr = [];
    let subArr = [];

    switch (type) {
      case "object":
        parentArr = form.object.definitionChoices.array;
        parentArr.push({ id: [], description: desc });
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionChoices: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "parent":
        parentArr = form.context.contextActivitiesParent.array;
        parentArr[index].definitionChoices.selected = true;
        subArr = parentArr[index].definitionChoices.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionChoices.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "grouping":
        parentArr = form.context.contextActivitiesGrouping.array;
        parentArr[index].definitionChoices.selected = true;
        subArr = parentArr[index].definitionChoices.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionChoices.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "category":
        parentArr = form.context.contextActivitiesCategory.array;
        parentArr[index].definitionChoices.selected = true;
        subArr = parentArr[index].definitionChoices.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionChoices.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "other":
        parentArr = form.context.contextActivitiesOther.array;
        parentArr[index].definitionChoices.selected = true;
        subArr = parentArr[index].definitionChoices.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionChoices.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: { selected: true, array: parentArr },
            },
          })
        );
        break;
      default:
    }
    if (openAddListItemMenu) setOpenAddListItemMenu(null);
  };
  const handleDeleteChoice = (indexToDelete) => {
    let arr = [];
    let arr2 = [];

    switch (type) {
      case "object":
        arr = form.object.definitionChoices.array;
        arr = arr.filter((item, i) => i !== indexToDelete);
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionChoices: { selected: true, array: arr },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        arr2 = arr[index].definitionChoices.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionChoices.array = arr2;
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
        arr2 = arr[index].definitionChoices.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionChoices.array = arr2;
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
        arr2 = arr[index].definitionChoices.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionChoices.array = arr2;
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
        arr2 = arr[index].definitionChoices.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionChoices.array = arr2;
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

    setChoices((choices) => {
      return choices.filter((_, i) => i !== index);
    });
  };

  const [scales, setScales] = useState([]);

  const handleAddScale = (newIndex) => {
    let newScales = scales;
    newScales.push({ newIndex });
    setScales(newScales);

    let arr = [];
    let desc = {};
    listLanguages.forEach((lang) => {
      desc = { ...desc, [lang.abbr]: [] };
    });

    let parentArr = [];
    let subArr = [];

    switch (type) {
      case "object":
        parentArr = form.object.definitionScales.array;
        parentArr.push({ id: [], description: desc });
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionScales: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "parent":
        parentArr = form.context.contextActivitiesParent.array;
        parentArr[index].definitionScales.selected = true;
        subArr = parentArr[index].definitionScales.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionScales.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "grouping":
        parentArr = form.context.contextActivitiesGrouping.array;
        parentArr[index].definitionScales.selected = true;
        subArr = parentArr[index].definitionScales.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionScales.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "category":
        parentArr = form.context.contextActivitiesCategory.array;
        parentArr[index].definitionScales.selected = true;
        subArr = parentArr[index].definitionScales.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionScales.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "other":
        parentArr = form.context.contextActivitiesOther.array;
        parentArr[index].definitionScales.selected = true;
        subArr = parentArr[index].definitionScales.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionScales.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: { selected: true, array: parentArr },
            },
          })
        );
        break;
      default:
    }
    if (openAddListItemMenu) setOpenAddListItemMenu(null);
  };
  const handleDeleteScale = (indexToDelete) => {
    let arr = [];
    let arr2 = [];

    switch (type) {
      case "object":
        arr = form.object.definitionScales.array;
        arr = arr.filter((item, i) => i !== indexToDelete);
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionScales: { selected: true, array: arr },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        arr2 = arr[index].definitionScales.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionScales.array = arr2;
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
        arr2 = arr[index].definitionScales.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionScales.array = arr2;
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
        arr2 = arr[index].definitionScales.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionScales.array = arr2;
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
        arr2 = arr[index].definitionScales.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionScales.array = arr2;
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
    setScales((scales) => {
      return scales.filter((_, i) => i !== index);
    });
  };

  const [sources, setSources] = useState([]);

  const handleAddSource = (newIndex) => {
    let newSources = sources;
    newSources.push({ newIndex });
    setSources(newSources);

    let arr = [];
    let desc = {};
    if (listLanguages.length > 0) {
      listLanguages.forEach((lang) => {
        desc = { ...desc, [lang.abbr]: [] };
      });
    }
    let parentArr = [];
    let subArr = [];

    switch (type) {
      case "object":
        parentArr = form.object.definitionSources.array;
        parentArr.push({ id: [], description: desc });
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionSources: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "parent":
        parentArr = form.context.contextActivitiesParent.array;
        parentArr[index].definitionSources.selected = true;
        subArr = parentArr[index].definitionSources.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionSources.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "grouping":
        parentArr = form.context.contextActivitiesGrouping.array;
        parentArr[index].definitionSources.selected = true;
        subArr = parentArr[index].definitionSources.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionSources.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "category":
        parentArr = form.context.contextActivitiesCategory.array;
        parentArr[index].definitionSources.selected = true;
        subArr = parentArr[index].definitionSources.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionSources.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "other":
        parentArr = form.context.contextActivitiesOther.array;
        parentArr[index].definitionSources.selected = true;
        subArr = parentArr[index].definitionSources.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionSources.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: { selected: true, array: parentArr },
            },
          })
        );
        break;
      default:
    }
    if (openAddListItemMenu) setOpenAddListItemMenu(null);
  };
  const handleDeleteSource = (indexToDelete) => {
    let arr = [];
    let arr2 = [];

    switch (type) {
      case "object":
        arr = form.object.definitionSources.array;
        arr = arr.filter((item, i) => i !== indexToDelete);
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionSources: { selected: true, array: arr },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        arr2 = arr[index].definitionSources.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionSources.array = arr2;
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
        arr2 = arr[index].definitionSources.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionSources.array = arr2;
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
        arr2 = arr[index].definitionSources.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionSources.array = arr2;
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
        arr2 = arr[index].definitionSources.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionSources.array = arr2;
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
    setSources((sources) => {
      return sources.filter((_, i) => i !== index);
    });
  };

  const [targets, setTargets] = useState([]);

  const handleAddTarget = (newIndex) => {
    let newTargets = targets;
    newTargets.push({ newIndex });
    setTargets(newTargets);

    let arr = [];
    let desc = {};
    listLanguages.forEach((lang) => {
      desc = { ...desc, [lang.abbr]: [] };
    });

    let parentArr = [];
    let subArr = [];

    switch (type) {
      case "object":
        parentArr = form.object.definitionTargets.array;
        parentArr.push({ id: [], description: desc });
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionTargets: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "parent":
        parentArr = form.context.contextActivitiesParent.array;
        parentArr[index].definitionTargets.selected = true;
        subArr = parentArr[index].definitionTargets.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionTargets.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "grouping":
        parentArr = form.context.contextActivitiesGrouping.array;
        parentArr[index].definitionTargets.selected = true;
        subArr = parentArr[index].definitionTargets.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionTargets.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "category":
        parentArr = form.context.contextActivitiesCategory.array;
        parentArr[index].definitionTargets.selected = true;
        subArr = parentArr[index].definitionTargets.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionTargets.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "other":
        parentArr = form.context.contextActivitiesOther.array;
        parentArr[index].definitionTargets.selected = true;
        subArr = parentArr[index].definitionTargets.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionTargets.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: { selected: true, array: parentArr },
            },
          })
        );
        break;
      default:
    }
    if (openAddListItemMenu) setOpenAddListItemMenu(null);
  };
  const handleDeleteTarget = (indexToDelete) => {
    let arr = [];
    let arr2 = [];

    switch (type) {
      case "object":
        arr = form.object.definitionTargets.array;
        arr = arr.filter((item, i) => i !== indexToDelete);
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionTargets: { selected: true, array: arr },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        arr2 = arr[index].definitionTargets.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionTargets.array = arr2;
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
        arr2 = arr[index].definitionTargets.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionTargets.array = arr2;
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
        arr2 = arr[index].definitionTargets.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionTargets.array = arr2;
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
        arr2 = arr[index].definitionTargets.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionTargets.array = arr2;
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
    setTargets((targets) => {
      return targets.filter((_, i) => i !== index);
    });
  };

  const [steps, setSteps] = useState([]);

  const handleAddStep = (newIndex) => {
    let newSteps = steps;
    newSteps.push({ newIndex });
    setSteps(newSteps);

    let arr = [];
    let desc = {};
    listLanguages.forEach((lang) => {
      desc = { ...desc, [lang.abbr]: [] };
    });

    let parentArr = [];
    let subArr = [];

    switch (type) {
      case "object":
        parentArr = form.object.definitionSteps.array;
        parentArr.push({ id: [], description: desc });
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionSteps: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "parent":
        parentArr = form.context.contextActivitiesParent.array;
        parentArr[index].definitionSteps.selected = true;
        subArr = parentArr[index].definitionSteps.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionSteps.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "grouping":
        parentArr = form.context.contextActivitiesGrouping.array;
        parentArr[index].definitionSteps.selected = true;
        subArr = parentArr[index].definitionSteps.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionSteps.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "category":
        parentArr = form.context.contextActivitiesCategory.array;
        parentArr[index].definitionSteps.selected = true;
        subArr = parentArr[index].definitionSteps.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionSteps.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: { selected: true, array: parentArr },
            },
          })
        );
        break;
      case "other":
        parentArr = form.context.contextActivitiesOther.array;
        parentArr[index].definitionSteps.selected = true;
        subArr = parentArr[index].definitionSteps.array;
        subArr.push({ id: [], description: desc });
        parentArr[index].definitionSteps.array = subArr;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: { selected: true, array: parentArr },
            },
          })
        );
        break;
      default:
    }
    if (openAddListItemMenu) setOpenAddListItemMenu(null);
  };
  const handleDeleteStep = (indexToDelete) => {
    let arr = [];
    let arr2 = [];

    switch (type) {
      case "object":
        arr = form.object.definitionSteps.array;
        arr = arr.filter((item, i) => i !== indexToDelete);
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionSteps: { selected: true, array: arr },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        arr2 = arr[index].definitionSteps.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionSteps.array = arr2;
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
        arr2 = arr[index].definitionSteps.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionSteps.array = arr2;
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
        arr2 = arr[index].definitionSteps.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionSteps.array = arr2;
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
        arr2 = arr[index].definitionSteps.array;
        arr2 = arr2.filter((item, i) => i !== indexToDelete);
        arr[index].definitionSteps.array = arr2;
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
    setSteps((steps) => {
      return steps.filter((_, i) => i !== index);
    });
  };

  const [listLanguages, setListLanguages] = useState([]);
  const handleAddListLanguage = (langAbbr) => {
    setListLanguages([...listLanguages, { abbr: langAbbr }]);
    if (openAddListLangMenu) setOpenAddListLangMenu(null);
  };
  const handleDeleteListLanguage = (index, abbr) => {
    const obj = { ...form.objectComponentListDisplay };
    delete obj[abbr];
    dispatch(setForm({ ...form, objectComponentListDisplay: obj }));
    setListLanguages((langs) => {
      return langs.filter((_, i) => i !== index);
    });
  };

  return (
    <>
      {interactionType.value == "true-false" ||
      interactionType.value == "fill-in" ||
      interactionType.value == "long-fill-in" ||
      interactionType.value == "numeric" ||
      interactionType.value == "other" ? (
        <>
          {correctResponses.map((str, idx) => {
            return (
              <>
                <Paper sx={{ overflowX: "auto" }}>
                  <ClearIcon
                    fontSize="medium"
                    onClick={() => handleDeleteCorrectResponse(idx)}
                  />
                  <Property
                    columnDefs={columnDefs}
                    name={prefix + "object.definition.correctResponses"}
                    //desc={<span>true-false: true/false; <br />choice/fill-in/long fill-in: answer1\[,\]answer2; <br />matching: source1[.]target1[,]source2[.]target3[,]source3[.]target1; <br />performance: pong[.]1:[,]dg[.]:10[,]lunch[.]; <br />sequencing: item1[,]item2[,]item3; <br />likert: id; <br />numeric: decimalMin[:]decimalMax/decimalMin[:]/[:]decimalMax/decimalExact; <br />other: *"</span>}
                    index={index}
                    idx={idx} //correctResponses[idx]
                    type={type}
                  />
                  {interactionType.value == "fill-in" ||
                  interactionType.value == "long-fill-in" ? (
                    <>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="case matters"
                        onChange={(event) =>
                          setCaseMatters(event.target.checked, idx)
                        }
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            defaultChecked
                            onChange={(event) =>
                              setOrderMatters(event.target.checked, idx)
                            }
                          />
                        }
                        label="order matters"
                      />
                      <FormControl sx={{ width: 200, pl: 3 }} size="small">
                        <InputLabel sx={{ pl: 3 }}>Select Language</InputLabel>
                        <Select
                          label="Select Language"
                          // value={value}
                          onChange={(event) =>
                            onLangSelected(event.target.value, idx)
                          }
                        >
                          <MenuItem key={-1} value={""}>
                            <Typography>No Language</Typography>
                          </MenuItem>
                          {languages.map((lang, index) => {
                            return (
                              <MenuItem key={index} value={lang.alpha2}>
                                <Typography>
                                  {lang.alpha2 + " (" + lang.English + ")"}
                                </Typography>
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </>
                  ) : (
                    <></>
                  )}
                </Paper>
              </>
            );
          })}
        </>
      ) : interactionType.value == "likert" ? (
        <>
          {correctResponses.map((str, idx) => {
            return (
              <>
                <Paper sx={{ overflowX: "auto" }}>
                  <ClearIcon
                    fontSize="medium"
                    onClick={() => handleDeleteCorrectResponse(idx)}
                  />
                  <Grid sx={{ pb: 2 }}>
                    <FormControl sx={{ width: 200, pl: 3 }} size="small">
                      <InputLabel sx={{ pl: 3 }}>Select Scale</InputLabel>
                      <Select
                        label="Select Scale"
                        // value={value}
                        onChange={(event) =>
                          onScaleSelected(event.target.value, idx)
                        }
                      >
                        {scales.map((s, i) => {
                          return (
                            <MenuItem key={i} value={i}>
                              scale {i}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                </Paper>
              </>
            );
          })}
        </>
      ) : interactionType.value == "choice" ||
        interactionType.value == "sequencing" ? (
        <>
          {correctResponses.map((str, idx) => {
            return (
              <>
                <Paper sx={{ overflowX: "auto" }}>
                  <ClearIcon
                    fontSize="medium"
                    onClick={() => handleDeleteCorrectResponse(idx)}
                  />
                  <Grid sx={{ pb: 2 }}>
                    {correctChoices.map((cc, ccidx) => {
                      return (
                        <>
                          <FormControl sx={{ width: 200, pl: 3 }} size="small">
                            <InputLabel sx={{ pl: 3 }}>
                              Select Choice
                            </InputLabel>
                            <Select
                              label="Select Choice"
                              // value={value}
                              onChange={(event) =>
                                onChoiceSelected(
                                  event.target.value,
                                  idx,
                                  cc.newIndex
                                )
                              }
                            >
                              {choices.map((c, i) => {
                                return (
                                  <MenuItem key={i} value={i}>
                                    choice {i}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <ClearIcon
                            fontSize="small"
                            onClick={() => removeCorrectChoice(ccidx, idx)}
                          />
                        </>
                      );
                    })}
                    <Button
                      id="add"
                      startIcon={<AddIcon />}
                      onClick={(event) =>
                        addCorrectChoice(correctChoices.length, idx)
                      }
                    />
                  </Grid>
                </Paper>
              </>
            );
          })}
        </>
      ) : interactionType.value == "matching" ? (
        <>
          {correctResponses.map((str, idx) => {
            return (
              <>
                <Paper sx={{ overflowX: "auto" }}>
                  <ClearIcon
                    fontSize="medium"
                    onClick={() => handleDeleteCorrectResponse(idx)}
                  />
                  <Grid sx={{ pb: 2 }}>
                    {correctMatches.map((cm, cmidx) => {
                      return (
                        <>
                          <FormControl sx={{ width: 200, pl: 3 }} size="small">
                            <InputLabel sx={{ pl: 3 }}>
                              Select Source
                            </InputLabel>
                            <Select
                              label="Select Source"
                              // value={value}
                              onChange={(event) =>
                                onSourceSelected(
                                  event.target.value,
                                  idx,
                                  cm.newIndex
                                )
                              }
                            >
                              {sources.map((s, i) => {
                                return (
                                  <MenuItem key={i} value={i}>
                                    source {i}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <FormControl sx={{ width: 200, pl: 3 }} size="small">
                            <InputLabel sx={{ pl: 3 }}>
                              Select Target
                            </InputLabel>
                            <Select
                              label="Select Target"
                              // value={value}
                              onChange={(event) =>
                                onTargetSelected(
                                  event.target.value,
                                  idx,
                                  cm.newIndex
                                )
                              }
                            >
                              {targets.map((t, i) => {
                                return (
                                  <MenuItem key={i} value={i}>
                                    target {i}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <ClearIcon
                            fontSize="small"
                            onClick={() => removeCorrectMatch(cmidx, idx)}
                          />
                        </>
                      );
                    })}
                    <Button
                      id="add"
                      startIcon={<AddIcon />}
                      onClick={(event) =>
                        addCorrectMatch(correctMatches.length, idx)
                      }
                    />
                  </Grid>
                </Paper>
              </>
            );
          })}
        </>
      ) : interactionType.value == "performance" ? (
        <>
          {correctResponses.map((str, idx) => {
            return (
              <>
                <Paper sx={{ overflowX: "auto" }}>
                  <ClearIcon
                    fontSize="medium"
                    onClick={() => handleDeleteCorrectResponse(idx)}
                  />
                  <Grid sx={{ pb: 2 }}>
                    {correctPerformances.map((cp, cpidx) => {
                      return (
                        <>
                          <FormControl sx={{ width: 200, pl: 3 }} size="small">
                            <InputLabel sx={{ pl: 3 }}>Select Step</InputLabel>
                            <Select
                              label="Select Step"
                              // value={value}
                              onChange={(event) =>
                                onStepSelected(
                                  event.target.value,
                                  idx,
                                  cp.newIndex
                                )
                              }
                            >
                              {steps.map((s, i) => {
                                return (
                                  <MenuItem key={i} value={i}>
                                    step {i}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <Property
                            columnDefs={columnDefs}
                            name={"correctresponses.response"}
                            index={index}
                            idx={idx}
                            langIndex={cpidx}
                            type={type}
                          />

                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked
                                onChange={(event) =>
                                  setOrderMatters(event.target.checked, idx)
                                }
                              />
                            }
                            label="order matters"
                          />
                          <FormControl sx={{ width: 200, pl: 3 }} size="small">
                            <InputLabel sx={{ pl: 3 }}>
                              Select Language
                            </InputLabel>
                            <Select
                              label="Select Language"
                              // value={value}
                              onChange={(event) =>
                                onLangSelected(event.target.value, idx)
                              }
                            >
                              <MenuItem key={-1} value={""}>
                                <Typography>No Language</Typography>
                              </MenuItem>
                              {languages.map((lang, index) => {
                                return (
                                  <MenuItem key={index} value={lang.alpha2}>
                                    <Typography>
                                      {lang.alpha2 + " (" + lang.English + ")"}
                                    </Typography>
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <ClearIcon
                            fontSize="small"
                            onClick={() => removeCorrectPerformance(cpidx, idx)}
                          />
                        </>
                      );
                    })}
                    <Button
                      id="add"
                      startIcon={<AddIcon />}
                      onClick={(event) =>
                        addCorrectPerformance(correctPerformances.length, idx)
                      }
                    />
                  </Grid>
                </Paper>
              </>
            );
          })}
        </>
      ) : (
        <></>
      )}

      <Paper>
        {choices.map((item, idx) => {
          if (interactionType.selected === true && (interactionType.value === "choice" || interactionType.value === "sequencing")) {
            return (
              <>
                <Paper sx={{ overflowX: "auto" }}>
                  <ClearIcon
                    fontSize="medium"
                    onClick={() => handleDeleteChoice(idx)}
                  />
                  <Property
                    columnDefs={columnDefs}
                    name={prefix + "choices.id"}
                    type={type}
                    index={index}
                    idx={idx}
                  />
                </Paper>
                {listLanguages.map((lang, langIndex) => {
                  return (
                    <>
                      <Paper sx={{ overflowX: "auto" }}>
                        <ClearIcon
                          fontSize="medium"
                          onClick={() =>
                            handleDeleteListLanguage(langIndex, lang.abbr)
                          }
                        />
                        <Property
                          columnDefs={columnDefs}
                          name={prefix + "choices.description"}
                          abbr={lang.abbr}
                          langIndex={langIndex}
                          index={index}
                          idx={idx}
                          type={type}
                        />
                      </Paper>
                    </>
                  );
                })}
              </>
            );
          }
        })}
        {scales.map((item, idx) => {
          if (interactionType.selected === true && interactionType.value === "likert") {
            return (
              <>
                <Paper sx={{ overflowX: "auto" }}>
                  <ClearIcon
                    fontSize="medium"
                    onClick={() => handleDeleteScale(idx)}
                  />
                  <Property
                    columnDefs={columnDefs}
                    name={prefix + "scales.id"}
                    type={type}
                    index={index}
                    idx={idx}
                  />
                </Paper>
                {listLanguages.map((lang, langIndex) => {
                  return (
                    <>
                      <Paper sx={{ overflowX: "auto" }}>
                        <ClearIcon
                          fontSize="medium"
                          onClick={() =>
                            handleDeleteListLanguage(langIndex, lang.abbr)
                          }
                        />
                        <Property
                          columnDefs={columnDefs}
                          name={prefix + "scales.description"}
                          abbr={lang.abbr}
                          langIndex={langIndex}
                          index={index}
                          idx={idx}
                          type={type}
                        />
                      </Paper>
                    </>
                  );
                })}
              </>
            );
          }
        })}
        {sources.map((item, idx) => {
          if (interactionType.selected === true && interactionType.value === "matching") {
            return (
              <>
                <Paper sx={{ overflowX: "auto" }}>
                  <ClearIcon
                    fontSize="medium"
                    onClick={() => handleDeleteSource(idx)}
                  />
                  <Property
                    columnDefs={columnDefs}
                    name={prefix + "sources.id"}
                    index={index}
                    idx={idx}
                    type={type}
                  />
                </Paper>
                {listLanguages.map((lang, langIndex) => {
                  return (
                    <>
                      <Paper sx={{ overflowX: "auto" }}>
                        <ClearIcon
                          fontSize="medium"
                          onClick={() =>
                            handleDeleteListLanguage(langIndex, lang.abbr)
                          }
                        />
                        <Property
                          columnDefs={columnDefs}
                          name={prefix + "sources.description"}
                          abbr={lang.abbr}
                          langIndex={langIndex}
                          index={index}
                          idx={idx}
                          type={type}
                        />
                      </Paper>
                    </>
                  );
                })}
              </>
            );
          }
        })}
        {targets.map((item, idx) => {
          if (interactionType.selected === true && interactionType.value === "matching") {
            return (
              <>
                <Paper sx={{ overflowX: "auto" }}>
                  <ClearIcon
                    fontSize="medium"
                    onClick={() => handleDeleteTarget(idx)}
                  />
                  <Property
                    columnDefs={columnDefs}
                    name={prefix + "targets.id"}
                    index={index}
                    idx={idx}
                    type={type}
                  />
                </Paper>
                {listLanguages.map((lang, langIndex) => {
                  return (
                    <>
                      <Paper sx={{ overflowX: "auto" }}>
                        <ClearIcon
                          fontSize="medium"
                          onClick={() =>
                            handleDeleteListLanguage(langIndex, lang.abbr)
                          }
                        />
                        <Property
                          columnDefs={columnDefs}
                          name={prefix + "targets.description"}
                          abbr={lang.abbr}
                          langIndex={langIndex}
                          index={index}
                          idx={idx}
                          type={type}
                        />
                      </Paper>
                    </>
                  );
                })}
              </>
            );
          }
        })}
        {steps.map((item, idx) => {
          if (interactionType.selected === true && interactionType.value === "performance") {
            return (
              <>
                <Paper sx={{ overflowX: "auto" }}>
                  <ClearIcon
                    fontSize="medium"
                    onClick={() => handleDeleteStep(idx)}
                  />
                  <Property
                    columnDefs={columnDefs}
                    name={prefix + "steps.id"}
                    index={index}
                    idx={idx}
                    type={type}
                  />
                </Paper>
                {listLanguages.map((lang, langIndex) => {
                  return (
                    <>
                      <Paper sx={{ overflowX: "auto" }}>
                        <ClearIcon
                          fontSize="medium"
                          onClick={() =>
                            handleDeleteListLanguage(langIndex, lang.abbr)
                          }
                        />
                        <Property
                          columnDefs={columnDefs}
                          name={prefix + "steps.description"}
                          abbr={lang.abbr}
                          langIndex={langIndex}
                          index={index}
                          idx={idx}
                          type={type}
                        />
                      </Paper>
                    </>
                  );
                })}
              </>
            );
          }
        })}

        <Button
          startIcon={<AddIcon />}
          onClick={(event) => handleAddCorrectResponse(correctResponses.length)}
        >
          Correct Response
        </Button>

        <Button
          startIcon={<AddIcon />}
          onClick={(event) => setOpenAddListItemMenu(event.currentTarget)}
        >
          Add List Item
        </Button>
        <Menu
          open={Boolean(openAddListItemMenu)}
          anchorEl={openAddListItemMenu}
          onClose={() => setOpenAddListItemMenu(null)}
        >
          {interactionType.value === "choice" ||
          interactionType.value === "sequencing" ? (
            <>
              <MenuItem
                key={0}
                value={"choices"}
                label={"choices"}
                onClick={(event) => {
                  handleAddChoice(choices.length);
                }}
              >
                <Typography>{"choices"}</Typography>
              </MenuItem>
            </>
          ) : interactionType.value === "likert" ? (
            <>
              <MenuItem
                key={0}
                value={"scale"}
                label={"scale"}
                onClick={(event) => {
                  handleAddScale(scales.length);
                }}
              >
                <Typography>{"scale"}</Typography>
              </MenuItem>
            </>
          ) : interactionType.value === "matching" ? (
            <>
              <MenuItem
                key={0}
                value={"source"}
                label={"source"}
                onClick={(event) => {
                  handleAddSource(sources.length);
                }}
              >
                <Typography>{"source"}</Typography>
              </MenuItem>
              <MenuItem
                key={1}
                value={"target"}
                label={"target"}
                onClick={(event) => {
                  handleAddTarget(targets.length);
                }}
              >
                <Typography>{"target"}</Typography>
              </MenuItem>
            </>
          ) : interactionType.value === "performance" ? (
            <>
              <MenuItem
                key={0}
                value={"steps"}
                label={"steps"}
                onClick={(event) => {
                  handleAddStep(steps.length);
                }}
              >
                <Typography>{"steps"}</Typography>
              </MenuItem>
            </>
          ) : (
            <></>
          )}
        </Menu>
        {choices.length > 0 ||
        scales.length > 0 ||
        sources.length > 0 ||
        targets.length > 0 ||
        steps.length > 0 ? (
          <Button
            startIcon={<AddIcon />}
            endIcon={<KeyboardArrowDownIcon />}
            onClick={(event) => setOpenAddListLangMenu(event.currentTarget)}
          >
            Add Language
          </Button>
        ) : (
          <></>
        )}

        <Menu
          open={Boolean(openAddListLangMenu)}
          anchorEl={openAddListLangMenu}
          onClose={() => setOpenAddListLangMenu(null)}
        >
          {languages.map((lang, index) => {
            return (
              <MenuItem
                key={index}
                value={lang.alpha2}
                // label={lang.alpha2 + '(' + lang.English + ')'}
                //onClick={handleAddLanguage(event.target.value)}
                onClick={() => {
                  handleAddListLanguage(lang.alpha2);
                }}
              >
                <Typography>
                  {lang.alpha2 + " (" + lang.English + ")"}
                </Typography>
              </MenuItem>
            );
          })}
        </Menu>
      </Paper>
    </>
  );
};

export default FormInteractionType;
