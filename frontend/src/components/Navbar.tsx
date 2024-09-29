import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoMdArrowDropdown } from "react-icons/io";
import styles from "../styles/Nav.module.scss";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.navbar}>
        {/* Main Title */}
        <Link href="/" className={styles.title}>
          SPEED
        </Link>

        {/* Hamburger Menu for Mobile */}
        <div className={styles.hamburger} onClick={toggleMenu}>
          ☰
        </div>

        {/* Nav Links */}
        <div className={`${styles.navLinks} ${isOpen ? styles.show : ""}`}>
          <NavItem route="/articles/all-articles">All Articles</NavItem>
          <NavItem route="/articles/create-article">Create New Article</NavItem>
          <NavItem route="/articles/lookup-submission">Lookup Submission</NavItem>

          {/* Admin Dropdown */}
          <div className={styles.adminDropdown}>
            <NavItem dropdown>
              Admin <IoMdArrowDropdown />
            </NavItem>
            <div className={styles.adminDropdownContent}>
              <NavItem route="/admin/dashboard">Dashboard</NavItem>
              <NavItem route="/admin/rejected-articles">Rejected Articles</NavItem>
            </div>
          </div>

          {/* Moderator Dashboard */}
          <NavItem route="/moderator/moderator-dashboard">Moderator Dashboard</NavItem>

          {/* Analyst Dashboard */}
          <NavItem route="/analyst/analyst-dashboard">Analyst Dashboard</NavItem>

          {/* Search */}
          <NavItem route="/search/search-results">Search</NavItem>
        </div>
      </nav>
    </div>
  );
};

// NavItem component
const NavItem = ({
  children,
  route,
  dropdown,
  style,
  onClick,
}: {
  children: React.ReactNode;
  route?: string;
  dropdown?: boolean;
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
      className={`${styles.navitem} ${dropdown ? styles.dropdown : ""}`}
      onClick={onClick ? onClick : navigate}
    >
      {children}
    </div>
  );
};

export default NavBar;
