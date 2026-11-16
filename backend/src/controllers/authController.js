import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

const createToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const validateCredentials = (email, password) => {
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return 'Enter a valid email';
  }
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return null;
};

export const register = async (req, res) => {
  const { email, password } = req.body ?? {};
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  const validationError = validateCredentials(normalizedEmail, password);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: 'Email is already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email: normalizedEmail, password: hashedPassword });

  res.status(201).json({ token: createToken(user._id.toString()), user: { email: user.email } });
};

export const login = async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  const isPasswordCorrect = user ? await bcrypt.compare(password, user.password) : false;

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({ token: createToken(user._id.toString()), user: { email: user.email } });
};