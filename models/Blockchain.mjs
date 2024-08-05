import { createHash } from '../utilities/crypto-lib.mjs';
import Block from './Block.mjs';
import FileHandler from '../utilities/fileHandler.mjs';
import { handleError, log } from '../utilities/errorHandler.mjs';

export default class Blockchain {
  constructor() {
    this.fileHandler = new FileHandler('data', 'blockchain.json');
    this.chain = this._initializeChain();
  }

  _initializeChain() {
    const data = this.fileHandler.read(true);
    if (data && data.chain && data.chain.length > 0) {
      return data.chain.map(blockData => new Block(
        blockData.timestamp,
        blockData.blockIndex,
        blockData.previousBlockHash,
        blockData.currentBlockHash,
        blockData.data,
        blockData.difficulty
      ));
    } else {
      return [this.createGenesisBlock()];
    }
  }

  createGenesisBlock() {
    return this.createBlock(Date.now(), '0', '0', [], parseInt(process.env.DIFFICULTY, 10));
  }

  createBlock(timestamp, previousBlockHash, currentBlockHash, data, difficulty) {
    if (typeof data !== 'object') {
      handleError('Blockdata måste vara ett objekt');
    }

    const block = new Block(
      timestamp,
      this.chain.length + 1,
      previousBlockHash,
      currentBlockHash,
      data,
      difficulty
    );

    this.chain.push(block);
    log(`Block #${block.blockIndex} skapades med hash: ${block.currentBlockHash}`);

    return block;
  }

  writeToFile() {
    this.fileHandler.write({ chain: this.chain });
  }

  getAllBlocks() {
    return this.chain;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  getBlockByIndex(index) {
    return this.chain[index - 1];
  }

  hashBlock(timestamp, previousBlockHash, data, nonce, difficulty) {
    const dataToHash = `${timestamp}${previousBlockHash}${JSON.stringify(data)}${nonce}${difficulty}`;
    return createHash(dataToHash);
  }

  proofOfWork(previousBlockHash, data) {
    let nonce = 0;
    let hash;
    let timestamp;
    let difficulty = this.adjustDifficulty(this.getLastBlock());

    do {
      nonce++;
      timestamp = Date.now();
      hash = this.hashBlock(timestamp, previousBlockHash, data, nonce, difficulty);
    } while (!this.isValidHash(hash, difficulty));

    return { nonce, difficulty, timestamp };
  }

  adjustDifficulty(lastBlock) {
    const MINE_RATE = parseInt(process.env.MINE_RATE, 10);
    const { difficulty } = lastBlock;

    if (lastBlock.timestamp + MINE_RATE > Date.now()) {
      return difficulty + 1;
    } else {
      return Math.max(difficulty - 1, 1);
    }
  }

  isValidHash(hash, difficulty) {
    return hash.substring(0, difficulty) === '0'.repeat(difficulty);
  }

  isValidChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.previousBlockHash !== previousBlock.currentBlockHash) {
        return false;
      }

      const recalculatedHash = this.hashBlock(
        currentBlock.timestamp,
        currentBlock.previousBlockHash,
        currentBlock.data,
        currentBlock.nonce,
        currentBlock.difficulty
      );

      if (recalculatedHash !== currentBlock.currentBlockHash) {
        return false;
      }
    }

    return true;
  }
}