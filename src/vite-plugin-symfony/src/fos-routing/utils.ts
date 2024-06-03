/**
 * Transforms an object into a shell argument.
 * Example: {key: 'value'} => '--key=value'
 * Values don't need to be escaped because node already does that.
 * @param key
 * @param value
 */
function shellArg(key: string, value: any): string {
  key = kebabize(key);
  return typeof value === "boolean" ? (value ? "--" + key : "") : "--" + key + "=" + value;
}

/**
 * Transforms a camelCase string into a kebab-case string.
 * @param str
 */
function kebabize(str: string): string {
  return str
    .split("")
    .map((letter, idx) => {
      return letter.toUpperCase() === letter ? `${idx !== 0 ? "-" : ""}${letter.toLowerCase()}` : letter;
    })
    .join("");
}

/**
 * Transforms an object into an array of shell arguments.
 * Example: {key: 'value'} => ['--key=value']
 * This function is recursive.
 * @param obj
 */
export const objectToArg = (obj: object): string[] => {
  return Object.keys(obj).reduce((pass, key) => {
    const val = obj[key];
    if (!val) {
      return pass;
    }
    if (key === "extraArgs" && typeof val === "object") {
      pass.push(...objectToArg(val));
      return pass;
    }

    if (Array.isArray(val)) {
      pass.push(...val.map((v) => shellArg(key, v)));
    } else {
      pass.push(shellArg(key, val));
    }
    return pass;
  }, []);
};

/**
 * Check if the item is an object.
 * @param item
 */
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
export const deepMerge = (target, source) => {
  let output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output = { ...output, [key]: source[key] };
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output = { ...output, [key]: source[key] };
      }
    });
  }
  return output;
};
