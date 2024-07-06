import { SUBTRACTION } from 'three-bvh-csg';

import { CsgOperation } from './csg_operation';
import { CsgType } from './constants';
import { MeshStandardMaterial } from 'three';
import { MaterialProperties } from './enum';

export class Hole extends CsgOperation {
  constructor(
    geometry,
    material = new MeshStandardMaterial(MaterialProperties[CsgType.HOLE])
  ) {
    super(geometry, material);

    this.type = CsgType.HOLE;
    this.operation = SUBTRACTION;
  }
}
