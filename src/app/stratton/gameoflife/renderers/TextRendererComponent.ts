import { Component, ElementRef, ViewChild, Inject, OnInit } from '@angular/core';

import { InjectToken} from '../../stratton.injection';

@Component({
    selector: 'app-gameoflife-textrenderer',
    template: `<div #div></div>`
})
export class TextRendererComponent implements Stratton.IGameOfLifeRenderer {

    @ViewChild('div') element: ElementRef;

    constructor(@Inject(InjectToken.IGlobalReference) private globalReference: Stratton.IGlobalReference) {   }

    render(state: Int8Array, constraints: Stratton.IGameOfLifeConstraints) {
        const scale = constraints.cellSizeInPixels;

        const div = this.element.nativeElement as HTMLElement;
        const divStyle = div.style;
        const document = this.globalReference.document;

        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }

        divStyle.fontSize = constraints.cellSizeInPixels + 'px';
        divStyle.lineHeight = constraints.cellSizeInPixels + 'px';
        divStyle.backgroundColor = this.intToColor(constraints.deathColor);
        divStyle.width = constraints.cols + 'ch';
        divStyle.height = (constraints.rows * constraints.cellSizeInPixels) + 'px';
        divStyle.overflowX = 'hidden';
        divStyle.overflowY = 'hidden';

        for (let index = 0; index < state.length; index++) {
            if (index > 0 && index % constraints.cols === 0) {
                div.appendChild(document.createElement('br'));
            }
            if (state[index]) {
                const live = document.createElement('i');
                live.innerText = '#';
                live.style.color = this.intToColor(constraints.livingColor);
                div.appendChild(live);
            } else {
                const blank = document.createElement('i');
                blank.innerText = '#';
                blank.style.color = this.intToColor(constraints.deathColor);
                div.appendChild(blank);
            }
        }
    }

    private intToColor(num: number) {
        num += 0x1000000;
        return '#' + num.toString(16).substr(1, 6);
    }
}
