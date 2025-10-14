import React, { useState } from 'react';
import axios from 'axios';

const UAPForm = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    state: '', category: '', academic_level: '', field_of_study: ''
  });

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:3001/users/register', formData);
    alert('Profile created!');
  };

  

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <select name="state" onChange={handleChange}>
        <option value="">Select State</option>
        <option value="Tamil Nadu">Tamil Nadu</option>
        <option value="Maharashtra">Maharashtra</option>
        {/* Add all states */}
      </select>
      <select name="category" onChange={handleChange}>
        <option value="">Select Category</option>
        <option value="SC">SC</option>
        <option value="ST">ST</option>
        <option value="OBC">OBC</option>
        <option value="PwD">PwD</option>
        <option value="First-Gen">First-Gen</option>
      </select>
      <input name="academic_level" placeholder="Academic Level" onChange={handleChange} />
      <input name="field_of_study" placeholder="Field of Study" onChange={handleChange} />
      <button type="submit">Create Profile</button>
    </form>
  );
};

export default UAPForm;
