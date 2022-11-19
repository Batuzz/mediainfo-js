# MediaInfo node

`mediainfo-node` is a JavaScript/TypeScript library for NodeJS environment created to gather media files' data by utilizing MediaInfo library.

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