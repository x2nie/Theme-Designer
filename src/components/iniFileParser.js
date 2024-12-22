export function parseIniFile(content) {
    const result = {};
    let currentSection = null;

    // Split by line breaks and iterate over lines
    const lines = content.split('\n');

    lines.forEach(line => {
        // Trim the line to remove excess spaces
        line = line.trim();

        // Skip empty lines or comments (lines starting with semicolon or hash)
        if (!line || line.startsWith(';') || line.startsWith('#')) {
            return;
        }

        // Check for section headers (lines that start with a bracket)
        if (line.startsWith('[') && line.endsWith(']')) {
            currentSection = line.substring(1, line.length - 1).trim();
            result[currentSection] = {};
        } else if (currentSection) {
            // Process key-value pairs (key=value)
            let [key, value] = line.split('=').map(part => part.trim());
            if (key && value == undefined) 
                value = ''
            if (key && value !== undefined) {
                result[currentSection][key] = value;
            }
        }
    });

    return result;
}

export function numbers2bytes(content) {
    return content.trim().split(' ').map(n => parseInt(n));
}


/*
WinClassicTheme.prototype.parseMetricSection = function(content) {
  var items = this.parseMetricContent(content);
  for (let [k, v] of Object.entries(items)) {
    console.log(k, v)
    if(k == 'NonclientMetrics') {
      v = NONCLIENTMETRICS(v)
    }
    items[k] = v
    // this.setItemColor(item, items[item]);
    // this.updateStylesheet(item);
  }
  this.NonclientMetricsDestination.value = JSON.stringify(items, null, 3)
  // this.resetPickers();
  // this.displayExport();
}
*/

export function parseNonclientMetrics(byteArray, parseAsString=false){
    if(parseAsString){
        byteArray = numbers2bytes(byteArray)
    }
    const view = new DataView(new ArrayBuffer(byteArray.length));
    byteArray.forEach((byte, index) => view.setUint8(index, byte));
  
    // Membaca LOGFONTA dari offset tertentu
    function readLOGFONTA(offset) {
        return {
            Height: view.getInt32(offset, true),
            Width: view.getInt32(offset + 4, true),
            Escapement: view.getInt32(offset + 8, true),
            Orientation: view.getInt32(offset + 12, true),
            Weight: view.getInt32(offset + 16, true),
            Italic: view.getUint8(offset + 20),
            Underline: view.getUint8(offset + 21),
            StrikeOut: view.getUint8(offset + 22),
            CharSet: view.getUint8(offset + 23),
            OutPrecision: view.getUint8(offset + 24),
            ClipPrecision: view.getUint8(offset + 25),
            Quality: view.getUint8(offset + 26),
            PitchAndFamily: view.getUint8(offset + 27),
            FaceName: new TextDecoder().decode(new Uint8Array(byteArray.slice(offset + 28, offset + 60))).replace(/\0.*$/, "") // Hapus null terminator
        };
    }
  
    // Membaca struktur NONCLIENTMETRICSA
    // https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-nonclientmetricsa
    const NONCLIENTMETRICSA = {
        cbSize: view.getUint32(0, true),
        BorderWidth: view.getInt32(4, true),
        ScrollWidth: view.getInt32(8, true),
        ScrollHeight: view.getInt32(12, true),
        CaptionWidth: view.getInt32(16, true),
        CaptionHeight: view.getInt32(20, true),
        CaptionFont: readLOGFONTA(24),
        SmCaptionWidth: view.getInt32(84, true),
        SmCaptionHeight: view.getInt32(88, true),
        SmCaptionFont: readLOGFONTA(92),
        MenuWidth: view.getInt32(152, true),
        MenuHeight: view.getInt32(156, true),
        MenuFont: readLOGFONTA(160),
        StatusFont: readLOGFONTA(220),
        MessageFont: readLOGFONTA(280),
        // iPaddedBorderWidth: view.getInt32(340, true),
    };
    if(NONCLIENTMETRICSA.cbSize> 340){
        NONCLIENTMETRICSA.iPaddedBorderWidth  = view.getInt32(340, true); // windows XP only
    }
    return NONCLIENTMETRICSA
}