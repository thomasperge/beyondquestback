import express from "express";
import { Response } from 'express';
import { UserDto } from "../types/users.dto";
import createUserService from './../services/users.services'

export default function (app: any) {
  const jsonMiddleware = express.json();

  app.post("/users/signup", jsonMiddleware, (req: UserDto, res: Response) => {
    createUserService.createUser(req, res);
  });

  app.post("/users/update", jsonMiddleware, (req: UserDto, res: Response) => {
    createUserService.createUser(req, res);
  });

  app.post("/users/delete", jsonMiddleware, (req: UserDto, res: Response) => {
    createUserService.createUser(req, res);
  });

  app.post("/users/get-data", jsonMiddleware, (req: UserDto, res: Response) => {
    createUserService.createUser(req, res);
  });
}
