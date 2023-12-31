export type Styles = {
  "main-panel": string;
  "main-panel__container": string;
  "main-panel__container--paddingX": string;
  "main-panel--with-navbar": string;
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
