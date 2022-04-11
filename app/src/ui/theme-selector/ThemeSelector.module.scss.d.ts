export type Styles = {
  "theme-selector": string;
  "theme-selector__wrapper": string;
  "theme-selector__switch": string;
  "theme-selector__switch--active": string;
  "theme-selector__divider": string;
  "z-depth-0": string;
  "z-depth-1": string;
  "z-depth-1-half": string;
  "z-depth-2": string;
  "z-depth-3": string;
  "z-depth-4": string;
  "z-depth-5": string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
