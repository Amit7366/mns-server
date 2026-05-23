export const extractSbmId = (member: string): string | null => {
  const piece = member.split('_').find(p => /^sbm\d+$/i.test(p));
  return piece ? piece.toLowerCase() : null;
};

export const parseUtc = (s: string): Date => {
  // "YYYY-MM-DD HH:mm:ss" -> ISO
  return new Date(`${s.replace(' ', 'T')}Z`);
};
