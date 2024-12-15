import { Component, useEffect, useState } from "@odoo/owl";
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
            color: win95_colors.Background,//'lime',
            color2: 'fuchsia',
            mapping: spec.Desktop,
            fullCss : this.windowStyle(),
        })
        useEffect(
            //? if user click any of colors or sizes, apply to data-then-CSS!
            ()=>{
                console.log('preparing-to-apply-cangess')
                this.applyChanges()
            },
            () => [this.state.color, this.state.text, JSON.stringify(this.state.font)]
        )
    }

    get sel_items(){
        return spec
    }

    toggleBold(){
        this.state.font.bold = !this.state.font.bold;
    }
    toggleItalic(){
        this.state.font.italic = !this.state.font.italic;
    }

    windowStyle(){
        //? generate css for html
        let ret = '\n'
        for(const [k,v] of Object.entries(this.data)){
            if(v.name){
                //? it is Font struct
                // for(const n of ['name', 'color', 'color2', 'text']){
                //     const key = scoop[n]
                //     if(key != null){
                //         this.data[key] = this.state[n]
                //     }
                // }
                for(let [p, yn] of Object.entries(v)){
                    switch (p) {
                        case 'bold':
                            ret += `--${k}-${p}: ${yn?'bold':100};\n`;
                            break;
                        case 'italic':
                            ret += `--${k}-${p}: ${yn?'italic':'normal'};\n`;
                            break;
                        // case 'name':
                        //     break;
                            
                        default:
                            ret += `--${k}-${p}: ${yn};\n`;
                            break;
                    }
                }
            } else {
                ret += `--${k}: ${v};\n`;
            }
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
    applyChanges(){
        // user click(state) --> send to html/css
        const scoop = this.state.mapping
        for(const n of ['size', 'color', 'color2', 'text']){
            const key = scoop[n]
            if(key != null){
                this.data[key] = this.state[n]
            }
        }
        for(const n of ['name', 'bold', 'italic']){
            const key = scoop['font']
            if(key != null){
                this.data[key][n] = this.state.font[n]
            }
        }
        this.state.fullCss = this.windowStyle()
    }
}

function findEl(el) {
    var name = el.getAttribute('data-el');
    if(name) return name;
    if(el.parentElement){
        return findEl(el.parentElement)
    }
}