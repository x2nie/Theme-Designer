export default function vitePluginCssGtk() {
    return {
      name: 'vite-plugin-css-gtk',
      enforce: 'pre',
      transform(code, id) {
        if (id.endsWith('.css')) {
            console.log('CSS:::', id)
        //   return code.replace(/\.win7\s+:root\b/g, '.win7');
        //   code = code.replace(/(\w+)\s+:root\b/g, (a,b,c)=>{
        //     // console.log('rep',a,'@2', b, '@3:', c)
        //     return b
        //   });

        // code = code.replace('@define-color', (a)=>{
        //     debugger
        //     console.log('ADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
        //     return 'abc'
        // })

          code = code.replace(/(@define-color)\s+(\w+)\s+([^;]+);/g, (a,b,c, d)=>{
            // console.log(`#1 ${a} \n\t #2 ${b}\n\t #3 ${c}\n\t #4 ${d}`)
            return `--${c}: ${d};`
          });

          code = code.replace(/@([\w\-])/g, (a,b,c, d)=>{
            // console.log(`#1 ${a} \n\t #2 ${b}\n\t #3 ${c}\n\t #4 ${d}`)
            return `var(--${b})`
          });
        }
        return code;
      },
    };
  }
  