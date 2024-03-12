const setToLs = (key: string, value: string) => {
  try {
    const valueString = JSON.stringify(value);
    localStorage.setItem(key, valueString);
  } catch (e) {
    return e;
  }
};

const removeFromLs = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    return e;
  }
};

const getFromLs = (key: string) => {
  try {
    const value = localStorage.getItem(key);
    if (value === null) {
      return undefined;
    }
    return JSON.parse(value);
  } catch (error) {
    console.error(`Error reading from local storage: ${error}`);
    return undefined;
  }
};

export default { setToLs, getFromLs, removeFromLs };
