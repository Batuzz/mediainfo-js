import * as MediaInfoLib from '../lib/MediaInfoWasm';
import { MediaInfoError } from './errors';
import { InputHandlerFactory } from './inputHandlers/inputHandlerFactory';
 
export type MediaInfoInput = URL | string;
 
export type MediaInfoData = any; // maybe we'll add concrete types in future
 
type ErrorHandlerFunction = (reason: any) => void;

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
      return await new Promise(async (resolve, reject) => {
        const normalizedInput = MediaInfo.normalizeInput(input);
        const stream = await MediaInfo.getDataStream(normalizedInput, reject);
        const mediaInfoData = await this.getMediaInfoData(stream);
        resolve(mediaInfoData);
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

  private static async getDataStream(input: string, errorHandler: ErrorHandlerFunction) {
    const inputHandler = InputHandlerFactory.createInputHandler(input);
    const stream = inputHandler.openStream(input);
    stream.on('error', errorHandler);
 
    return stream;
  }
 
  private getMediaInfoData(stream): Promise<MediaInfoData> {
    return new Promise(async resolve => {
      const mediaInfoInstance = new this.lib.MediaInfo();
 
      mediaInfoInstance.Open_Buffer_Init(-1, 0);
 
      stream.on('data', (chunk) => {
        mediaInfoInstance.Open_Buffer_Continue(chunk);
        mediaInfoInstance.Open_Buffer_Continue_Goto_Get();
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