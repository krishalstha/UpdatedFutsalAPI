import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterModule } from '@angular/router';
import { AppComponent } from '../app.component';
import { TopbarComponent } from "../topbar/topbar.component";

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterModule, SidebarComponent, TopbarComponent],
  providers: [AppComponent],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit{
  isShownavbar: boolean=false;
  isSidebarOpen = true; // Sidebar is visible by default

  constructor(
    
  ) {
    }
    ngOnInit(): void {
      this.isShownavbar = false;
    }
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  } 