import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { tap, debounceTime, switchMap, delay } from 'rxjs/operators';
import { SortColumn, SortDirection } from './sortable.directive';
import { InstitutionsService } from './institutions.service';


interface SearchResult {
  institutions: any[];
  total: number;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(institutions: any[], column: string, direction: string): any[] {
  if (direction === '' || column === '') {
    return institutions;
  } else {
    return [...institutions].sort((a, b) => {
      let res;
      if(column === 'institutionType'){
        res = compare(a[column]['name'], b[column]['name']);
      }else{
        res = compare(a[column], b[column]);
      }
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(institution: [], term: string, pipe: PipeTransform) {
  return institution['name'].toLowerCase().includes(term.toLowerCase())
    || institution['institutionType']['name'].toLowerCase().includes(term);
}



@Injectable({
  providedIn: 'root'
})
export class InstitutionsLocationsService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _institutions$ = new BehaviorSubject<any[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  institutionsList = [];



  private _state = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe, private institutionService: InstitutionsService) {

    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._institutions$.next(result.institutions);
      this._total$.next(result.total);
    });
    this.institutionService.getInstitutions().subscribe(result => {
      this.institutionsList = result;
      this._search$.next();
    },
      error => {
        console.error(error)
      }
    );

  }

  get institutions$() { return this._institutions$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  private _set(patch: Partial<any>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    // 1. sort
    let institutions = sort(this.institutionsList, sortColumn, sortDirection);

    // 2. filter
    institutions = institutions.filter(country => matches(country, searchTerm, this.pipe));
    const total = institutions.length;

    // 3. paginate
    institutions = institutions.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    // total = 10;
    return of({ institutions, total });
  }
}
