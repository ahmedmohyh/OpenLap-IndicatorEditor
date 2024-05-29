import axios from "axios";
import { indicatorResponseToQueryWrapper } from "./ruleEngine/ruleGenerator";
import parse from "html-react-parser";
import Swal from 'sweetalert2';

export const lrs_id = import.meta.env.VITE_APP_LRS_ID;
export const org_id = import.meta.env.VITE_APP_ORG_ID;

export const Backend = axios.create({
  baseURL: import.meta.env.VITE_ANALYTICS_FRAMEWORK_URL,
  responseType: "json",
  headers: {
    'Authorization': localStorage.getItem('userToken')?'Bearer ' + localStorage.getItem('userToken'):''
  }
});

export const LearningLockerBackend = axios.create({
  baseURL: import.meta.env.VITE_LEARNING_LOCKER_URL,
  responseType: "json",
});

export const sendXAPI = async (data, key) => {
  LearningLockerBackend.defaults.headers.common[
    "Authorization"
  ] = `Basic ${key}`;
  LearningLockerBackend.defaults.headers.common[
    "X-Experience-API-Version"
  ] = `1.0.0`;
  try {
    const response = await LearningLockerBackend.post(
      "/data/xAPI/statements",
      data
    );
    // console.log(response);
    alert("Data successfully sent to Learning Locker");
  } catch (error) {
    alert(error);
    throw error;
  }
};

const handleErrorResponse = (data) => {
  Swal.fire({
    title: `${data.code} Error`,
    text: `${data.message}`,
    icon: 'error',
    confirmButtonText: 'Ok'
  }).then(() => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('openlapUser')
    sessionStorage.clear();
    window.location.href = '/sign-in'
  })
}

Backend.interceptors.response.use(
  function(response) {
    if(response.response && response.response.data.code !== 401){
      handleErrorResponse(response.response.data);
    }
    return response;
  },
  function(error){
    if(error.response && error.response.data && error.response.data.code === 401 ){
      handleErrorResponse(error.response.data);
    }
    return Promise.reject(error);
  }
);

export const signIn = async (data) => {
  const response = await Backend.post("/AnalyticsEngine/UserLogin", {
    email: data.email,
    password: data.password,
  });
  sessionStorage.setItem("userToken", response.data.token);
  sessionStorage.setItem("openlapUser", JSON.stringify(response.data.user));
  localStorage.setItem("userToken", response.data.token);
  localStorage.setItem("openlapUser", JSON.stringify(response.data.user))
};

export const signUp = async (data) => {
  await Backend.post("/AnalyticsEngine/UserRegistration", {
    email: data.email,
    password: data.password,
    firstname: data.firstname,
    lastname: data.lastname,
  });
};

export const showVisualization = async (indicator) => {
  try {
    let vizQuery = indicatorResponseToQueryWrapper(indicator);
    console.log("VIZQUERY ", vizQuery);
    let postUrl = "/AnalyticsEngine/GetIndicatorPreview"
    if (indicator.indicatorType === "Basic Indicator") {
      postUrl = "/AnalyticsEngine/GetIndicatorPreview"
    }
    if (indicator.indicatorType === "composite") {
      postUrl = "/AnalyticsEngine/GetCompositeIndicatorPreview"
    }
    if (indicator.indicatorType === "multianalysis") {
      postUrl = "/AnalyticsEngine/GetMLAIIndicatorPreview"
    }
    const response = await Backend.post(
      postUrl,
      vizQuery
    );
    const {
      data: { visualizationCode },
    } = response;
    let objectData = parse(decodeURIComponent(visualizationCode));
    let scriptData = objectData[1].props.dangerouslySetInnerHTML.__html;
    return { name: indicator.name, objectData, scriptData };
  } catch (e) {
    console.log("Error: ", e);
  }
};
