import clsx from "clsx";
import { useEffect, useState } from "react";

import { Icon } from "ui/icon/Icon";
import { useLocalStorage } from "hooks/useLocalStorage/useLocalStorage";

import styles from "./ThemeSelector.module.scss";
import { ThemeSelectorProps, Theme } from "./ThemeSelector.types";

const themes: Theme[] = ["fileagent", "fileagent-dark"];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className }) => {
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

  return (
    <div
      className={clsx(className, styles["theme-selector"])}
      onClick={handleOnThemeChange}
      onKeyPress={handleOnThemeChange}
      role="button"
      tabIndex={0}
    >
      <Icon name={theme === "fileagent" ? "icon-sun" : "icon-moon-2"} />
    </div>
  );
};
