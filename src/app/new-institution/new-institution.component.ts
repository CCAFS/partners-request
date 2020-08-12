import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InstitutionsService } from '../services/institutions.service';



@Component({
  selector: 'app-new-institution',
  templateUrl: './new-institution.component.html',
  styleUrls: ['./new-institution.component.scss']
})
export class NewInstitutionComponent implements OnInit {

  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    acronym: new FormControl('', [Validators.minLength(3)]),
    type: new FormControl('', [Validators.required]),
    headquarter: new FormControl('', [Validators.required]),
    website: new FormControl('', Validators.pattern(this.reg))
  });
  insTypes = [];
  institutions = [];

  constructor(private institutionsService: InstitutionsService) { }

  ngOnInit() {
    this.getInstitutionsTypes();
    this.getInstitutions();
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    
    if (this.form.status === 'VALID') {
      console.log(this.form.value);
    }
  }

  resetValue() {
    this.form.reset({ name: '', email: '', body: '' });
  }

  changeWebsite(e) {
    console.log(e);
  }


  getInstitutionsTypes(){
    return this.institutionsService.getInstitutionsTypes()
    .subscribe(
      res => {
        console.log(res);
        this.insTypes = res;
        // this.dashboardCommentsData = this.dashService.groupData(res.data);
        // this.hideSpinner();
      },
      error => {
        // this.hideSpinner()
        // console.log("getCommentStats", error);
        // this.alertService.error(error);
      },
    )
  }
  getInstitutions(){
    return this.institutionsService.getInstitutions()
    .subscribe(
      res => {
        console.log(res);
        this.institutions = res;
        // this.dashboardCommentsData = this.dashService.groupData(res.data);
        // this.hideSpinner();
      },
      error => {
        // this.hideSpinner()
        // console.log("getCommentStats", error);
        // this.alertService.error(error);
      },
    )
  }

}
