import { Response } from 'express';
import { TweetDto } from '../types/tweet';
import tweetModel from '../models/tweet.model';

async function createTweet(tweetDto: TweetDto, res: Response): Promise<void> {
  try {
    const newTweet = new tweetModel({
      user_id: tweetDto.user_id,
      challenge_id: tweetDto.challenge_joined_id,
      text: tweetDto.text
    });

    console.log(newTweet);

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

export default {
  createTweet,
};
