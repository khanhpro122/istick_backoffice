interface IResearch {
  id: number;
  slug: string;
  bannerUrl: string;
  title: string;
  type: string;
  description: string;
  status: 'DRAFT' | 'PUBLISHED',
  timeToRead: number,
  field: string,
  overview: string,
  author: string,
  authorAvatar: string,
  // post_type: 'string'
}

type ListResearch = IResearch[];

export type { IResearch, ListResearch };
