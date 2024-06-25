import { Response } from 'express';
import usersSchema from '../models/user.model';
import joinChallengeSchema from '../models/join_challenge.model';
import challengeSchema from '../models/challenge.model';
import { UserDto } from "../types/users.dto";

async function createUser(req: UserDto, res: Response): Promise<void> {
  try {
    const existingUser = await usersSchema.findOne({ name: req.name, lastname: req.lastname });
    if (existingUser) {
      throw new Error("Username already exists");
    }

    if (req.hobbies?.length == undefined || req.hobbies?.length < 2) {
      throw new Error("Hoobies must have 2 value");
    }

    const newUser = new usersSchema({
      name: req.name,
      lastname: req.lastname,
      age: req.age,
      password: req.password,
      hobbies: req.hobbies
    });

    await newUser.validate();
    await newUser.save();

    res.status(200).send(newUser);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
}

async function signinUser(req: UserDto, res: Response): Promise<void> {
  try {
    const existingUser = await usersSchema.findOne({ name: req.name, password: req.password });

    if (!existingUser) {
      res.status(404).send({ message: "User not found", status: 1 });
      return;
    }

    res.status(200).send(existingUser);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

async function getUserData(req: string, res: Response): Promise<void> {
  try {
    const userData = await usersSchema.findOne({ _id: req });

    if (userData) {
      res.status(200).send(userData);
      return;
    }

    res.status(400).send({ message: "User not found", status: 1 });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

async function getUsersChallengeJoined(req: string, res: Response): Promise<void> {
  try {
    const userData = await usersSchema.findOne({ _id: req });

    if (!userData) {
      res.status(400).send({ message: "User not found", status: 1 });
      return;
    }

    const allChallengeJoinedData = await joinChallengeSchema.find({ user_id: req });
    const allChallengesData = [];

    for (let challenge of allChallengeJoinedData) {
      const challengeData = await challengeSchema.findOne({ _id: challenge.challenge_id });

      if (challengeData) {
        const challengeWithStatus = {
          ...challenge.toObject(),
          ...challengeData.toObject(),
        };

        allChallengesData.push(challengeWithStatus);
      }
    }

    res.status(200).send(allChallengesData);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}


export default {
  createUser,
  signinUser,
  getUserData,
  getUsersChallengeJoined
};
