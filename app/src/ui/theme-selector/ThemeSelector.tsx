import clsx from "clsx";

import { Icon } from "ui/icon/Icon";
import { useThemeContext } from "context/theme/useThemeContext";

import styles from "./ThemeSelector.module.scss";
import { ThemeSelectorProps } from "./ThemeSelector.types";

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className }) => {
  const { theme, handleOnThemeChange } = useThemeContext();

  return (
    <div
      className={clsx(className, styles["theme-selector"])}
      onClick={handleOnThemeChange}
      onKeyPress={handleOnThemeChange}
      role="button"
      tabIndex={0}
    >
      <Icon name={theme === "fileagent" ? "icon-moon-2" : "icon-sun"} />
    </div>
  );
};
