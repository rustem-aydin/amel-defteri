// helpers/getDeedHeaderImage.ts
export const getDeedHeaderImage = (type: string) => {
  if (type === "FARZ") {
    // Return the required asset, not a string
    return require("@/assets/images/farz.jpg");
  }
  if (type === "VACİP") {
    // Return the required asset, not a string
    return require("@/assets/images/farz.jpg");
  }
  if (type === "SÜNNET") {
    return require("@/assets/images/sunnet.jpg");
  }
  return require("@/assets/images/sunnet.jpg");
};
