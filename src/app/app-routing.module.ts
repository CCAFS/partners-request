import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewInstitutionComponent } from './new-institution/new-institution.component';
import { ManagePartnersComponent } from './manage-partners/manage-partners.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_helpers/auth.guard';
import { HomeComponent } from './home/home.component';
import { PartnerRoleGuard } from './_helpers/partner-role.guard';


const routes: Routes = [
  { path: 'new-institution', component: NewInstitutionComponent, canActivate: [AuthGuard]},
  { path: 'manage-institutions', component: ManagePartnersComponent, canActivate: [PartnerRoleGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
