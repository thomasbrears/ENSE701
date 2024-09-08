import React, { useState } from "react";
import Link from "next/link";
import styles from "../../styles/Nav.module.scss";

type Props = {
  children?: React.ReactNode;
};

const NavBar = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.title}>
          SPEED
        </Link>
        <div className={styles.hamburger} onClick={toggleMenu}>
          ☰
        </div>
        <div className={`${styles.navLinks} ${isOpen ? styles.show : ""}`}>
          <Link href="/articles" className={styles.navitem}>
            All Articles
          </Link>
          <Link href="/articles/new" className={styles.navitem}>
            New Article
          </Link>
          <div className={styles.adminDropdown}>
            <Link href="#" className={styles.navitem}>
              Admin
            </Link>
            <div className={styles.adminDropdownContent}>
              <Link href="/admin/dashboard">Dashboard</Link>
              <Link href="/admin/settings">Settings</Link>
            </div>
          </div>
        </div>
        {children}
      </nav>
    </div>
  );
};

export default NavBar;
