import express from 'express';
import { upLoadImgHandler } from '../Controller/messagesController.js';
import uploadImage from '../Middleware/multer.js';
const route = express.Router();

route.post('/add-image-message', uploadImage.single('image'), upLoadImgHandler);

export default route;
