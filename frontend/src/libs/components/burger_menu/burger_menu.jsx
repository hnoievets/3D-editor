import { useState } from 'react';
import styles from './styles.module.css';
import { NavLink } from 'react-router-dom';
import { Route } from '../../../../../shared/constants/route';

function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.burgerContainer}>
      <div
        className={`${styles.burgerMenu} ${isOpen ? styles.open : ''}`}
        onClick={toggleMenu}
      >
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
      </div>
      {isOpen && (
        <nav className={styles.menu}>
          <NavLink to={Route.PROJECTS}>Home</NavLink>
        </nav>
      )}
    </div>
  );
}

export default BurgerMenu;
