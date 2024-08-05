import { appendFileSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join as joinPath, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(__dirname);

class FileHandler {
  constructor(folder, filename) {
    this.pathname = joinPath(projectRoot, folder, filename);
    this.ensureDirectoryExistence();
  }

  ensureDirectoryExistence() {
    const dir = dirname(this.pathname);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  append(data) {
    try {
      appendFileSync(this.pathname, `${data}\n`, 'utf8');
    } catch (error) {
      throw new Error(`Failed to append data to file: ${error.message}`);
    }
  }

  read(isJSON = false) {
    try {
      const data = readFileSync(this.pathname, 'utf8');
      return isJSON ? JSON.parse(data) : data;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return isJSON ? {} : '';
      }
      throw new Error(`Failed to read from file: ${error.message}`);
    }
  }

  write(data, isJSON = true) {
    try {
      const content = isJSON ? JSON.stringify(data, null, 2) : data;
      writeFileSync(this.pathname, content, 'utf8');
    } catch (error) {
      throw new Error(`Failed to write to file: ${error.message}`);
    }
  }
}

export default FileHandler;