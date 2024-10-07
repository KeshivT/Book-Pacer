import FileStorage from './file-storage';
import { parseXml } from './xml';

export const findOpfFile = (fileStorage: FileStorage): string => {
  const text = fileStorage.readAsText('META-INF/container.xml');
  const xml = parseXml(text);
  return xml.container.rootfiles.rootfile['full-path'];
};

export const parseOpfFile = (opfFilePath: string, fileStorage: FileStorage) => {
  const text = fileStorage.readAsText(opfFilePath);
  const xml = parseXml(text);
  return xml.package;
};

export const readOpfFile = (fileStorage: FileStorage) => {
  const opfFilePath = findOpfFile(fileStorage);
  return parseOpfFile(opfFilePath, fileStorage);
};
