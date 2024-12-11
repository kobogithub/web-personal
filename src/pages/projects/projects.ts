import { getRepositoryDetails } from "../../utils";

export interface Project {
  name: string;
  demoLink: string;
  tags?: string[];
  description?: string;
  postLink?: string;
  demoLinkRel?: string;
  [key: string]: any;
}

export const projects: Project[] = [
  {
    name: "Web Personal",
    description: "A blog that sharing web development resources and tutorials",
    demoLink: "https://kobouharriet.site",
    tags: ["Site"],
  },
  {
    name: "Home Manager + Nix",
    description: "Home Manager: gestion de configuraciones de usuario con Nix.",
    demoLink: "https://github.com/kobogithub/dotfiles-home-manager",
    tags: ["Nix", "Linux"],
  },
  // {
  //   ...(await getRepositoryDetails('syakirurahman/organization-tree')),
  //   name: 'Organization tree',
  //   demoLink: 'https://organization-tree-2a446.web.app/',
  //   tags: ['Hobby']
  // }
];
