# MediaInfo node

`mediainfo-node` is a JavaScript/TypeScript library for NodeJS environment created to gather media files' data by utilizing MediaInfo library (links can be found here: [MediaInfo website](https://mediaarea.net/en/MediaInfo), [MediaInfo GitHub](https://github.com/MediaArea/MediaInfo) and [MediaInfoLib GitHub](https://github.com/MediaArea/MediaInfoLib).

## Installation
```shell
npm install mediainfo-node
```

## Example usage

```typescript
  const mediaInfo = new MediaInfo();
  const data = await mediaInfo.getInfo('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  console.log(JSON.stringify(data, null, 2));
```