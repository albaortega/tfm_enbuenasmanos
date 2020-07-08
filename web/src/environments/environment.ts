// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
    isMockEnabled: true, // You have to switch this, when your real back-end is done
    authTokenKey: 'authce9d77b308c149d5992a80073637e4d5',
    firebaseConfig: {
          apiKey: "AIzaSyAPE0LUtRc2qT6kBka8dKX92GQdgFm6OPY",
          authDomain: "enbuenasmanos.firebaseapp.com",
          databaseURL: "https://enbuenasmanos.firebaseio.com",
          projectId: "enbuenasmanos",
          storageBucket: "enbuenasmanos.appspot.com",
          messagingSenderId: "464035979401",
          appId: "1:464035979401:web:cebbaa262d899d27"
    },
    appURL: "http://localhost:8080"
};
