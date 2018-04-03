import { InjectionToken } from '@angular/core';

export function _<T>(name): InjectionToken<T> {
    return new InjectionToken<T>(name);
}

export const InjectToken = {
    IGameOfLifeService: _<Stratton.IGameOfLifeService>('IGameOfLifeService'),
    IGlobalReference: _<Stratton.IGlobalReference>('IGlobalReference')
};

