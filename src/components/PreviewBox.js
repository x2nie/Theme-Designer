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
            theme: 'win98',
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
            const {theTheme} = event.data

            if(theTheme) this.switchTheme(theTheme);
        });
    }

    switchTheme(theme){
        const style = document.getElementById('the-theme')
        style.setAttribute('href', `themes/${theme}/${theme}.css`)

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