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
        position: "absolute",      //just placed it to overlap the navbar, was having issues
        top: "27px",            
        right: "30px",        
        zIndex: 1000,           
      }}
    >
      {theme === "dark" ? "Light" : "Dark"} Mode
    </button>
  );
};

export default ThemeToggleButton;
