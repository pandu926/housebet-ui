export type EditionId = 'desk' | 'matrix' | 'arena';

function normalizeEdition(raw?: string | null): EditionId | null {
  if (!raw) return null;
  const val = raw.trim().toLowerCase();
  if (val === '1' || val === 'sub1' || val === 'desk') return 'desk';
  if (val === '2' || val === 'sub2' || val === 'matrix') return 'matrix';
  if (val === '3' || val === 'sub3' || val === 'arena') return 'arena';
  return null;
}

/**
 * Resolves which standalone Housebets Contest Submission architecture is active.
 * - In standalone production builds (`VITE_LOCK_EDITION=true`), strictly locks to `VITE_EDITION`
 *   with zero URL override so each submission link is a 100% pure standalone product.
 * - In dev/tunnel mode, supports `?edition=1|2|3` (or `desk|matrix|arena`) for instant live review.
 */
export function getActiveEdition(): EditionId {
  const envEdition = normalizeEdition(import.meta.env.VITE_EDITION);
  const isLocked = import.meta.env.VITE_LOCK_EDITION === 'true';

  if (isLocked && envEdition) {
    return envEdition;
  }

  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const queryEdition = normalizeEdition(params.get('edition'));
    if (queryEdition) {
      return queryEdition;
    }
  }

  return envEdition || 'desk';
}
