import { InjectionToken } from '@angular/core';

export const InjectToken = {
    'IGameOfLifeService':
    new InjectionToken<Stratton.IGameOfLifeService>('IGameOfLifeService'),
    'IGlobalReference':
    new InjectionToken<Stratton.IGlobalReference>('IGlobalReference')
};
