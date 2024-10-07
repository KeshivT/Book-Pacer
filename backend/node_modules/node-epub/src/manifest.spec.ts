import fixutureMini from './__fixtures__/manifest.fixture-mini';
import fixutureFull from './__fixtures__/manifest.fixture-full';

import { parseManifest } from './manifest';

describe('manifest', () => {
  it('transform manifest minimal fixture into key based object', () => {
    const manifest = parseManifest(fixutureMini);
    expect(manifest).toEqual({
      cover: {
        href: 'cover.xhtml',
        id: 'cover',
        mediaType: 'application/xhtml+xml',
      },
    });
  });

  it('transform manifest full fixture into key based object', () => {
    const manifest = parseManifest(fixutureFull);
    expect(manifest).toMatchSnapshot();
  });
});
