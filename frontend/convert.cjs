const fs = require('fs');

let html = fs.readFileSync('stitch_home.html', 'utf-8');

// Extract body content
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
if (!bodyMatch) {
  console.log('No body found');
  process.exit(1);
}

let jsx = bodyMatch[1];
// Convert class to className
jsx = jsx.replace(/class=/g, 'className=');
// Convert inline styles
jsx = jsx.replace(/style="background-image:\s*url\('([^']+)'\)"/g, "style={{ backgroundImage: `url('$1')` }}");
// Close img tags
jsx = jsx.replace(/<img([^>]+[^\/])>/g, '<img$1 />');
// Remove <script> tags inside body if any
jsx = jsx.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

// Strip the hardcoded Navbar from the Stitch HTML so we can use our own component if needed
// Actually, for this redesign, let's keep the Stitch HTML structure exactly as generated.
// We just need to replace the Login button with a Link, etc. later.

const reactCode = `import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
    const navigate = useNavigate();
    
    return (
        <div className="bg-background text-on-background font-body-md overflow-x-hidden min-h-screen">
            ${jsx}
        </div>
    );
};

export default Home;
`;

fs.writeFileSync('src/pages/Home.jsx', reactCode);
console.log('Converted Home.jsx');
