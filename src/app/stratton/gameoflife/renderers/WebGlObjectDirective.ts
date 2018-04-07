/* tslint:disable:directive-selector */

import { Directive, ElementRef, ViewChild, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

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
            .pipe(map(this.parse))
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
      this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(this.mesh.positions), this.context.STATIC_DRAW);

      this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.normal);
      this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(this.mesh.vertexNormals), this.context.STATIC_DRAW);

      this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
      this.context.bufferData(this.context.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.cells), this.context.STATIC_DRAW);

      //this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.color);
      //this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(this.mesh.), this.context.STATIC_DRAW);

    }

    private parse(str): Stratton.GameOfLife.IWebGlMesh {
        const lines = str.trim().split('\n');
        const mesh = {
            positions: [],
            cells: [],
            vertexUVs: null,
            faceUVs: null,
            vertexNormals: null,
            faceNormals: null,
            name: null,
            faceCount: 0
          };

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
              mesh.positions.push(parts.slice(1).map(Number).slice(0, 3));
              break;
            case 'vt':
              mesh.vertexUVs = mesh.vertexUVs || [];
              mesh.vertexUVs.push(parts.slice(1).map(Number));
              break;
            case 'vn':
              mesh.vertexNormals = mesh.vertexNormals || [];
              mesh.vertexNormals.push(parts.slice(1).map(Number));
              break;
            case 'f':
              const positionIndices = [];
              const uvIndices = [];
              const normalIndices = [];

              parts
                .slice(1)
                .forEach(part => {
                  const indices = part
                    .split('/')
                    .map(index => index === '' ? NaN : Number(index));

                  positionIndices.push(this.convertIndex(indices[0], mesh.positions.length));

                  if (indices.length > 1) {
                    if (!isNaN(indices[1])) {
                      uvIndices.push(this.convertIndex(indices[1], mesh.vertexUVs.length));
                    }
                    if (!isNaN(indices[2])) {
                      normalIndices.push(this.convertIndex(indices[2], mesh.vertexNormals.length));
                    }
                  }
                });

                mesh.cells.push(...positionIndices);

                mesh.faceCount++;

                if (uvIndices.length > 0) {
                  mesh.faceUVs = mesh.faceUVs || [];
                  mesh.faceUVs.push(uvIndices);
                }
                if (normalIndices.length > 0) {
                  mesh.faceNormals = mesh.faceNormals || [];
                  mesh.faceNormals.push(normalIndices);
                }

              break;
            default:
              // skip
          }
        }

        return mesh;
      }

      private convertIndex(objIndex, arrayLength) {
        return objIndex > 0 ? objIndex - 1 : objIndex + arrayLength;
      }
}
