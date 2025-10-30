import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { UserModel } from '../models/User.js';
import { ProfileModel } from '../models/Profile.js';

export async function getMe(req: AuthRequest, res: Response) {
  try {
    const user = await UserModel.findById(req.userId).populate('profile');
    if (!user) return res.status(404).json({ message: 'Not found' });
    return res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profile: user.profile,
    });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'Not found' });
    await ProfileModel.findByIdAndUpdate(user.profile, req.body, { new: true, upsert: true });
    const updated = await UserModel.findById(req.userId).populate('profile');
    return res.json({ profile: updated?.profile });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}


