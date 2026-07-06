const fs = require('fs');
let content = fs.readFileSync('src/components/OwnerDashboard.tsx', 'utf8');
content = content.replace("History", "FileText"); // Replace History if it was unused or fix import
fs.writeFileSync('src/components/OwnerDashboard.tsx', content);

let contentTenant = fs.readFileSync('src/components/TenantApp.tsx', 'utf8');
contentTenant = contentTenant.replace("currentUser.room", "currentUser.roomNumber");
contentTenant = contentTenant.replace("currentUser.room", "currentUser.roomNumber");
contentTenant = contentTenant.replace("currentUser.room", "currentUser.roomNumber");
contentTenant = contentTenant.replace("currentUser.room", "currentUser.roomNumber");
contentTenant = contentTenant.replace("currentUser.room", "currentUser.roomNumber");
fs.writeFileSync('src/components/TenantApp.tsx', contentTenant);
