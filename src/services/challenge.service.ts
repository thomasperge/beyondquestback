import { Response } from 'express';
import { ChallengeDto } from '../types/challenge.dto.js';
import challengeSchema from '../models/challenge.model'

async function generateChallenge(req: ChallengeDto, res: Response): Promise<void> {
  try {
    const newChallenge = new challengeSchema({
      generate_by_user_id: req.generate_by_user_id,
      text: req.text,
      time_to_complete_the_challenge: req.time_to_complete_the_challenge
    });

    await newChallenge.validate();
    await newChallenge.save();

    res.status(201).send("User created successfully");
  } catch (error: any) {
    res.status(400).send(error.message);
  }
}

export default {
  generateChallenge,
};
