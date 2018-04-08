/* tslint:disable:directive-selector */

import { Directive, ElementRef, ViewChild, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Directive({
  selector: '[globalMath]',
  exportAs: 'Math'
})
export class MathDirective {
  constructor(){
    return Math;
  }
}

@Directive({
    selector: 'webgl-object'
})
export class WebGlObjectDirective extends Observable<Stratton.GameOfLife.IWebGlObject> {

    constructor(private element: ElementRef, private http: HttpClient) {        
      super(observer => {
        const url = element.nativeElement.getAttribute('src');
        const name = element.nativeElement.getAttribute('name');
        this.http
            .get(url, {responseType: 'text'})
            .pipe(map(data => this.parse(data)))
            .subscribe(val => {
              this.mesh = val;
              this.load();
              observer.next({
                name : name,
                bind : (attributes: Stratton.GameOfLife.IWebGlAttributes)=> this.bind(attributes),
                draw: () => this.draw()
              });
            }, console.log);
      });
    }

    private mesh: Stratton.GameOfLife.IWebGlMesh;
    private buffers: Stratton.GameOfLife.IWebGlObjectBuffers;

    @Input() context: WebGLRenderingContext;

    private bind(attributes: Stratton.GameOfLife.IWebGlAttributes): void {
      this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.position);
      this.context.vertexAttribPointer(attributes.vertexPosition, 3, this.context.FLOAT, false, 0, 0);
      this.context.enableVertexAttribArray(attributes.vertexPosition);
    
      //this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.color);
      //this.context.vertexAttribPointer(this.vertexColor, 4, this.context.FLOAT, false, 0, 0);
      //this.context.enableVertexAttribArray(this.vertexColor);

      this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.normal);
      this.context.vertexAttribPointer(attributes.vertexNormal, 3, this.context.FLOAT, false, 0, 0);
      this.context.enableVertexAttribArray(attributes.vertexNormal);      

      this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    }

    private draw(): void {
      this.context.drawElements(this.context.TRIANGLES, this.mesh.faceCount * 3, this.context.UNSIGNED_SHORT, 0);
    }
    
    private load() {
      if (this.buffers) {
        this.context.deleteBuffer(this.buffers.position);
        this.context.deleteBuffer(this.buffers.color);
        this.context.deleteBuffer(this.buffers.normal);
        this.context.deleteBuffer(this.buffers.indices);
        this.buffers = null;
      }

      this.buffers = {
        position : this.context.createBuffer(),
        color : null,//this.context.createBuffer(),
        normal : this.context.createBuffer(),
        indices : this.context.createBuffer()      
      };

      this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.position);
      this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), this.context.STATIC_DRAW);

      this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.normal);
      this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(this.mesh.normals), this.context.STATIC_DRAW);

      this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
      this.context.bufferData(this.context.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.indices), this.context.STATIC_DRAW);

      //this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.color);
      //this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(this.mesh.), this.context.STATIC_DRAW);

    }

    private parse(str): Stratton.GameOfLife.IWebGlMesh {
        const lines = str.trim().split('\n');
        
        let name: string = null;
        const tempNormals = [];
        const tempVectors = [];
        const faces: {v:number, n: number}[][] = [];

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          if (line[0] === '#') {
            continue;
          }

          const parts = line
            .trim()
            .replace(/ +/g, ' ')
            .split(' ');

          const values = parts.slice(1);

          switch (parts[0]) {
            case 'o':
              name = values.join(' ');
              break;
            case 'v':
              tempVectors.push(...values.map(Number));
              break;
            case 'vt':
            //  mesh.textUVs = mesh.textUVs || [];
             // mesh.textUVs.push(...parts.slice(1).map(Number));
              break;
            case 'vn':
              tempNormals.push(...values.map(Number));
              break;
            case 'f':
                faces.push(values.map(indices => {
                  const p = indices.split('/').map(index => index === '' ? NaN : Number(index)-1);
                  return { v: p[0], n: p[2] };
                }));
              break;
            default:
              // skip
          }
        }

        const vertices = [];
        const normals = [];
        const indices = [];
        const lookup = new Array(tempNormals.length * tempVectors.length / 9).fill(NaN);
        let nextIndex = 0;
        faces.forEach(face=> {
          face.forEach(point => {
            if (isNaN(lookup[point.v * tempNormals.length / 3 + point.n ])) {
              lookup[point.v * tempNormals.length / 3 + point.n ] = nextIndex;
              indices.push(nextIndex);
              vertices.push(...tempVectors.slice(point.v * 3, point.v * 3 +3));
              normals.push(...tempNormals.slice(point.n * 3, point.n * 3 +3));
              nextIndex++;
            } else {
              indices.push(lookup[point.v * tempNormals.length / 3 + point.n ]);
            }
          })
        });

        return {
          name: name,   
          vertices: vertices,
          normals: normals, 
          indices: indices,       
          textUVs: null,
          faceCount: faces.length
        };
      }
}
