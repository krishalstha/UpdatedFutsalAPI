import { Component, OnInit, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.css'] // Use the correct name of your CSS file
})
export class SidebarComponent implements OnInit {
  selectedBookingId: number | null = null;
  @Input() isSidebarOpen = true; // Sidebar is open by default

  ngOnInit(): void {}
  selectBooking(id: number): void {
    this.selectedBookingId = id;
  }
}
