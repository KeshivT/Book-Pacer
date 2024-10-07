import { parse } from 'fast-xml-parser';

export const parseXml = (xmlData: string) =>
  parse(xmlData, {
    attributeNamePrefix: '',
    textNodeName: 'text',
    ignoreAttributes: false,
    ignoreNameSpace: true,
  });
