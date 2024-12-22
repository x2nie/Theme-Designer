import { Component, loadFile, onMounted, onWillStart, useEffect, useRef, useState } from "@odoo/owl";
import { parseIniFile } from "./iniFileParser";
import { FieldColor } from "./FieldColor";
import { FieldSpin } from "./FieldSpin";
import { spec, win95_colors } from "./spec";

import './DesktopTheme.scss'
import './PreviewBox.scss'
import './Editors.scss'

export class DesktopTheme extends Component{
    static template = "DesktopTheme.Form"
    static components = {FieldColor, FieldSpin}
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
            color_schemes : [],
        })

        onWillStart(async () => {
            const ini = await loadFile(`/color_schemes.ini`);
            this.colorSchemes = parseIniFile(ini)
            console.log(this.colorSchemes)
        })
        const scroll10px = useRef('scroll10px')
        onMounted(() => scroll10px.el.scrollTop = 10);
        useEffect(
            //? if user click any of colors or sizes, apply to data-then-CSS!
            ()=>{
                console.log('preparing-to-apply-cangess')
                this.applyChanges()
            },
            () => [this.state.size, this.state.color, this.state.color2, this.state.text, JSON.stringify(this.state.font)]
        )

        //? user change theme, let reload its color scheme
        useEffect(
            //? if user click any of colors or sizes, apply to data-then-CSS!
            (theme_name)=>{
                this.state.color_schemes = this.colorSchemes[theme_name] || []
                // this.applyChanges()
            },
            () => [this.state.theme]
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
    getLongText(){
        let txt = 'Text'
        for (let i = 0; i < 10; i++) {
            txt += '\n'
        }
        return txt
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
                            ret += `--${k}-${p}: ${yn?'bold':100} !important;\n`;
                            break;
                        case 'italic':
                            ret += `--${k}-${p}: ${yn?'italic':'normal'} !important;\n`;
                            break;
                        // case 'name':
                        //     break;
                            
                        default:
                            ret += `--${k}-${p}: ${yn} !important;\n`;
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