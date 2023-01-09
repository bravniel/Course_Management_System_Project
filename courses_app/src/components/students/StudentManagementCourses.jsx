import React from 'react';

import {SiCoursera} from 'react-icons/si';
import { useNavigate } from 'react-router-dom';

const CoursesStudent = () => {
  const navigate = useNavigate();

    return (

                <div className='request-container'>
                <SiCoursera className='svg' onClick={()=>{navigate("/student/courses")}}/>
                <p>Courses</p>
            </div>

    );
};

export default CoursesStudent;