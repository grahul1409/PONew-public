# Simple App Router for PONew UI Access

## Current Status
✅ **project1** is successfully deployed to HTML5 Repository
- App Host ID: `74461e68-54df-49a5-9ad2-4a1b6e01b197`
- Service Instance: `ext_capapp-html5-srv`
- Status: UPLOADED
- Size: 30.78 KB

## Access Options

### Option 1: Create App Router (Recommended)

Create a simple Application Router to access your UI5 applications:

1. **Create approuter directory:**
```bash
mkdir approuter
cd approuter
npm init -y
npm install @sap/approuter
```

2. **Create xs-app.json:**
```json
{
  "welcomeFile": "/project1/index.html",
  "authenticationMethod": "none",
  "routes": [
    {
      "source": "^/project1/(.*)$",
      "target": "$1",
      "localDir": "resources",
      "authenticationType": "none"
    },
    {
      "source": "^/api/(.*)$",
      "destination": "backend",
      "authenticationType": "none"
    }
  ]
}
```

3. **Create manifest.yml:**
```yaml
applications:
- name: PONew-approuter
  buildpack: nodejs_buildpack
  memory: 256M
  services:
  - ext_capapp-html5-srv
  env:
    destinations: |
      [
        {
          "name": "backend",
          "url": "https://your-cap-service-url",
          "forwardAuthToken": true
        }
      ]
```

4. **Deploy:**
```bash
cf push
```

### Option 2: Direct HTML5 Repository Access

For development/testing purposes, you can access the UI directly:

1. **Get HTML5 Repository URL:**
```bash
cf service-key ext_capapp-html5-srv mykey
```

2. **Access URL Format:**
```
https://{html5_repository_url}/app/{app-id}/index.html
```

## Current Application Structure

```
PONew/
├── app/
│   ├── project1/           # Main PO Approval App
│   │   ├── webapp/
│   │   │   ├── index.html
│   │   │   ├── manifest.json
│   │   │   └── Component.js
│   │   └── package.json
│   ├── project2/           # Alternative PO View
│   └── approuter/          # Application Router
│       ├── xs-app.json
│       └── package.json
├── srv/                    # CAP Service Layer
└── db/                     # Database Layer
```

## Next Steps

1. ✅ **Applications Deployed** - project1 is in HTML5 Repository
2. 🔄 **Setup App Router** - Create routing configuration
3. ⏳ **Configure Authentication** - Setup XSUAA if needed
4. ⏳ **Test End-to-End** - Verify full application flow