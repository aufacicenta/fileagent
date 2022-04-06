import { useEffect, useState } from "react";

import { Button } from "ui/button/Button";
import { Icon } from "ui/icon/Icon";
import { useLocalStorage } from "hooks/useLocalStorage/useLocalStorage";

import { ThemeSelectorProps, Theme } from "./ThemeSelector.types";

export const ThemeSelector: React.FC<ThemeSelectorProps> = () => {
  const localStorage = useLocalStorage();
  const [theme, setTheme] = useState<Theme>("dark");

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
    const newTheme = theme === "dark" ? "light" : "dark";
    localStorage.set("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <Button variant="gradient" color="secondary" onClick={handleOnThemeChange}>
      {theme === "light" ? <Icon name="icon-moon" /> : <Icon name="icon-sun" />}
    </Button>
  );
};
