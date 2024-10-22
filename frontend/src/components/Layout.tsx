import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import styles from "../styles/Layout.module.scss";
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
      
      {/* removed old toggle button that used to be here */}
      <main className={styles.mainContent}>{children}</main>
      
      <Footer />
    </div>
  );
};

export default Layout;
