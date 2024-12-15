import { Component, useState } from "@odoo/owl";
import { FieldColor } from "./FieldColor";
import { spec, win95_colors } from "./spec";

import './DesktopTheme.scss'
import './PreviewBox.scss'
import './Editors.scss'

export class DesktopTheme extends Component{
    static template = "DesktopTheme.Form"
    static components = {FieldColor}
    setup(){
        this.data = useState(win95_colors);
        this.state = useState({
            theme: 'win98',
            item: 'Desktop',
            size: 10,
            font: {name:'Arial'},
            color: 'lime',
            color2: 'fuchsia',
            mapping: spec.Desktop,
            fullCss : this.windowStyle(),
        })

    }

    get sel_items(){
        return spec
    }

    windowStyle(){
        let ret = '\n'
        for(const [k,v] of Object.entries(this.data)){
            ret += `--${k}: ${v};\n`;
        }
        return ret;
    }

    previewClick(ev){
        // console.log('EL:', findEl(ev.target))
        console.log('state:', this.state)
        console.log('data:', this.data)
        const item = findEl(ev.target)
        const scoop = spec[item];
        if(!scoop){
            console.log('not found scoop:', item)
            return
        }
        this.state.item = item;
        this.state.mapping = scoop;
        //? prepare .state
        for(const [k,v] of Object.entries(scoop)){
            this.state[k] = win95_colors[v]
        }
    }
    fillState(scoop){
        for(const [k,v] of Object.entries(scoop)){
            this.state[k] = win95_colors[v]
        }
    }
}

function findEl(el) {
    var name = el.getAttribute('data-el');
    if(name) return name;
    if(el.parentElement){
        return findEl(el.parentElement)
    }
}