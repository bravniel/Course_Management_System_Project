import React, { useState } from 'react';

import { FaUserCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProfessorStudents = () => {
  const navigate = useNavigate();

    return (

                <div className='request-container'>
                <FaUserCog className='svg' onClick={()=>{navigate("/professor/students")}}/>
                <p>Manage Students</p>
            </div>

    );
};

export default ProfessorStudents;