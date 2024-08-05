import express from 'express';
import {
  generateBlock,
  fetchBlockchain,
  fetchBlockByIndex,
} from '../controllers/blockchain-controller.mjs';

const router = express.Router();

// Hämta hela blockkedjan
router.get('/', fetchBlockchain);

// Hämta ett specifikt block med index
router.get('/block/:index', fetchBlockByIndex);

// Skapa ett nytt block
router.post('/mine', generateBlock);

export default router;