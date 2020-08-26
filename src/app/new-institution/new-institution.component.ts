import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InstitutionsService } from '../services/institutions.service';

import { NgxSpinnerService } from "ngx-spinner";

import { environment } from '../../environments/environment';
import { AlertService } from '../services/alert.service';


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

  constructor(private institutionsService: InstitutionsService,
    private alert: AlertService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.getInstitutionsTypes();
    this.getCountries();
    this.getCRPS();
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    let params;
    this.spinner.show();
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
            this.resetValues();
            this.spinner.hide();
            this.alert.success(`${res.partnerName} is ${res.requestStatus.toLowerCase()}.`);
          },
          error => {
            console.error("submit", error);
            this.alert.error(`${error.status} : ${error.statusText}.`)
            this.spinner.hide();
          },
        )
    }
  }

  resetValues() {
    this.form.reset({ name: '', headquarter: '', type: '', website: '', acronym: '', crp: '' });
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
          this.spinner.hide();

        },
        error => {
          console.error("getInstitutionsTypes", error);
          this.spinner.hide();

        },
      )
  }
  getCountries() {
    return this.institutionsService.getCountries()
      .subscribe(
        res => {
          // console.log(res);
          this.countries = res;
          this.spinner.hide();

        },
        error => {
          console.error("getCountries", error);
          this.spinner.hide();

        },
      )
  }
  getCRPS() {
    return this.institutionsService.getCRPS()
      .subscribe(
        res => {
          // console.log(res);
          this.crps = res.filter(crp => crp.cgiarEntityTypeDTO.code == 1 || crp.cgiarEntityTypeDTO.code == 3);
          this.spinner.hide();

        },
        error => {
          console.error("getCRPS", error);
          this.spinner.hide();

        },
      )
  }

}
