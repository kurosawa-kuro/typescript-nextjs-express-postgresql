const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/Images'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

// multerインスタンスを作成
const upload = multer({ storage: storage });

// ファイルアップロード処理のハンドラー関数
const handleFileUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'ファイルがアップロードされていません' });
  }
  
  res.status(200).json({
    message: 'ファイルが正常にアップロードされました',
    file: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size
    }
  });
};

module.exports = { upload, handleFileUpload };