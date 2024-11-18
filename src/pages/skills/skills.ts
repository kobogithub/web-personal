
export interface Skills {
  name: string;
  demoLink: string;
  tags?: string[],
  description?: string;
  postLink?: string;
  demoLinkRel?: string;
  [key: string]: any;
}

export const skills: Skills[] = [
  {
    name: 'Web Personal',
    description: 'A blog that sharing web development resources and tutorials',
    demoLink: 'https://kobouharriet.site',
    tags: ['Site']
  }
]
