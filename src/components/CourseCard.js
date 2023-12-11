// CourseCard.js
import React from 'react';
import './CourseCard.css';

function CourseCard({ title, imageUrl, link }) {
  return (
    <div className="course-card">
      <div className="course-image-container">
        <img src={imageUrl} alt={title} />
      </div>
      <h3>{title}</h3>
      <a href={link} className="learn-link">学習</a>
    </div>
  );
}

export default CourseCard;
