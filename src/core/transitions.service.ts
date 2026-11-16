import transitionsData from '@/data/transitions2050.json';
import type { TransitionPathwayDTO, TransitionsMeta } from '@/types/transitions.types';

interface TransitionsFile {
  pathways: TransitionPathwayDTO[];
  meta: TransitionsMeta;
}

const data = transitionsData as TransitionsFile;

export class TransitionsService {
  static getPathways(): TransitionPathwayDTO[] {
    return data.pathways;
  }

  static getMeta(): TransitionsMeta {
    return data.meta;
  }
}

export default TransitionsService;