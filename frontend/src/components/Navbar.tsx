import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Nav.module.scss";
import { useTheme } from "../context/ThemeContext"; // Import the theme context

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme(); // Get the current theme

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={theme === "dark" ? `${styles.navbarContainer} ${styles.navbarContainerDark}` : styles.navbarContainer}>
      <nav className={theme === "dark" ? `${styles.navbar} ${styles.navbarDark}` : styles.navbar}>
        {/* Main Title */}
        <Link href="/" className={theme === "dark" ? `${styles.title} ${styles.titleDark}` : styles.title}>
          SPEED
        </Link>

        {/* Hamburger Menu for Mobile */}
        <div className={styles.hamburger} onClick={toggleMenu}>
          ☰
        </div>

        {/* Nav Links */}
        <div className={`${styles.navLinks} ${isOpen ? styles.show : ""} ${theme === "dark" ? styles.navLinksDark : ""}`}>
          <NavItem route="/articles/all-articles" darkMode={theme === "dark"}>Articles</NavItem>
          <NavItem route="/articles/create-article" darkMode={theme === "dark"}>New Article</NavItem>
          <NavItem route="/articles/lookup-submission" darkMode={theme === "dark"}>Lookup Submission</NavItem>

          {/* Admin Dashboard */}
          <NavItem route="/admin/dashboard" darkMode={theme === "dark"}>Admin</NavItem>

          {/* Rejected Articles */}
          <NavItem route="/admin/rejected-articles" darkMode={theme === "dark"}>Rejected Articles</NavItem>

          {/* Moderator Dashboard */}
          <NavItem route="/moderator/ModeratorQueue" darkMode={theme === "dark"}>Moderator</NavItem>

          {/* Analyst Dashboard */}
          <NavItem route="/analyst/analyst-dashboard" darkMode={theme === "dark"}>Analyst</NavItem>
        </div>
      </nav>
    </div>
  );
};

// NavItem component
const NavItem = ({
  children,
  route,
  darkMode,
  style,
  onClick,
}: {
  children: React.ReactNode;
  route?: string;
  darkMode?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}) => {
  const router = useRouter();

  const navigate: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (route) {
      router.push(route);
    }
    event.stopPropagation();
  };

  return (
    <div
      style={style}
      className={`${darkMode ? styles.navitemDark : styles.navitem}`}
      onClick={onClick ? onClick : navigate}
    >
      {children}
    </div>
  );
};

export default NavBar;
