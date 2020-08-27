import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewInstitutionComponent } from './new-institution/new-institution.component';
import { ManagePartnersComponent } from './manage-partners/manage-partners.component';


const routes: Routes = [
  { path: 'new-institution', component: NewInstitutionComponent },
  { path: 'manage-institutions', component: ManagePartnersComponent },
  { path: '',   redirectTo: '/new-institution', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
