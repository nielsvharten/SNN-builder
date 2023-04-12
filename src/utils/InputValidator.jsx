const INFINITY = "\u221E";

function validateFloat(oldValue, newValue, min, max) {
  // accept (-)Inf when min/max are not defined
  if (newValue === INFINITY && max === null) return newValue;
  if (newValue === "-" + INFINITY && min === null) return newValue;

  const floatRegex = /^-?\d*(\.\d*)?$/;
  const floatRegexNonNegative = /^\d*(\.\d*)?$/;

  const valid =
    min !== null && min >= 0
      ? floatRegexNonNegative.test(newValue)
      : floatRegex.test(newValue);
  if (!valid) {
    return oldValue;
  }

  const value = parseFloat(newValue);
  if (min !== null && min > value) return oldValue;
  if (max !== null && max < value) return oldValue;

  return newValue;
}

function validateInt(oldValue, newValue, min, max) {
  // accept (-)Inf when min/max are not defined
  if (newValue === INFINITY && max === null) return newValue;
  if (newValue === "-" + INFINITY && min === null) return newValue;

  const intRegex = /^-?\d*$/;
  const intRegexNonNegative = /^\d*$/;

  const valid =
    min !== null && min >= 0
      ? intRegexNonNegative.test(newValue)
      : intRegex.test(newValue);
  if (!valid) {
    return oldValue;
  }

  const value = parseInt(newValue);
  if (min !== null && min > value) return oldValue;
  if (max !== null && max < value) return oldValue;

  return newValue;
}

function validateFloatList(oldValue, newValue) {
  const floatListRegex =
    /^\[(-?(\d\d*(\.\d*)?|\u221E),)*(-?(\d*(\d\.\d*)?|\u221E))?\]$/;

  const valid = floatListRegex.test(newValue);
  if (valid) {
    return newValue;
  } else {
    return oldValue;
  }
}

function InputValidator(type, oldValue, newValue, min = null, max = null) {
  switch (type) {
    case "float":
      return validateFloat(oldValue, newValue, min, max);
    case "int":
      return validateInt(oldValue, newValue, min, max);
    case "bool": // always valid
      return newValue;
    case "float-list":
      return validateFloatList(oldValue, newValue);
    default:
      return "";
  }
}

export default InputValidator;
