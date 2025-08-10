import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './config/db.js';
import apiRoutes from './routes/api.js'
import { processAllData } from './scripts/processData.js';

dotenv.config();

const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

(async () => {
  try {
    await connectDB();
    await processAllData();
    console.log('Data processing completed');
  } catch (error) {
    console.error('Data processing failed:', error);
  }
})();

app.get('/', (req, res) => {
  res.send("Hello World!");
})

app.use('/api', apiRoutes)

const PORT = process.env.PORT || 6009;

app.listen(PORT, () => console.info("server is running on http://localhost:" + PORT));