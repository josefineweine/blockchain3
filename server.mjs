import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import blockchainRouter from './routes/blockchain-routes.mjs';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1/blockchain', blockchainRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server körs på port ${PORT}`));