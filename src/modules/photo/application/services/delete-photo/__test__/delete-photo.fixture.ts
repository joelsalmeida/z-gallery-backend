import { PhotoTestBuilder } from '@/modules/photo/domain/__test__/builders';

export const buildDeletePhotoFixture = () => {
  const photo = new PhotoTestBuilder().build();
  return { photo };
};
