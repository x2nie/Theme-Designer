const watch = require("node-watch");
const { compileScss, initialCompile, themesDir, outputDir } = require("./scss-utils.cjs");
const path = require("path");
const fs = require("fs");

// Lakukan kompilasi awal
initialCompile();

// Watch perubahan pada folder "themes"
watch(
    themesDir,
    { recursive: true, filter: (f) => /\.scss$/.test(f) }, // Hanya file .scss
    (evt, filePath) => {
        const folderPath = path.dirname(filePath);
        const folderName = path.basename(folderPath);
        const fileName = path.basename(filePath, ".scss");
        console.log('scss.changed:', filePath)
        console.log(`scss.changed.info folder: ${folderName} fileName:${fileName} @:${folderPath}`)

        // if (folderName === fileName) {
            if (evt === "remove") {
                const relativePath = path.relative(themesDir, filePath);
                const outputFile = path.join(outputDir, relativePath.replace(/\.scss$/, ".css"));

                if (fs.existsSync(outputFile)) {
                    fs.unlinkSync(outputFile);
                    console.log(`Deleted: ${outputFile}`);
                }
            } else if (evt === "update") {
                if(folderName=='base'){
                    initialCompile();
                } else {
                    // compileScss(filePath);
                    const mainFilePath = path.join(folderPath, `${folderName}.scss`)
                    compileScss(mainFilePath);
                }
            }
        // }
    }
);

console.log(`Watching for SCSS changes in ${themesDir}`);
