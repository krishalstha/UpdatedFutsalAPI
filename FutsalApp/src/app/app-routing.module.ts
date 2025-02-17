import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FutsalDetailsComponent } from './futsal-details/futsal-details.component';
import { AcceptBookingsComponent } from './accept-bookings/accept-bookings.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';  // Admin Layout Component

const routes: Routes = [
  // Public Routes
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  // Admin Routes (wrap them inside AdminDashboardComponent)
  {
    path: 'admin-dashboard', component: AdminDashboardComponent,  // Admin Layout Wrapper
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'accept-bookings', component: AcceptBookingsComponent },
      { path: 'futsaldetailcomponent', component: FutsalDetailsComponent },
       ]},
       { path: '', redirectTo: 'dashboard', pathMatch: 'full' },  // Default route is dashboard
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
