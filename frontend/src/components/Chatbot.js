import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleTranslate = async () => {
    const res = await axios.post('http://localhost:5000/translate', {
      text: input,
      target_lang: 'en'
    });
    setResponse(res.data.translated_text);
  };

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#eee', padding: '10px', borderRadius: '8px' }}>
      <textarea value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={handleTranslate}>Translate</button>
      <div>{response}</div>
    </div>
  );
};

export default Chatbot;
