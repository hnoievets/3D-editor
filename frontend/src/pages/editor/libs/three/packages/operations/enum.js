import { CsgType } from './constants';

export const MaterialProperties = {
  [CsgType.SOLID]: { flatShading: true, transparent: true, opacity: 1 },
  [CsgType.HOLE]: {
    flatShading: true,
    transparent: true,
    opacity: 0.8,
  },
};
