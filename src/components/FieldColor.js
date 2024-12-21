import { Component, useRef, xml } from "@odoo/owl";

import './FieldColor.scss'

export class FieldColor extends Component {
    // static template = xml`<button class="btn-color" t-on-click="btnClick"><input type="color" t-model="props.model" t-att-style="style" t-ref="input"/></button>`
    static template = xml`<button class="btn-color" t-on-click="btnClick" t-att="{disabled: props.disabled}"><i t-attf-style="background:{{props.color}};"/><s/><b/><t t-slot="default"/></button>`

    setup(){
        this.input = useRef("input")
    }

    get disable(){
        return this.props.disabled != null
    }
    btnClick(){
        // this.input.el.click();
    }
}