import type { InmetAlert } from '../types.js';

const INMET_ACTIVE_ALERTS_URL = 'https://apiprevmet3.inmet.gov.br/avisos/ativos';
const INMET_ALERTS_CACHE_TTL_MS = 10 * 60 * 1000;

const normalizeText = (text: string): string =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];

const getSeverityRank = (severity: string): number => {
  const normalizedSeverity = normalizeText(severity);
  if (normalizedSeverity.includes('grande perigo')) return 3;
  if (normalizedSeverity === 'perigo') return 2;
  if (normalizedSeverity.includes('perigo potencial')) return 1;
  return 0;
};

export const selectMostSevereAlerts = (alerts: InmetAlert[]): InmetAlert[] => {
  const alertsByPhenomenon = new Map<string, InmetAlert>();
  for (const alert of alerts) {
    const key = normalizeText(alert.phenomenon).trim();
    const current = alertsByPhenomenon.get(key);
    if (!current || getSeverityRank(alert.severity) > getSeverityRank(current.severity)) {
      alertsByPhenomenon.set(key, alert);
    }
  }
  return [...alertsByPhenomenon.values()];
};

interface CachedInmetAlert {
  municipalities: string;
  alert: InmetAlert;
}

let cachedAlerts: { expiresAt: number; alerts: CachedInmetAlert[] } | null = null;
let alertsRequest: Promise<CachedInmetAlert[]> | null = null;

const includesCity = (municipalities: string, cityName: string): boolean => {
  const normalizedMunicipalities = normalizeText(municipalities);
  const normalizedCity = normalizeText(cityName).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|,)\\s*${normalizedCity}\\s+-\\s+rs\\s+\\(\\d+\\)(?:,|$)`)
    .test(normalizedMunicipalities);
};

const toInmetAlert = (value: unknown): InmetAlert | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = value.id_aviso;
  const phenomenon = value.descricao;
  const severity = value.severidade;
  const start = value.inicio;
  const end = value.fim;
  if (
    (typeof id !== 'string' && typeof id !== 'number') ||
    typeof phenomenon !== 'string' ||
    typeof severity !== 'string' ||
    typeof start !== 'string' ||
    typeof end !== 'string'
  ) {
    return null;
  }

  return {
    id: String(id),
    phenomenon,
    severity,
    start,
    end,
    risks: getStringArray(value.riscos),
    instructions: getStringArray(value.instrucoes),
  };
};

const fetchActiveAlerts = async (): Promise<CachedInmetAlert[]> => {
  const response = await fetch(INMET_ACTIVE_ALERTS_URL, {
    signal: AbortSignal.timeout(10_000),
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`INMET returned HTTP ${response.status}.`);
  }

  const data: unknown = await response.json();
  if (!isRecord(data)) {
    throw new Error('INMET returned an invalid response.');
  }

  const hasAlertLists = Array.isArray(data.hoje) || Array.isArray(data.amanha);
  const alertRecords = [
    ...(Array.isArray(data.hoje) ? data.hoje : []),
    ...(Array.isArray(data.amanha) ? data.amanha : []),
  ];
  if (!hasAlertLists) {
    throw new Error('INMET response does not contain the expected alert lists.');
  }

  const seenIds = new Set<string>();
  return alertRecords
    .filter((alert): alert is Record<string, unknown> => isRecord(alert))
    .map((record) => ({
      municipalities: typeof record.municipios === 'string' ? record.municipios : '',
      alert: toInmetAlert(record),
    }))
    .filter((item): item is CachedInmetAlert =>
      item.municipalities.length > 0 && item.alert !== null,
    )
    .filter((alert) => {
      if (seenIds.has(alert.alert.id)) {
        return false;
      }
      seenIds.add(alert.alert.id);
      return true;
    });
};

const getActiveAlerts = async (): Promise<CachedInmetAlert[]> => {
  if (cachedAlerts && cachedAlerts.expiresAt > Date.now()) {
    return cachedAlerts.alerts;
  }
  if (alertsRequest) {
    return alertsRequest;
  }

  alertsRequest = fetchActiveAlerts()
    .then((alerts) => {
      cachedAlerts = { alerts, expiresAt: Date.now() + INMET_ALERTS_CACHE_TTL_MS };
      return alerts;
    })
    .finally(() => {
      alertsRequest = null;
    });
  return alertsRequest;
};

export const getInmetAlerts = async (cityName: string): Promise<InmetAlert[]> => {
  const alerts = await getActiveAlerts();
  const cityAlerts = alerts
    .filter(({ municipalities }) => includesCity(municipalities, cityName))
    .map(({ alert }) => alert);
  return selectMostSevereAlerts(cityAlerts);
};
