/* tslint:disable:component-selector */

import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'webgl-object'
})
export class WebGlObjectComponent {

    constructor(private element: ElementRef, private http: HttpClient) {
        const url = element.nativeElement.getAttribute('src');
        const type = element.nativeElement.getAttribute('type');
        if (type === 'obj') {
            this.http
                .get(url, {responseType: 'text'})
                .subscribe(source => {

                }, console.log);
        }

    }


    function parse(str) {
        const lines = str.trim().split('\n');
        const positions = [];
        const cells = [];
        const vertexUVs = [];
        const vertexNormals = [];
        const faceUVs = [];
        const faceNormals = [];
        const name = null;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          if (line[0] === '#') {
            continue;
          }

          const parts = line
            .trim()
            .replace(/ +/g, ' ')
            .split(' ');

          switch(parts[0]) {
            case 'o':
              name = parts.slice(1).join(' ');
              break;
            case 'v':
              var position = parts.slice(1).map(Number).slice(0, 3);
              positions.push(position);
              break;
            case 'vt':
              var uv = parts.slice(1).map(Number);
              vertexUVs.push(uv);
              break;
            case 'vn':
              var normal = parts.slice(1).map(Number);
              vertexNormals.push(normal);
              break;
            case 'f':
              var positionIndices = [];
              var uvIndices = [];
              var normalIndices = [];
      
              parts
                .slice(1)
                .forEach(function(part) {
                  var indices = part
                    .split('/')
                    .map(function(index) {
                      if(index === '') {
                        return NaN;
                      }
                      return Number(index);
                    })
      
                  positionIndices.push(convertIndex(indices[0], positions.length));
      
                  if(indices.length > 1) {
                    if(!isNaN(indices[1])) {
                      uvIndices.push(convertIndex(indices[1], vertexUVs.length));
                    }
                    if(!isNaN(indices[2])) {
                      normalIndices.push(convertIndex(indices[2], vertexNormals.length));
                    }
                  }
      
                });
      
                cells.push(positionIndices);
      
                if(uvIndices.length > 0) {
                  faceUVs.push(uvIndices);
                }
                if(normalIndices.length > 0) {
                  faceNormals.push(normalIndices);
                }
                
              break;
            default:
              // skip
          }
      
        }
      
        var mesh = {
          positions: positions,
          cells: cells
        };
      
        if(vertexUVs.length > 0) {
          mesh.vertexUVs = vertexUVs;
        }
      
        if(faceUVs.length > 0) { 
          mesh.faceUVs = faceUVs;
        }
      
        if(vertexNormals.length > 0) {
          mesh.vertexNormals = vertexNormals;
        }
      
        if(faceNormals.length > 0) {
          mesh.faceNormals = faceNormals;
        }
      
        if(name !== null) {
          mesh.name = name;
        }
      
        return mesh;
      }
      
      function convertIndex(objIndex, arrayLength) {
        return objIndex > 0 ? objIndex - 1 : objIndex + arrayLength;
      }

}
