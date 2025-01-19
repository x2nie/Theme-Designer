const watch = require("node-watch");
const { render } = require("sass");
const fs = require("fs");
const path = require("path");

const themesDir = path.resolve("themes");
const outputDir = path.resolve("public/themes");

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

        fs.mkdirSync(path.dirname(outputFile), { recursive: true });
        // fs.writeFileSync(outputFile, result.css);
        const result_css = result.css.toString().replace(/\.window \.window/g, '.window:not(#hey_works)')
        fs.writeFileSync(outputFile, result_css);
        console.log(`Compiled: ${relativePath} -> ${outputFile}`);
    });
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

// Lakukan kompilasi awal
initialCompile();

// Watch perubahan pada folder "themes"
watch(
    themesDir,
    { recursive: true, filter: (f) => /\.scss$/.test(f) }, // Hanya file .scss
    (evt, filePath) => {
        const folderName = path.basename(path.dirname(filePath));
        const fileName = path.basename(filePath, ".scss");

        if (folderName === fileName) {
            if (evt === "remove") {
                const relativePath = path.relative(themesDir, filePath);
                const outputFile = path.join(outputDir, relativePath.replace(/\.scss$/, ".css"));

                if (fs.existsSync(outputFile)) {
                    fs.unlinkSync(outputFile);
                    console.log(`Deleted: ${outputFile}`);
                }
            } else if (evt === "update") {
                compileScss(filePath);
            }
        }
    }
);

console.log(`Watching for SCSS changes in ${themesDir}`);
