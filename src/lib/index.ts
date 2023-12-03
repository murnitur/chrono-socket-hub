export default class Helper {
  static isJSON = (data: any) => {
    try {
      JSON.parse(typeof data === "string" ? data : JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  };

  static isArrayOfStrings = (data: any) => {
    if (Array.isArray(data)) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (typeof element !== "string") {
          return false;
        }
      }
      return true;
    }
    return false;
  };
}
