import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import CourseCard from '../components/CourseCard'; // Import the CourseCard component
import './RecommendedCourses.css';

function RecommendedCourses() {
  const location = useLocation();
  const { score } = location.state || { score: 0 };

  const courses = {
    introductory: [
      { title: 'Introduction to Mechanical Engineering Jargon', imageUrl: '/course1.gif' },
      { title: 'Mathematical and Physical Foundations Terminology', imageUrl: '/course2.gif' },
      { title: 'Computer-Aided Design (CAD) Lingo', imageUrl: '/course3.gif' },
      { title: 'Statics and Dynamics Vocabulary', imageUrl: '/course4.gif' },
      { title: 'Materials and Manufacturing Nomenclature', imageUrl: '/course5.gif' },
    ],
    intermediate: [
      { title: 'Fluid Mechanics Language Mastery', imageUrl: '/course1.gif' },
      { title: 'Thermodynamics Lexical Advancements', imageUrl: '/course2.gif' },
      { title: 'Machine Design and Components Discourse', imageUrl: '/course3.gif' },
      { title: 'Heat Transfer Lexicon Enhancement', imageUrl: '/course4.gif' },
      { title: 'Mechanical Vibrations Terminology Refinement', imageUrl: '/course5.gif' },
    ],
    advanced: [
      { title: 'Control Systems Terminology Mastery', imageUrl: '/course1.gif' },
      { title: 'Finite Element Analysis (FEA) Lexical Proficiency', imageUrl: '/course2.gif' },
      { title: 'Advanced Materials and Composite Structures Jargon', imageUrl: '/course3.gif' },
      { title: 'Advanced Dynamics Linguistic Precision', imageUrl: '/course4.gif' },
      { title: 'Robotics and Automation Language Mastery', imageUrl: '/course5.gif' },
    ],
    upperAdvanced: [
      { title: 'Advanced Thermofluids Lexical Finesse', imageUrl: '/course1.gif' },
      { title: 'Renewable Energy Systems Vocabulary Mastery', imageUrl: '/course2.gif' },
      { title: 'Advanced Manufacturing Technologies Linguistic Precision', imageUrl: '/course3.gif' },
      { title: 'Engineering Ethics and Professional Practice Articulation', imageUrl: '/course4.gif' },
      { title: 'Research Methods in Mechanical Engineering Linguistic Mastery', imageUrl: '/course5.gif' },
    ],
    nearNative: [
      { title: 'Advanced Robotics and AI Integration Verbal Prowess', imageUrl: '/course1.gif' },
      { title: 'Advanced Computational Fluid Dynamics (CFD) Linguistic Expertise', imageUrl: '/course2.gif' },
      { title: 'Leadership and Project Management Articulate Expression', imageUrl: '/course3.gif' },
      { title: 'Innovations in Product Design Articulation', imageUrl: '/course4.gif' },
      { title: 'Global Perspectives in Engineering Linguistic Insight', imageUrl: '/course5.gif' },
    ],
  };
  

  const renderCourses = (courseList) => {
    return (
      <div className="courses-list">
        {courseList.map((course, index) => (
          <div className="course-card-wrapper" key={index}>
            <CourseCard
              title={course.title}
              imageUrl={`${process.env.PUBLIC_URL}${course.imageUrl}`}
              link="#" // Replace with actual link
            />
          </div>
        ))}
      </div>
    );
  };

  const renderContentBasedOnScore = (score) => {
    if (score >= 0 && score <= 20) {
      return (
        <>
          <h3>Introductory Level</h3>
          <div className="courses-list">
            {renderCourses(courses.introductory)}
          </div>
        </>
      );
    } else if (score > 20 && score <= 40) {
      return (
        <>
          <h3>Intermediate Level</h3>
          <div className="courses-list">
            {renderCourses(courses.intermediate)}
          </div>
        </>
      );
    }else if (score > 40 && score <= 60) {
      return (
        <>
          <h3>Advanced Level</h3>
          <div className="courses-list">
            {renderCourses(courses.advanced)}
          </div>
        </>
      );
    }
    else if (score > 60 && score <= 80) {
      return (
        <>
          <h3>UpperAdvanced Level</h3>
          <div className="courses-list">
            {renderCourses(courses.upperAdvanced)}
          </div>
        </>
      );
    }
    else if (score > 80 && score <= 100) {
      return (
        <>
          <h3>NearNative Level</h3>
          <div className="courses-list">
            {renderCourses(courses.nearNative)}
          </div>
        </>
      );
    }
    // ... similar rendering logic for other levels
    else {
      return <div>適切なコースが見つかりませんでした。</div>;
    }
  };

  return (
    <>
      <Header />
      <div className="recommended-courses-container">
        <h2>おすすめのコース</h2>
        {renderContentBasedOnScore(score)}
      </div>
    </>
  );
}

export default RecommendedCourses;
