import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InstitutionsService } from '../services/institutions.service';

import { environment } from '../../environments/environment';


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
    crp: new FormControl('', [Validators.required]),
    website: new FormControl('', Validators.pattern(this.reg))
  });
  insTypes = [];
  countries = [];
  crps = [];

  constructor(private institutionsService: InstitutionsService) { }

  ngOnInit() {
    this.getInstitutionsTypes();
    this.getCountries();
    this.getCRPS();
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    let params;
    if (this.form.status === 'VALID') {
      params = {
        "name": this.form.value.name,
        "acronym": this.form.value.acronym,
        "websiteLink": this.form.value.website,
        "institutionTypeCode": this.form.value.type,
        "hqCountryIso": this.form.value.headquarter,
        "externalUserMail": environment.default_user.email,
        "externalUserName": environment.default_user.name,
        "externalUserComments": environment.default_user.comments
      }
      // console.log(params, this.form.value)
      this.institutionsService.createPartner(this.form.value.crp, params)
        .subscribe(
          res => {
            console.log(res);
            // this.crps = res;
            this.resetValues()
          },
          error => {
            console.error("submit", error);
          },
        )
    }
  }

  resetValues() {
    this.form.reset({ name: '', headquarter: '', type: '', website: '', acronym: '' , crp: ''});
  }

  changeWebsite(e, prop?) {
    console.log(e, prop);
  }



  /**
   * ** API calls
   */
  getInstitutionsTypes() {
    return this.institutionsService.getInstitutionsTypes()
      .subscribe(
        res => {
          // console.log(res);
          this.insTypes = res;
        },
        error => {
          console.error("getInstitutionsTypes", error);
        },
      )
  }
  getCountries() {
    return this.institutionsService.getCountries()
      .subscribe(
        res => {
          // console.log(res);
          this.countries = res;
        },
        error => {
          console.error("getCountries", error);
        },
      )
  }
  getCRPS() {
    return this.institutionsService.getCRPS()
      .subscribe(
        res => {
          // console.log(res);
          this.crps = res;
        },
        error => {
          console.error("getCRPS", error);
        },
      )
  }

}
