export function getLastParentGroupOrOneself(object) {
  while (object.parent.isGroup) {
    object = object.parent;
  }

  return object;
}
