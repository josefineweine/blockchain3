import { dirname } from 'path';
import { fileURLToPath } from 'url';
import Block from '../models/Block.mjs';

const __appdir = dirname(fileURLToPath(import.meta.url));

function createAndValidateBlock(
  timestamp,
  blockIndex,
  previousBlockHash,
  currentBlockHash,
  data,
  difficulty
) {
  const block = new Block(
    timestamp,
    blockIndex,
    previousBlockHash,
    currentBlockHash,
    data,
    difficulty
  );

  expect(block.timestamp).toBe(timestamp);
  expect(block.blockIndex).toBe(blockIndex);
  expect(block.previousBlockHash).toBe(previousBlockHash);
  expect(block.currentBlockHash).toBe(currentBlockHash);
  expect(block.data).toBe(data);
  expect(block.difficulty).toBe(difficulty);

  return block;
}

test('Should create a block with default difficulty.', () => {
  const timestamp = new Date().toISOString();
  const defaultDifficulty = parseInt(process.env.DIFFICULTY, 10);
  
  const block = createAndValidateBlock(
    timestamp,
    1,
    'previousHash',
    'currentHash',
    'sampleData',
    defaultDifficulty
  );

  expect(block.difficulty).toBe(defaultDifficulty);
});

test('Should correctly link two consecutive blocks.', () => {
  const timestamp = new Date().toISOString();

  const block1 = createAndValidateBlock(
    timestamp,
    1,
    'previousHash',
    'currentHash1',
    'data1',
    5
  );

  const block2 = createAndValidateBlock(
    timestamp,
    2,
    block1.currentBlockHash,
    'currentHash2',
    'data2',
    5
  );

  expect(block2.previousBlockHash).toBe(block1.currentBlockHash);
});

test('Should throw an error for invalid block data.', () => {
  const timestamp = new Date().toISOString();

  expect(() => {
    createAndValidateBlock(
      timestamp,
      1,
      'previousHash',
      'currentHash',
      null, 
      4
    );
  }).toThrow();
});