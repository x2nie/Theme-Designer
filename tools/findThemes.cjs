// generated file by chatgpt.com

const fs = require('fs');
const path = require('path');

const rootDir = 'src/styles/themes';  // Ganti dengan path folder yang sesuai
const outputFile = 'public/color_schemes.ini';

// Fungsi untuk mencari file dengan ekstensi .theme di dalam folder 'sub'
function findThemeFiles(dir) {
  const subDir = path.join(dir, 'color-scheme');
  console.log('scanning subdir:', subDir)
  const themeFiles = [];

  // Cek apakah subfolder 'sub' ada
  if (fs.existsSync(subDir) && fs.statSync(subDir).isDirectory()) {
    // Baca file di dalam folder 'sub'
    const files = fs.readdirSync(subDir);
    
    // Loop untuk memeriksa setiap file
    files.forEach(file => {
      if (file.endsWith('.theme') || file.endsWith('.Theme') ) {
        themeFiles.push(file);  // Simpan nama file .theme
      }
    });
  }

  return themeFiles;
}

// Fungsi utama untuk memulai pencarian
function processFolders(rootDir) {
  const result = [];

  // Baca folder di dalam rootDir
  const folders = fs.readdirSync(rootDir);
  
  folders.forEach(folder => {
    const folderPath = path.join(rootDir, folder);
    
    // Cek apakah itu folder dan bukan file biasa
    if (fs.statSync(folderPath).isDirectory()) {
      // Cari file .theme di dalam subfolder 'sub'
      const themeFiles = findThemeFiles(folderPath);
      
      // Jika ditemukan, masukkan ke dalam hasil
      if (themeFiles.length > 0) {
        // result.push(...themeFiles);
        result.push(`[${folder}]`);  // Tambahkan nama folder sebagai header
        result.push(themeFiles.join('\n'));  // Tambahkan daftar file .theme
        result.push('');  // Tambahkan baris kosong setelah setiap section
      }
    }
  });

  // Tulis hasil ke output.txt
  fs.writeFileSync(outputFile, result.join('\n'), 'utf8');
  console.log(`Daftar file tema berhasil disimpan di ${outputFile}`);
}

// Mulai proses
processFolders(rootDir);
