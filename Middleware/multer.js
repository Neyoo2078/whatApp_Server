import multer from 'multer';

const uploadImage = multer({ dest: './upload/images' });
export default uploadImage;
