import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';  // Import your routes configuration

// Bootstrap the application with standalone components
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      HttpClientModule,  // Import necessary modules
      BrowserAnimationsModule,
      FormsModule,
      ToastrModule.forRoot() // Ensure ToastrModule is initialized properly
    ),
    provideZoneChangeDetection({ eventCoalescing: true }), // Enable event coalescing for performance optimization
    provideRouter(routes),  // Set up routing
  ],
})
  .catch((err) => console.error('Bootstrap error:', err));  // Handle any bootstrap errors
