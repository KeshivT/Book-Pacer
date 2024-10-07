# node-epub

## Getting started

    yarn add node-epub

```typescript
import Epub from 'node-epub';

const epub = new Epub('./path-to.epub');

console.log(
  epub.title,
  epub.creator,
  epub.language,
  epub.identifier,
  epub.coverImage,
);
```
