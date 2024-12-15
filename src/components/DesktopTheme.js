import { Component, useState } from "@odoo/owl";
import { spec, win95_colors } from "./spec";

import './DesktopTheme.scss'
import './PreviewBox.scss'
import './Editors.scss'

export class DesktopTheme extends Component{
    static template = "DesktopTheme.Form"
    setup(){
        this.state = useState({
            theme: 'win98',
            item: 'Desktop',
            size: 10,
        })
        this.data = useState(win95_colors)
    }

    get sel_items(){
        return spec
    }

    previewClick(ev){
        // console.log('EL:', findEl(ev.target))
        this.state.item = findEl(ev.target)
    }
}

function findEl(el) {
    var name = el.getAttribute('data-el');
    if(name) return name;
    if(el.parentElement){
        return findEl(el.parentElement)
    }
}