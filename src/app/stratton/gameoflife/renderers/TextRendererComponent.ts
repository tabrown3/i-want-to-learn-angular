import { Component, ElementRef, ViewChild, Inject, OnInit } from '@angular/core';

import { InjectToken } from '../../stratton.injection';

@Component({
    selector: 'app-gameoflife-textrenderer',
    template: `<pre #pre>{{text}}</pre>`
})
export class TextRendererComponent implements Stratton.IGameOfLifeRenderer, OnInit {

    @ViewChild('pre') preElement: ElementRef;
    text: string;

    constructor() {   }

    ngOnInit(): void {
        this.text = '';
    }

    render(state: Int8Array, constraints: Stratton.IGameOfLifeConstraints) {
        const scale = constraints.cellSizeInPixels;

        this.preElement.nativeElement.style.fontSize = constraints.cellSizeInPixels + 'px';
        this.preElement.nativeElement.style.lineHeight = constraints.cellSizeInPixels + 'px';
        this.preElement.nativeElement.style.color = this.intToColor(constraints.livingColor);
        this.preElement.nativeElement.style.backgroundColor = this.intToColor(constraints.deathColor);

        const characters = [];

        for (let index = 0; index < state.length; index++) {
            characters.push(state[index] ? '#' : ' ');
            if (index > 0 && index % constraints.cols === 0) {
                characters.push('\n');
            }
        }
        this.text = characters.join('');
    }

    private intToColor(num: number) {
        num += 0x1000000;
        return '#' + num.toString(16).substr(1, 6);
    }
}