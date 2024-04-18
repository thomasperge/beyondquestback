import { Response } from 'express';
import usersSchema from '../models/user.model';
import { UserDto } from "../types/users.dto";

async function createUser(req: UserDto, res: Response): Promise<void> {
  try {
    const existingUser = await usersSchema.findOne({ name: req.name, lastname: req.lastname });
    if (existingUser) {
      throw new Error("Username already exists");
    }

    const newUser = new usersSchema({
      name: req.name,
      lastname: req.lastname,
      age: req.age,
      password: req.password
    });

    await newUser.validate();
    await newUser.save();

    res.status(200).send({ message: "User created successfully", status: 0 });
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

    res.status(200).send({ message: "Login successful", status: 0 });
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

export default {
  createUser,
  signinUser,
  getUserData
};
