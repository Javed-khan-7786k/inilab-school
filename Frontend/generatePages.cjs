const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const appTsxPath = path.join(__dirname, 'src', 'App.tsx');
const navTsPath = path.join(__dirname, 'src', 'constants', 'navigation.ts');

const tree = [
  { group: null, items: ['Dashboard', 'Student', 'Parents', 'Teacher', 'Staff'] },
  { group: 'Academic', items: ['Class', 'Section', 'Subject', 'Syllabus', 'Assignments', 'Routine'] },
  { group: 'Attendance', items: ['Student Attendance', 'Staff Attendance'] },
  { group: 'Exam', items: ['Exam', 'Exam Schedule', 'Grade', 'Exam Attendance'] },
  { group: 'Mark', items: ['Mark', 'Mark Distribution', 'Promotion'] },
  { group: null, items: ['Message', 'Media', 'Mail / SMS'] },
  { group: 'Online Exam', items: ['Question Group', 'Question Level', 'Question Bank', 'Online Exam', 'Instruction', 'Take Exam'] },
  { group: 'Payroll', items: ['Salary Template', 'Hourly Template', 'Manage Salary', 'Make Payments', 'Overtime'] },
  { group: 'Asset Management', items: ['Vendor', 'Location', 'Asset Category', 'Asset', 'Asset Assignments', 'Purchase'] },
  { group: 'Inventory', items: ['Category', 'Product', 'Warehouse', 'Supplier', 'Purchase', 'Sale'] },
  { group: 'Leave Application', items: ['Leave Category', 'Leave Assign', 'Leave Apply', 'Leave Application'] },
  { group: null, items: ['Tutorial', 'gmeetliveclass'] },
  { group: 'Child', items: ['Activities Category', 'Activities', 'Child Care'] },
  { group: 'Library', items: ['Member', 'Books', 'Issue', 'E-Books'] },
  { group: 'Transport', items: ['Transport', 'Member'] },
  { group: 'Hostel', items: ['Hostel', 'Category', 'Member'] },
  { group: 'Sponsorship', items: ['Candidate', 'Sponsor', 'Sponsorship'] },
  { group: 'Account', items: ['Fee Types', 'Invoice', 'Payment History', 'Expense', 'Income', 'Global Payment'] },
  { group: 'Announcement', items: ['Notice', 'Events', 'Holiday'] },
  { group: 'Report', items: [
      'Class Report', 'Sponsorship Report', 'Student Report', 'ID Card Report', 'Admit Card Report', 'Routine Report',
      'Exam Schedule Report', 'Attendance Report', 'Attendance Overview Report', 'Library Books Report', 'Library Card Report',
      'Library Book Issue Report', 'Personal Report', 'Mark Usage Report', 'Tabulation Sheet Report', 'Mark Sheet Report',
      'Progress Card Report', 'Teacher Gender Report', 'Online Exam Report', 'Online Exam Question Report', 'Online Exam Question Answers Report',
      'Online Admission Report', 'Certificate Report', 'Leave Application Report', 'Product Purchase Report', 'Product Sale Report',
      'Academic Payment Fees Report', 'Fees Report', 'Due Fees Report', 'Balance Fees Report', 'Transaction Report', 'Students Fine Report',
      'Overview Report', 'Salary Report', 'Account Ledger Report'
  ]},
  { group: null, items: ['Online Admission'] },
  { group: 'Administrator', items: ['Academic Year', 'Student Group', 'Complaint', 'Purchase Template', 'Reset Admin', 'Passcode', 'Make Login Templates', 'Import', 'Backup', 'Mail Log', 'Auto Logout'] },
  { group: 'Frontend', items: ['Visitor Comments', 'Take Exam Frontend', 'Pages', 'Library Frontend'] },
  { group: 'Settings', items: ['General Setting', 'Financial Settings', 'Payment Settings', 'SMS Settings', 'Email Setting', 'Mock Setting'] },
  { group: null, items: ['Current Enquiries'] }
];

const toPascalCase = (str) => {
    return str.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '').replace(/^[a-z]/, (m) => m.toUpperCase());
};

const toKebabCase = (str) => {
    return str.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase().replace(/^-|-$/g, '');
};

