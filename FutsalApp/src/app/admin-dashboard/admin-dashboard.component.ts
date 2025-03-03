import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { AppComponent } from '../app.component';
import { TopbarComponent } from "../topbar/topbar.component";

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterModule, SidebarComponent, TopbarComponent],
  providers: [AppComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit{
  isShownavbar: boolean=false;
  isSidebarOpen = true; // Sidebar is visible by default

  constructor(
    private location: Location, 
    private router: Router
  ) {}
    ngOnInit(): void {
      this.isShownavbar = false;
       // Listen for back button press
    window.onpopstate = () => {
      this.logout();
    };
    }
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    }
    logout() {
      // Clear session data (if needed)
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to login or logout page
      this.router.navigate(['/login']);
      window.location.reload();
    }
  } 