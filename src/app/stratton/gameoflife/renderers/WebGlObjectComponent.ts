/* tslint:disable:component-selector */

import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Component({
    selector: 'webgl-object'
})
export class WebGlObjectComponent extends Observable<Stratton.GameOfLife.IWebGlObject> {

    constructor(private element: ElementRef, private http: HttpClient) {
        super(observer => {
            const url = element.nativeElement.getAttribute('src');
            this.http
                .get(url, {responseType: 'text'})
                .pipe(map(this.parse))
                .subscribe(observer.next, console.log);
        });
    }

    parse(str): Stratton.GameOfLife.IWebGlObject {
        const lines = str.trim().split('\n');
        const mesh = {
            positions: [],
            cells: [],
            vertexUVs: null,
            faceUVs: null,
            vertexNormals: null,
            faceNormals: null,
            name: null
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

                mesh.cells.push(positionIndices);

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

      convertIndex(objIndex, arrayLength) {
        return objIndex > 0 ? objIndex - 1 : objIndex + arrayLength;
      }
}
