import express, { Request, Response } from "express";
import { UserDto } from "../types/users.dto";
import { ChallengeDto } from "../types/challenge.dto.js";
import challengeService from "../services/challenge.service.js";

export default function (app: any) {
  const jsonMiddleware = express.json();

  app.post("/challenge/generate", jsonMiddleware, (req: Request<ChallengeDto>, res: Response) => {
    if (req.body) {
      challengeService.generateChallenge(req.body, res);
    } else {
      res.status(400).send("Request body is missing or empty");
    }
  });
}
