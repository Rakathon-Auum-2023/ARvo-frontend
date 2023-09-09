import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { search } from '../redux/actions';

const PromtInput = () => {

const dispatch = useDispatch();

const [prompt, setPrompt] = useState({});

const handleChange = (event) => {
    const {name, value} = event.target;
    setPrompt({ ...prompt, [name]: value});
}

  return (
    <div className='input-section'>
        <h2 className='left-header'>Describe the design you'd like to create:</h2>

        <form className='promt-form'>
            <textarea name='prompt' className='promt-input' rows="10" cols="30" placeholder='Enter your promt !' onChange={() => [handleChange, dispatch(search())]}/>
            <input className='promt-btn' type='submit' name='submit' value="Create"/>
        </form>
        
    </div>
  )
}

export default PromtInput