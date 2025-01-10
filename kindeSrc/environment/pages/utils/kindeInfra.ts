const getAssetUrl = (assetPath, orgCode) => {
  return `/${assetPath}?${orgCode ? `p_org_code=${orgCode}&` : ""}cache=@8973ff883c2c40e1bad198b543e12b24@`;
};

export const setKindeDesignerCustomProperties = ({
  baseBackgroundColor,
  baseLinkColor,
  buttonBorderRadius,
  primaryButtonBackgroundColor,
  primaryButtonColor,
  cardBorderRadius,
  inputBorderRadius,
}) => {
  return `
        ${baseBackgroundColor ? `--kinde-designer-base-background-color: ${baseBackgroundColor};` : ""}
        ${baseLinkColor ? `--kinde-designer-base-link-color: $${baseLinkColor};` : ""}
        ${cardBorderRadius ? `--kinde-designer-card-border-radius: ${cardBorderRadius};` : ""}
        ${buttonBorderRadius ? `--kinde-designer-button-border-radius: ${buttonBorderRadius};` : ""}
        ${inputBorderRadius ? `--kinde-designer-control-select-text-border-radius: ${inputBorderRadius};` : ""}
        ${primaryButtonBackgroundColor ? `--kinde-designer-button-primary-background-color: ${primaryButtonBackgroundColor};` : ""}
        ${primaryButtonColor ? `--kinde-designer-button-primary-color: ${primaryButtonColor};` : ""}
        `;
};

export const getLogoUrl = (orgCode) => {
  return getAssetUrl("logo", orgCode);
};

export const getDarkModeLogoUrl = ({ isDarkVariant, orgCode }) => {
  return getAssetUrl("logo_dark", orgCode);
};

export const getSVGFavicon = (orgCode) => {
  return getAssetUrl("favicon_svg", orgCode);
};

export const getFallbackFavicon = (orgCode) => {
  return getAssetUrl("favicon_fallback", orgCode);
};
