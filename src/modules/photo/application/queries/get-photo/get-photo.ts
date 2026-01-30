import { GetPhotoQuery } from '.';
import { PhotoDetailsView } from './photo-details.view.type';

export abstract class GetPhoto {
  abstract execute(command: GetPhotoQuery): Promise<PhotoDetailsView>;
}
