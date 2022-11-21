import { FileInputHandler } from './fileInputHandler';
import { HttpInputHandler } from './httpInputHandler';
import { IMediaInfoInputHandler } from './IMediaInfoInputHandler';

export class InputHandlerFactory {
  public static createInputHandler(input: string): IMediaInfoInputHandler {
    if (input.toLowerCase().startsWith('http')) {
      return new HttpInputHandler();
    } else {
      return new FileInputHandler();
    }
  }
}