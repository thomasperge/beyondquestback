import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connect } from "mongoose";
import UserRoutes from './src/routes/users.route'
import ChallengeRoutes from './src/routes/challenge.route'

dotenv.config();

const app: Express = express();
app.use(cors());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, PATCH, DELETE"
	);
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	next();
});

const port = process.env.PORT || 3000;

const mongo_uri = process.env.MONGODB_URL;
const openAi_uri = process.env.OPENAI_SECRET_KEY;

if (!mongo_uri) {
	throw new Error("La variable d'environnement MONGODB_URL n'est pas définie.");
}

if (!openAi_uri) {
	throw new Error("La variable d'environnement OPENAI_SECRET_KEY n'est pas définie.");
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