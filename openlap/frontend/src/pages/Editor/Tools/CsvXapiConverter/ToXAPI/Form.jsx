import React, { useState } from "react";
import Property from "./Property";
import SelectionProperty from "./SelectionProperty";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Link,
  Menu,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
  FormControlLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import { openVisualizationAccordion } from "../../../../../utils/redux/reducers/iscReducer";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ClearIcon from "@mui/icons-material/Clear";
import HelpIcon from "@mui/icons-material/Help";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FormObject from "./FormObject";
import FormAgent from "./FormAgent";
import FormAttachment from "./FormAttachment";
import FormLanguageMap from "./FormLanguageMap";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

import {
  setForm
} from "../../../../../utils/redux/reducers/csvxapiReducer";

import { useNavigate } from "react-router-dom";

const Form = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rowData = useSelector((state) => state.csvxapiReducer.data.rowData);
  const columnDefs = useSelector(
    (state) => state.csvxapiReducer.data.columnDefs
  );

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const form = useSelector((state) => state.csvxapiReducer.form);

  const [openAddScoreMenu, setOpenAddScoreMenu] = useState(null);
  const [openAddContextActivityMenu, setOpenAddContextActivityMenu] =
    useState(null);

  const [openContextLanguages, setOpenContextLanguages] = useState(null);
  const [contextLanguage, setContextLanguage] = useState("");

    const handleSetContextLanguage = (langAbbr) => {
      dispatch(setForm({...form, context: {...form.context, language: {selected: true, tag: langAbbr}}}));
    };

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



  const [id, setId] = useState(false);
  const handleAddId = () => {
    setId((prevState) => !prevState);
    dispatch(setForm({ ...form, id: { ...form.id, selected: true } }));
  };
  const handleDeleteId = () => {
    setId((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        id: { ...form.id, selected: false },
      })
    );
  };

  const [actorMembers, setActorMembers] = useState([]);
  const handleAddActorMember = (index) => {
    setActorMembers([...actorMembers, index]);
    let arr = form.actor.members.array;
    arr.push({
      ifi: "",
      name: { selected: true, stringParts: [] },
      accountHomepage: { selected: true, stringParts: [] },
      accountName: { selected: true, stringParts: [] },
      mbox: { selected: true, stringParts: [] },
      mbox_sha1sum: { selected: true, generateSHA1: false, stringParts: [] },
      openid: { selected: true, stringParts: [] },
    });
    dispatch(
      setForm({
        ...form,
        actor: { ...form.actor, members: { selected: true, array: arr } },
      })
    );
  };
  const handleDeleteActorMember = (index) => {
    let arr = form.actor.members.array;
    arr = arr.filter((member, i) => i !== index);
    dispatch(
      setForm({
        ...form,
        actor: { ...form.actor, members: { selected: true, array: arr } },
      })
    );
    setActorMembers((members) => {
      return members.filter((_, i) => i !== index);
    });
  };

  const [instructorMembers, setInstructorMembers] = useState([]);
  const handleAddInstructorMember = (index) => {
    setInstructorMembers([...instructorMembers, index]);
    let arr = form.context.instructor.members.array;
    arr.push({
      ifi: "",
      name: { selected: true, stringParts: [] },
      accountHomepage: { selected: true, stringParts: [] },
      accountName: { selected: true, stringParts: [] },
      mbox: { selected: true, stringParts: [] },
      mbox_sha1sum: { selected: true, generateSHA1: false, stringParts: [] },
      openid: { selected: true, stringParts: [] },
    });
    dispatch(
      setForm({
        ...form,
        context: {
          ...form.context,
          instructor: {
            ...form.context.instructor,
            members: { selected: true, array: arr },
          },
        },
      })
    );
  };
  const handleDeleteInstructorMember = (index) => {
    let arr = form.context.instructor.members.array;
    arr = arr.filter((member, i) => i !== index);
    dispatch(
      setForm({
        ...form,
        context: {
          ...form.context,
          instructor: {
            ...form.context.instructor,
            members: { selected: true, array: arr },
          },
        },
      })
    );
    setInstructorMembers((members) => {
      return members.filter((_, i) => i !== index);
    });
  };

  const handleAddResult = () => {
    setResult((prevState) => !prevState);
    dispatch(setForm({ ...form, result: { ...form.result, selected: true } }));
  };
  const handleDeleteResult = () => {
    setResult((prevState) => !prevState);
    dispatch(setForm({ ...form, result: { ...form.result, selected: false } }));
  };

  const [scores, setScores] = useState([]);
  const handleAddScore = (typeName) => {
    setScores([...scores, typeName]);
    switch (typeName) {
      case "scaled":
        dispatch(
          setForm({
            ...form,
            result: {
              ...form.result,
              score: {
                ...form.result.score,
                scaled: { ...form.result.score.scaled, selected: true },
              },
            },
          })
        );
        break;
      case "raw":
        dispatch(
          setForm({
            ...form,
            result: {
              ...form.result,
              score: {
                ...form.result.score,
                raw: { ...form.result.score.raw, selected: true },
              },
            },
          })
        );
        break;
      case "min":
        dispatch(
          setForm({
            ...form,
            result: {
              ...form.result,
              score: {
                ...form.result.score,
                min: { ...form.result.score.min, selected: true },
              },
            },
          })
        );
        break;
      case "max":
        dispatch(
          setForm({
            ...form,
            result: {
              ...form.result,
              score: {
                ...form.result.score,
                max: { ...form.result.score.max, selected: true },
              },
            },
          })
        );
        break;
      default:
    }
    if (openAddScoreMenu) setOpenAddScoreMenu(null);
  };
  const handleDeleteScore = (index, type) => {
    setScores((scores) => {
      return scores.filter((_, i) => i !== index);
    });
    switch (type) {
      case "scaled":
        dispatch(
          setForm({
            ...form,
            result: {
              ...form.result,
              score: {
                ...form.result.score,
                scaled: { ...form.result.score.scaled, selected: false },
              },
            },
          })
        );
        break;
      case "raw":
        dispatch(
          setForm({
            ...form,
            result: {
              ...form.result,
              score: {
                ...form.result.score,
                raw: { ...form.result.score.raw, selected: false },
              },
            },
          })
        );
        break;
      case "min":
        dispatch(
          setForm({
            ...form,
            result: {
              ...form.result,
              score: {
                ...form.result.score,
                min: { ...form.result.score.min, selected: false },
              },
            },
          })
        );
        break;
      case "max":
        dispatch(
          setForm({
            ...form,
            result: {
              ...form.result,
              score: {
                ...form.result.score,
                max: { ...form.result.score.max, selected: false },
              },
            },
          })
        );
        break;
      default:
    }
  };

  const setGenerateScaled = (bool) => {
    dispatch(
      setForm({
        ...form,
        result: {
          ...form.result,
          score: {
            ...form.result.score,
            scaled: { ...form.result.score.scaled, autogenerate: bool },
          },
        },
      })
    );
  };

  const [contextActivities, setContextActivities] = useState([]);
  const handleAddContextActivity = (typeName) => {
    let newCA = contextActivities;
    newCA.push(typeName);
    setContextActivities(newCA);

    let arr = [];

    switch (typeName) {
      case "parent":
        arr = form.context.contextActivitiesParent.array;
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
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: {
                ...form.context.contextActivitiesGrouping,
                selected: true,
              },
            },
          })
        );
        break;
      case "category":
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: {
                ...form.context.contextActivitiesCategory,
                selected: true,
              },
            },
          })
        );
        break;
      case "other":
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: {
                ...form.context.contextActivitiesOther,
                selected: true,
              },
            },
          })
        );
        break;
    }
    if (openAddContextActivityMenu) setOpenAddContextActivityMenu(null);
  };
  const handleDeleteContextActivity = (index, type) => {
    switch (type) {
      case "parent":
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: {
                ...form.context.contextActivitiesParent,
                selected: false,
              },
            },
          })
        );
        break;
      case "grouping":
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: {
                ...form.context.contextActivitiesGrouping,
                selected: false,
              },
            },
          })
        );
        break;
      case "category":
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: {
                ...form.context.contextActivitiesCategory,
                selected: false,
              },
            },
          })
        );
        break;
      case "other":
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: {
                ...form.context.contextActivitiesOther,
                selected: false,
              },
            },
          })
        );
        break;
    }
    setContextActivities((contextActivities) => {
      return contextActivities.filter((_, i) => i !== index);
    });
  };

  const objFormTemplate = {
    id: {
      selected: true,
      stringParts: [],
    },
    definitionName: {
      selected: true,
      languages: [],
    },
    definitionDescription: {
      selected: true,
      languages: {},
    },
    definitionType: {
      selected: true,
      stringParts: [],
    },
    definitionMoreinfo: {
      selected: false,
      stringParts: [],
    },
    definitionExtension: {
      selected: false,
      json: {},
    },
    definitionInteractiontype: {
      selected: false,
      value: "",
    },
    definitionCorrectresponses: {
      selected: false,
      array: [],
    },
    definitionChoices: {
      selected: false,
      array: [],
    },
    definitionScales: {
      selected: false,
      array: [],
    },
    definitionSources: {
      selected: false,
      array: [],
    },
    definitionTargets: {
      selected: false,
      array: [],
    },
    definitionSteps: {
      selected: false,
      array: [],
    },
  };


