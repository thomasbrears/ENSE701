import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import styles from "../styles/Layout.module.scss";
import ThemeToggleButton from "./ThemeToggleButton";
import { useTheme } from "../context/ThemeContext"; 

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();

  // applying theme class to body
  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-mode" : "";
  }, [theme]);

  return (
    <div className={styles.container}>
      <Navbar />
      
      {/* Dark Mode Toggle Button*/}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
        <ThemeToggleButton />
      </div>

      <main className={styles.mainContent}>{children}</main>
      
      <Footer />
    </div>
  );
};

export default Layout;
