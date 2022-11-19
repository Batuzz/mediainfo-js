import { MediaInfo } from '../src';
 
async function exec() {
  const mediaInfo = new MediaInfo();
  await mediaInfo.instantiateLib();
  const data = await mediaInfo.getInfo('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  console.log(JSON.stringify(data, null, 2));
}
 
 
exec();