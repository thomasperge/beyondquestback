import { Response } from 'express';
import { JoinChallengeDto } from '../types/challenge.dto';
import challengeSchema from '../models/challenge.model'
import joinChallengeSchema from '../models/join_challenge.model'
import usersSchema from '../models/user.model'

async function joinChallenge(req: JoinChallengeDto, res: Response): Promise<void> {
  try {
    const existingUser = await usersSchema.findOne({ _id: req.user_id });

    if (!existingUser) {
      res.status(404).send({ message: "User not found", status: 1 });
      return;
    }

    const existingChallenge = await challengeSchema.findOne({ _id: req.challenge_id });

    if (!existingChallenge) {
      res.status(404).send({ message: "Challenge not found", status: 1 });
      return;
    }

    const newJoinChallenge = new joinChallengeSchema({
      challenge_id: req.challenge_id,
      user_id: req.user_id,
      completed: false,
    });

    await newJoinChallenge.validate();
    await newJoinChallenge.save();

    console.log("=================== : ", newJoinChallenge);

    res.status(201).send({ message: "Challenge joined successfully", status: 0 });
  } catch (error: any) {
    res.status(400).send(error.message);
  }
}

export default {
  joinChallenge,
};