const getIcon = (label) => {
    const iconMap = {
        'Dashboard': 'fa-laptop', 'Student': 'fa-users', 'Parents': 'fa-user', 'Teacher': 'fa-user-secret', 'Staff': 'fa-user',
        'Academic': 'fa-book', 'Attendance': 'fa-calendar', 'Exam': 'fa-pencil', 'Mark': 'fa-flask', 'Message': 'fa-envelope',
        'Media': 'fa-camera', 'Mail / SMS': 'fa-paper-plane', 'Online Exam': 'fa-internet-explorer', 'Payroll': 'fa-money',
        'Asset Management': 'fa-archive', 'Inventory': 'fa-inbox', 'Leave Application': 'fa-rocket', 'Tutorial': 'fa-youtube-play',
        'gmeetliveclass': 'fa-video-camera', 'Child': 'fa-child', 'Library': 'fa-book', 'Transport': 'fa-bus', 'Hostel': 'fa-building',
        'Sponsorship': 'fa-handshake-o', 'Account': 'fa-briefcase', 'Announcement': 'fa-bullhorn', 'Report': 'fa-file-text',
        'Online Admission': 'fa-user-plus', 'Administrator': 'fa-cogs', 'Frontend': 'fa-desktop', 'Settings': 'fa-cog', 'Current Enquiries': 'fa-list'
    };
    return iconMap[label] || 'fa-circle-o';
};

const pagesToCreate = [];
const adminNavigationItems = [];

tree.forEach(node => {
    if (node.group === null) {
        node.items.forEach(item => {
            const pageName = toPascalCase(item) + 'Page';
            let pathRoute = '/dashboard/' + toKebabCase(item);
            if (item === 'Dashboard') pathRoute = '/dashboard';
            
            pagesToCreate.push({ name: pageName, route: pathRoute, label: item });
            adminNavigationItems.push({
                type: 'link',
                data: { icon: getIcon(item), label: item, href: pathRoute }
            });
        });
    } else {
        const children = [];
        node.items.forEach(item => {
            const pageName = toPascalCase(node.group) + toPascalCase(item) + 'Page';
            const pathRoute = '/dashboard/' + toKebabCase(node.group) + '/' + toKebabCase(item);
            
            pagesToCreate.push({ name: pageName, route: pathRoute, label: item });
            children.push({ icon: 'fa-circle-o', label: item, href: pathRoute });
        });
        
        adminNavigationItems.push({
            type: 'treeview',
            data: {
                icon: getIcon(node.group),
                label: node.group,
                defaultOpen: false,
                children: children
            }
        });
    }
});

// Create missing files
let createdCount = 0;
pagesToCreate.forEach(page => {
    const filePath = path.join(pagesDir, page.name + '.tsx');
    if (!fs.existsSync(filePath)) {
        const template = `import React from 'react';\nimport { DashboardLayout } from '../components/layout/DashboardLayout';\n\nexport function ${page.name}() {\n  return (\n    <DashboardLayout>\n      <div className="p-6">\n        <h1 className="text-2xl font-bold">{ "${page.label}" }</h1>\n        <p className="mt-4 text-gray-600">This page is under construction.</p>\n      </div>\n    </DashboardLayout>\n  );\n}\n`;
        fs.writeFileSync(filePath, template, 'utf8');
        createdCount++;
    }
});
console.log('Created ' + createdCount + ' missing pages.');

// Read App.tsx
let appTsx = fs.readFileSync(appTsxPath, 'utf8');
const routesArray = [];
const importsArray = [];

pagesToCreate.forEach(page => {
    // Only add if not already in App.tsx
    if (!appTsx.includes('import { ' + page.name + ' }')) {
        importsArray.push('import { ' + page.name + ' } from "./pages/' + page.name + '";');
    }
    
    // Check if route exists approximately
    if (!appTsx.includes('element={<' + page.name + ' />}') && !appTsx.includes('element={<ProtectedRoute><' + page.name + ' /></ProtectedRoute>}')) {
        routesArray.push('\\n          <Route\\n            path="' + page.route + '"\\n            element={\\n              <ProtectedRoute>\\n                <' + page.name + ' />\\n              </ProtectedRoute>\\n            }\\n          />');
    }
});

if (importsArray.length > 0 || routesArray.length > 0) {
    // Insert imports at the end of the imports section (before function App() or const App =)
    const importInsertPos = appTsx.lastIndexOf('import ');
    if (importInsertPos !== -1) {
        const endOfImportLine = appTsx.indexOf('\\n', importInsertPos);
        appTsx = appTsx.slice(0, endOfImportLine + 1) + importsArray.join('\\n') + '\\n' + appTsx.slice(endOfImportLine + 1);
    } else {
        appTsx = importsArray.join('\\n') + '\\n' + appTsx;
    }
    
    // Insert routes before {/* Default redirect */}
    const routeInsertPos = appTsx.indexOf('{/* Default redirect */}');
    if (routeInsertPos !== -1) {
        appTsx = appTsx.slice(0, routeInsertPos) + routesArray.join('') + '\\n          ' + appTsx.slice(routeInsertPos);
    }
    
    fs.writeFileSync(appTsxPath, appTsx, 'utf8');
    console.log('Updated App.tsx with new imports and routes.');
}

// Generate Admin navigation items string for copy-pasting or replacing
const navItemsString = JSON.stringify(adminNavigationItems, null, 2);
fs.writeFileSync(path.join(__dirname, 'admin_nav.json'), navItemsString, 'utf8');
console.log('Saved admin_nav.json');
