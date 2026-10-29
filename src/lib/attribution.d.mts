export type Attribution = {
  session_id: string; touched: number; referrer: string | null; channel: string; oid: string | null;
  utm_source?: string | null; utm_medium?: string | null; utm_campaign?: string | null; utm_id?: string | null; utm_content?: string | null; utm_term?: string | null;
};
export type AttributionRuntime = {
  capture(): Attribution; pagePath(path?: string): string; gaConfig(): Record<string, string>;
  shouldRecordPage(): boolean; markPageRecorded(): void;
};
export function createAttributionRuntime(env: Window): AttributionRuntime;
export function attributionRuntime(): AttributionRuntime | null;
export function attributionFromRecord(row: { page_path?: string | null; referrer?: string | null; utm_source?: string | null; utm_medium?: string | null; utm_campaign?: string | null }): { channel: string; source: string | null; medium: string | null; campaign: string | null; content: string | null; oid: string | null };
export function channelLabel(channel: string): string;
export function campaignLabel(campaign: string | null): string;
