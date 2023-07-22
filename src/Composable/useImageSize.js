export const calculateImageSize = (base64Str, unit) => {
  const byteLength = (base64Str.length * 3) / 4;

  switch (unit) {
    case "k":
      return (byteLength / 1024).toFixed(2);
    case "m":
      return (byteLength / 1024 / 1024).toFixed(2);
    default:
      return byteLength.toFixed(2);
  }
};
