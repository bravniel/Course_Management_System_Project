import React, { useState } from 'react';

import {SiCoursera} from 'react-icons/si';
import { useNavigate } from 'react-router-dom';

const CoursesProfessor = () => {
  const navigate = useNavigate();

    return (

                <div className='request-container'>
                <SiCoursera className='svg' onClick={()=>{navigate("/professor/courses")}}/>
                <p>Courses</p>
            </div>

    );
};

export default CoursesProfessor;