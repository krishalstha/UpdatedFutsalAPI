import { Component, AfterViewInit } from '@angular/core';
// import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  // ngAfterViewInit(): void {
  //   const ctx = document.getElementById('dashboardChart') as HTMLCanvasElement;
  //   new Chart(ctx, {
  //     type: 'bar',
  //     data: {
  //       labels: ['Users', 'Bookings', 'Revenue'],
  //       datasets: [{
  //         label: 'Stats',
  //         data: [120, 340, 12000],
  //         backgroundColor: ['#3498db', '#2ecc71', '#e74c3c'],
  //         borderWidth: 1
  //       }]
  //     }
  //   });
  // }
}
