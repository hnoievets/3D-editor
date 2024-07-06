import { CsgType } from './operations/constants';
import { Hole } from './operations/hole';
import { Solid } from './operations/solid';

export const OperationConstructors = {
  [CsgType.SOLID]: Solid,
  [CsgType.HOLE]: Hole,
};
