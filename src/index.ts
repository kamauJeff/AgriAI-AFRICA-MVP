import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';   // <-- add this
import zxcvbn from 'zxcvbn';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());                    // <-- add this line

// Example route that reads cookies
app.get('/profile', (req, res) => {
  // Access cookies via req.cookies
  console.log(req.cookies);
  res.json({ message: 'Profile endpoint', cookies: req.cookies });
});

app.post('/check-password', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }
  const result = zxcvbn(password);
  res.json(result);
});

app.get('/', (req, res) => {
  res.send('Backend with TypeScript, Express, CORS, cookie-parser and zxcvbn');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});