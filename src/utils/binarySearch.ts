export const binarySearchOfPouchDbDocs = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  docs: PouchDB.Core.Document<any>[],
  docId: string
): number => {
  let low = 0;
  let high = docs.length - 1;
  let mid;
  while (low <= high) {
    mid = Math.floor((low + high) / 2);
    if (docs?.[mid]?._id === docId) return mid;
    docs?.[mid]?._id > docId ? (low = mid + 1) : (high = mid - 1);
  }
  return -1;
};
