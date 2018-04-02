import { InjectionToken } from '@angular/core';

export const InjectToken_igameoflifeservice = new InjectionToken<Stratton.IGameOfLifeService>('IGameOfLifeService');
export const InjectToken_iglobalreference = new InjectionToken<Stratton.IGlobalReference>('IGlobalReference');

export const InjectToken = {
    IGameOfLifeService: InjectToken_igameoflifeservice,
    IGlobalReference: InjectToken_iglobalreference
};
