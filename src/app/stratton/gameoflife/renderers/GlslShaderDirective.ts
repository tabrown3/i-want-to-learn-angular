
/* tslint:disable:directive-selector */

import { Directive, ElementRef, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Directive({
    selector: 'glsl-shader'
})
export class GlslShaderDirective extends Observable<Stratton.GameOfLife.IGlslShaderSource> {

    constructor(private element: ElementRef, private http: HttpClient) {
        super(observer => {
            const url = element.nativeElement.getAttribute('src');
            const type = element.nativeElement.getAttribute('type');
            this.http.get(url, {responseType: 'text'})
            .subscribe(source => {
                console.log(source);
                observer.next({
                    source: source,
                    shaderType: type
                });
            }, console.log);
        });
    }

}
