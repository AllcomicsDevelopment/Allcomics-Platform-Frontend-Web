// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiUrl: 'https://api.allcomics.co.kr/v1',
    // localUrl: 'http://localhost:4493/v1',
    // apiUrl: 'https://api-client.allcomics.org/v1',
    localUrl: 'https://api-client.allcomics.org/v1',
    oauthAPI: 'https://dev.oauth.allcomics.co.kr',
    project: 'allcomics',
    target_arn: 'arn:aws:sns:ap-northeast-2:085403634746:lemon-hello-sns',
    baseUrl: 'http://localhost:4200',
    language: 'ko'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
