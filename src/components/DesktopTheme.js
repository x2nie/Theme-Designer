import { Component } from "@odoo/owl";

import './DesktopTheme.scss'
import './PreviewBox.scss'

export class DesktopTheme extends Component{
    static template = "DesktopTheme.Form"


    previewClick(ev){
        console.log('EL:', findEl(ev.target))
    }
}

function findEl(el) {
    var name = el.getAttribute('data-el');
    if(name) return name;
    if(el.parentElement){
        return findEl(el.parentElement)
    }
}