export function canEditOperator(
  canManageOperators: boolean,
  currentUserId: number,
  operatorUserId: number,
) {
  return canManageOperators || currentUserId === operatorUserId;
}

export function canShowOperatorActions(
  canManageOperators: boolean,
  currentUserId: number,
) {
  return canManageOperators || currentUserId > 0;
}
