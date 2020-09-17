import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InstitutionsService } from '../services/institutions.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";

import { faCheck, faTimes, faList } from '@fortawesome/free-solid-svg-icons';
import { AlertService } from '../services/alert.service';
import { DecimalPipe } from '@angular/common';
import { InstitutionsLocationsService } from '../services/institutions-locations.service';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '../services/sortable.directive';


@Component({
  selector: 'app-manage-partners',
  templateUrl: './manage-partners.component.html',
  styleUrls: ['./manage-partners.component.scss'],
  providers: [InstitutionsLocationsService, DecimalPipe]
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
  rejectionForm = new FormGroup({
    justification: new FormControl('', []),
  });
  isCollapsed = false;
  crps = [];
  requestedPartners = [];
  selectedCRP = '';
  selectedPartner;
  closeResult = '';
  /*** icons ***/
  faCheck = faCheck;
  faTimes = faTimes;
  faList = faList;

  institution$: Observable<any[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>



  constructor(private institutionsService: InstitutionsService,
    private modalService: NgbModal,
    private alert: AlertService,
    public locationsService: InstitutionsLocationsService,
    private spinner: NgxSpinnerService) {
    this.institution$ = locationsService.institutions$;
    this.total$ = locationsService.total$;
  }

  ngOnInit() {
    this.spinner.show();
    this.getCRPS();
  }

  resetValues() {
    this.rejectionForm.reset({ justification: '' });
  }

  changeCRP(e, prop?) {
    this.spinner.show();
    this.getResquestPartners();
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.locationsService.sortColumn = column;
    this.locationsService.sortDirection = direction;
  }


  get f() {
    return this.acceptanceForm.controls;
  }
  get g() {
    return this.rejectionForm.controls;
  }

  open(content, partner) {
    this.selectedPartner = partner;
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        // reject partner request 
        if (result === 'ok clicked') {
          let params = {
            "code": this.selectedPartner['id'],
            "justification": this.rejectionForm.value.justification,
            "accept": false,
          }
          this.resetValues();
          this.spinner.show();
          this.institutionsService.managePartnerRequest(this.selectedCRP, params)
            .subscribe(
              res => {
                // console.log(res);
                // this.spinner.hide();
                this.alert.success(`${res.partnerName} is ${res.requestStatus.toLowerCase()}.`);
                this.getResquestPartners();
              },
              error => {
                this.spinner.hide();
                console.error("reject partner request ", error);
                this.alert.error(`${error.status} : ${error.statusText}.`)
              },
            )
        }
      }, (reason) => {
        this.resetValues();
      });
  }

  acceptRequest(partner) {
    this.spinner.show()
    let params = {
      "code": partner['id'],
      "accept": true,
    }
    this.institutionsService.managePartnerRequest(this.selectedCRP, params)
      .subscribe(
        res => {
          this.spinner.hide();
          this.alert.success(`${res.partnerName} is ${res.requestStatus.toLowerCase()}.`);
          this.getResquestPartners();
        },
        error => {
          this.spinner.hide();
          console.error("reject partner request ", error);
          this.alert.error(`${error.status} : ${error.statusText}.`)
        },
      )
  }

  openAllInstitutions(institutionsModal) {
    this.institution$ = this.locationsService.institutions$;
    this.modalService.open(institutionsModal, { size: 'lg', ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        if (result === 'ok clicked') {
        }
      }, (reason) => {
        console.log('reason >', reason)
      });

  }

  /**
  * ** API calls
  */
  getResquestPartners() {
    this.selectedCRP = this.acceptanceForm.value.crp;
    this.institutionsService.listRequestedPartners(this.selectedCRP)
      .subscribe(
        res => {
          this.requestedPartners = res;
          // console.log(this.requestedPartners);
          this.spinner.hide();
          // this.resetValues()
        },
        error => {
          console.error("getResquestPartners", error);
          this.spinner.hide();
          this.alert.error(error)
        },
      )
  }
  getCRPS() {
    return this.institutionsService.getCRPS()
      .subscribe(
        res => {
          this.crps = res.filter(crp => crp.cgiarEntityTypeDTO.code == 1 || crp.cgiarEntityTypeDTO.code == 3);
          this.spinner.hide();
          // console.log(res, this.crps);
        },
        error => {
          console.error("getCRPS", error);
          this.spinner.hide();
          this.alert.error(error)
        },
      )
  }

}
