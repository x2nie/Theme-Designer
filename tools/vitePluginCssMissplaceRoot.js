export default function vitePluginCssMissplaceRoot() {
    return {
      name: 'vite-plugin-css-rem-root',
      enforce: 'post',
      transform(code, id) {
        if (id.endsWith('.css') || id.endsWith('.scss')) {
          //   return code.replace(/\.win7\s+:root\b/g, '.win7');
          // code = code.replace(/(\w+)\s+:not\(\.DMRESET\)\s+:root\b/g, (a,b,c)=> b);
          // code = code.replace(/\.window\s+\.window[\s]*([:\.]*)+/gm, (a,b,c)=> '.window' + b);
          code = code.replace(/\.window\s+\.window\b([:\.]*)+/gm, (a,b,c)=> '.window' + b);
          code = code.replace(/(\w+)\s+:root\b/gm, (a,b,c)=>{
            // console.log('rep',a,'@2', b, '@3:', c)
            // console.log(id)
            // console.log(`rep [${a}] @2: "[${b}]" @3: "[${c}]"`)
            return b
          });
          code = code.replace(/\.window\s+\.title-bar\s+/gm, (a,b,c)=> '.window > .title-bar ');

          // code = code.replace(/(@[\w\-]+)\s+(\w+)\s+([^;]+);/g, (a,b,c)=>{
          //   console.log('@',a,'@2', b, '@3:', c)
          //   return b
          // });
          return {
            code,
            map: null, // Biarkan null untuk source map default
          };
        }
        return code;
      },
    };
  }
  