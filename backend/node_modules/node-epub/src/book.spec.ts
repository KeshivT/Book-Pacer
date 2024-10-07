import fs from 'fs';

import Book from './book';

describe('epub30-test-0100 - Tests for Content Documents in a reflowable context', () => {
  const epubFolderPath = './resources/testsuite/content/30/epub30-test-0100';

  it('should read unpacked epub from folder path', () => {
    const book = new Book(epubFolderPath);
    expect(book.isZipFile).toEqual(false);
  });

  it('should have the right title', () => {
    const book = new Book(epubFolderPath);
    expect(book.title).toEqual('EPUBTEST 0100 - Reflowable Content Tests');
  });

  it('should have one or multiple creators', () => {
    const book = new Book(epubFolderPath);
    expect(book.creator).toMatchSnapshot();
  });

  it('should have one or multiple languages', () => {
    const book = new Book(epubFolderPath);
    expect(book.language).toEqual(['en', 'jp']);
  });

  it('should have one or multiple identifier', () => {
    const book = new Book(epubFolderPath);
    expect(book.identifier).toEqual({
      id: 'uid',
      text: 'com.github.epub-testsuite.epub30-test-0100',
    });
  });

  it('should have one or multiple coverimage', () => {
    const book = new Book(epubFolderPath);
    expect(book.coverImage).toBeUndefined();
  });
});

describe('epub30-test-0130 - Tests for right-to-left page progression and vertical writing mode languages in a reflowable context', () => {
  const epubFolderPath = './resources/testsuite/content/30/epub30-test-0130';

  it('should read unpacked epub from folder path', () => {
    const book = new Book(epubFolderPath);
    expect(book.isZipFile).toEqual(false);
  });

  it('should have the right title', () => {
    const book = new Book(epubFolderPath);
    expect(book.title).toEqual(
      'EPUBTEST 0130 - RTL Progression and Vertical Writing Tests',
    );
  });

  it('should have one or multiple creators', () => {
    const book = new Book(epubFolderPath);
    expect(book.creator).toMatchSnapshot();
  });

  it('should have one or multiple languages', () => {
    const book = new Book(epubFolderPath);
    expect(book.language).toEqual(['en', 'ja', 'he']);
  });

  it('should have one or multiple identifier', () => {
    const book = new Book(epubFolderPath);
    expect(book.identifier).toEqual({
      id: 'uid',
      text: 'com.github.epub-testsuite.epub30-test-0130',
    });
  });

  it('should have one or multiple coverimage', () => {
    const book = new Book(epubFolderPath);
    expect(book.coverImage).toEqual({
      href: 'img/cover.jpg',
      id: 'cover',
      mediaType: 'image/jpeg',
      properties: 'cover-image',
    });
  });
});

describe('Die Verwandlung by Franz Kafka - Epub zip-file', () => {
  const epubFilePath = './resources/2-die-verwandlung.epub';

  it('should read epub zip from file path', () => {
    const book = new Book(epubFilePath);
    expect(book.isZipFile).toEqual(true);
  });

  it('should read epub zip from file path', () => {
    const buffer = fs.readFileSync(epubFilePath);
    const book = new Book(buffer);
    expect(book.isZipFile).toEqual(true);
  });

  it('should have the right title', () => {
    const book = new Book(epubFilePath);
    expect(book.title).toEqual('Die Verwandlung');
  });

  it('should have one or multiple creators', () => {
    const book = new Book(epubFilePath);
    expect(book.creator).toEqual([
      {
        meta: {},
        role: 'aut',
        text: 'Franz Kafka',
      },
    ]);
  });

  it('should have one or multiple languages', () => {
    const book = new Book(epubFilePath);
    expect(book.language).toEqual(['nl']);
  });

  it('should have one or multiple identifier', () => {
    const book = new Book(epubFilePath);
    expect(book.identifier).toEqual({
      id: 'BookId',
      scheme: 'UUID',
      text: 'urn:uuid:83b5dbdc-fc4b-4efe-9efe-ca949c7f0d54',
    });
  });

  it('should have one or multiple coverimage', () => {
    const book = new Book(epubFilePath);
    expect(book.coverImage).toBeUndefined();
  });
});

describe('Lorem ipsum - Epub zip-file created with Apple Pages', () => {
  const epubFilePath = './resources/1-lorem-ipsum.epub';

  it('should read epub zip from file path', () => {
    const book = new Book(epubFilePath);
    expect(book.isZipFile).toEqual(true);
  });

  it('should read epub zip from file path', () => {
    const buffer = fs.readFileSync(epubFilePath);
    const book = new Book(buffer);
    expect(book.isZipFile).toEqual(true);
  });

  it('should have the right title', () => {
    const book = new Book(epubFilePath);
    expect(book.title).toEqual('Lorem ipsum');
  });

  it('should have one or multiple creators', () => {
    const book = new Book(epubFilePath);
    expect(book.creator).toEqual([
      {
        id: 'creator',
        meta: {
          property: 'role',
          refines: '#creator',
          scheme: 'marc:relators',
          text: 'aut',
        },
        text: 'Richard',
      },
    ]);
  });

  it('should have one or multiple languages', () => {
    const book = new Book(epubFilePath);
    expect(book.language).toEqual(['en']);
  });

  it('should have one or multiple identifier', () => {
    const book = new Book(epubFilePath);
    expect(book.identifier).toEqual({
      id: 'BookId',
      text: '345A4F7A-D930-4545-B1E4-3FAF38917550',
    });
  });

  it('should have one or multiple coverimage', () => {
    const book = new Book(epubFilePath);
    expect(book.coverImage).toEqual({
      href: 'images/cover-image.png',
      id: 'cover-image',
      mediaType: 'image/png',
    });
  });
});
