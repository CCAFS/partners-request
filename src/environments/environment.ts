// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//import { config } from 'process';

export const environment = {
  production: false,
  apiUrl: '/api',
  app_user: 'marlosadmin',
  app_password: "6723646",
  default_user:{
    email: 'MARLOSupport@cgiar.org',
    name: 'MARLO support',
    comments: 'Partner Request App'
  },
  config:{
    apiUrl:'apiUrl'
  }
};