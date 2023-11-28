import express from 'express';
import cors from 'cors';
import { router } from './routes/routes.js'

const app = express();

const corsOptions = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200,
};

const port = 3000;

app.use(express.json());
app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.use('/api/v1', router);

