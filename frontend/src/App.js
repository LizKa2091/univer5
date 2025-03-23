import React, { useState } from 'react';
function App() {
   const [registerUsername, setRegisterUsername] = useState('');
   const [registerPassword, setRegisterPassword] = useState('');
   const [loginUsername, setLoginUsername] = useState('');
   const [loginPassword, setLoginPassword] = useState('');
   const [jwtToken, setJwtToken] = useState('');
   const [result, setResult] = useState('');

   const backendUrl = 'http://localhost:3000';

   const handleRegister = async (e) => {
      e.preventDefault();
      try {
         const response = await fetch(`${backendUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: registerUsername, password: registerPassword })
         });

         const data = await response.json();

         if (response.ok) setResult(data.message);

         else setResult(data.error);
      } 
      catch (error) {
         setResult('Ошибка регистрации');
      }
   };

   const handleLogin = async (e) => {
      e.preventDefault();
      try {
         const response = await fetch(`${backendUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: loginUsername, password: loginPassword })
         });

         const data = await response.json();

         if (response.ok) {
            setJwtToken(data.token);
            setResult('Успешная авторизация');
         } 
         else setResult(data.error);
      } 
      catch (error) {
         setResult('Ошибка входа');
      }
   };

   const handleFetchProtected = async () => {
      try {
         const response = await fetch(`${backendUrl}/protected`, {
            headers: { 'Authorization': `Bearer ${jwtToken}` }
         });

         const data = await response.json();

         if (response.ok) setResult(data.data);
         else setResult(data.error || 'Ошибка доступа к защищенным данным');
      } 
      catch (error) {
         setResult('Ошибка при запросе защищенных данных');
      }
   };
   
   return (
      <div style={{ padding: '20px' }}>
         <h2>Регистрация</h2>
         <form onSubmit={handleRegister}>
            <input
               type="text"
               placeholder="Имя пользователя"
               value={registerUsername}
               onChange={(e) => setRegisterUsername(e.target.value)}
               required
            />
            <br />
            <input
               type="password"
               placeholder="Пароль"
               value={registerPassword}
               onChange={(e) => setRegisterPassword(e.target.value)}
               required
            />
            <br />
            <button type="submit">Зарегистрироваться</button>
         </form>
         <h2>Вход</h2>
         <form onSubmit={handleLogin}>
            <input
               type="text"
               placeholder="Имя пользователя"
               value={loginUsername}
               onChange={(e) => setLoginUsername(e.target.value)}
               required
            />
            <br />
            <input
               type="password"
               placeholder="Пароль"
               value={loginPassword}
               onChange={(e) => setLoginPassword(e.target.value)}
               required
            />
            <br />
            <button type="submit">Войти</button>
         </form>
         <h2>Доступ к защищенным данным</h2>
         <button onClick={handleFetchProtected}>Получить данные</button>
         <h3>Результат:</h3>
         <div>{result}</div>
      </div>
   );
};

export default App;