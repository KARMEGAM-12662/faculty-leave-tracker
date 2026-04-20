import { Component, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div style="max-width: 800px; margin: 2rem auto; font-family: sans-serif;">
      <h1>🏛️ Faculty Leave Tracker</h1>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #ddd;">
        <h3>Submit New Request</h3>
        <input [(ngModel)]="newName" placeholder="Faculty Name" style="margin-right:10px; padding:8px">
        <input [(ngModel)]="newDate" type="date" style="margin-right:10px; padding:8px">
        <button (click)="submitLeave()" style="padding:8px 15px; background:#007bff; color:white; border:none; border-radius:4px; cursor:pointer">Submit</button>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <thead style="background: #333; color: white;">
          <tr>
            <th style="padding:12px; text-align:left">Faculty</th>
            <th style="padding:12px; text-align:left">Date</th>
            <th style="padding:12px; text-align:left">Status</th>
            <th style="padding:12px; text-align:left">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (req of requests(); track req.id) {
            <tr>
              <td style="padding:12px; border-bottom:1px solid #eee">{{ req.facultyName }}</td>
              <td style="padding:12px; border-bottom:1px solid #eee">{{ req.leaveDate }}</td>
              <td style="padding:12px; border-bottom:1px solid #eee">
                <span [style.color]="req.status === 'Approved' ? 'green' : req.status === 'Rejected' ? 'red' : 'orange'">
                  {{ req.status }}
                </span>
              </td>
              <td style="padding:12px; border-bottom:1px solid #eee">
                @if (req.status === 'Pending') {
                  <button (click)="updateStatus(req.id, 'Approved')" style="background:green; color:white; border:none; margin-right:5px">✔</button>
                  <button (click)="updateStatus(req.id, 'Rejected')" style="background:red; color:white; border:none">✖</button>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class AppComponent {
  requests = signal<any[]>(JSON.parse(localStorage.getItem('leaveData') || '[]'));
  newName = '';
  newDate = '';

  constructor() {
    effect(() => {
      localStorage.setItem('leaveData', JSON.stringify(this.requests()));
    });
  }

  submitLeave() {
    if (!this.newName || !this.newDate) return;
    const newEntry = {
      id: Date.now(),
      facultyName: this.newName,
      leaveDate: this.newDate,
      status: 'Pending'
    };
    this.requests.update(prev => [newEntry, ...prev]);
    this.newName = ''; this.newDate = '';
  }

  updateStatus(id: number, newStatus: string) {
    this.requests.update(list => 
      list.map(req => req.id === id ? { ...req, status: newStatus } : req)
    );
  }
}
