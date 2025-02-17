import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  imports: [NgIf],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.css']
})
export class TopbarComponent implements OnInit{
  
  isLoggedIn: boolean = false;
  @Output() sidebarToggle = new EventEmitter<void>();
constructor(
  private authService: AuthService, private router: Router
){}
  ngOnInit(): void {
    const token = localStorage.getItem("Token");
    if(token){
      this.isLoggedIn =true;
    }else{
      this.isLoggedIn = false;
    }
    // Check if the user is logged in
    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;   
    });
    
   
  }
  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  logout(): void {  
    this.authService.logout(); 
    this.isLoggedIn = false;  
    localStorage.clear();
    this.router.navigate(['/home']).then(() => {
      window.location.reload(); // Reload the home page after navigation
    });
  }
  
}
