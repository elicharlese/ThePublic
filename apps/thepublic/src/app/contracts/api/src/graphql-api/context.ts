import { Request, Response } from 'express';

interface Context {
  req: Request;
  res: Response;
  // Add other context properties here
}

export const createContext = ({ req, res }): Context => {
  return { req, res };
};