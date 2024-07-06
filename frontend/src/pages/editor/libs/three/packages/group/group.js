import { Box3, Group as ThreeGroup, Vector3 } from 'three';

import { editor } from '../../editor';

class Group extends ThreeGroup {
  #box;
  #vector;

  constructor() {
    super();
    // ініціалізація об'єкт для знаходження центру групи об'єктів
    this.#box = new Box3();
    // ініціалуузація пестого вектору з довжиною 3
    this.#vector = new Vector3();
  }

  // метод групування, що приймає масив
  group(children) {
    // скидання попереднього центру
    this.#box.makeEmpty();

    // додавання до боксу переданих об'єктів
    children.forEach((child) => this.#box.expandByObject(child));

    //встановлення позиції группі, що відповідає візуальному її центру
    this.position.copy(this.#box.getCenter(this.#vector));
    // додавання об'єктів у группу
    children.forEach((child) => this.attach(child));

    // повернення групи
    return this;
  }

  // повертає группі що розширена переданими елементами
  getExpanded(children) {
    // конкатинація переданих об'єктів та вже існуючих
    children = this.children.concat(children);
    
    //видалення групи
    this.removeFromParent();

    //повернення нової розширенної группи
    return new this.constructor().group(children);
  }
  // розгрупування
  ungroup(target = editor.scene) {
    //видалення группи з батьківського об'єкту (сцени)
    this.removeFromParent();

    // перенесення елементів групи до цільового об'єкту
    for (let i = this.children.length - 1; i >= 0; i--) {
      target.attach(this.children[i]);
    }
  }

  // видаленн пам'яті для усіх улументів групи
  dispose() {
    this.children.forEach((object) => object.dispose());
    this.clear();
  }

  // встановлення коьору кожному члену групи
  setColor(color) {
    this.children.forEach((child) => child.setColor(color));
  }

  changeOperationTo(type) {
    let operation;

    [...this.children].forEach((child) => {
      operation = child.changeOperationTo(type);

      if (child != operation) {
        child.removeFromParent();
        child.dispose();

        this.attach(operation);
      }
    });

    return this;
  }

  get hasAncestor() {
    return this.children.some(({ hasAncestor }) => hasAncestor);
  }

  removeAncestor() {
    this.children.forEach((child) => child.removeAncestor());
  }

  undoOperation() {
    const group = new this.constructor();

    [...this.children].forEach((child) => {
      const subGroup = child.undoOperation();

      if (!subGroup) {
        group.add(child);
        return;
      }

      subGroup.ungroup(group);
    });

    group.position.copy(this.position);
    group.scale.copy(this.scale);
    group.rotation.copy(this.rotation);

    this.removeFromParent();

    return group;
  }
}

export { Group };
