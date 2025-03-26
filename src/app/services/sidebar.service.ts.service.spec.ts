import { TestBed } from '@angular/core/testing';

import { SidebarServiceTsService } from './sidebar.service.ts.service';

describe('SidebarServiceTsService', () => {
  let service: SidebarServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
