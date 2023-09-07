import React, { useEffect, useState } from "react";

import { useLocalStorage } from "hooks/useLocalStorage/useLocalStorage";
import { Theme } from "ui/theme-selector/ThemeSelector.types";

import { ThemeContext } from "./ThemeContext";
import { ThemeContextControllerProps } from "./ThemeContext.types";

const themes: Theme[] = ["fileagent", "fileagent-dark"];

export const ThemeContextController = ({ children }: ThemeContextControllerProps) => {
  const [theme, setTheme] = useState<Theme>("fileagent");

  const localStorage = useLocalStorage();

  useEffect(() => {
    const localTheme = localStorage.get<Theme>("theme");

    if (!localTheme) {
      localStorage.set("theme", theme);

      document.body.dataset.theme = theme;

      return;
    }

    document.body.dataset.theme = localTheme;

    setTheme(localTheme);
  }, [localStorage, theme]);

  const handleOnThemeChange = () => {
    const currentThemeIndex = themes.indexOf(theme);

    const newTheme = themes[currentThemeIndex + 1] ? themes[currentThemeIndex + 1] : themes[0];

    setTheme(newTheme);

    localStorage.set("theme", newTheme);
  };

  const props = {
    handleOnThemeChange,
    theme,
  };

  return <ThemeContext.Provider value={props}>{children}</ThemeContext.Provider>;
};
