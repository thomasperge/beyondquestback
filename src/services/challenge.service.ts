import { Response } from 'express';
import { ChallengeDto } from '../types/challenge.dto';
import challengeSchema from '../models/challenge.model'
import joinChallengeSchema from '../models/join_challenge.model'
import usersSchema from '../models/user.model'
import OpenAI from 'openai';

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
      categorie: req.hobbies,
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


export default {
  generateChallenge,
  getTrendingChallenge
};
