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
    private modalService: NgbModal,
    private alert: AlertService,
    public locationsService: InstitutionsLocationsService,
    private spinner: NgxSpinnerService
    ) {
      this.institution$ = locationsService.institutions$;
      this.institution$ = this.locationsService.institutions$;
      this.total$ = locationsService.total$;
      this.institution$ = locationsService.institutions$;
      this.institution$ = this.locationsService.institutions$;
      this.total$ = locationsService.total$;
  }

  ngOnInit() {
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
