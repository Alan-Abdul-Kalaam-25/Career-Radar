import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';
import { ProfileModel } from '../models/Profile.js';
import { setAuthCookie } from '../middleware/auth.js';

export async function register(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, password } = req.body as Record<string, string>;
    if (!firstName || !lastName || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const profile = await ProfileModel.create({});
    const user = await UserModel.create({ firstName, lastName, email, passwordHash, profile: profile._id });
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    setAuthCookie(res, token);
    return res.status(201).json({ id: user._id, firstName, lastName, email });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as Record<string, string>;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    setAuthCookie(res, token);
    return res.json({ id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie('token', { path: '/' });
  res.json({ ok: true });
}


