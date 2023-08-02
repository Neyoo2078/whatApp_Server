import express from 'express';
import { GenerateToken } from '../Controller/GenerateToken.js';

const route = express.Router();

route.get('/token/:userId', GenerateToken);

export default route;
