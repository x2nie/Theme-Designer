const { render } = require("sass");
const fs = require("fs");
const path = require("path");

const themesDir = path.resolve("themes");
const outputDir = path.resolve("public/themes");

// Fungsi untuk membaca file dan mengonversinya ke Base64
const convertToBase64 = (filePath) => {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return null;
    }
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = getMimeType(filePath);
    return `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
};

// Fungsi untuk mendapatkan MIME type berdasarkan ekstensi file
const getMimeType = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case ".png": return "image/png";
        case ".jpg":
        case ".jpeg": return "image/jpeg";
        case ".gif": return "image/gif";
        case ".svg": return "image/svg+xml";
        default: return "application/octet-stream";
    }
};

// Fungsi untuk mengganti `url()` dengan Base64 di CSS hasil kompilasi
const replaceUrlsWithBase64 = (css, baseDir) => {
    return css.replace(/url\(["']?(.*?)["']?\)/g, (match, url) => {
        // Jika URL sudah dalam format base64, biarkan saja
        if (url.startsWith("data:")) {
            return match;
        }

        // Buat path file absolut berdasarkan baseDir
        const filePath = path.resolve(baseDir, url);

        // Periksa apakah file ada
        if (fs.existsSync(filePath)) {
            // Jika file ada, konversi ke base64
            const base64 = convertToBase64(filePath);
            return `url(${base64})`;
        }

        // Jika file tidak ada, kembalikan URL asli
        console.error(`File not found: ${filePath}`);
        return match;
    });
};

const bugfixRoot = (code) =>{
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
          return code
}

// Fungsi untuk mengompilasi file SCSS menjadi CSS
const compileScss = (filePath) => {
    const folderName = path.basename(path.dirname(filePath));
    const fileName = path.basename(filePath, ".scss");

    if (folderName !== fileName) {
        // Abaikan jika nama file SCSS tidak sama dengan nama folder induknya
        return;
    }

    const relativePath = path.relative(themesDir, filePath);
    const outputFile = path.join(outputDir, relativePath.replace(/\.scss$/, ".css"));

    render({ file: filePath }, (err, result) => {
        if (err) {
            console.error(`Error compiling ${filePath}:`, err.message);
            return;
        }

        // Ganti URL menjadi Base64
        let processedCss = replaceUrlsWithBase64(result.css.toString(), path.dirname(filePath));

        //* .win98 .window :root { --> .win98 .window {
        processedCss = bugfixRoot(processedCss);

        fs.mkdirSync(path.dirname(outputFile), { recursive: true });
        fs.writeFileSync(outputFile, processedCss);
        console.log(`Compiled: ${relativePath} -> ${outputFile}`);
    });
};

// Fungsi untuk mendapatkan semua file SCSS dari folder `themes`
const getAllScssFiles = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            results = results.concat(getAllScssFiles(filePath)); // Rekursif untuk folder
        } else if (file.endsWith(".scss")) {
            results.push(filePath); // Tambahkan hanya file .scss
        }
    });

    return results;
};

// Fungsi untuk melakukan kompilasi awal hanya pada file SCSS yang valid
const initialCompile = () => {
    console.log("Performing initial compile of matching SCSS files...");
    const scssFiles = getAllScssFiles(themesDir);

    scssFiles.forEach((filePath) => {
        const folderName = path.basename(path.dirname(filePath));
        const fileName = path.basename(filePath, ".scss");

        if (folderName === fileName) {
            compileScss(filePath);
        }
    });

    console.log("Initial compile completed.");
};

module.exports = {
    compileScss,
    initialCompile,
    themesDir,
    outputDir,
};
