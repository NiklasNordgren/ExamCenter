import { TestBed } from '@angular/core/testing';

import { LoginStateShareService } from './login-state-share.service';

describe('LoginStateShareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginStateShareService = TestBed.get(LoginStateShareService);
    expect(service).toBeTruthy();
  });
});
