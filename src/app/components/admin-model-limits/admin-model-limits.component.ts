import { Component, OnInit, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, ModelLimitsResponse, PingResult } from '../../services/admin.service';

@Component({
  selector: 'app-admin-model-limits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-model-limits.component.html',
  styleUrl: './admin-model-limits.component.scss',
})
export class AdminModelLimitsComponent implements OnInit {
  private adminService = inject(AdminService);

  close = output<void>();

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  data = signal<ModelLimitsResponse['data'] | null>(null);
  pingingModel = signal<string | null>(null);
  pingResults = signal<Record<string, PingResult>>({});
  activeTab = signal<'waterfall' | 'google-models'>('waterfall');
  expandedModelId = signal<string | null>(null);

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.loading.set(true);
    this.error.set(null);
    this.adminService.getModelLimits().subscribe({
      next: (res) => {
        this.data.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(
          err.error?.message || 'ไม่สามารถโหลดข้อมูลจำกัดโมเดลได้ (อาจไม่มีสิทธิ์ Admin)',
        );
        this.loading.set(false);
      },
    });
  }

  toggleExpand(modelId: string) {
    if (this.expandedModelId() === modelId) {
      this.expandedModelId.set(null);
    } else {
      this.expandedModelId.set(modelId);
    }
  }

  testPing(modelName: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (this.pingingModel()) return;
    this.pingingModel.set(modelName);

    this.adminService.pingModel(modelName).subscribe({
      next: (res) => {
        this.pingResults.update((prev) => ({ ...prev, [modelName]: res.data }));
        this.pingingModel.set(null);
      },
      error: (err) => {
        this.pingResults.update((prev) => ({
          ...prev,
          [modelName]: {
            success: false,
            latencyMs: 0,
            model: modelName,
            error: err.error?.message || err.message || 'Ping ล้มเหลว',
          },
        }));
        this.pingingModel.set(null);
      },
    });
  }

  getPingResult(modelName: string): PingResult | undefined {
    return this.pingResults()[modelName];
  }

  formatTokens(tokens: number): string {
    if (!tokens) return '-';
    if (tokens >= 1000000) {
      return (tokens / 1000000).toLocaleString() + 'M';
    }
    if (tokens >= 1000) {
      return (tokens / 1000).toLocaleString() + 'K';
    }
    return tokens.toLocaleString();
  }
}
