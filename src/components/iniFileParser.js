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