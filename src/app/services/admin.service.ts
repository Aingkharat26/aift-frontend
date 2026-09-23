import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ModelLimitInfo {
  id: string;
  name: string;
  displayName: string;
  priority: number;
  status: string;
  color: string;
  inputTokenLimit: number;
  outputTokenLimit: number;
  rpmQuota: number;
  rpdQuota: number;
  tpmQuota: string;
  description: string;
}

export interface LiveGoogleModel {
  name: string;
  displayName: string;
  inputTokenLimit: number;
  outputTokenLimit: number;
  description: string;
}

export interface ModelLimitsResponse {
  success: boolean;
  data: {
    apiKeyConfigured: boolean;
    isApiKeyValid: boolean;
    activeModels: ModelLimitInfo[];
    liveGoogleModels: LiveGoogleModel[];
    systemQuotas: {
      freeTierRpm: number;
      freeTierRpd: number;
      freeTierTpm: number;
    };
  };
}

export interface PingResult {
  success: boolean;
  latencyMs: number;
  model: string;
  reply?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/admin';

  getModelLimits(): Observable<ModelLimitsResponse> {
    return this.http.get<ModelLimitsResponse>(`${this.apiUrl}/models`);
  }

  pingModel(model: string): Observable<{ success: boolean; data: PingResult }> {
    return this.http.post<{ success: boolean; data: PingResult }>(`${this.apiUrl}/ping`, { model });
  }
}
