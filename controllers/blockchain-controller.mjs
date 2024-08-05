import { blockchain } from '../startup.mjs';
import ErrorResponse from '../utilities/ErrorResponseModel.mjs';
import ResponseModel from '../utilities/ResponseModel.mjs';

const sendResponse = (res, statusCode, payload) => {
  res.status(statusCode).json(new ResponseModel({ statusCode, data: payload }));
};

export const fetchBlockchain = (req, res, next) => {
  try {
    const chain = blockchain.getAllBlocks();
    sendResponse(res, 200, chain);
  } catch (error) {
    next(new ErrorResponse('Kunde inte hämta blockkedjan', 500));
  }
};

export const generateBlock = (req, res, next) => {
  try {
    const lastBlock = blockchain.getLastBlock();
    const data = req.body;

    const { nonce, difficulty, timestamp } = blockchain.proofOfWork(
      lastBlock.currentBlockHash,
      data
    );

    const currentBlockHash = blockchain.hashBlock(
      timestamp,
      lastBlock.currentBlockHash,
      data,
      nonce,
      difficulty
    );

    const newBlock = blockchain.createBlock(
      timestamp,
      lastBlock.currentBlockHash,
      currentBlockHash,
      data,
      difficulty
    );

    blockchain.writeToFile();
    sendResponse(res, 201, newBlock);
  } catch (error) {
    next(new ErrorResponse('Blockgenerering misslyckades', 500));
  }
};

export const fetchBlockByIndex = (req, res, next) => {
  try {
    const blockIndex = parseInt(req.params.index, 10);
    const block = blockchain.getBlockByIndex(blockIndex);

    if (!block) {
      return next(
        new ErrorResponse(`Block med index ${blockIndex} hittades inte`, 404)
      );
    }

    sendResponse(res, 200, block);
  } catch (error) {
    next(new ErrorResponse('Kunde inte hämta blocket', 500));
  }
};