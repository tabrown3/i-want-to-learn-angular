/* tslint:disable:directive-selector */
import { Directive, ElementRef, Input } from '@angular/core';
//import { CommonModule } from '@angular/common';
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
            .pipe(map(data => this.parse(data)))
            .subscribe(val => {
              this.mesh = val;
              this.load();
              observer.next({
                name : name,
                bind : (attributes: Stratton.GameOfLife.IWebGlAttributes) => this.bind(attributes),
                draw: () => this.draw()
              });
            }, console.log);
      });
    }

    private mesh: Stratton.GameOfLife.IWebGlMesh;
    private buffers: Stratton.GameOfLife.IWebGlObjectBuffers;

    @Input() context: WebGLRenderingContext;

    private bind(attributes: Stratton.GameOfLife.IWebGlAttributes): void {
      const gl = this.context;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
      gl.vertexAttribPointer(attributes.vertexPosition, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(attributes.vertexPosition);

      // this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.color);
      // this.context.vertexAttribPointer(this.vertexColor, 4, this.context.FLOAT, false, 0, 0);
      // this.context.enableVertexAttribArray(this.vertexColor);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normal);
      gl.vertexAttribPointer(attributes.vertexNormal, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(attributes.vertexNormal);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    }

    private draw(): void {
      const gl = this.context;
      gl.drawElements(gl.TRIANGLES, this.mesh.faceCount * 3, gl.UNSIGNED_SHORT, 0);
    }

    private load() {
      const gl = this.context;

      if (this.buffers) {
        gl.deleteBuffer(this.buffers.position);
        gl.deleteBuffer(this.buffers.color);
        gl.deleteBuffer(this.buffers.normal);
        gl.deleteBuffer(this.buffers.indices);
        this.buffers = null;
      }

      this.buffers = {
        position : this.context.createBuffer(),
        color : null, // this.context.createBuffer(),
        normal : this.context.createBuffer(),
        indices : this.context.createBuffer()
      };

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), gl.STATIC_DRAW);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normal);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.normals), gl.STATIC_DRAW);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.indices), gl.STATIC_DRAW);

      // this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.color);
      // this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(this.mesh.), this.context.STATIC_DRAW);

    }

    private parse(str): Stratton.GameOfLife.IWebGlMesh {
        const lines = str.trim().split('\n');

        let name: string = null;
        const tempNormals = [];
        const tempVectors = [];
        const faces: {v: number, n: number}[][] = [];

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
                faces.push(values.map(data => {
                  const p = data.split('/').map(index => index === '' ? NaN : Number(index) - 1);
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
        faces.forEach(face => {
          face.forEach(point => {
            if (isNaN(lookup[point.v * tempNormals.length / 3 + point.n ])) {
              lookup[point.v * tempNormals.length / 3 + point.n ] = nextIndex;
              indices.push(nextIndex);
              vertices.push(...tempVectors.slice(point.v * 3, point.v * 3 + 3));
              normals.push(...tempNormals.slice(point.n * 3, point.n * 3 + 3));
              nextIndex++;
            } else {
              indices.push(lookup[point.v * tempNormals.length / 3 + point.n ]);
            }
          });
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
