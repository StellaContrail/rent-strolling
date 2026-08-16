export function shouldRefetch(prevMuniCode: string | null, nextMuniCode: string): boolean {
  return prevMuniCode !== nextMuniCode;
}
