import express, { Request, Response } from "express";
import { TweetDto } from "../types/tweet";
import tweetService from '../services/tweet.service'

export default function (app: any) {
  const jsonMiddleware = express.json();

  app.post("/tweet/new", jsonMiddleware, (req: Request<TweetDto>, res: Response) => {
    if (req.body) {
      tweetService.createTweet(req.body, res);
    } else {
      res.status(400).send("Request body is missing or empty");
    }
  });

  app.get("/tweet/all", jsonMiddleware, (req: any, res: Response) => {
    tweetService.getAllTweet(req, res);
  });
}
