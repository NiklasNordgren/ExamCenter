import { TestBed } from '@angular/core/testing';

import { UnpublishService } from './unpublish.service';

describe('UnpublishService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnpublishService = TestBed.get(UnpublishService);
    expect(service).toBeTruthy();
  });
});
