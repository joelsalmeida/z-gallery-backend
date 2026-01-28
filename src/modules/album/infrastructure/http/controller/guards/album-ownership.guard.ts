import { AlbumAccessPolicyPort } from '@/modules/album/application/ports/out';
import { AlbumId } from '@/modules/album/domain/value-objects';
import { AuthenticatedRequest } from '@/modules/auth/application/dtos/authentication-data.dto';
import { UserId } from '@/modules/user/domain/value-objects';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AlbumOwnershipGuard implements CanActivate {
  constructor(private readonly accessPolicy: AlbumAccessPolicyPort) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest<{ albumId: string }>>();

    const { albumId } = request.params;
    if (!albumId) throw new BadRequestException('albumId param is required');

    const canAccess = await this.accessPolicy.canAccessAlbum(
      AlbumId.restore(albumId),
      UserId.restore(request.user.sub),
    );
    if (!canAccess) throw new ForbiddenException();

    return true;
  }
}
