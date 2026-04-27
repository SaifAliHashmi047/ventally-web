const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else if (dirPath.endsWith('.tsx')) {
            callback(dirPath);
        }
    });
}

const SRC_DIR = path.join(__dirname, 'src');

walkDir(SRC_DIR, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Find lucide-react imports
    const lucideImportMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/);
    if (!lucideImportMatch) return;
    
    const importedIcons = lucideImportMatch[1]
        .split(',')
        .map(i => i.trim())
        .filter(i => i && !i.includes(' as ')); // Ignoring aliases for simplicity
    
    let modified = false;
    
    importedIcons.forEach(icon => {
        // Regex to find the icon component
        // Example: <ChevronRight className="text-white/80" />
        // Note: this is a simple regex and might not catch all multi-line props, but it catches most
        const regex = new RegExp(`(<${icon}\\s+[^>]*?className=(['"\`]))([^>]*?)(['"\`])`, 'g');
        
        content = content.replace(regex, (match, prefix, quote1, classNameStr, quote2) => {
            let newClassNameStr = classNameStr.split(/\s+/).map(cls => {
                if (cls.startsWith('text-')) {
                    if (cls === 'text-white') return cls;
                    if (cls === 'text-primary' || cls === 'text-accent') return 'text-primary';
                    // User says "only two colors... one is primary... second is white"
                    // We'll replace all other text- colors with text-white
                    return 'text-white';
                }
                return cls;
            }).join(' ');
            
            if (classNameStr !== newClassNameStr) {
                modified = true;
                return `${prefix}${newClassNameStr}${quote2}`;
            }
            return match;
        });
    });
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Modified:', filePath);
    }
});
