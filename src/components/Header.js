import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../brand-icon.png'; // Adjust the path as necessary

const Header = memo(() => {
  return (
    <header className="header">
      <Link to="/subjects" className="header-logo">
        <img src={logo} alt="Brand" />
      </Link>
      <nav className="header-nav">
        <ul>
          <li><Link to="/dictionary">Dictionary</Link></li>
          <li><Link to="/deploynment">Profile</Link></li>
          {/* 他のナビゲーション項目 */}
        </ul>
      </nav>
    </header>
  );
});

export default Header;
