import express, { Request, Response } from "express";
import { ChallengeDto } from "../types/challenge.dto";
import { JoinChallengeDto } from "../types/challenge.dto";
import challengeService from "../services/challenge.service";
import joinChallengeService from "../services/join_challenge.service";

export default function (app: any) {
  const jsonMiddleware = express.json();

  app.post("/challenge/generate", jsonMiddleware, (req: Request<ChallengeDto>, res: Response) => {
    if (req.body) {
      challengeService.generateChallenge(req.body, res);
    } else {
      res.status(400).send("Request body is missing or empty");
    }
  });

  app.post("/challenge/join-challenge", jsonMiddleware, (req: Request<JoinChallengeDto>, res: Response) => {
    if (req.body) {
      joinChallengeService.joinChallenge(req.body, res);
    } else {
      res.status(400).send("Request body is missing or empty");
    }
  });

  app.get("/challenge/user/:id", jsonMiddleware, (req: Request, res: Response) => {
    const userId = req.params.id;
    challengeService.getAllUserJoinedChallenge(userId, res);
  });

  app.get("/challenge/get-trends", jsonMiddleware, (req: Request<JoinChallengeDto>, res: Response) => {
    challengeService.getTrendingChallenge(req, res);
  });
}
