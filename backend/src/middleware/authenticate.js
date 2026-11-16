import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const [type, token] = (req.headers.authorization ?? '').split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized' });
  }
};