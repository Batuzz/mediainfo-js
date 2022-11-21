import { MediaInfoInput } from 'src';

export class MediaInfoError extends Error {
  constructor(public readonly message: string, public readonly higherOrderError: any) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class MediaInfoInputError extends MediaInfoError {
  constructor(
    public readonly message: string,
    public readonly input: MediaInfoInput,
    public readonly higherOrderError: any = undefined) {
    super(message, higherOrderError);
  }
}