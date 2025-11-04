import { getRepositoryDetails } from "../../utils";

export interface BilingualText {
  es: string;
  en: string;
}

export interface Project {
  id: string;
  name: BilingualText;
  description: BilingualText;
  demoLink: string;
  tags?: string[];
  postLink?: string;
  demoLinkRel?: string;
  [key: string]: any;
}

export const projects: Project[] = [
  {
    id: "proj-1",
    name: {
      es: "Web Personal",
      en: "Personal Website"
    },
    description: {
      es: "Un blog que comparte recursos y tutoriales de desarrollo web",
      en: "A blog that sharing web development resources and tutorials"
    },
    demoLink: "https://kobouharriet.site",
    tags: ["Site"],
  },
  {
    id: "proj-2",
    name: {
      es: "Home Manager + Nix",
      en: "Home Manager + Nix"
    },
    description: {
      es: "Home Manager: gestión de configuraciones de usuario con Nix.",
      en: "Home Manager: user configuration management with Nix."
    },
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
