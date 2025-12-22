import { CHATGPT_ENDPOINTS } from '@/backend/constants';

export function isChatGPTEndpoint(url: string): boolean {
    return CHATGPT_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

export function generateId(type: 'req'|'issue' = 'req'): string {
    return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}