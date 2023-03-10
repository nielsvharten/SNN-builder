import React from "react";

function validateFloat(oldValue, newValue) {
  const valid = /^-?\d*(\.\d*)?$/.test(newValue);
  if (valid) {
    return newValue;
  } else {
    return oldValue;
  }
}

function validateInt(oldValue, newValue) {
  const valid = /^-?\d*$/.test(newValue);
  if (valid) {
    return newValue;
  } else {
    return oldValue;
  }
}

function validateFloatList(oldValue, newValue) {
  console.log(newValue);
  const valid = /^\[(-?\d*(\.\d*)?\,)*(-?\d*(\.\d*)?)?\]$/.test(newValue);
  if (valid) {
    return newValue;
  } else {
    return oldValue;
  }
}

function InputValidator(option, oldValue, newValue) {
  switch (option.type) {
    case "float":
      return validateFloat(oldValue, newValue);
    case "int":
      return validateInt(oldValue, newValue);
    case "bool":
      return newValue;
    case "float-list":
      return validateFloatList(oldValue, newValue);
    default:
      return "";
  }
}

export default InputValidator;
