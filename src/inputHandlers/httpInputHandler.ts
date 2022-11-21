import got from 'got';
import { MediaInfoInputError } from 'src/errors';
import { Duplex } from 'stream';
import { IMediaInfoInputHandler } from './IMediaInfoInputHandler';

export class HttpInputHandler implements IMediaInfoInputHandler {
  public openStream(input: string): Duplex {
    try {
      const stream = got.stream(input);
      if (stream.errored) {
        throw stream.errored;
      }
      return stream;
    } catch (err) {
      throw new MediaInfoInputError('Could not open read stream from HTTP address', input, err);
    }
  }
}