import { Component, OnInit, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, NgIf],
  templateUrl: './sidebar.component.html',
styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit{
  @Input() isSidebarOpen = true; // Sidebar is open by default
  ngOnInit(): void {
  }

}
