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
import { BDashboardComponent } from './dashboard/bdashboard.component';
import { AcceptBookingsComponent } from './accept-bookings/accept-bookings.component';
import { BookingDetailFormComponent } from './booking-detail-form/booking-detail-form.component';
import { SettingComponent } from './setting/setting.component';
import { AuthGuard } from './auth.guard';
import { AcceptedDetailsComponent } from './accepted-details/accepted-details.component';
import { ReportComponent } from './report/report.component';
import { PaymentComponent } from './payment/payment.component';
import { AdminBookingDetailsComponent } from './admin-booking-details/admin-booking-details.component';



export const routes: Routes = [
  { path: 'home', component: HomeComponent },  
  { path: 'register', component: RegisterComponent },  
  { path: 'futsaldetail', component: FutsalDetailFormComponent },
  { path: 'futsaldetailscomponent', component: FutsalDetailsComponent },
  { path: 'futsal', component: FutsalComponent },
  { path: 'bookingscreen/:futsalName', component: BookingDetailsComponent },
  { path: 'bookingdetailformcomponent', component: BookingDetailFormComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'contactus', component: ContactusComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'forget', component: ForgotPasswordComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Protect Admin Dashboard & its child routes
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent, 
    canActivateChild: [AuthGuard],  // Apply guard here
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },  
      { path: 'dashboard', component: DashboardComponent },
      { path: 'bdashboard', component: BDashboardComponent },
      { path: 'setting', component: SettingComponent },
      { path: 'acceptbookings', component: AcceptBookingsComponent },
      { path: 'futsaldetailcomponent', component: FutsalDetailsComponent },
      { path: 'accepted-details/:id', component: AcceptedDetailsComponent },
      { path: 'bookingscreen/:futsalName', component: BookingDetailsComponent },
      { path: 'adminbookingdetailscomponent', component: AdminBookingDetailsComponent },
      { path: 'bookingdetailformcomponent', component: BookingDetailFormComponent },
      { path: 'report', component: ReportComponent },
      { path: 'payment', component: PaymentComponent }  
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}