import fs from 'fs-extra';
import Messages from '../Model/Messages.js';

export const audioMessanger = async (req, res) => {
  const { from, to } = req.query;
  if (req.file) {
    const date = Date.now();
    let fileName = `upload/audios/audio-${date}${req.file.originalname}`;
    console.log({ fs: req.file });
    console.log({ fileName });
    console.log({ path: req.file.path });
    fs.renameSync(req.file.path, fileName);
    if (to && from) {
      const message = await Messages.create({
        message: fileName,
        senderId: from,
        receiverId: to,
        messageType: 'audio',
      });
      console.log({ message });
      res.status(200).json(message);
    } else {
      res.status(400).json('senderid or recieverId does not exist ');
    }
  } else {
    res.status(400).json('Audio File does not exist');
  }
};
