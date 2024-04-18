import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import UserRoutes from './src/routes/users.route'
import ChallengeRoutes from './src/routes/challenge.route'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const mongo_uri = process.env.MONGODB_URL;

if (!mongo_uri) {
  throw new Error("La variable d'environnement MONGODB_URL n'est pas définie.");
}

connect(mongo_uri, {
	maxPoolSize: 10,
})
	.then(async () => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => console.log(err));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

UserRoutes(app)
ChallengeRoutes(app)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});