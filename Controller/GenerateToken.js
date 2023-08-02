import generateToken04 from '../Utils/GenerateToken.js';

export const GenerateToken = (req, res, next) => {
  console.log('we here here');
  const { userId } = req.params;
  console.log({ userId });
  const appId = parseInt(process.env.ZEGO_APP_ID);
  const ServerSecret = process.env.ZEGO_SERVER_SECRET;
  console.log({ userId, appId, ServerSecret });
  const effectiveTime = 3600;
  const payload = '';
  if (appId && ServerSecret && userId) {
    const tokens = generateToken04(
      appId,
      userId,
      ServerSecret,
      effectiveTime,
      payload
    );
    console.log({ tokens });
    res.status('200').json(tokens);
  } else {
    res.status(400).jsom('appid , userID , serverSecret is required');
  }
};
