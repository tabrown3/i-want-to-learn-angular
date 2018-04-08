
/* tslint:disable:directive-selector */
import { Directive, ElementRef, ViewChild, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Directive({
    selector: 'glsl-shader'
})
export class GlslShaderDirective extends Observable<Stratton.GameOfLife.IGlslShaderSource> {

    constructor(private element: ElementRef, private http: HttpClient) {
        super(observer => {
            const url = element.nativeElement.getAttribute('src');
            const type = element.nativeElement.getAttribute('type');            
            this.http
                .get(url, {responseType: 'text'})
                .pipe(map(source => ({ source: source, shaderType: type })))
                .subscribe(val => observer.next(val), console.log);
        });
    }
}
