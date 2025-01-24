// const { Component, useState, mount, loadFile, xml } = owl;
import { Component, useState, mount, loadFile, xml, onWillStart, useEffect } from '@odoo/owl';
import { spec, win95_colors } from "./spec";
// import { parseCustomJSON } from './cssThemeInfo';

// import './DesktopTheme.scss'
import './PreviewBox.scss'
// import './Editors.scss'
import './DesktopIcon.scss'
import { parseIniFile } from './iniFileParser';

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
            const {theTheme, theSceme} = event.data

            if(theTheme) this.switchTheme(theTheme);
            if(theSceme) this.switchScheme(theSceme);
        });
        onWillStart(
            () => this.switchTheme('win98')
        )
    }

    async switchTheme(theme){
        //? host ask for switch of theme.css
        const styleElement = document.getElementById('the-theme')
        // styleElement.setAttribute('src', `themes/${theme}/${theme}.css`)
        let themeInfo = {ThemeInfo:{Name:null}, Schemes:{}, Variants:[]}
        const filePath =  `themes/${theme}/${theme}.css`
        try {
            // Fetch CSS file content
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to fetch CSS file. Status: ${response.status}`);
            }

            const cssContent = await response.text();
            // console.log(`CSS content of ${filePath}:\n`, cssContent);

            //? ambil theme info
            const regex = /\/\*\*\s+(\[ThemeInfo\][^*]+)\*\*\//gm;
            const match = regex.exec(cssContent);

            if (match) {
                // console.log(match[1]); // Output: [ThemeInfo]\n    Name = Win7\n\n[Schemes]\n    Nature = style: --ActiveColor:#123123\n\n[Variants]\n    Normal = class:\n    Small Button = class:vista
                themeInfo = parseIniFile(match[1])
                // console.log('themeInfo:', )
            } 
            // else {console.log('No match found');            }

            //? Update the content of the <style> element
            styleElement.textContent = cssContent;

            console.log(`CSS injected into <style> from: ${filePath}`);
        } catch (error) {
            console.error(`Error loading or injecting CSS content: ${filePath}`, error);
        }

        window.parent.postMessage({themeInfo})
    }

    switchScheme(scheme){
        const [kind, value] = splitOnce(scheme, ':')
        console.log([kind, value])
        switch (kind) {
            case 'class':
                document.body.className = value;
                break;
        
            default:
                break;
        }
    }

    previewClick(ev){
        //? user click an element
        const scope = findEldataScope(ev.target)
        window.parent.postMessage({theScope: scope})
    }
}

function findEldataScope(el) {
    var name = el.getAttribute('data-el');
    if(name) return name;
    if(el.parentElement){
        return findEldataScope(el.parentElement)
    }
}

function splitOnce(str, delimiter) {
    const index = str.indexOf(delimiter);
    if (index === -1) {
        return [str]; // Jika delimiter tidak ditemukan, kembalikan string utuh dalam array
    }
    return [str.slice(0, index), str.slice(index + delimiter.length)];
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