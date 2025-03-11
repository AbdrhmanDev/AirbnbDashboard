import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="delete-dialog">
      <div class="dialog-header">
        <mat-icon class="warning-icon">warning</mat-icon>
        <h2>Confirm Deletion</h2>
      </div>

      <div class="dialog-content">
        <p>Are you sure you want to delete "{{ data.hotelName }}"?</p>
        <p class="warning-text">This action cannot be undone.</p>
      </div>

      <div class="dialog-actions">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="warn" (click)="onConfirm()">
          Delete
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .delete-dialog {
        padding: 20px;
        max-width: 400px;
      }

      .dialog-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
      }

      .warning-icon {
        color: #f44336;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      h2 {
        margin: 0;
        color: #333;
      }

      .dialog-content {
        margin-bottom: 24px;
      }

      .warning-text {
        color: #666;
        font-size: 14px;
        margin-top: 8px;
      }

      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
    `,
  ],
})
export class DeleteConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hotelName: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
