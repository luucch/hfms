export const notEmpty = (
  target: { [key: string]: string },
  key: string,
): boolean => {
  return !!target[key] && target[key].length > 0;
};

export const isInt = (str: string | number): boolean => {
  const regex = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
  return regex.test(str.toString());
};
