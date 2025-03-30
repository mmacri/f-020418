// Using explicit string comparison to fix the type error
export const compareIds = (id1: string | number, id2: string | number): boolean => {
  return String(id1) === String(id2);
};
