import { UserDto } from "../types/users.dto";
import { Response } from 'express';

async function createUser(request: UserDto, res: Response): Promise<void> {
  res.json({ title: "GeeksforGeeks" });
}

export default {
  createUser
};
