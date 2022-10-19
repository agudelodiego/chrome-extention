import React from 'react';

const App = () => {

  console.log('Me estoy ejecutando desde App.js, voy a enviar un mensaje');
  chrome.runtime.sendMessage({
    "message":"check cookies"
  });
  
  return (
    <h1>Hello extensions</h1>
  );
};
export default App;