const attachmentFormTemplate = {
    usageType: {
      selected: false,
      stringParts: [],
    },
    display: {
      selected: false,
      languages: {},
    },
    description: {
      selected: false,
      languages: {},
    },
    contentType: {
      selected: false,
      stringParts: [],
    },
    length: {
      selected: false,
      stringParts: [],
    },
    sha2: {
      selected: false,
      generateSHA2: false,
      stringParts: [],
    },
    fileUrl: {
      selected: false,
      stringParts: [],
    },
};

  const [parents, setParents] = useState([]);
  const handleAddParent = (index) => {
    setParents([...parents, index]);
    let arr = form.context.contextActivitiesParent.array;
    arr.push(objFormTemplate);
    dispatch(
      setForm({
        ...form,
        context: {
          ...form.context,
          contextActivitiesParent: { selected: true, array: arr },
        },
      })
    );
  };
  const handleDeleteParent = (index) => {
    let arr = form.context.contextActivitiesParent.array;
    arr = arr.filter((item, i) => i !== index);
    dispatch(
      setForm({
        ...form,
        context: {
          ...form.context,
          contextActivitiesParent: { selected: true, array: arr },
        },
      })
    );
    setParents((parents) => {
      return parents.filter((_, i) => i !== index);
    });
  };

  const [groupings, setGroupings] = useState([]);
  const handleAddGrouping = (index) => {
    setGroupings([...groupings, index]);
    let arr = form.context.contextActivitiesGrouping.array;
    arr.push(objFormTemplate);
    dispatch(
      setForm({
        ...form,
        context: {
          ...form.context,
          contextActivitiesGrouping: { selected: true, array: arr },
        },
      })
    );
  };
  const handleDeleteGrouping = (index) => {
    let arr = form.context.contextActivitiesGrouping.array;
    arr = arr.filter((item, i) => i !== index);
    dispatch(
      setForm({
        ...form,
        context: {
          ...form.context,
          contextActivitiesGrouping: { selected: true, array: arr },
        },
      })
    );
    setGroupings((groupings) => {
      return groupings.filter((_, i) => i !== index);
    });
  };

  const [categories, setCategories] = useState([]);
  const handleAddCategory = (index) => {
    setCategories([...categories, index]);
    let arr = form.context.contextActivitiesCategory.array;
    arr.push(objFormTemplate);
    dispatch(
      setForm({
        ...form,
        context: {
          ...form.context,
          contextActivitiesCategory: { selected: true, array: arr },
        },
      })
    );
  };
  const handleDeleteCategory = (index) => {
    let arr = form.context.contextActivitiesCategory.array;
    arr = arr.filter((item, i) => i !== index);
    dispatch(
      setForm({
        ...form,
        context: {
          ...form.context,
          contextActivitiesCategory: { selected: true, array: arr },
        },
      })
    );
    setCategories((categories) => {
      return categories.filter((_, i) => i !== index);
    });
  };

  const [others, setOthers] = useState([]);
  const handleAddOther = (index) => {
    setOthers([...others, index]);
    let arr = form.context.contextActivitiesOther.array;
    arr.push(objFormTemplate);
    dispatch(
      setForm({
        ...form,
        context: {
          ...form.context,
          contextActivitiesOther: { selected: true, array: arr },
        },
      })
    );
  };
  const handleDeleteOther = (index) => {
    let arr = form.context.contextActivitiesOther.array;
    arr = arr.filter((item, i) => i !== index);
    dispatch(
      setForm({
        ...form,
        context: {
          ...form.context,
          contextActivitiesOther: { selected: true, array: arr },
        },
      })
    );
    setOthers((others) => {
      return others.filter((_, i) => i !== index);
    });
  };

  const [contextActivity, setContextActivity] = useState(false);

  const [revision, setRevision] = useState(false);
  const handleAddRevision = () => {
    setRevision((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        context: {
          ...form.context,
          revision: { ...form.context.revision, selected: true },
        },
      })
    );
  };
  const handleRemoveRevision = () => {
    setRevision((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        context: {
          ...form.context,
          revision: { ...form.context.revision, selected: false },
        },
      })
    );
  };

  const [registration, setRegistration] = useState(false);
  const handleAddRegistration = () => {
    setRegistration((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        context: {
          ...form.context,
          registration: { ...form.context.registration, selected: true },
        },
      })
    );
  };
  const handleRemoveRegistration = () => {
    setRegistration((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        context: {
          ...form.context,
          registration: { ...form.context.registration, selected: false },
        },
      })
    );
  };

  const [instructor, setInstructor] = useState(false);
  const handleAddInstructor = () => {
    setInstructor((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        context: {
          ...form.context,
          instructor: { ...form.context.instructor, selected: true },
        },
      })
    );
  };
  const handleRemoveInstructor = () => {
    setInstructor((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        context: {
          ...form.context,
          instructor: { ...form.context.instructor, selected: false },
        },
      })
    );
  };

  const [team, setTeam] = useState(false);

  const [teamMembers, setTeamMembers] = useState([]);
  const handleAddTeamMember = (index) => {
    setTeamMembers([...teamMembers, index]);
    let arr = form.context.members.array;
    arr.push({
      ifi: "",
      name: { selected: true, stringParts: [] },
      accountHomepage: { selected: true, stringParts: [] },
      accountName: { selected: true, stringParts: [] },
      mbox: { selected: true, stringParts: [] },
      mbox_sha1sum: { selected: true, generateSHA1: false, stringParts: [] },
      openid: { selected: true, stringParts: [] },
    });
    dispatch(
      setForm({
        ...form,
        context: { ...form.context, members: { selected: true, array: arr } },
      })
    );
  };
  const handleDeleteTeamMember = (index) => {
    let arr = form.context.members.array;
    arr = arr.filter((member, i) => i !== index);
    dispatch(
      setForm({
        ...form,
        context: { ...form.context, members: { selected: true, array: arr } },
      })
    );
    setTeamMembers((members) => {
      return members.filter((_, i) => i !== index);
    });
  };

  const [contextExtension, setContextExtension] = useState(false);

  const handleSetContextExtension = () => {
    setContextExtension((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        context: {
          ...form.context,
          extension: { ...form.context.extension, selected: true },
        },
      })
    );
  };
  const handleRemoveContextExtension = () => {
    setContextExtension((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        context: {
          ...form.context,
          extension: { ...form.context.extension, selected: false },
        },
      })
    );
  };

  const handleJsonInputContextExtension = (event) => {
    if (event.error === false) {
      dispatch(
        setForm({
          ...form,
          context: {
            ...form.context,
            extension: { ...form.context.extension, json: event.jsObject },
          },
        })
      );
    }
  };

  const [result, setResult] = useState(false);

  const [score, setScore] = useState(false);
  const handleSetScore = () => {
    setScore((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        result: {
          ...form.result,
          score: { ...form.result.score, selected: true },
        },
      })
    );
  };
  const handleRemoveScore = () => {
    setScore((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        result: {
          ...form.result,
          score: { ...form.result.score, selected: false },
        },
      })
    );
  };

  const [success, setSuccess] = useState(false);
  const handleSetSuccess = () => {
    setSuccess((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        result: {
          ...form.result,
          success: { ...form.result.success, selected: true },
        },
      })
    );
  };
  const handleRemoveSuccess = () => {
    setSuccess((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        result: {
          ...form.result,
          success: { ...form.result.success, selected: false },
        },
      })
    );
  };

  const [completion, setCompletion] = useState(false);
  const handleSetCompletion = () => {
    setCompletion((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        result: {
          ...form.result,
          completion: { ...form.result.completion, selected: true },
        },
      })
    );
  };
  const handleRemoveCompletion = () => {
    setCompletion((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        result: {
          ...form.result,
          completion: { ...form.result.completion, selected: false },
        },
      })
    );
  };

  const [response, setResponse] = useState(false);
  const handleSetResponse = () => {
    setResponse((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        result: {
          ...form.result,
          response: { ...form.result.response, selected: true },
        },
      })
    );
  };
  const handleRemoveResponse = () => {
    setResponse((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        result: {
          ...form.result,
          response: { ...form.result.response, selected: false },
        },
      })
    );
  };

  const [duration, setDuration] = useState(false);
  const handleSetDuration = () => {
    setDuration((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        result: {
          ...form.result,
          duration: { ...form.result.duration, selected: true },
        },
      })
    );
  };
  const handleRemoveDuration = () => {
    setDuration((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        result: {
          ...form.result,
          duration: { ...form.result.duration, selected: false },
        },
      })
    );
  };

  const [resultExtension, setResultExtension] = useState(false);

  const handleSetResultExtension = () => {
    setResultExtension((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        result: {
          ...form.result,
          extension: { ...form.result.extension, selected: true },
        },
      })
    );
  };
  const handleRemoveResultExtension = () => {
    setResultExtension((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        result: {
          ...form.result,
          extension: { ...form.result.extension, selected: false },
        },
      })
    );
  };

  const handleJsonInputResultExtension = (event) => {
    if (event.error === false) {
      dispatch(
        setForm({
          ...form,
          result: {
            ...form.result,
            extension: { ...form.result.extension, json: event.jsObject },
          },
        })
      );
    }
  };

  const [timestamp, setTimestamp] = useState(false);
  const handleAddTimestamp = () => {
    setTimestamp((prevState) => !prevState);
    dispatch(
      setForm({ ...form, timestamp: { ...form.timestamp, selected: true } })
    );
  };
  const handleDeleteTimestamp = () => {
    setTimestamp((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        timestamp: { ...form.timestamp, selected: false },
      })
    );
  };

  const [attachments, setAttachments] = useState(false);
  const handleAddAttachments = () => {
    setAttachments((prevState) => !prevState);
    dispatch(
      setForm({ ...form, attachments: { ...form.attachments, selected: true } })
    );
  };
  const handleRemoveAttachments = () => {
    setAttachments((prevState) => !prevState);
    dispatch(
      setForm({
        ...form,
        attachments: { ...form.attachments, selected: false },
      })
    );
  };

  const [attachmentArray, setAttachmentArray] = useState([]);
  const addAttachment = (index) => {
    setAttachmentArray([...attachmentArray, index]);
    let arr = form.attachments.array;
    arr.push(attachmentFormTemplate);
    dispatch(
      setForm({
        ...form,
        attachments: { selected: true, array: arr },
      })
    );
  };
  const deleteAttachment = (index) => {
    let arr = form.attachments.array;
    arr = arr.filter((att, i) => i !== index);
    dispatch(
      setForm({
        ...form,
        attachments: { selected: true, array: arr },
      })
    );
    setAttachmentArray((att) => {
      return att.filter((_, i) => i !== index);
    });
  };


  return (
    <>
      {id ? (
        <>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ "&:hover": { backgroundColor: "openlapbg.light" } }}
              onClick={() => dispatch(openVisualizationAccordion())}
            >
              <ClearIcon
                fontSize="medium"
                onClick={(event) => handleDeleteId()}
              />
              <Typography sx={{ pl: 1, fontWeight: "bold" }}>
                id
                <Link
                  sx={{ pl: 2 }}
                  href="https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#stmtid"
                  target="_blank"
                  rel="noreferrer"
                >
                  <OpenInNewIcon />
                </Link>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Property
                columnDefs={columnDefs}
                name="id"
                desc="UUID, e.g. f562825f-9803-4e33-842a-60c5eb5b0b31"
              />
            </AccordionDetails>
          </Accordion>
        </>
      ) : (
        <></>
      )}

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ "&:hover": { backgroundColor: "openlapbg.light" } }}
          onClick={() => dispatch(openVisualizationAccordion())}
        >
          <Typography sx={{ pl: 1, fontWeight: "bold" }}>
            actor
            <Link
              sx={{ pl: 2 }}
              href="https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#actor"
              target="_blank"
              rel="noreferrer"
            >
              <OpenInNewIcon />
            </Link>
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          {/* <Typography sx={{ pl: 1 }}>name</Typography> */}

          <SelectionProperty
            name="actor.objectType"
            selections={[
              ["Agent", 1],
              ["Group", 2],
            ]}
          />
          <FormAgent prefix="actor" type="actor" />

          {/* {(form.actorObjecttype.value==="Group") ? (<></>):(  */}
          {/* {(form.actorObjecttype.value=="Group") && */}
          <>
            {actorMembers.map((member, index) => {
              if (form.actor.objecttype.value === "Group") {
                return (
                  <>
                    <Paper sx={{ overflowX: "auto", pl: 3, pb: 2 }}>
                      <ClearIcon
                        fontSize="medium"
                        onClick={() => handleDeleteActorMember(index)}
                      />
                      <FormAgent
                        prefix="actor.members"
                        type="actor.members"
                        index={actorMembers[index]}
                      />
                    </Paper>
                  </>
                );
              }
            })}
            {form.actor.objecttype.value === "Group" ? (
              <Button
                startIcon={<AddIcon />}
                onClick={(event) => handleAddActorMember(actorMembers.length)}
              >
                Add Member
              </Button>
            ) : (
              <></>
            )}
          </>
          {/* )} */}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ "&:hover": { backgroundColor: "openlapbg.light" } }}
        >
          <Typography sx={{ pl: 1, fontWeight: "bold" }}>
            verb
            <Link
              sx={{ pl: 2 }}
              href="https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#verb"
              target="_blank"
              rel="noreferrer"
            >
              <OpenInNewIcon />
            </Link>
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Paper sx={{ overflowX: "auto" }}>
            <Property
              columnDefs={columnDefs}
              name="verb.id"
              desc="IRI, e.g. http://adlnet.gov/expapi/verbs/created"
            />
          </Paper>
          <Paper sx={{ overflowX: "auto" }}>
          <Typography sx={{ pl: 1, pr: 3, pt: 1, pb: 2 }}>
                verb.display
                <Tooltip
                    title={"Language Map, e.g. {en-US: initialized, en-GB: initialised}"}
                    arrow
                    placement="right-start"
                  >
                    <IconButton size="small">
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
              </Typography>
          <FormLanguageMap columnDefs={columnDefs} name="verb.display" />
          </Paper>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ "&:hover": { backgroundColor: "openlapbg.light" } }}
          onClick={() => dispatch(openVisualizationAccordion())}
        >
          <Typography sx={{ pl: 1, fontWeight: "bold" }}>
            object
            <Link
              sx={{ pl: 2 }}
              href="https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#object"
              target="_blank"
              rel="noreferrer"
            >
              <OpenInNewIcon />
            </Link>
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          <FormObject prefix="" form={form} type="object" setForm={setForm} />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ "&:hover": { backgroundColor: "openlapbg.light" } }}
          onClick={() => dispatch(openVisualizationAccordion())}
        >
          <Typography sx={{ pl: 1, fontWeight: "bold" }}>
            context
            <Link
              sx={{ pl: 2 }}
              href="https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#context"
              target="_blank"
              rel="noreferrer"
            >
              <OpenInNewIcon />
            </Link>
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          <Property
            columnDefs={columnDefs}
            name="context.platform"
            desc="any string"
            form={form}
            setForm={setForm}
          />
          {/* <Property
            columnDefs={columnDefs}
            name="context.language"
            desc="string according to RFC 5646, e.g. en-US"
            form={form}
            setForm={setForm}
          /> */}
                <Paper sx={{ overflowX: "auto", height: 150 }}>
        <Grid>
          <Typography sx={{ pl: 1, pr: 3, pt: 1, pb: 2 }}>
            {"context.language"}
            <Tooltip
                    title={"RFC5646 language tag, e.g. en-US"}
                    arrow
                    placement="right-start"
                  >
                    <IconButton size="small">
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
          </Typography>
         
        </Grid>
                  <Grid sx={{ pb: 2 }}>
          <FormControl sx={{ width: 200, pl: 3, pt: 1 }} size="small">
            <InputLabel sx={{ width: 200, pl: 4, pt: 1 }} size="small">
              Select Language
            </InputLabel>
            <Select
              open={openContextLanguages}
              label="Select Language"
              value={contextLanguage} //column.selectedColumn
              //display={value}
              onClose={() => setOpenContextLanguages((prevState) => !prevState)}
              onOpen={() => setOpenContextLanguages((prevState) => !prevState)}
              onChange={(event) => {
                setContextLanguage(event.target.value);
                //handleSetContextLanguage(event.target.value, index);
                //setColumn(event.target.value);
              }}
            >
              {languages.map((lang, index) => {
                return (
                  <MenuItem
                    key={index}
                    value={lang.alpha2}
                    // label={lang.alpha2 + '(' + lang.English + ')'}
                    //onClick={handleAddLanguage(event.target.value)}
                    onClick={() => {
                      handleSetContextLanguage(lang.alpha2);
                    }}
                  >
                    <Typography>
                      {lang.alpha2 + " (" + lang.English + ")"}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
</Grid>
</Paper>

          {registration ? (
            <>
              <ClearIcon
                fontSize="medium"
                onClick={(event) => handleRemoveRegistration()}
              />
              <Property
                columnDefs={columnDefs}
                name="context.registration"
                desc="UUID, e.g. f562825f-9803-4e33-842a-60c5eb5b0b31"
                form={form}
                setForm={setForm}
              />
            </>
          ) : (
            <></>
          )}
          {revision ? (
            <>
              <ClearIcon
                fontSize="medium"
                onClick={(event) => handleRemoveRevision()}
              />
              <Property
                columnDefs={columnDefs}
                name="context.revision"
                desc="any string"
                form={form}
                setForm={setForm}
              />
            </>
          ) : (
            <></>
          )}
          {instructor ? (
            <>
              <ClearIcon
                fontSize="medium"
                onClick={(event) => handleRemoveInstructor()}
              />
              <Paper sx={{ overflowX: "auto" }}>
                <Grid>
                  <Typography sx={{ pl: 1, pr: 3, pt: 1, pb: 2 }}>
                    instructor
                  </Typography>
                </Grid>
                <SelectionProperty
                  name="instructor.objectType"
                  selections={[
                    ["Agent", 1],
                    ["Group", 2],
                  ]}
                />
                <FormAgent prefix="instructor" type="instructor" />
              </Paper>
              <>
                {instructorMembers.map((member, index) => {
                  if (form.context.instructor.objecttype.value === "Group") {
                    return (
                      <>
                        <Paper sx={{ overflowX: "auto", pl: 3, pb: 2 }}>
                          <ClearIcon
                            fontSize="medium"
                            onClick={() => handleDeleteInstructorMember(index)}
                          />
                          <FormAgent
                            prefix="instructor.members"
                            type="instructor.members"
                            index={instructorMembers[index]}
                          />
                        </Paper>
                      </>
                    );
                  }
                })}
                {form.context.instructor.objecttype.value === "Group" ? (
                  <Button
                    startIcon={<AddIcon />}
                    onClick={(event) =>
                      handleAddInstructorMember(instructorMembers.length)
                    }
                  >
                    Add Member
                  </Button>
                ) : (
                  <></>
                )}
              </>
            </>
          ) : (
            <></>
          )}

          {team ? (
            <>
              <ClearIcon
                fontSize="medium"
                onClick={(event) => setTeam((prevState) => !prevState)}
              />
              <Paper sx={{ overflowX: "auto" }}>
                <Grid>
                  <Typography sx={{ pl: 1, pr: 3, pt: 1, pb: 2 }}>
                    team
                  </Typography>
                </Grid>
                {teamMembers.map((member, index) => {
                  return (
                    <>
                      <Paper sx={{ overflowX: "auto", pl: 3, pb: 2 }}>
                        <ClearIcon
                          fontSize="medium"
                          onClick={() => handleDeleteTeamMember(index)}
                        />
                        <FormAgent
                          prefix="team.members"
                          type="team.members"
                          index={teamMembers[index]}
                        />
                      </Paper>
                    </>
                  );
                })}
              </Paper>
              <Button
                startIcon={<AddIcon />}
                onClick={(event) => handleAddTeamMember(teamMembers.length)}
              >
                Add Member
              </Button>
            </>
          ) : (
            <></>
          )}

          {contextExtension ? (
            <>
              <ClearIcon
                fontSize="medium"
                onClick={(event) => handleRemoveContextExtension()}
              />

              <JSONInput
                id="a_unique_id"
                placeholder={form.context.extension.json}
                // colors      = { darktheme }
                locale={locale}
                height="100px"
                onChange={(event) => handleJsonInputContextExtension(event)}
              />
            </>
          ) : (
            <></>
          )}

          {contextActivity ? (
            <>
              <ClearIcon
                fontSize="medium"
                onClick={(event) =>
                  setContextActivity((prevState) => !prevState)
                }
              />
              <Paper sx={{ overflowX: "auto" }}>
                <Grid>
                  <Typography sx={{ pl: 1, pr: 3, pt: 1, pb: 2 }}>
                    contextActivities
                  </Typography>
                </Grid>
                <Grid sx={{ pb: 2, pl: 3, pr: 3 }}>
                  {contextActivities.map((act, index) => {
                    return (
                      <>
                        <Paper sx={{ overflowX: "auto" }}>
                          <ClearIcon
                            fontSize="medium"
                            onClick={() =>
                              handleDeleteContextActivity(index, act)
                            }
                          />
                          <Grid>
                            <Typography sx={{ pl: 1, pr: 3, pt: 1, pb: 2 }}>
                              {act}
                            </Typography>
                          </Grid>
                          {act === "parent" ? (
                            <>
                              {parents.map((item, idx) => {
                                return (
                                  <>
                                    <Paper
                                      sx={{ overflowX: "auto", pl: 3, pb: 2 }}
                                    >
                                      <ClearIcon
                                        fontSize="medium"
                                        onClick={() => handleDeleteParent(idx)}
                                      />
                                      <FormObject
                                        prefix="context.activities."
                                        type={"parent"}
                                        index={idx}
                                      />
                                    </Paper>
                                  </>
                                );
                              })}
                              <Button
                                startIcon={<AddIcon />}
                                onClick={(event) =>
                                  handleAddParent(parents.length)
                                }
                              >
                                Add Item
                              </Button>
                            </>
                          ) : act === "grouping" ? (
                            <>
                              {groupings.map((item, idx) => {
                                return (
                                  <>
                                    <Paper
                                      sx={{ overflowX: "auto", pl: 3, pb: 2 }}
                                    >
                                      <ClearIcon
                                        fontSize="medium"
                                        onClick={() =>
                                          handleDeleteGrouping(idx)
                                        }
                                      />
                                      <FormObject
                                        prefix="context.activities."
                                        type={"grouping"}
                                        index={idx}
                                        form={form}
                                        setForm={setForm}
                                      />
                                    </Paper>
                                  </>
                                );
                              })}
                              <Button
                                startIcon={<AddIcon />}
                                onClick={(event) =>
                                  handleAddGrouping(groupings.length)
                                }
                              >
                                Add Item
                              </Button>
                            </>
                          ) : act === "category" ? (
                            <>
                              {categories.map((item, idx) => {
                                return (
                                  <>
                                    <Paper
                                      sx={{ overflowX: "auto", pl: 3, pb: 2 }}
                                    >
                                      <ClearIcon
                                        fontSize="medium"
                                        onClick={() =>
                                          handleDeleteCategory(idx)
                                        }
                                      />
                                      <FormObject
                                        prefix="context.activities."
                                        type={"category"}
                                        index={idx}
                                        form={form}
                                        setForm={setForm}
                                      />
                                    </Paper>
                                  </>
                                );
                              })}
                              <Button
                                startIcon={<AddIcon />}
                                onClick={(event) =>
                                  handleAddCategory(categories.length)
                                }
                              >
                                Add Item
                              </Button>
                            </>
                          ) : act === "other" ? (
                            <>
                              {others.map((item, idx) => {
                                return (
                                  <>
                                    <Paper
                                      sx={{ overflowX: "auto", pl: 3, pb: 2 }}
                                    >
                                      <ClearIcon
                                        fontSize="medium"
                                        onClick={() => handleDeleteOther(idx)}
                                      />
                                      <FormObject
                                        prefix="context.activities."
                                        type={"other"}
                                        index={idx}
                                        form={form}
                                        setForm={setForm}
                                      />
                                    </Paper>
                                  </>
                                );
                              })}
                              <Button
                                startIcon={<AddIcon />}
                                onClick={(event) =>
                                  handleAddOther(others.length)
                                }
                              >
                                Add Item
                              </Button>
                            </>
                          ) : (
                            <></>
                          )}
                        </Paper>
                      </>
                    );
                  })}
                  <Button
                    startIcon={<AddIcon />}
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={(event) =>
                      setOpenAddContextActivityMenu(event.currentTarget)
                    }
                  >
                    Add Activity
                  </Button>
                  <Menu
                    open={Boolean(openAddContextActivityMenu)}
                    anchorEl={openAddContextActivityMenu}
                    onClose={() => setOpenAddContextActivityMenu(null)}
                  >
                    <MenuItem
                      key={0}
                      value={"parent"}
                      label={"parent"}
                      disabled={contextActivities.includes("parent")}
                      onClick={(event) => {
                        handleAddContextActivity("parent");
                      }}
                    >
                      <Typography>{"parent"}</Typography>
                    </MenuItem>
                    <MenuItem
                      key={1}
                      value={"grouping"}
                      label={"grouping"}
                      disabled={contextActivities.includes("grouping")}
                      onClick={(event) => {
                        handleAddContextActivity("grouping");
                      }}
                    >
                      <Typography>{"grouping"}</Typography>
                    </MenuItem>
                    <MenuItem
                      key={2}
                      value={"category"}
                      label={"category"}
                      disabled={contextActivities.includes("category")}
                      onClick={(event) => {
                        handleAddContextActivity("category");
                      }}
                    >
                      <Typography>{"category"}</Typography>
                    </MenuItem>
                    <MenuItem
                      key={3}
                      value={"other"}
                      label={"other"}
                      disabled={contextActivities.includes("other")}
                      onClick={(event) => {
                        handleAddContextActivity("other");
                      }}
                    >
                      <Typography>{"other"}</Typography>
                    </MenuItem>
                  </Menu>
                </Grid>
              </Paper>
            </>
          ) : (
            <></>
          )}
          <Button
            startIcon={<AddIcon />}
            onClick={(event) => handleAddRegistration()}
            disabled={registration}
          >
            Registration
          </Button>
          <Button
            startIcon={<AddIcon />}
            onClick={(event) => handleAddRevision()}
            disabled={revision}
          >
            Revision
          </Button>
          <Button
            startIcon={<AddIcon />}
            onClick={(event) => handleAddInstructor()}
            disabled={instructor}
          >
            Instructor
          </Button>
          <Button
            startIcon={<AddIcon />}
            onClick={(event) => setTeam((prevState) => !prevState)}
            disabled={team}
          >
            Team
          </Button>
          <Button
            startIcon={<AddIcon />}
            onClick={(event) => handleSetContextExtension()}
            disabled={contextExtension}
          >
            Extension
          </Button>
          <Button
            startIcon={<AddIcon />}
            onClick={(event) => setContextActivity((prevState) => !prevState)}
            disabled={contextActivity}
          >
            Context Activities
          </Button>
        </AccordionDetails>
      </Accordion>

      {result ? (
        <>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ "&:hover": { backgroundColor: "openlapbg.light" } }}
              onClick={() => dispatch(openVisualizationAccordion())}
            >
              <ClearIcon
                fontSize="medium"
                onClick={(event) => handleDeleteResult()}
              />
              <Typography sx={{ pl: 1, fontWeight: "bold" }}>
                result
                <Link
                  sx={{ pl: 2 }}
                  href="https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#result"
                  target="_blank"
                  rel="noreferrer"
                >
                  <OpenInNewIcon />
                </Link>
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              {score ? (
                <>
                  <ClearIcon
                    fontSize="medium"
                    onClick={(event) => handleRemoveScore()}
                  />
                  <Paper sx={{ overflowX: "auto" }}>
                    <Grid>
                      <Typography sx={{ pl: 1, pr: 3, pt: 1, pb: 2 }}>
                        score
                        <Tooltip
                          // <span><br/>raw:  <span/>
                          title={
                            <span>
                              scaled: decimal between -1 and 1<br />
                              raw: decimal between min and max
                              <br />
                              min: decimal less than max (if present)
                              <br />
                              max: decimal greater than min (if present)
                              <br />
                            </span>
                          }
                          arrow
                          placement="right-start"
                        >
                          <IconButton size="small">
                            <HelpIcon />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                    </Grid>
                    <Grid sx={{ pb: 2, pl: 3, pr: 3 }}>
                      {scores.map((score, index) => {
                        return (
                          <>
                            <Paper sx={{ overflowX: "auto" }}>
                              <ClearIcon
                                fontSize="medium"
                                onClick={() => handleDeleteScore(index, score)}
                              />
                              <Property
                                columnDefs={columnDefs}
                                name="result.score"
                                abbr={score}
                              />
                            </Paper>
                            {score == "scaled" ? (
                              <>
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label="generateScaled"
                                  onChange={(event) =>
                                    setGenerateScaled(event.target.checked)
                                  }
                                />
                              </>
                            ) : (
                              <></>
                            )}
                          </>
                        );
                      })}
                      <Button
                        startIcon={<AddIcon />}
                        endIcon={<KeyboardArrowDownIcon />}
                        onClick={(event) =>
                          setOpenAddScoreMenu(event.currentTarget)
                        }
                      >
                        Add Score
                      </Button>
                      <Menu
                        open={Boolean(openAddScoreMenu)}
                        anchorEl={openAddScoreMenu}
                        onClose={() => setOpenAddScoreMenu(null)}
                      >
                        <MenuItem
                          key={0}
                          value={"scaled"}
                          label={"scaled"}
                          disabled={scores.includes("scaled")}
                          onClick={(event) => {
                            handleAddScore("scaled");
                          }}
                        >
                          <Typography>{"scaled"}</Typography>
                        </MenuItem>
                        <MenuItem
                          key={1}
                          value={"raw"}
                          label={"raw"}
                          disabled={scores.includes("raw")}
                          onClick={(event) => {
                            handleAddScore("raw");
                          }}
                        >
                          <Typography>{"raw"}</Typography>
                        </MenuItem>
                        <MenuItem
                          key={2}
                          value={"min"}
                          label={"min"}
                          disabled={scores.includes("min")}
                          onClick={(event) => {
                            handleAddScore("min");
                          }}
                        >
                          <Typography>{"min"}</Typography>
                        </MenuItem>
                        <MenuItem
                          key={3}
                          value={"max"}
                          label={"max"}
                          disabled={scores.includes("max")}
                          onClick={(event) => {
                            handleAddScore("max");
                          }}
                        >
                          <Typography>{"max"}</Typography>
                        </MenuItem>
                      </Menu>
                    </Grid>
                  </Paper>
                </>
              ) : (
                <></>
              )}
              {success ? (
                <>
                  <ClearIcon
                    fontSize="medium"
                    onClick={(event) => handleRemoveSuccess()}
                  />
                  <Property
                    columnDefs={columnDefs}
                    name="result.success"
                    desc="Boolean, e.g. true"
                  />
                </>
              ) : (
                <></>
              )}
              {completion ? (
                <>
                  <ClearIcon
                    fontSize="medium"
                    onClick={(event) => handleRemoveCompletion()}
                  />
                  <Property
                    name="result.completion"
                    desc="Boolean, e.g. true"
                  />
                </>
              ) : (
                <></>
              )}
              {response ? (
                <>
                  <ClearIcon
                    fontSize="medium"
                    onClick={(event) =>
                      handleRemoveResponse((prevState) => !prevState)
                    }
                  />
                  <Property
                    columnDefs={columnDefs}
                    name="result.response"
                    desc="string"
                  />
                </>
              ) : (
                <></>
              )}
              {duration ? (
                <>
                  <ClearIcon
                    fontSize="medium"
                    onClick={(event) =>
                      handleRemoveDuration((prevState) => !prevState)
                    }
                  />
                  <Property
                    columnDefs={columnDefs}
                    name="result.duration"
                    desc="duration according to ISO8601, e.g. PT1234S"
                  />
                </>
              ) : (
                <></>
              )}

              {resultExtension ? (
                <>
                  <ClearIcon
                    fontSize="medium"
                    onClick={(event) => handleRemoveResultExtension()}
                  />

                  <JSONInput
                    id="a_unique_id"
                    placeholder={form.result.extension.json}
                    // colors      = { darktheme }
                    locale={locale}
                    height="100px"
                    onChange={(event) => handleJsonInputResultExtension(event)}
                  />
                </>
              ) : (
                <></>
              )}

              {/* <Paper sx={{ overflowX: "auto", height: 150 }}>
            <Property name="verb.id" />
          </Paper> */}
              <Button
                startIcon={<AddIcon />}
                onClick={(event) => handleSetScore()}
                disabled={score}
              >
                Score
              </Button>
              <Button
                startIcon={<AddIcon />}
                onClick={(event) => handleSetSuccess()}
                disabled={success}
              >
                Success
              </Button>
              <Button
                startIcon={<AddIcon />}
                onClick={(event) => handleSetCompletion()}
                disabled={completion}
              >
                Completion
              </Button>
              <Button
                startIcon={<AddIcon />}
                onClick={(event) => handleSetResponse()}
                disabled={response}
              >
                Response
              </Button>
              <Button
                startIcon={<AddIcon />}
                onClick={(event) => handleSetDuration()}
                disabled={duration}
              >
                Duration
              </Button>
              <Button
                startIcon={<AddIcon />}
                onClick={(event) => handleSetResultExtension()}
                disabled={resultExtension}
              >
                Extension
              </Button>
            </AccordionDetails>
          </Accordion>
        </>
      ) : (
        <></>
      )}

      {timestamp ? (
        <>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ "&:hover": { backgroundColor: "openlapbg.light" } }}
              onClick={() => dispatch(openVisualizationAccordion())}
            >
              <ClearIcon
                fontSize="medium"
                onClick={(event) => handleDeleteTimestamp()}
              />
              <Typography sx={{ pl: 1, fontWeight: "bold" }}>
                timestamp
                <Link
                  sx={{ pl: 2 }}
                  href="https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#timestamp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <OpenInNewIcon />
                </Link>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Property
                columnDefs={columnDefs}
                name="timestamp"
                desc="timestamp according to ISO8601, e.g. 2023-03-01T07:59:21.148Z"
              />
            </AccordionDetails>
          </Accordion>
        </>
      ) : (
        <></>
      )}

      {attachments ? (
        <>
                  <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ "&:hover": { backgroundColor: "openlapbg.light" } }}
              onClick={() => dispatch(openVisualizationAccordion())}
            >
              <ClearIcon
                fontSize="medium"
                onClick={(event) => handleRemoveAttachments()}
              />
              <Typography sx={{ pl: 1, fontWeight: "bold" }}>
                attachments
                <Link
                  sx={{ pl: 2 }}
                  href="https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#attachments"
                  target="_blank"
                  rel="noreferrer"
                >
                  <OpenInNewIcon />
                </Link>
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
       {attachmentArray.map((attachment, index) => {
                return (
                  <>
                    <Paper sx={{ overflowX: "auto", pl: 3, pb: 2 }}>
                      <ClearIcon
                        fontSize="medium"
                        onClick={() => deleteAttachment(index)}
                      />
                      <FormAttachment
                        prefix="attachments"
                        type="attachments"
                        index={index}
                      />
                    </Paper>
                  </>
                );
            })}
                          <Button
                startIcon={<AddIcon />}
                onClick={(event) => addAttachment(attachmentArray.length)}
              >
                Add Attachment
              </Button>
              </AccordionDetails>
          </Accordion>
        </>
      ) : (
        <></>
      )}

      <Button
        startIcon={<AddIcon />}
        onClick={(event) => handleAddId()}
        disabled={result}
      >
        id
      </Button>
      <Button
        startIcon={<AddIcon />}
        onClick={(event) => handleAddResult()}
        disabled={result}
      >
        result
      </Button>
      <Button
        startIcon={<AddIcon />}
        onClick={(event) => handleAddTimestamp()}
        disabled={timestamp}
      >
        timestamp
      </Button>
      <Button
        startIcon={<AddIcon />}
        onClick={(event) => handleAddAttachments()}
        disabled={attachments}
      >
        attachments
      </Button>
    </>
  );
};

export default Form;
