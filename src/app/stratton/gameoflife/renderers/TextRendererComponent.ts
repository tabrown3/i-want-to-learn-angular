import { Component, ElementRef, ViewChild, Inject, OnInit } from '@angular/core';

import { InjectToken} from '../../stratton.injection';

@Component({
    selector: 'app-gameoflife-textrenderer',
    template: `<div #div></div>`
})
export class TextRendererComponent implements Stratton.IGameOfLifeRenderer {

    @ViewChild('div') element: ElementRef;

    constructor(@Inject(InjectToken.IGlobalReference) private globalReference: Stratton.IGlobalReference) {   }

    elementArray: HTMLElement[];
    rows = 0;
    cols = 0;

    shouldRebuild(constraints: Stratton.IGameOfLifeConstraints): boolean {
        return constraints.rows !== this.rows || constraints.cols !== this.cols;
    }

    rebuildReferences(constraints: Stratton.IGameOfLifeConstraints) {
        this.rows = constraints.rows;
        this.cols = constraints.cols;

        const div = this.element.nativeElement as HTMLElement;
        const divStyle = div.style;
        const document = this.globalReference.document;

        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }

        this.elementArray = [];

        for (let r = 0; r < constraints.rows; r++) {
            const row = document.createElement('div');
            for (let c = 0; c < constraints.cols; c++) {
                const cell = document.createElement('i');
                cell.innerHTML = '#';
                cell.style.color = this.intToColor(constraints.deathColor);
                row.appendChild(cell);
                this.elementArray.push(cell);
            }
            div.appendChild(row);
        }

        divStyle.width = (constraints.cols * constraints.cellSizeInPixels) + 'px';
        divStyle.height = (constraints.rows * constraints.cellSizeInPixels) + 'px';
        divStyle.overflowX = 'hidden';
        divStyle.overflowY = 'hidden';
        divStyle.backgroundColor = this.intToColor(constraints.deathColor);
    }

    initialize(constraints: Stratton.IGameOfLifeConstraints) {
        this.rebuildReferences(constraints);
    }

    render(state: Int8Array, constraints: Stratton.IGameOfLifeConstraints) {
        if (this.shouldRebuild(constraints)) {
            return;
        }

        const div = this.element.nativeElement as HTMLElement;
        const divStyle = div.style;

        divStyle.fontSize = constraints.cellSizeInPixels + 'px';
        divStyle.lineHeight = constraints.cellSizeInPixels + 'px';

        this.elementArray.forEach((elm, index) => {
            elm.style.color = this.intToColor(state[index] ? constraints.livingColor : constraints.deathColor);
        });
    }

    private intToColor(num: number) {
        num += 0x1000000;
        return '#' + num.toString(16).substr(1, 6);
    }
}
