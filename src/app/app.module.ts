import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from './material/material.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './features/auth/auth.module';
import { ReviewModule } from './features/review/review.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BasicInterceptor } from './core/interceptors/basic.interceptor';
import { ErrorHandler } from '@angular/core';
import { BasicErrorHandler } from './core/handlers/error-handler';

@NgModule({
  declarations: [AppComponent, HomePageComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    SharedModule,
    CoreModule,
    AuthModule,
    ReviewModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: BasicErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
