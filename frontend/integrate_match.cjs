const fs = require('fs');

let oldMatch = fs.readFileSync('src/pages/MatchDetail.jsx', 'utf8');
let newMatch = fs.readFileSync('src/pages/MatchDetailStitch.jsx', 'utf8');

// Extract the logic part of MatchDetail.jsx
// It ends just before `return (`
const logicPartMatch = oldMatch.match(/([\s\S]*?)return \(\s*<div className="max-w-7xl mx-auto space-y-8 pb-32">/);
if (!logicPartMatch) process.exit(1);
const logicPart = logicPartMatch[1];

// We'll process newMatch to make it dynamic.
// 1. Team Hawks -> {match.teamA.name}
newMatch = newMatch.replace(/Team Hawks/g, '{match.teamA.name}');
// 2. Team Falcons -> {match.teamB.name}
newMatch = newMatch.replace(/Team Falcons/g, '{match.teamB.name}');
// 3. Score 15 -> {currentSet.teamAScore || 0}
// Note: We need to be careful. The score 15 is rendered as:
// <span className="text-7xl md:text-9xl font-black glow-primary text-primary tracking-tighter">15</span>
newMatch = newMatch.replace(/>15</g, '>{currentSet?.teamAScore || 0}<');
newMatch = newMatch.replace(/>12</g, '>{currentSet?.teamBScore || 0}<');
// 4. Sets: Hawks 1 - 0 Falcons
newMatch = newMatch.replace(/Sets: \{match\.teamA\.name\} 1 - 0 \{match\.teamB\.name\}/g, 'Sets: {match.teamA.name} {teamASets} - {teamBSets} {match.teamB.name}');
// 5. Set 2 - Ongoing
newMatch = newMatch.replace(/Set 2 - Ongoing/g, 'Set {match.currentSet} - {match.status === \'live\' ? \'Ongoing\' : \'Finished\'}');

// Remove the static TopNavBar from newMatch since we already have a way to navigate back, 
// or let's just keep the new one and modify the "Live", "Matches", etc to Link.
newMatch = newMatch.replace(/<a className="([^"]+)" href="#">Live<\/a>/, '<Link to="/" className="$1">Live</Link>');
newMatch = newMatch.replace(/<a className="([^"]+)" href="#">Matches<\/a>/, '<Link to="/" className="$1">Matches</Link>');

// We don't have the player list dynamic easily since the old schema didn't populate players or they were in `match.teamA.players`. Let's just leave the sidebar as is (dummy data) or comment out the `li`s and add a map if `match.teamA.players` exists.
// For now, let's just leave the sidebar static to preserve the layout without crashing if players are null.

// Create final JSX
const finalJSX = `${logicPart}
    return (
        <div className="bg-background text-on-background font-body-md overflow-x-hidden min-h-screen">
            ${newMatch}
        </div>
    );
};
export default MatchDetail;
`;

fs.writeFileSync('src/pages/MatchDetail.jsx', finalJSX);
console.log('Integrated MatchDetail.jsx');
