import { Masonry, type MasonryBreakpoints } from '@/components/compounds';
import { Heading, Section } from '@/components/core';
import { useImmutableRequest } from '@/hooks/use-request';
import type { TopTrackData } from '@/lib/spotify';
import { breakpointsValues } from '@/stitches';
import type { FC } from '@/types';

import { SongCard } from './activity/SongCard';

const masonryBreakpoints: MasonryBreakpoints = {};
masonryBreakpoints['0'] = 1;
masonryBreakpoints[(breakpointsValues['mobile-sm'] || 0).toString()] = 1;
masonryBreakpoints[(breakpointsValues['tablet-sm'] || 0).toString()] = 2;

export const TopTracks: FC = () => {
  const { data } = useImmutableRequest<{ tracks?: Array<TopTrackData> }>(
    '/api/top-tracks',
  );
  if (!data?.tracks) return null;
  return (
    <Section
        id={'top-tracks'}
        css={{ gap: 'calc($$verticalContentPadding / 2)', px: 0 }}
      >
      <Heading as={'h4'}>Top Tracks</Heading>
      <Masonry
          breakpoints={masonryBreakpoints}
          gap={'calc($$verticalContentPadding / 2.5)'}
        >
        {data?.tracks?.map((song, index) => {
            return (
              <SongCard song={song} key={index} css={{ hocus: { my: 1 } }} />
            );
          })}
      </Masonry>
    </Section>
  );
};
