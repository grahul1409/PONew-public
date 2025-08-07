# PONew - SAP CAP Purchase Order Approval Application

Welcome to your SAP CAP Purchase Order Approval project.

## Project Structure

This project contains:

File or Folder | Purpose
---------|----------
`app/` | UI frontend applications (Fiori Elements apps)
`db/` | Domain models and data (CDS schema, CSV data)
`srv/` | Service models and implementation (OData services)
`approuter/` | Application router for multi-tenant apps
`package.json` | Project metadata and configuration
`mta.yaml` | Multi-Target Application deployment descriptor

## Applications

- **project1**: Main Purchase Order approval app with custom extensions
- **project2**: Alternative PO management interface
- **project3**: Additional PO views and reports

## Key Features

- Purchase Order creation and approval workflow
- Multi-level approval process
- User-specific PO views
- Integration with SAP BTP
- Fiori Elements based UI
- OData V4 services

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   cds watch
   ```

3. Access the applications:
   - project1: http://localhost:4004/project1/webapp/index.html
   - project2: http://localhost:4004/project2/webapp/index.html
   - project3: http://localhost:4004/project3/webapp/index.html

## Deployment

This application is configured for deployment to SAP BTP using MTA (Multi-Target Application) approach.

```bash
npm run build
npm run deploy
```

## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.