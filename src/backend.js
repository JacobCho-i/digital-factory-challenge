const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middleware/auth');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

const User = require('./models/User');
const UserData = require('./models/UserData');

mongoose.connect(process.env.REACT_APP_MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('DB connection error:', err));

// POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'User already exists' });

    const newUser = new User({ email, password });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.REACT_APP_JWT_SECRET, {
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
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ msg: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id }, process.env.REACT_APP_JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token, user: { id: user._id, email: user.email } });
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

app.listen(process.env.REACT_APP_PORT, () => {
  console.log(`Server running at port ${process.env.REACT_APP_PORT}`);
});
