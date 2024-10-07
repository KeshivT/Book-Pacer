import camelcaseKeys from 'camelcase-keys';

export const parseManifest = (manifest: any) => {
  const result: any = {};

  manifest.item.forEach((item: any) => {
    result[item.id] = camelcaseKeys(item);
  });

  return result;
};
