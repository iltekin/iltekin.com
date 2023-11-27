import type { Route } from 'next';

import { mdiCarousel, mdiInstagram, mdiVideo } from '@/components/icons';
import type { InstagramPost } from '@/lib/instagram/types.d';
import { getRandomItem } from '@/utils/random';

import {
  InstaIcon,
  InstaPhotoContainer,
  InstaVideo,
  StyledPhoto,
} from './insta-photo.styles';

interface InstaPhotoProps {
  post: InstagramPost;
}

type MediaItem = Pick<InstagramPost, 'mediaType' | 'mediaUrl'>;

const getMediaFromPost = (post: InstagramPost): MediaItem => {
  if (!post.children || !post.children.length)
    return { mediaType: post.mediaType, mediaUrl: post.mediaUrl };
  const item = getRandomItem(post.children || []);
  return { mediaType: item.mediaType, mediaUrl: item.mediaUrl };
};

const getPostTitle = (post: InstagramPost): string => {
  let title = '';
  if (post.mediaType === 'VIDEO') title = 'Watch video';
  else title = `View photo${post.children?.length ? 's' : ''}`;
  return `${title} "${post.prunedCaption}" on Instagram`;
};

export const InstaPhoto = (props: InstaPhotoProps) => {
  const { post } = props;
  const media = getMediaFromPost(post);

  return (
    <InstaPhotoContainer
      title={getPostTitle(post)}
      href={(post.permalink || '#') as Route}
      style={{
        backgroundColor: `rgb(${
          post.colorPalette?.dominant ||
          post.colorPalette?.muted ||
          post.colorPalette?.vibrant
        })`,
      }}
    >
      {media.mediaType === 'IMAGE' ? (
        <StyledPhoto
          src={media.mediaUrl || ''}
          alt={post.accessibilityCaption || post.prunedCaption || ''}
          loading={'lazy'}
          decoding={'async'}
          width={post.dimensions?.width || 214}
          height={post.dimensions?.height || 214}
          crossOrigin={'anonymous'}
        />
      ) : media.mediaType === 'VIDEO' ? (
        <InstaVideo
          width={post.dimensions?.width || 214}
          height={post.dimensions?.height || 214}
          poster={post.thumbnailUrl}
          crossOrigin={'anonymous'}
          autoPlay
          muted
          loop
        >
          <source src={media.mediaUrl} type={'video/mp4'} />
        </InstaVideo>
      ) : null}
      <InstaIcon
        path={
          post.mediaType === 'CAROUSEL_ALBUM'
            ? mdiCarousel
            : post.mediaType === 'VIDEO'
              ? mdiVideo
              : mdiInstagram
        }
        size={1.75}
      />
    </InstaPhotoContainer>
  );
};
