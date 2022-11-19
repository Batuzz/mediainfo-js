import * as MediaInfoLib from '../lib/MediaInfoWasm';
import got from 'got';
 
export type MediaInfoInput = URL | string;
 
export type MediaInfoData = any; // maybe we'll add concrete types in future
 
type ErrorHandlerFunction = (reason: any) => void;
 
export class MediaInfoError extends Error {
  constructor(public readonly message: string, public readonly higherOrderError: any) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
 
export class MediaInfo {
  private lib;
 
  public async instantiateLib() {
    try {
      this.lib = await MediaInfoLib({ });
    } catch (e) {
      throw new MediaInfoError('Failed to instantiate MediaInfoLib', e);
    }
  }
 
  public async getInfo(input: MediaInfoInput): Promise<MediaInfoData> {
    if (!this.lib) {
      await this.instantiateLib();
    }
 
    try {
      return await new Promise((resolve, reject) => {
        const normalizedInput = MediaInfo.normalizeInput(input);
        const stream = MediaInfo.getDataStream(normalizedInput, reject);
        resolve(this.getMediaInfoData(stream));
      });
    } catch (e) {
      throw new MediaInfoError('Failed to read media data', e);
    }
  }
 
  private static normalizeInput(input: MediaInfoInput): string {
    let normalizedInput;
    if (input instanceof URL) {
      normalizedInput = input.toString();
    } else {
      normalizedInput = input;
    }
 
    return normalizedInput;
  }
 
  private static getDataStream(input: string, errorHandler: ErrorHandlerFunction) {
    let stream;
 
    if (input.toLowerCase().startsWith('http')) {
      stream = got.stream(input);
    } else {
      throw new Error('Input other than HTTP is not supported yet');
    }
 
    stream.on('error', errorHandler);
 
    return stream;
  }
 
  private getMediaInfoData(stream): Promise<MediaInfoData> {
    return new Promise(async resolve => {
      const mediaInfoInstance = new this.lib.MediaInfo();
 
      mediaInfoInstance.Open_Buffer_Init(-1, 0);
 
      let seekTo: number;
 
      stream.on('data', (chunk) => {
        mediaInfoInstance.Open_Buffer_Continue(chunk);
        seekTo = mediaInfoInstance.Open_Buffer_Continue_Goto_Get();
 
        if (seekTo !== -1) {
          mediaInfoInstance.Open_Buffer_Init(-1, seekTo);
          stream.end();
        }
      });
 
      stream.on('end', () => {
        mediaInfoInstance.Open_Buffer_Finalize();
        mediaInfoInstance.Option('Output', 'JSON');
        mediaInfoInstance.Option('Complete');
        const output: any = JSON.parse(mediaInfoInstance.Inform());
        mediaInfoInstance.Close();
        mediaInfoInstance.delete();
        resolve(output);
      });
    });
  }
}