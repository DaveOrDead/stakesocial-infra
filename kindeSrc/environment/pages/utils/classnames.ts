const hasOwn = {}.hasOwnProperty;

export default function cx() {
  let classes = "";

  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i];
    if (arg) {
      classes = appendClass(classes, parseValue(arg));
    }
  }

  return classes;
}

function parseValue(arg) {
  if (typeof arg === "string") {
    return arg;
  }

  if (typeof arg !== "object") {
    return "";
  }

  if (Array.isArray(arg)) {
    return cx.apply(null, arg);
  }

  if (
    arg.toString !== Object.prototype.toString &&
    !arg.toString.toString().includes("[native code]")
  ) {
    return arg.toString();
  }

  let classes = "";

  for (const key in arg) {
    if (hasOwn.call(arg, key) && arg[key]) {
      classes = appendClass(classes, key);
    }
  }

  return classes;
}

function appendClass(value, newClass) {
  if (!newClass) {
    return value;
  }

  return value ? value + " " + newClass : newClass;
}
