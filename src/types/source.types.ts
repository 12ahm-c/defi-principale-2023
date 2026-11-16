export type SourceCategory =
  | 'scientifique_institutionnel'
  | 'institutionnel'
  | 'pedagogique_mediatique'
  | 'outil_interactif';

export interface SourceDefinitionDTO {
  id: string;
  officialName: string;
  category: SourceCategory;
  roleFr: string;
  keyCaveatFr: string;
  url: string;
}
