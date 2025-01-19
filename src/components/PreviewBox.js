// const { Component, useState, mount, loadFile, xml } = owl;
import { Component, useState, mount, loadFile, xml, onWillStart, useEffect } from '@odoo/owl';
import { spec, win95_colors } from "./spec";

// import './DesktopTheme.scss'
import './PreviewBox.scss'
// import './Editors.scss'
import './DesktopIcon.scss'

class Root extends Component {
static template = "theme_preview";

setup(){
    // this.data = useState(win95_colors);
    this.data = {...win95_colors}; // assure simple
    this.state = useState({
        theme: 'win95',
        item: 'Desktop',
        size: 10,
        font: {name:'Arial'},
        color: win95_colors.Background,//'lime',
        color2: 'fuchsia',
        mapping: spec.Desktop,
        fullCss : '',// this.windowStyle(),
        color_schemes : [],
        color_scheme : '',
    })

    // Menerima pesan dari iframe
    window.addEventListener('message', (event) => {
        console.log('Pesan dari iframe:', event.data);
        const {theTheme} = event.data
        if(theTheme){
            const style = document.getElementById('the-theme')
            style.setAttribute('href', `themes/${theTheme}/${theTheme}.css`)
        }
    });

    // ? load color schems
    // onWillStart(async () => {
    //     const ini = await loadFile(`/color_schemes.ini`);
    //     this.colorSchemesIni = parseIniFile(ini)
    //     console.log(this.colorSchemesIni)
    // })

    // const scroll10px = useRef('scroll10px')
    // onMounted(() => scroll10px.el.scrollTop = 10);


    // useEffect(
    //     //? if user click any of colors or sizes, apply to data-then-CSS!
    //     ()=>{
    //         console.log('preparing-to-apply-cangess')
    //         this.applyChanges()
    //     },
    //     () => [this.state.size, this.state.color, this.state.color2, this.state.text, JSON.stringify(this.state.font)]
    // )

    //? user change theme, let reload its color schemes list
    // useEffect(
    //     (theme_name)=>{
    //         this.state.color_schemes = this.colorSchemesIni[theme_name] || [];
    //         this.state.color_scheme = '' //* Default.
    //         // this.applyChanges()
    //     },
    //     () => [this.state.theme]
    // )

    //? user change color schem, let aplly the colors
    // useEffect(
    //     (theme_name)=>{
    //         // debugger
    //         if(this.state.color_scheme == '') return //* Default.
    //         // this.applyChanges()
    //         this.applyThemeFile()
    //         // this.state.fullCss = this.windowStyle()
    //     },
    //     () => [this.state.color_scheme]
    // )
}
}

// mount(Root, document.body);
// async, so we can use async/await
(async function setup() {
    const templates = await loadFile(`/owl_templates.xml`);
    const env = {
    // designer : reactive({
    //   root: null, //will be a form being designing
    //   pickedComponent: 'TButton'
    // })
    // ui: createUI(),
    // _t: someTranslateFn,
    // templates,
    // possibly other stuff
    };

    // @ts-ignore
    mount(Root, document.body, { env, templates, });
})();