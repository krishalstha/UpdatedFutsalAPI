import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';  
import { AboutusComponent } from './aboutus/aboutus.component';  
import { FutsalComponent } from './futsal/futsal.component';
import { ContactusComponent } from './contactus/contactus.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forget/forget.component';
import { FutsalDetailFormComponent } from './FutsalDetails/futsal-detail-form/futsal-detail-form.component';
import { FutsalDetailsComponent } from './futsal-details/futsal-details.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AcceptBookingsComponent } from './accept-bookings/accept-bookings.component';
import { BookingDetailFormComponent } from './booking-detail-form/booking-detail-form.component';
import { SettingComponent } from './setting/setting.component';



export const routes: Routes = [
  { path: 'home', component: HomeComponent },  // Default route
  { path: 'register', component: RegisterComponent }, // Route for register page
  { path: 'futsaldetail', component: FutsalDetailFormComponent },
  { path: 'futsaldetailcomponent', component: FutsalDetailsComponent},
  { path:'futsaldetailscomponent', component: FutsalDetailsComponent },
  { path: 'futsal', component: FutsalComponent},
  { path: 'bookingscreen/:futsalName', component: BookingDetailsComponent },
  { path: 'bookingdetailformcomponent', component: BookingDetailFormComponent},
  { path: 'aboutus', component: AboutusComponent},
  { path: 'contactus', component: ContactusComponent},
  {path: 'contactus', component: ContactusComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent},
  { path: 'forget', component: ForgotPasswordComponent},
  //{ path: 'admin-dashboard', component: AdminDashboardComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'accept-bookings', component: AcceptBookingsComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'admin-dashboard', component: AdminDashboardComponent,  
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },  
      { path: 'dashboard', component: DashboardComponent },
      { path: 'setting', component: SettingComponent},
      { path: 'acceptbookings', component: AcceptBookingsComponent },
      { path: 'futsaldetailcomponent', component: FutsalDetailsComponent },
       ]},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
