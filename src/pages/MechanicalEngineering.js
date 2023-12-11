import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './MechanicalEngineering.css';

const MechanicalEngineering = () => {
  const words = [
    "Gear", "Bolt", "Shaft", "Lever", "Pulley",
    "Bearing", "Coupling", "Actuator", "Compressor", "Turbine",
    "Kinematics", "Dynamics", "Thermodynamics", "Fluid Mechanics", "Control Systems",
    "Mechatronics", "Nanotechnology", "Biomechanics", "Cryogenics", "Aerodynamics"
  ];
  
  const [selectedChoices, setSelectedChoices] = useState({});
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChoice = (word, choice) => {
    const newChoices = { ...selectedChoices, [word]: choice };
    setSelectedChoices(newChoices);

    const newProgress = Object.keys(newChoices).length;
    const newScore = Object.values(newChoices).reduce((total, current) => {
      if (current === "理解できる") return total + 5;
      if (current === "確信が持てない") return total + 2;
      return total;
    }, 0);

    setScore(newScore);
    setProgress(newProgress);
  };
  
  const handleCalculateSkill = () => {
    navigate('/subjects/mechanical-engineering/results', { state: { score } });
  };

  const progressPercentage = (progress / words.length) * 100;

  return (
    <div className="mechanical-engineering-page">
      <Header />
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="progress-text">進捗: {progress} / {words.length}</div>
      </div>
      {words.map((word, index) => (
        <div key={index} className="word-test">
          <h3>{word}</h3>
          <div className="choice-buttons">
            {["理解できる", "確信が持てない", "よく分からない"].map((choice, idx) => (
              <div
                key={choice}
                className={`choice-button choice-button-${idx + 1} ${selectedChoices[word] === choice ? `selected-${idx + 1}` : ''}`}
                onClick={() => handleChoice(word, choice)}
              >
                <div>{choice}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {progress === words.length && (
        <button className="calculate-skill-button" onClick={handleCalculateSkill}>
          言葉のスキルを計る
        </button>
      )}
    </div>
  );
};

export default MechanicalEngineering;
