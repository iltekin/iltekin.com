import type { NextRequest } from 'next/server';

import { queryBuilder, type ReactionName } from '@/lib/planetscale';
import { buildApiResponse } from '@/utils/response';

export const config = { runtime: 'edge' };

// eslint-disable-next-line max-lines-per-function
export default async function handler(req: NextRequest) {
  try {
    const { pathname } = new URL(req.nextUrl || '');
    const slug = pathname.substring(pathname.lastIndexOf('/') + 1);
    if (!slug) {
      return buildApiResponse(400, {
        success: false,
        error: 'Slug is required.',
      });
    }

    const data = await queryBuilder
      .selectFrom('counters')
      .where('slug', '=', slug)
      .select(['slug', 'likes', 'loves', 'awards', 'bookmarks'])
      .execute();

    if (req.method === 'POST') {
      const body = await req.json();
      const reaction = body?.reaction as ReactionName;
      if (!reaction) {
        return buildApiResponse(400, {
          success: false,
          error: 'Reaction key is required.',
        });
      }

      const reactionCount: number = !data.length
        ? 0
        : Number(data[0]?.[reaction] || 0);

      await queryBuilder
        .insertInto('counters')
        .values({ slug, [reaction as string]: 1 })
        .onDuplicateKeyUpdate({ [reaction as string]: reactionCount + 1 })
        .execute();

      return buildApiResponse(200, {
        success: true,
        counters: { ...data, [reaction as string]: reactionCount + 1 },
      });
    }

    if (req.method === 'GET') {
      const [counters] = data;
      if (!counters)
        return buildApiResponse(200, { success: true, counters, total: 0 });

      const total = Object.keys(counters).reduce(
        // eslint-disable-next-line
        (accumulator: string, key: string): string => {
          return (
            Number(accumulator) +
            Number(counters[key as keyof typeof counters] || 0)
          ).toString();
        },
        '0',
      );

      return buildApiResponse(200, {
        success: true,
        counters,
        total,
      });
    }

    return buildApiResponse(405, {
      success: false,
      error: 'Method not allowed!',
    });
  } catch (err) {
    return buildApiResponse(500, {
      success: false,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      error: err?.message || err?.stackTrace.toString() || 'Unexpected error',
    });
  }
}
