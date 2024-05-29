import {Navigate, Route} from "react-router-dom";
import React from "react";

// Function: Returns a capitalized letter of the first word
export const toFirstLetter = (name) => ((name || "").charAt(0) || "").toUpperCase();

// Function: Returns the first word of a string with the first letter capitalized
export const toFirstCharUppercase = (name) => name.charAt(0).toUpperCase() + name.slice(1);

export const countWords = (str) => {
  str = str.replace(/(^\s*)|(\s*$)/gi, "");
  str = str.replace(/[ ]{2,}/gi, " ");
  str = str.replace(/\n /, "\n");
  return str.split(' ').length;
}

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

export const getRandomColor = () => {
  let letters = '012345'.split('');
  let color = '#';
  color += letters[Math.round(Math.random() * 5)];
  letters = '0123456789ABCDEF'.split('');
  for (let i = 0; i < 5; i++) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}

export const countIndicators = (inputArray) => {
  let hashMap = {};
  for (let indicator of inputArray) {
    if (indicator.type in hashMap) {
      hashMap[indicator.type] = hashMap[indicator.type] + 1;
    } else {
      hashMap[indicator.type] = 1;
    }
  }
  let outputArray = [];
  Object.keys(hashMap).forEach(type => {
    outputArray.push({
      type,
      count: hashMap[type]
    })
  });

  return outputArray;
}

export const color = (letter) =>
  letter === "Basic Indicator" ? "#886F66" : letter === "Composite Indicator" ? "#37845B" : "#DA1F91";

// Function: Creates authorized routes
export function AuthorizedRoute({component: Component, isAuth, ...rest}) {
  return (
    <Route {...rest} render={(props) =>
      isAuth ? <Component {...props} {...rest} />
        : <Navigate to={{pathname: '/login', state: {from: props.location}}}/>}
    />
  )
}

export const camelCase = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "")
    .replace(/[^\w\s]/gi, "");
};

export const cleaningResponseData = (inputData) => {
  const removeSlashes = inputData.replace(/\\|\//g, " ");
  const replaceUnderscores = removeSlashes.replace(/_|\./g, "-");
  const removeSpaces = replaceUnderscores.split(" ");
  const removeEmptyStrings = removeSpaces.filter(Boolean);
  return removeEmptyStrings[removeEmptyStrings.length - 1];
};

export const cleaningTexts = inputData => {
  const removeSlashes = inputData.replace(/\\|\//g, " ");
  const replaceUnderscores = removeSlashes.replace(/_|\./g, " ");
  return replaceUnderscores.charAt(0).toUpperCase() + replaceUnderscores.slice(1);
}

export const getTimeframeArray = function (startDate, endDate) {
  let start = new Date(startDate);
  let end = new Date(endDate);
  let arr = [];
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt).toISOString());
  }
  return arr;
};


