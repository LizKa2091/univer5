import React, { useState } from 'react';

function App() {
   const [registerEmail, setRegisterEmail] = useState('');
   const [registerPassword, setRegisterPassword] = useState('');
   const [loginEmail, setLoginEmail] = useState('');
   const [loginPassword, setLoginPassword] = useState('');
   const [result, setResult] = useState('');
   const backendUrl = 'http://localhost:3000';

   const handleRegister = async (e) => {
      e.preventDefault();
      try {
         const response = await fetch(`${backendUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: registerEmail, password: registerPassword })
         });

         const data = await response.json();

         if (response.ok) setResult(data.message);

         else setResult(`ошибка: ${data.error}`);
      } 
      catch (error) {
         setResult(`ошибка регистрации: ${error}`);
      }
   };

   const handleLogin = async (e) => {
      e.preventDefault();
      try {
         const response = await fetch(`${backendUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: loginEmail, password: loginPassword })
         });

         const data = await response.json();

         if (response.ok) {
            localStorage.setItem('token', data.token);
            setResult('успешная авторизация');
         } 
         else {
            setResult(`ошибка: ${data.error}`);
         }
      } 
      catch (error) {
         setResult(`ошибка входа: ${error}`);
      }
   };
   const handleFetchProtected = async () => {
      try {
         const token = localStorage.getItem('token');

         const response = await fetch(`${backendUrl}/protected`, {
            headers: { 'Authorization': `Bearer ${token}` }
         });

         const data = await response.json();

         if (response.ok) setResult(data.data);

         else setResult(`ошибка: ${data.error}` || 'ошибка доступа к защищенным данным');
      } 
      catch (error) {
         setResult(`ошибка: ${error}`);
      }
   };
   return (
      <div style={{ border: '1px solid black', borderRadius: '16px', backgroundColor: 'wheat', padding: 25, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
         <h3>Регистрация</h3>
         <form onSubmit={handleRegister}>
            <input
               type="email"
               placeholder="почта"
               value={registerEmail}
               onChange={(e) => setRegisterEmail(e.target.value)}
               required
            />
            <br />
            <input
               type="password"
               placeholder="пароль"
               value={registerPassword}
               onChange={(e) => setRegisterPassword(e.target.value)}
               required
            />
            <br />
            <button type="submit">Зарегистрироваться</button>
         </form>
         <h3>Вход</h3>
         <form onSubmit={handleLogin}>
            <input
               type="email"
               placeholder="почта"
               value={loginEmail}
               onChange={(e) => setLoginEmail(e.target.value)}
               required
            />
            <br />
            <input
               type="password"
               placeholder="пароль"
               value={loginPassword}
               onChange={(e) => setLoginPassword(e.target.value)}
               required
            />
            <br />
            <button type="submit">Войти</button>
         </form>
         <h5>Доступ к защищенным данным</h5>
         <button onClick={handleFetchProtected}>Получить данные</button>
         <h5>Результат:</h5>
         <div>{result}</div>
      </div>
   );
};
export default App;