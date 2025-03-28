const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middleware/auth');
const jwt = require('jsonwebtoken');
const app = express();

app.use(cors({
  origin: 'https://digital-factory-challenge.vercel.app',
  credentials: true
}));

app.use(express.json());

// loading data schema
const User = require('./models/User');
const UserData = require('./models/UserData');

// loading environment variables
const { JWT_SECRET, PORT, MONGO_URI } = require('./config');

// connecting mongo DB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('DB connection error:', err));

// POST /api/register
// Registering user with username, email, and password
app.post('/api/register', async (req, res) => {
  try {

    // server-side validations
    const { username, email, password } = req.body;
    if ( !username || !email || !password ) return res.status(400).json({ msg: 'one of the value is missing!' });

    const validator = require('validator');
    if (!validator.isEmail(req.body.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'User already exists!' });

    // enter user-info
    const newUser = new User({ username, email, password });
    await newUser.save();

    // sign in automatically on succession
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(201).json({
      msg: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/login
// Given log in credentials (email, password), validate it and return JWT token otherwise return error
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password ) return res.status(400).json({ msg: 'one of the value is missing!' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ msg: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token, user: { username: user.username, id: user._id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/task
app.get('/api/task', auth, async (req, res) => {
  const tasks = await UserData.find({ user_id: req.user.userId });
  res.json(tasks);
});

// POST /api/task
app.post('/api/task', auth, async (req, res) => {
  const { content } = req.body;
  console.log('req.user:', req.user);
  console.log('Saving task with:', {
    user_id: req.user.userId,
    content
  });
  const task = new UserData({ user_id: req.user.userId, content });
  await task.save();
  res.status(201).json(task);
});

// PUT /api/task/:id
app.put('/api/task/:id', auth, async (req, res) => {
  const { content } = req.body;
  const task = await UserData.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user.userId },
    { content },
    { new: true }
  );

  if (!task) return res.status(404).json({ error: 'task not found' });
  res.json(task);
});


// DELETE /api/task/:id
app.delete('/api/task/:id', auth, async (req, res) => {
  const task = await UserData.findOneAndDelete({
    _id: req.params.id,
    user_id: req.user.userId
  });

  if (!task) return res.status(404).json({ error: 'task not found' });
  res.json({ message: 'task deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
