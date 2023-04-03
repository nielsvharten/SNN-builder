const floatRegex = /^-?\d*(\.\d*)?$/;
const floatRegexNonNegative = /^\d*(\.\d*)?$/;
const intRegex = /^-?\d*$/;
const intRegexNonNegative = /^\d*$/;
const floatListRegex = /^\[(-?\d\d*(\.\d*)?,)*(-?\d*(\d\.\d*)?)?\]$/;

function validateFloat(oldValue, newValue, min, max) {
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
