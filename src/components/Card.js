import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

function Card({ title, to, style }) { // style プロパティを受け取るように変更
  // グラデーションを含むカードスタイルの定義
  const cardStyle = {
    ...style, // 渡されたスタイルを適用
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: '16px',
    textDecoration: 'none',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
  };

  return (
    <Link to={to} style={cardStyle} className="card">
      <h3>{title}</h3>
    </Link>
  );
}

export default Card;
