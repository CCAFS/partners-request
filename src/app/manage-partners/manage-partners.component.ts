import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InstitutionsService } from '../services/institutions.service';

@Component({
  selector: 'app-manage-partners',
  templateUrl: './manage-partners.component.html',
  styleUrls: ['./manage-partners.component.scss']
})
export class ManagePartnersComponent implements OnInit {

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
  ]
  acceptanceForm = new FormGroup({
    crp: new FormControl('', [Validators.required]),
  });
  isCollapsed = false;
  crps = [];
  requestedPartners = [];


  constructor(private institutionsService: InstitutionsService) { }

  ngOnInit() {
    this.getCRPS();
  }

  resetValues() {
    this.acceptanceForm.reset({ crp: '' });
  }

  changeCRP(e, prop?) {
    this.getResquestPartners();
  }


  get f() {
    return this.acceptanceForm.controls;
  }

  /**
  * ** API calls
  */
  getResquestPartners() {
    this.institutionsService.listRequestedPartners(this.acceptanceForm.value.crp)
      .subscribe(
        res => {
          console.log(res);
          this.requestedPartners = res;
          // this.resetValues()
        },
        error => {
          console.error("getResquestPartners", error);
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
