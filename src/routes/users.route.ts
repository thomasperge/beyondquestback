import express, { Request, Response } from "express";
import { UserDto } from "../types/users.dto";
import createUserService from '../services/users.service'

export default function (app: any) {
  const jsonMiddleware = express.json();

  app.post("/users/signup", jsonMiddleware, (req: Request<UserDto>, res: Response) => {
    if (req.body) {
      createUserService.createUser(req.body, res);
    } else {
      res.status(400).send("Request body is missing or empty");
    }
  });

  app.get("/users/data/:userId", jsonMiddleware, (req: any, res: Response) => {
    const userId = req.params.userId;
    if (userId) {
      createUserService.getUserData(userId, res);
    } else {
      res.status(400).send("User ID is missing");
    }
  });

  app.post("/users/signin", jsonMiddleware, (req: Request<UserDto>, res: Response) => {
    if (req.body) {
      createUserService.signinUser(req.body, res);
    } else {
      res.status(400).send("Request body is missing or empty");
    }
  });
}
