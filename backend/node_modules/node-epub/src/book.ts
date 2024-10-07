import fs from 'fs';
import path from 'path';
import camelcaseKeys from 'camelcase-keys';

import FileStorage, {
  ZipFileStorage,
  DirectoryFileStorage,
} from './file-storage';
import { findOpfFile, parseOpfFile } from './opf';

const findTagMeta = (meta: object[], id: string) =>
  meta && meta instanceof Array
    ? meta.find((item: any) => item.refines === `#${id}`)
    : {};

const ensureArray = (obj: any) => (obj instanceof Array ? obj : [obj]);

const findCoverImageId = (meta: object[]) => {
  if (!meta) {
    return 'cover';
  }

  const metaArray = ensureArray(meta);
  const coverImageObject: any = metaArray.find(
    (item: any) => item.name === 'cover',
  );
  return coverImageObject?.content || 'cover';
};

interface Creator {
  id: string;
  meta: {
    property: string;
    refines: string;
    scheme: string;
    text: string;
  };
  text: string;
}

interface Identifier {
  id: string;
  text: string;
}

interface CoverImage {
  href: string;
  id: string;
  mediaType: string;
}

export default class Book {
  private files: FileStorage;
  private basePath: string;
  readonly isZipFile: boolean;
  readonly title: string;
  readonly creator: Creator[];
  readonly language: string[];
  readonly identifier: Identifier;
  readonly coverImage?: CoverImage;

  constructor(epubPathOrBuffer: string | Buffer) {
    const isString = typeof epubPathOrBuffer === 'string';
    this.isZipFile = !isString || !fs.lstatSync(epubPathOrBuffer).isDirectory();

    if (this.isZipFile) {
      this.files = new ZipFileStorage(epubPathOrBuffer);
    } else {
      this.files = new DirectoryFileStorage(epubPathOrBuffer as string);
    }

    const opfFilePath = findOpfFile(this.files);
    this.basePath = path.dirname(opfFilePath);
    const opf = parseOpfFile(opfFilePath, this.files);

    const {
      manifest: { item: manifest },
    } = opf;
    const { title, creator, meta, language, identifier } = opf.metadata;

    // Title
    this.title = typeof title === 'object' ? title.text : title;

    // Creator
    this.creator = ensureArray(creator).map((item: any) => ({
      ...item,
      meta: findTagMeta(meta, item.id),
    }));

    // Language
    this.language = ensureArray(language);

    // Identifier
    this.identifier = identifier;

    // Cover image
    const coverImageId = findCoverImageId(meta);
    if (coverImageId) {
      const coverImage = manifest.find((item: any) => item.id === coverImageId);
      if (coverImage) {
        this.coverImage = (camelcaseKeys(coverImage) as unknown) as CoverImage;
      }
    }
  }

  readAsText(fileName: string, encoding?: string): string {
    const filePath = path.join(this.basePath, fileName);
    return this.files.readAsText(filePath, encoding);
  }

  readAsBuffer(fileName: string): Buffer {
    const filePath = path.join(this.basePath, fileName);
    return this.files.readAsBuffer(filePath);
  }
}
