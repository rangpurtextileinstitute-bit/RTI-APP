const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "const handleSendGuardianAlert = (studentId: string, alertType: any, msg: string) => {",
  "const handleSendGuardianAlert = (studentId: string, alertType: GuardianAlert['alertType'], msg: string) => {"
);

fs.writeFileSync('src/App.tsx', content, 'utf8');

