import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './Results.css';

const Results = () => {
  const [showAnimation, setShowAnimation] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { score } = location.state || { score: 0 };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000); // 3秒後にアニメーションを非表示にする

    return () => clearTimeout(timer);
  }, []);

  const percentage = (score / 100) * 100;

  // 「学習する」ボタンのクリックイベントハンドラー
  const handleStudyClick = () => {
    navigate('/subjects/mechanical-engineering/results/recommended-courses', { state: { score } });
  };

  return (
    <div>
      <Header />
      {showAnimation ? (
        <div className="animation-container">
          <img src="/clap-hand-and-lettering-coming-soon-sticker-3.gif" alt="Coming Soon" />
        </div>
      ) : (
        <div className="score-container">
          <h1>あなたのスコア:</h1>
          <div className="score-ring">
            <span className="score-text">{percentage}点</span>
          </div>
          <button onClick={handleStudyClick} className="study-button">学習する</button> {/* ボタンを追加 */}
        </div>
      )}
    </div>
  );
};

export default Results;
