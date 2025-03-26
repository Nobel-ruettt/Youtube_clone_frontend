import { TestBed } from '@angular/core/testing';

import { RouteServiceTsService } from './route.service.ts.service';

describe('RouteServiceTsService', () => {
  let service: RouteServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
