export default function storageKey(
  uid: string | null | undefined,
  key: string,
): string {
  return uid ? `${uid}:${key}` : key;
}
