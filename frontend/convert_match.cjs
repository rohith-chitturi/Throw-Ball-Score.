const fs = require('fs');

let html = fs.readFileSync('stitch_match.html', 'utf8');

const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
if (!bodyMatch) process.exit(1);

let jsx = bodyMatch[1];
jsx = jsx.replace(/class=/g, 'className=');
jsx = jsx.replace(/<!--/g, '{/*');
jsx = jsx.replace(/-->/g, '*/}');
jsx = jsx.replace(/style="([^"]+)"/g, (match, p1) => {
    return 'style={{}}'; // simplified
});
jsx = jsx.replace(/<img([^>]+[^\/])>/g, '<img$1 />');
jsx = jsx.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
jsx = jsx.replace(/<hr([^>]+[^\/])>/g, '<hr$1 />');

fs.writeFileSync('src/pages/MatchDetailStitch.jsx', jsx);
console.log('Done');
