import express from 'express';
import { audioMessanger } from '../Controller/audioMessanger.js';
import uploadAudios from '../Middleware/AudioMulter.js';

const router = express.Router();

router.post('/add-image-message', uploadAudios.single('audio'), audioMessanger);

export default router;
