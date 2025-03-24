require('dotenv').config();
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
      return res.status(401).json({ error: 'нет токена' });
   }

   jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ error: 'недействительный токен' });
      req.user = user;
      next();
   });
}

app.post('/register', (req, res) => {
   const { email, password } = req.body;
   const userExists = users.find(u => u.email === email);

   if (userExists) {
      return res.status(400).json({ error: 'пользователь уже существует' });
   }

   users.push({ email, password });
   res.json({ message: 'регистрация прошла успешно' });
});

app.post('/login', (req, res) => {
   const { email, password } = req.body;
   const user = users.find(u => u.email === email && u.password === password);

   if (!user) {
      return res.status(401).json({ error: 'неверные учетные данные' });
   }

   const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
   res.json({ token });
});

app.get('/protected', authenticateToken, (req, res) => {
   const user = users.find(u => u.email === req.user.email);
   if (!user) {
      return res.status(404).json({ error: 'пользователь не найден' });
   }
   res.json({ data: `ку, почта: ${user.email}, пароль: ${user.password}` })
});

app.listen(PORT, () => {
   console.log(`Сервер запущен на порту ${PORT}`);
});