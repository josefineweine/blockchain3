export default class Block {
    constructor(
      timestamp,
      blockIndex,
      previousBlockHash,
      currentBlockHash,
      data,
      difficulty
    ) {
      if (data === null || data === undefined) {
        throw new Error('Block data cannot be null or undefined');
      }
  
      this.timestamp = timestamp;
      this.blockIndex = blockIndex;
      this.previousBlockHash = previousBlockHash;
      this.currentBlockHash = currentBlockHash;
      this.data = data;
      this.difficulty = difficulty || parseInt(process.env.DIFFICULTY, 10);
    }
  }