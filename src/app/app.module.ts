import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewInstitutionComponent } from './new-institution/new-institution.component';
import { ManagePartnersComponent } from './manage-partners/manage-partners.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BasicAuthInterceptor } from './_helpers/basic-auth.interceptor';

import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  declarations: [
    AppComponent,
    NewInstitutionComponent,
    ManagePartnersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgPipesModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
