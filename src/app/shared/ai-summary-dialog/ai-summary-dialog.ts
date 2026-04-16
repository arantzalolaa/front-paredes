import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface AiSummaryDialogData {
  title: string;
  summary: string;
}

@Component({
  selector: 'app-ai-summary-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './ai-summary-dialog.html',
  styleUrl: './ai-summary-dialog.scss',
})
export class AiSummaryDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: AiSummaryDialogData) {}
}