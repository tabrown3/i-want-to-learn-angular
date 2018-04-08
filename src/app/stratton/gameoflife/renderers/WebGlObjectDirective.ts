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
        const mesh = {
            vertices: [],
            indices: [],
            textUVs: null,
            normals: null,
            
            name: null,
            faceCount: 0
          };

          const tempNormals = [];

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          if (line[0] === '#') {
            continue;
          }

          const parts = line
            .trim()
            .replace(/ +/g, ' ')
            .split(' ');

          switch (parts[0]) {
            case 'o':
              mesh.name = parts.slice(1).join(' ');
              break;
            case 'v':
              mesh.vertices.push(...parts.slice(1).map(Number).slice(0, 3));
              break;
            case 'vt':
              mesh.textUVs = mesh.textUVs || [];
              mesh.textUVs.push(...parts.slice(1).map(Number));
              break;
            case 'vn':
              tempNormals.push(...parts.slice(1).map(Number));
              break;
            case 'f':
                                        
              parts
                .slice(1)
                .forEach(part => {
                  const indices = part
                    .split('/')
                    .map(index => index === '' ? NaN : Number(index));

                    //may need to support negative values
                  mesh.indices.push(indices[0]-1);

                  if (indices.length > 1) {
                    if (!isNaN(indices[1])) {
                      //not supported yet
                    }
                    if (!isNaN(indices[2])) {
                      mesh.normals = mesh.normals || [];
                      mesh.normals.push(...tempNormals.slice(indices[2], indices[2] + 3));                      
                    }
                  }
                });

                

                mesh.faceCount++;                

              break;
            default:
              // skip
          }
        }

        return mesh;
      }
}
