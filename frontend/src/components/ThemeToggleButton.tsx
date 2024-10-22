import { useTheme } from "../context/ThemeContext";

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme(); 

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: "0.5em 1em",
        backgroundColor: theme === "dark" ? "#FFF" : "#333",
        color: theme === "dark" ? "#333" : "#FFF",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        height: "100%", 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {theme === "dark" ? "Light" : "Dark"} Mode
    </button>
  );
};

export default ThemeToggleButton;
