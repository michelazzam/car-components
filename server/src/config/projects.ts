export const ProjectsConfig = {
  'car-components': {
    name: 'Car Components',
    logo: '/assets/images/brand-logos/logo.jpg',
    displayName: 'Car Components',
    description: 'Car Components Management System',
    author: 'Car Components',
    keywords: 'system, pos, apos, Car Components, Car Components - APOS',
    productName: 'car-components',
    identifier: 'com.ams.carcomponents',
    version: '0.2.0',
    repository: {
      url: 'git+https://github.com/michelazzam/Car-Components.git',
      issues: 'https://github.com/michelazzam/Car-Components/issues',
      homepage: 'https://github.com/michelazzam/Car-Components#readme',
    },
    updater: {
      endpoints: [
        'https://github.com/michelazzam/car-components/releases/latest/download/latest.json',
      ],
    },
    storage: {
      name: 'Car Components Purchase Storage',
    },
    settings: {
      features: {
        manageCarBrandsModels: true,
        allowServices: true,
        showSort: true,
        allowEditingStock: true,
      },
      invoice: {
        manageCustomerType: true,
        allowItemDiscountLessThanCost: false,
        allowChangePrice: true,
        allowDiscountPerItem: true,
      },
      inventory: {
        showSort: true,
        allowEditingStock: true,
        showStockLevels: true,
        allowBulkOperations: true,
      },
      ui: {
        theme: 'car-theme',
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
      },
    },
    env: {
      client: {
        NEXT_PUBLIC_APP_NAME: 'Car Components',
        NEXT_PUBLIC_BILLING_TOKEN: 'token_for_car_components',
        NEXT_PUBLIC_API_URL: 'http://localhost:8000/v1',
        NEXT_PUBLIC_BILLING_URL:
          'https://admin.panel.staging.advanced-meta.com',
        NEXT_PUBLIC_GITHUB_TOKEN:
          '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',
        NEXT_PUBLIC_ALLOW_SERVICES: 'true',
        NEXT_PUBLIC_MANAGE_CAR_BRANDS_MODELS: 'true',
        NEXT_PUBLIC_ALLOW_EDITING_STOCK: 'true',
        NEXT_PUBLIC_MANAGE_CUSTOMER_TYPE: 'true',
        NEXT_PUBLIC_ALLOW_ITEM_DISCOUNT_LESS_THAN_COST: 'false',
        NEXT_PUBLIC_ALLOW_CHANGE_PRICE: 'true',
        NEXT_PUBLIC_ALLOW_DISCOUNT_PER_ITEM: 'true',
        NEXT_PUBLIC_PRIMARY_COLOR: '#3B82F6',
        NEXT_PUBLIC_SECONDARY_COLOR: '#1E40AF',
      },
      tauri: {
        NODE_ENV: 'development',
        PORT: '8000',
        DATABASE_URL: 'mongodb://127.0.0.1:27017',
        AMS_SERVER_URL: 'https://admin.panel.advanced-meta.com',
        BACKUP_DATABASE_URL:
          'mongodb+srv://husseinhopehassan:dlM1aPjAoPpfFc12@cluster0.t9khsc5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        TELEGRAM_API_TOKEN: '8159012563:AAFewyHGGLCAdm8Y-WTNNzxe88j2Pxo43zA',
        CHAT_ID: '-1002683151718',
        CLIENT_CHAT_ID: '-1002669572928',
        TAURI_SIGNING_PRIVATE_KEY:
          'dW50cnVzdGVkIGNvbW1lbnQ6IHJzaWduIGVuY3J5cHRlZCBzZWNyZXQga2V5ClJXUlRZMEl5NWRVcWRpWWJ3NjBsaUJaWUlVdnBWV2NhUzdNRXNzTW9PbjlJOUxxN2tFRUFBQkFBQUFBQUFBQUFBQUlBQUFBQUVvbkhrM0RrN0pWVTQ0aEtSQ3BZSDRFRytnSmcydTFDWndoLy9vcHFJdndiZkZHRitJVnhMSE5jUTh6UDZiRVlkR2JQSzVBSWorTFpxSE9HbkZZZVJ2UzcrTkswYmE4UzNUaS9SNStKazdWSXQrYjBTTHQ2MEhQalQvT2hvaWNYbE43aitmdXZLU2c9Cg==',
        CLIENT_NAME: 'Car Components',
        CUSTOM_ENV: 'car-components',
      },
    },
  },
  'another-customer': {
    name: 'Another Customer',
    displayName: 'Another Customer App',
    logo: '/assets/images/brand-logos/thermoBox-logo.jpg',
    description: 'Another Customer Management System',
    author: 'Another Customer',
    keywords: 'system, pos, apos, Another Customer, Another Customer - APOS',
    productName: 'another-customer',
    identifier: 'com.ams.anothercustomer',
    version: '0.1.0',
    repository: {
      url: 'git+https://github.com/michelazzam/Another-Customer.git',
      issues: 'https://github.com/michelazzam/Another-Customer/issues',
      homepage: 'https://github.com/michelazzam/Another-Customer#readme',
    },
    updater: {
      endpoints: [
        'https://github.com/michelazzam/another-customer/releases/latest/download/latest.json',
      ],
    },
    storage: {
      name: 'Another Customer Purchase Storage',
    },
    settings: {
      features: {
        manageCarBrandsModels: false,
        allowServices: false,
        showSort: true,
        allowEditingStock: false,
      },
      invoice: {
        manageCustomerType: false,
        allowItemDiscountLessThanCost: true,
        allowChangePrice: false,
        allowDiscountPerItem: false,
      },
      inventory: {
        showSort: true,
        allowEditingStock: false,
        showStockLevels: false,
        allowBulkOperations: false,
      },
      ui: {
        theme: 'customer-theme',
        primaryColor: '#10B981',
        secondaryColor: '#059669',
      },
    },
    env: {
      client: {
        NEXT_PUBLIC_APP_NAME: 'Another Customer',
        NEXT_PUBLIC_BILLING_TOKEN: 'token_for_another_customer',
        NEXT_PUBLIC_API_URL: 'http://localhost:8000/v1',
        NEXT_PUBLIC_BILLING_URL:
          'https://admin.panel.staging.advanced-meta.com',
        NEXT_PUBLIC_GITHUB_TOKEN:
          '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',
        NEXT_PUBLIC_ALLOW_SERVICES: 'false',
        NEXT_PUBLIC_MANAGE_CAR_BRANDS_MODELS: 'false',
        NEXT_PUBLIC_ALLOW_EDITING_STOCK: 'false',
        NEXT_PUBLIC_MANAGE_CUSTOMER_TYPE: 'false',
        NEXT_PUBLIC_ALLOW_ITEM_DISCOUNT_LESS_THAN_COST: 'true',
        NEXT_PUBLIC_ALLOW_CHANGE_PRICE: 'false',
        NEXT_PUBLIC_ALLOW_DISCOUNT_PER_ITEM: 'false',
        NEXT_PUBLIC_PRIMARY_COLOR: '#10B981',
        NEXT_PUBLIC_SECONDARY_COLOR: '#059669',
      },
      tauri: {
        NODE_ENV: 'development',
        PORT: '8000',
        DATABASE_URL: 'mongodb://127.0.0.1:27017',
        AMS_SERVER_URL: 'https://admin.panel.advanced-meta.com',
        BACKUP_DATABASE_URL:
          'mongodb+srv://husseinhopehassan:dlM1aPjAoPpfFc12@cluster0.t9khsc5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        TELEGRAM_API_TOKEN: '8159012563:AAFewyHGGLCAdm8Y-WTNNzxe88j2Pxo43zA',
        CHAT_ID: '-1002683151718',
        CLIENT_CHAT_ID: '-1002669572928',
        TAURI_SIGNING_PRIVATE_KEY:
          'dW50cnVzdGVkIGNvbW1lbnQ6IHJzaWduIGVuY3J5cHRlZCBzZWNyZXQga2V5ClJXUlRZMEl5NWRVcWRpWWJ3NjBsaUJaWUlVdnBWV2NhUzdNRXNzTW9PbjlJOUxxN2tFRUFBQkFBQUFBQUFBQUFBQUlBQUFBQUVvbkhrM0RrN0pWVTQ0aEtSQ3BZSDRFRytnSmcydTFDWndoLy9vcHFJdndiZkZHRitJVnhMSE5jUTh6UDZiRVlkR2JQSzVBSWorTFpxSE9HbkZZZVJ2UzcrTkswYmE4UzNUaS9SNStKazdWSXQrYjBTTHQ2MEhQalQvT2hvaWNYbE43aitmdXZLU2c9Cg==',
        CLIENT_NAME: 'Another Customer',
        CUSTOM_ENV: 'another-customer',
      },
    },
  },
  'xyz-customer': {
    name: 'Xyz Customer',
    logo: '/assets/images/brand-logos/logo_sanaya.png',
    displayName: 'Xyz Customer',
    description: 'Xyz Customer Management System',
    author: 'Xyz Customer',
    keywords: 'system, pos, apos, Xyz Customer, Xyz Customer - APOS',
    productName: 'xyz-customer',
    identifier: 'com.ams.xyzcustomer',
    version: '0.1.0',
    repository: {
      url: 'git+https://github.com/michelazzam/xyz-customer.git',
      issues: 'https://github.com/michelazzam/xyz-customer/issues',
      homepage: 'https://github.com/michelazzam/xyz-customer#readme',
    },
    updater: {
      endpoints: [
        'https://github.com/michelazzam/xyz-customer/releases/latest/download/latest.json',
      ],
    },
    storage: {
      name: 'Xyz Customer Purchase Storage',
    },
    settings: {
      features: {
        manageCarBrandsModels: true,
        allowServices: true,
        showSort: true,
        allowEditingStock: true,
      },
      invoice: {
        manageCustomerType: true,
        allowItemDiscountLessThanCost: false,
        allowChangePrice: true,
        allowDiscountPerItem: true,
      },
      inventory: {
        showSort: true,
        allowEditingStock: true,
        showStockLevels: true,
        allowBulkOperations: true,
      },
      ui: {
        theme: 'xyz-customer-theme',
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
      },
    },
    env: {
      client: {
        NEXT_PUBLIC_API_URL: 'http://localhost:8000/v1',
        NEXT_PUBLIC_BILLING_URL:
          'https://admin.panel.staging.advanced-meta.com',
      },
      tauri: {
        NODE_ENV: 'development',
        PORT: '8000',
        DATABASE_URL: 'mongodb://127.0.0.1:27017',
        AMS_SERVER_URL: 'https://admin.panel.advanced-meta.com',
        BACKUP_DATABASE_URL:
          'mongodb+srv://husseinhopehassan:dlM1aPjAoPpfFc12@cluster0.t9khsc5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        TELEGRAM_API_TOKEN: '8159012563:AAFewyHGGLCAdm8Y-WTNNzxe88j2Pxo43zA',
        CHAT_ID: '-1002683151718',
        CLIENT_CHAT_ID: '-1002669572928',
        TAURI_SIGNING_PRIVATE_KEY:
          'dW50cnVzdGVkIGNvbW1lbnQ6IHJzaWduIGVuY3J5cHRlZCBzZWNyZXQga2V5ClJXUlRZMEl5NWRVcWRpWWJ3NjBsaUJaWUlVdnBWV2NhUzdNRXNzTW9PbjlJOUxxN2tFRUFBQkFBQUFBQUFBQUFBQUlBQUFBQUVvbkhrM0RrN0pWVTQ0aEtSQ3BZSDRFRytnSmcydTFDWndoLy9vcHFJdndiZkZHRitJVnhMSE5jUTh6UDZiRVlkR2JQSzVBSWorTFpxSE9HbkZZZVJ2UzcrTkswYmE4UzNUaS9SNStKazdWSXQrYjBTTHQ2MEhQalQvT2hvaWNYbE43aitmdXZLU2c9Cg==',
        CLIENT_NAME: 'Xyz Customer',
        CUSTOM_ENV: 'xyz-customer',
      },
    },
  },
};
