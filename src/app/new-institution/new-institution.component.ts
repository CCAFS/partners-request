import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InstitutionsService } from '../services/institutions.service';

import { NgxSpinnerService } from "ngx-spinner";

import { environment } from '../../environments/environment';
import { AlertService } from '../services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-new-institution',
  templateUrl: './new-institution.component.html',
  styleUrls: ['./new-institution.component.scss']
})
export class NewInstitutionComponent implements OnInit {

  @ViewChild('institutionResponse', {static: false}) institutionResponse;

  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  rules = [
    { text: `The institution should be a legal entity. If a user submits an institution that is not a legal entity, the legal entity with whom it's associated should be added to the list. Example: Earth Institute is not a legal entity, but could be listed as Columbia University. CCAFS is not a legal entity, but could be listed as CIAT.`, id: '' },
    { text: `Government entities include any ministry/department/agency at the national, state, or local level, including parliamentary bodies. The institution should be added to the list at its highest level, so groups within Ministry/Department of Agriculture should not be added to the list. If a user submits a subdepartment within a ministry, the top-level ministry should be listed instead. The institution should be added to the list with the country included in the title, so Ministry of Agriculture and Forests (Bhutan).`, id: '' },
    { text: `Institutions should be listed in their official language, providing this is English, French, German, Portuguese, Italian or Spanish. Example: Centro Internacional de Agricultura Tropical, not International Center for Tropical Agriculture. All other entries should be in English, although titles in other official languages may (optional) be included in addition to English, example: Department of Agriculture / Jabatan pertanian (Malaysia)`, id: '' },
    { text: `All NGOs (international, regional, national, or local) should be listed only once, by the headquarter location. If a user requests Oxfam-Kenya for example, it should be added to the list as Oxfam. When a user selects Oxfam from the dropdown list in MARLO, s/he can specify the specific country office there. `, id: '' },
    { text: `Bilateral development agencies include aid or development agencies receiving funding from the government in their home countries (e.g., USAID, DFID) and should be classified as bilateral development agencies as opposed to government.`, id: '' },
    { text: `Development banks (e.g., World Bank or Asian Development Bank) and multilateral financing institutions (e.g., Global Environment Facility) should be classified as international/regional financial institutions`, id: '' },
    { text: `Any international or regional institution carrying our research regardless of its funding source (public or private), including think tanks and research consulting firms, should be classified as international/regional research institution. CGIAR Centers or academic institutions do not belong in this category.`, id: '' },
    { text: `Any national or local institution carrying our research regardless of its funding source (public or private) should be classified as national/local research institutions. Academic institutions do not belong in this category.`, id: '' },
    { text: `UN entities should be classified as international organizations`, id: '' },
  ];
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
  institution_requested = [];
  currentUser = this.authenticationService.currentUserValue;

  constructor(private institutionsService: InstitutionsService,
    private alert: AlertService,
    private modalService: NgbModal,
    private authenticationService: AuthService,
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
        "externalUserMail": this.currentUser.email,
        "externalUserName": this.currentUser.firstName,
        "externalUserComments": environment.default_user.comments
      }
      // console.log(params, this.form.value)
      this.institutionsService.createPartner(this.form.value.crp, params)
        .subscribe(
          res => {
            this.institution_requested = res;
            this.resetValues();
            this.spinner.hide();
            this.alert.success(`${res.partnerName} is ${res.requestStatus.toLowerCase()}.`);
            
            // console.log(this.institution_requested);
            this.open(this.institutionResponse)
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

  open(institutionResponse) {
    this.modalService.open(institutionResponse, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  changeWebsite(e, prop?) {

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
