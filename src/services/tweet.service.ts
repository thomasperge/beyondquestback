import { Response } from 'express';
import { TweetDto } from '../types/tweet';
import tweetModel from '../models/tweet.model';
import join_challengeModel from '../models/join_challenge.model';
import challengeModel from '../models/challenge.model';
import userModel from '../models/user.model';

async function createTweet(tweetDto: TweetDto, res: Response): Promise<void> {
  try {
    const challengeJoined = await join_challengeModel.findOne({_id: tweetDto.challenge_joined_id})

    if (!challengeJoined) {
      throw new Error('Challenge joined not found');
    }

    const challenge = await challengeModel.findOne({_id: challengeJoined.challenge_id})

    if (!challenge) {
      throw new Error('Challenge not found');
    }

    const newTweet = new tweetModel({
      user_id: tweetDto.user_id,
      challenge_id: challenge._id,
      text: tweetDto.text
    });

    await newTweet.validate();
    await newTweet.save();

    if (newTweet) {
      res.status(201).json(newTweet);
    } else {
      res.status(500).send("Failed to save tweet");
    }
  } catch (error) {
    console.error("Error creating tweet:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function getAllTweet(req: any, res: Response): Promise<void> {
  try {
    // Obtenir tous les tweets
    const allTweets = await tweetModel.find({});

    // Récupérer les informations nécessaires pour chaque tweet
    const enrichedTweets = await Promise.all(allTweets.map(async (tweet) => {
      
      // Obtenir les informations du challenge
      const challenge = await challengeModel.findOne({ _id: tweet.challenge_id });

      // Obtenir les informations du joined challenge
      const joinedChallenge = await join_challengeModel.findOne({
        challenge_id: tweet.challenge_id,
        user_id: tweet.user_id
      });

      // Obtenir les informations de l'utilisateur qui a généré le challenge
      const generatedByUser = await userModel.findOne({ _id: challenge?.generate_by_user_id });

      // Obtenir les informations de l'utilisateur qui a joint le challenge
      const joinedByUser = await userModel.findOne({ _id: tweet.user_id });

      console.log("Challenge : ", challenge);
      console.log("Joined Challenge : ", joinedChallenge);
      console.log("Generate by User : ", generatedByUser);
      console.log("Joined by User : ", joinedByUser);

      if (!challenge || !joinedChallenge || !generatedByUser || !joinedByUser) {
        throw new Error('Erreur lors de la recherche de donée');
      }

      return {
        ...tweet.toObject(),
        challenge: {
          text: challenge.text,
          hobbies: challenge.hobbies
        },
        generatedByUser: {
          name: generatedByUser.name,
          lastname: generatedByUser.lastname
        },
        joinedChallenge: {
          completed: joinedChallenge.completed
        },
        joinedByUser: {
          _id: joinedByUser._id,
          name: joinedByUser.name,
          lastname: joinedByUser.lastname
        }
      };
    }));

    // console.log(enrichedTweets);
    res.status(200).send(enrichedTweets.reverse());
  } catch (error) {
    console.error("Error getting all tweets:", error);
    res.status(500).send("Internal Server Error");
  }
}

export default {
  createTweet,
  getAllTweet
};
