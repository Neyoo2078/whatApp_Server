import multer from 'multer';

const uploadAudios = multer({ dest: '/upload/audios' });
export default uploadAudios;
