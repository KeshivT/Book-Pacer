import path from 'path';
import fs from 'fs';
import Zip from 'adm-zip';

export default interface FileStorage {
  readAsText(fileName: string, encoding?: string): string;
  readAsBuffer(fileName: string): Buffer;
}

export class ZipFileStorage implements FileStorage {
  private zip: Zip;

  constructor(fileNameOrRawData: string | Buffer) {
    this.zip = new Zip(fileNameOrRawData);
  }

  readAsText(fileName: string, encoding = 'utf-8'): string {
    return this.zip.readAsText(fileName, encoding);
  }

  readAsBuffer(fileName: string): Buffer {
    const buffer = this.zip.readFile(fileName);
    if (buffer === null) {
      throw new Error(`Failed to access "${fileName}" in zip archive.`);
    }
    return buffer;
  }
}

export class DirectoryFileStorage implements FileStorage {
  private rootDirectory: string;

  constructor(directoryPath: string) {
    this.rootDirectory = directoryPath;
  }

  readAsText(fileName: string, encoding = 'utf-8'): string {
    const filePath = path.join(this.rootDirectory, fileName);
    return fs.readFileSync(filePath, { encoding });
  }

  readAsBuffer(fileName: string): Buffer {
    const filePath = path.join(this.rootDirectory, fileName);
    return fs.readFileSync(filePath);
  }
}
