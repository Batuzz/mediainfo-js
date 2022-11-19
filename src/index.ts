import * as MediaInfoLib from '../lib/MediaInfoWasm';

export class MediaInfo {
  private lib;

  public getMediaInfoData(source) {
    this.lib = MediaInfoLib(source);
    this.lib.Open_Buffer_Init(0);
  }
}
