const express = require('express')
const path = require('path')
const cors = require('cors')
const { upload, handleFileUpload } = require('./upload')

const app = express()

// ミドルウェアの設定
app.use(cors())
app.use(express.json())
app.use('/Images', express.static(path.join(__dirname, 'public/Images')))

// ファイルアップロードのルート
app.post('/upload', upload.single('file'), handleFileUpload)

// サーバーの起動
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})