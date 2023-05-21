
const checkInputOnValidLengthAndNumberOnly = (input, length) => {
  const result = input.length <= length && !isNaN(input[input.length - 1]);
  console.log('> checkInputOnValidLengthAndNumberOnly:', result);
  return result;
};

const executeMethodWhenTargetInputValid = (target, method, validator, length) => {
  const { value } = target;
  const isValid = validator(value, length);
  if (isValid) {
    if (value.startsWith('0')) {
      target.value = '0';
    }
    method(target.value);
    console.log('> executeMethodWhenTargetInputValid');
  }
  else target.value = value.substring(0, value.length - 1);
  return isValid;
};


export {
  executeMethodWhenTargetInputValid,
  checkInputOnValidLengthAndNumberOnly
};
