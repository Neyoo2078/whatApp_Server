import Messages from '../Model/Messages.js';
import fs from 'fs-extra';

export const upLoadImgHandler = async (req, res, next) => {
  const { from, to } = req.query;
  console.log({ from, to });
  if (req.file) {
    const date = Date.now();
    let fileName = `upload/images/images-${date}${req.file.originalname}`;
    console.log({ fs: req.file });
    console.log({ fileName });
    console.log({ path: req.file.path });
    fs.renameSync(req.file.path, fileName);

    if (from && to) {
      const message = await Messages.create({
        message: fileName,
        messageType: 'image',
        senderId: from,
        receiverId: to,
      });
      console.log({ message });
      res.status(200).json(message);
    } else {
      res.status(400).json('From or To data not available');
    }
  } else {
    res.status(400).json('Image is required');
  }
};
