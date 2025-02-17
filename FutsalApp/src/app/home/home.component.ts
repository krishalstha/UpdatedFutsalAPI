import { Component,OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
// import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent {
  //isShownavbar: boolean = true;
  constructor(private dialog: MatDialog,
    //  private appcomponent: AppComponent,
    private router: Router,
    
  ) { 
    // this.appcomponent.isShownavbar=true;
  }
  ngOnInit(): void{
    // localStorage.setItem("shownavbar", "true") 
    // this.appcomponent.isShownavbar=true; 
  }
  navigateToFutsal(): void {
    this.router.navigate(['/futsal']);
  } 
}