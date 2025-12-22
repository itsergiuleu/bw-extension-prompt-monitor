export interface InterceptorConfig {
    timeout: number;
    onSensitiveDataDetected: (data: SensitiveDataDetectedEvent) => void;
    onRequestResolved: (requestId: string, action: string) => void;
    shouldIntercept: (url: string, method: string) => boolean;
}

export interface SensitiveDataDetectedEvent {
    requestId: string;
    emails: string[];
    url: string;
    method: string;
    body: string | null;
    headers: Record<string, string>;
}

export interface PendingRequest {
    resolve: (value: Response | PromiseLike<Response>) => void;
    reject: (reason?: unknown) => void;
    originalArgs: Parameters<typeof fetch>;
    timeoutId: ReturnType<typeof setTimeout>;
}

export interface SensitiveDataResult {
    success: boolean;
    data: SensitiveDataItem[];
}

export interface SensitiveDataItem {
    type: string;
    value: string;
}
