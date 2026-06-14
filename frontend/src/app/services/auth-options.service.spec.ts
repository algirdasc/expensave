import { TestBed } from '@angular/core/testing';
import { NB_AUTH_OPTIONS } from '@nebular/auth';
import { AuthOptionsService } from './auth-options.service';

describe('AuthOptionsService', () => {
    it('reads nested values from Nebular auth options', (): void => {
        TestBed.configureTestingModule({
            providers: [
                AuthOptionsService,
                {
                    provide: NB_AUTH_OPTIONS,
                    useValue: {
                        forms: {
                            validation: {
                                password: {
                                    minLength: 8,
                                },
                            },
                        },
                    },
                },
            ],
        });

        const service = TestBed.inject(AuthOptionsService);

        expect(service.getConfigValue('forms.validation.password.minLength')).toBe(8);
    });

    it('returns null for missing option paths', (): void => {
        TestBed.configureTestingModule({
            providers: [AuthOptionsService, { provide: NB_AUTH_OPTIONS, useValue: {} }],
        });

        const service = TestBed.inject(AuthOptionsService);

        expect(service.getConfigValue('forms.validation.password.maxLength')).toBeNull();
    });
});
