import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postsRoutes from './routes/posts.js'
import commentRoutes from './routes/comments.js'
import likesRoutes from './routes/likes.js'
import relationshipRoutes from './routes/relationship.js'
import multer from "multer"

const app = express();
dotenv.config();

// middlewares
app.use((req, res, next) => {;
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client-ui/public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const upload = multer({ storage: storage })

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    return res.status(200).json(file.filename);
  } catch (error) {
    console.log(error)
  }
})

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/relationships', relationshipRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});