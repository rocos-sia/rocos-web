/** Public, non-secret configuration for a separately hosted simulation experience. */
export interface SimulationConfig { enabled: boolean; experienceUrl: string | null }
export function parseSimulationConfig(value: unknown): SimulationConfig {
  const disabled = { enabled: false, experienceUrl: null };
  if (!value || typeof value !== 'object') return disabled;
  const candidate = value as Record<string, unknown>;
  if (candidate.enabled !== true || typeof candidate.experienceUrl !== 'string') return disabled;
  try {
    const url = new URL(candidate.experienceUrl);
    if (url.protocol !== 'https:' || url.username || url.password) return disabled;
    return { enabled: true, experienceUrl: url.href };
  } catch { return disabled; }
}
