import { MediaInfo } from '../src';

async function exec() {
  const mediaInfo = new MediaInfo();
  mediaInfo.getMediaInfoData('https://example-segment.url/0001.ts');
}

exec();
