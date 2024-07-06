import { ADDITION } from 'three-bvh-csg';
import { CsgOperation } from './csg_operation';
import { CsgType } from './constants';
import { MeshStandardMaterial } from 'three';
import { MaterialProperties } from './enum';

export class Solid extends CsgOperation {
  constructor(
    geometry,
    material = new MeshStandardMaterial(MaterialProperties[CsgType.SOLID])
  ) {
    super(geometry, material);

    this.type = CsgType.SOLID;

    this.castShadow = true;
    this.operation = ADDITION;
  }
}
