import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Token URL se pakdo agar admin redirect ho ke aaya hai
const params = new URLSearchParams(window.location.search);
const urlToken = params.get("token");
if (urlToken) {
  sessionStorage.setItem("token", urlToken);
  window.history.replaceState({}, "", "/dashboard");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
