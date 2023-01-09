import React from 'react';
import CoursesProfessor from './ProfessorManagementCourses';
import EditProfessor from './ProfessorManagementProfile';
import ProfessorStudents from './ProfessorManagementStudents';

const ProfessorHomePage = () =>{
    return (
        
        <div className="home">
            <EditProfessor />
            <CoursesProfessor />
            <ProfessorStudents />
    </div>
    );
};

export default ProfessorHomePage;