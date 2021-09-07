import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InstitutionsService } from '../services/institutions.service';
import { ExcelService } from '../services/excel.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";

import { faCheck, faTimes, faList } from '@fortawesome/free-solid-svg-icons';
import { AlertService } from '../services/alert.service';
import { DecimalPipe } from '@angular/common';
import { InstitutionsLocationsService } from '../services/institutions-locations.service';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '../services/sortable.directive';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [InstitutionsLocationsService, DecimalPipe]
})
export class HomeComponent implements OnInit {
  institution$: Observable<any[]>;
  total$: Observable<number>;
  

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>
  constructor(
    private institutionsService: InstitutionsService,
    private excelService : ExcelService,
    private modalService: NgbModal,
    private alert: AlertService,
    public locationsService: InstitutionsLocationsService,
    private spinner: NgxSpinnerService,
    ) {
      this.institution$ = locationsService.institutions$;
      this.total$ = locationsService.total$;


  }
  exportAsXLSX():void {
    this.spinner.show();
    let data = [];
      this.locationsService.institutionsList.forEach(element => {        
        data.push( {
          Id: element.code,
          Name: element.name,
          Acronym: element.acronym,
          Type: element.institutionType.name,
          Website : element.websiteLink
          }); 
          
         
    });
    //console.log(data)    
    this.excelService.exportAsExcelFile(data, 'InstitutionsList');
    this.spinner.hide();
 }

  ngOnInit() {
 
    this.spinner.show();
    if(!this.locationsService.institutionLoaded){
    let interval = setInterval(()=>{ 
      if(this.locationsService.institutionLoaded){
        this.spinner.hide();
        clearInterval(interval);
      }
      //console.log("interval");
     }, 1000);

    }

  }




  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    // this.headers.forEach(header => {
    //   if (header.sortable !== column) {
    //     header.direction = '';
    //   }
    // });

    this.locationsService.sortColumn = column;
    this.locationsService.sortDirection = direction;
  }
}
