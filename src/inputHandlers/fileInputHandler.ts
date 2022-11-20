import * as fs from 'fs';
import { MediaInfoInputError } from '../errors';
import { IMediaInfoInputHandler } from './IMediaInfoInputHandler';

export class FileInputHandler implements IMediaInfoInputHandler {
  public openStream(input: string): fs.ReadStream {
    try {
      const stream = fs.createReadStream(input);
      if (stream.errored) {
        throw stream.errored;
      }
      return stream;
    } catch (err) {
      throw new MediaInfoInputError('Could not open read stream to the file', input, err);
    }
  }
}
