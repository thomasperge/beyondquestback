import { Response } from 'express';
import { ChallengeDto } from '../types/challenge.dto';
import challengeSchema from '../models/challenge.model'
import joinChallengeSchema from '../models/join_challenge.model'
import usersSchema from '../models/user.model'

async function generateChallenge(req: ChallengeDto, res: Response): Promise<void> {
  try {
    const existingUser = await usersSchema.findOne({ _id: req.generate_by_user_id });

    if (!existingUser) {
      res.status(404).send({ message: "User not found", status: 1 });
      return;
    }

    const newChallenge = new challengeSchema({
      generate_by_user_id: req.generate_by_user_id,
      text: req.text,
      categorie: req.categorie,
    });

    const newJoinChallenge = new joinChallengeSchema({
      challenge_id: newChallenge._id,
      user_id: req.generate_by_user_id,
      completed: false,
    });

    await newChallenge.validate();
    await newChallenge.save();

    await newJoinChallenge.validate();
    await newJoinChallenge.save();

    res.status(200).send({ message: "Challenge created successfully", status: 0 });
  } catch (error: any) {
    res.status(400).send(error.message);
  }
}

export default {
  generateChallenge,
};
