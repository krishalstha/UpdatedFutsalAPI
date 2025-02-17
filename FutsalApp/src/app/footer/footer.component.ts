import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [NgIf],
  templateUrl: './footer.component.html',
  styleUrl: './footer.css'
})
export class FooterComponent implements OnInit{
  isAdmin: boolean = false;
  ngOnInit(): void {
    this.checkUserRole();
  }
  

  checkUserRole() {
    const userData = localStorage.getItem('loggedInUser'); // ✅ Fetch stored user data
    if (userData) {
      const parsedUser = JSON.parse(userData); // ✅ Parse JSON
      this.isAdmin = parsedUser.roleId === 'Admin'; // ✅ Compare role
    } else {
      this.isAdmin = false; // Default to false if no user data found
    }
    console.log("Is Admin:", this.isAdmin); // ✅ Debugging log
  }
}
