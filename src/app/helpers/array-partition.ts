export interface PartitionResult<T> {
  accepted: T[];
  rejected: T[];
}

export const arrayPartition = <T>(
  array: T[],
  predicate: (value: T) => boolean
): PartitionResult<T> => {
  const accepted: T[] = [];
  const rejected: T[] = [];
  array.forEach((value) => (predicate(value) ? accepted.push(value) : rejected.push(value)));
  return { accepted, rejected };
};
