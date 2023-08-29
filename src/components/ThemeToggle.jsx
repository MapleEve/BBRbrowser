import { Switch } from "antd";
import { BsSun, BsMoon } from "react-icons/bs";

const ThemeToggle = ({ themeMode, toggleTheme }) => {
  const isDarkTheme = themeMode.toLowerCase() === "dark";
  return (
    <Switch
      id="themeToggle"
      checked={isDarkTheme}
      onChange={toggleTheme}
      checkedChildren={<BsMoon />}
      unCheckedChildren={<BsSun />}
    />
  );
};

export default ThemeToggle;
