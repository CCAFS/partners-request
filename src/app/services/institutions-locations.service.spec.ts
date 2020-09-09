import { TestBed } from '@angular/core/testing';

import { InstitutionsLocationsService } from './institutions-locations.service';

describe('InstitutionsLocationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InstitutionsLocationsService = TestBed.get(InstitutionsLocationsService);
    expect(service).toBeTruthy();
  });
});
