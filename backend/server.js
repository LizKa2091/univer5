const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(cors());
app.use(bodyParser.json());

const users = [];

function authenticateToken(req, res, next) {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];

   if (!token) {
      return res.status(401).json({ error: 'Нет токена.' });
   }

   jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ error: 'Недействительный токен.' });
      req.user = user;
      next();
   });
}

app.post('/register', (req, res) => {
   const { username, password } = req.body;
   const userExists = users.find(u => u.username === username);

   if (userExists) {
      return res.status(400).json({ error: 'Пользователь уже существует.' });
   }

   users.push({ username, password });
   res.json({ message: 'Регистрация прошла успешно.' });
});

app.post('/login', (req, res) => {
   const { username, password } = req.body;
   const user = users.find(u => u.username === username && u.password === password);

   if (!user) {
      return res.status(401).json({ error: 'Неверные учетные данные.' });
   }

   const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
   res.json({ token });
});

app.get('/protected', authenticateToken, (req, res) => {
   res.json({ data: `Привет, ${req.user.username}! Это защищенные данные.` });
});

app.listen(PORT, () => {
   console.log(`Сервер запущен на порту ${PORT}`);
});