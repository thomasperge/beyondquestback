import { Response } from 'express';
import { ChallengeDto, JoinChallengeDto } from '../types/challenge.dto';
import challengeSchema from '../models/challenge.model'
import joinChallengeSchema from '../models/join_challenge.model'
import usersSchema from '../models/user.model'
import OpenAI from 'openai';
import join_challengeModel from '../models/join_challenge.model';
import challengeModel from '../models/challenge.model';

async function generateChallenge(req: ChallengeDto, res: Response): Promise<void> {
  try {
    console.log(req);

    const existingUser = await usersSchema.findOne({ _id: req._id });

    if (!existingUser) {
      res.status(404).send({ message: "User not found", status: 1 });
      return;
    }

    // Openai => Generate challenge
    const openAi_uri = process.env.OPENAI_SECRET_KEY;

    const openai = new OpenAI({
      apiKey: openAi_uri,
    });

    const response: any = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { "role": "system", "content": `Tu est un générateur de challenge sur le thème de : ${req.hobbies}` },
        { "role": "user", "content": `Génére moi un seule challenge (maximum 70 caractères)` },
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1
    });

    const newChallenge = new challengeSchema({
      generate_by_user_id: req._id,
      text: response.choices[0].message.content,
      hobbies: req.hobbies,
    });

    const newJoinChallenge = new joinChallengeSchema({
      challenge_id: newChallenge._id,
      user_id: newChallenge.generate_by_user_id,
      completed: false,
    });

    await newChallenge.validate();
    await newChallenge.save();

    await newJoinChallenge.validate();
    await newJoinChallenge.save();

    res.status(200).send(newChallenge);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
}

async function getTrendingChallenge(req: any, res: Response): Promise<void> {
  try {
    const trendingChallenges = await joinChallengeSchema.aggregate([
      {
        $group: {
          _id: "$challenge_id",
          joinsCount: { $sum: 1 }
        }
      },
      {
        $sort: { joinsCount: -1 }
      }
    ]);

    const top3TrendingChallenges = trendingChallenges.slice(0, 3);

    const trendingChallengesDetails = await Promise.all(top3TrendingChallenges.map(async (trendingChallenge: any) => {
      const challengeData = await challengeSchema.findOne({ _id: trendingChallenge._id });
      return {
        challenge_id: trendingChallenge._id,
        joinsCount: trendingChallenge.joinsCount,
        challengeData: challengeData
      };
    }));

    res.status(200).send(trendingChallengesDetails);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

interface CompletedChallenge extends ChallengeDto {
  challenge_joined_id?: string;
  challenge_id?: string;
  completed?: boolean;
}

async function getAllUserJoinedChallenge(user_id: string, res: Response): Promise<void> {
  try {
    const allChallengeJoined: JoinChallengeDto[] = await join_challengeModel.find({ user_id: user_id });

    const userJoinedChallenges: CompletedChallenge[] = [];

    for (const joinChallenge of allChallengeJoined) {
      const challenge: ChallengeDto | null = await challengeModel.findOne({ _id: joinChallenge.challenge_id });

      if (challenge) {
        const completed: boolean = joinChallenge.completed ?? false;
        const { _id, generate_by_user_id, text, hobbies } = challenge;

        const completedChallenge: CompletedChallenge = { challenge_joined_id: joinChallenge._id, challenge_id: challenge._id, generate_by_user_id, text, hobbies, completed, createdAt: joinChallenge.createdAt };
        userJoinedChallenges.push(completedChallenge);
      }
    }

    console.log(userJoinedChallenges);
    
    res.status(200).send(userJoinedChallenges);
  } catch (error: any) {
    console.log(error);
    res.status(400).send(error.message);
  }
}

async function completeAJoinedChallenge(challenge_joined_id: string, res: Response): Promise<void> {
  try {
    console.log(challenge_joined_id);
    
    const challengeJoined = await join_challengeModel.findOneAndUpdate(
      { _id: challenge_joined_id },
      { completed: true },
      { new: true }
    );

    if (!challengeJoined) {
      throw new Error('Le challenge rejoint spécifié est introuvable.');
    }

    res.status(200).send({ message: "Success", status: 1, challengeJoined });
  } catch (error: any) {
    console.error(error);
    res.status(400).send({ message: error.message, status: 0 });
  }
}

export default {
  generateChallenge,
  getTrendingChallenge,
  getAllUserJoinedChallenge,
  completeAJoinedChallenge
};
