import { PhotoId } from '@/modules/photo/domain/value-objects';
import { UserId } from '@/modules/user/domain/value-objects';

export abstract class PhotoAccessPolicyPort {
  abstract canAccessPhoto(photoId: PhotoId, userId: UserId): Promise<boolean>;
}
