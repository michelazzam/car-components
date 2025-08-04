# Creating tauri from Next js (page router) & Nest js

## 1- Main Next Configurations?

- While downloading the tauri , it asks us , the port and where is the out of our client ?
  `Note: Out is the static site that is generated after building the next app`

```js
/**@type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export", //Here  in nextconfig.json , this tells build to make a static export
 ...
};
module.exports = nextConfig;
```

- the export path was : `../client/out`
  it is specified in tauri.config.json

```json
"build": {
    "frontendDist": "../client/out",
    "devUrl": "http://localhost:3000",
    "beforeDevCommand": "npm run dev:client"
  },
```

## 2-Main Nestjs Config:

`Note: In summary, here we will make an executable of the nest js application, we need 3 - one for os , linux and windows , for now i made the windows . And then we give this exe to the /bin in tauri that will treat it as a non-packaged resource ( just to run it as it is )`

### a-Prerequisites

- Handle crypto library to run before starting the nest server (server/src/main.ts)

```ts
if (typeof (globalThis as any).crypto === "undefined") {
  (globalThis as any).crypto = {
    randomUUID: (): string => nodeCrypto.randomUUID(),
  };
}
```

- Enhable the cors for the server (tauri will not sit on http by default , we added http package)

```ts
app.enableCors({
  origin: ["http://tauri.localhost", "*"],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
});
```

- Adding http package to tauri

```toml
#/src-tauri/Cargo.toml
[dependencies]
serde_json = "1.0"
serde = { version = "1.0", features = ["derive"] }
log = "0.4"
tauri = { version = "2.5.0", features = ["protocol-asset"] }
tauri-plugin-log = "2.0.0-rc"
tauri-plugin-shell = "2"
tauri-plugin-http = "2.4.3" #HERE THE HTTP PACKAGE

```

- Adding the http plugin to src-tauri/src/main.rs

```rust
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init()) //here is the plugin , it registers on builder and then it givebuilder to the next method , allowing chain
```

### b- Packaging

- Install the pkg from npm (in server)
- Run the pkg:win command that will run the following

```json
"pkg dist/main.js --target node18-win-x64 --output ../src-tauri/bin/server-x86_64-pc-windows-msvc.exe"

//This will:
//1- Pick the output of the build ( static server at main.js )
//2- Go to src-tauri/bin and put it
//3- It will name it : server-x86_64-pc-windows-msvc.exe which is necessary
//i needed 2 hours to guess this :)
```

`Note : Dont forget that this is special for windows, for macos or linux there are different commands , !!also use the node18 as it worked nicely!!`

### c- Telling Tauri about it

```json
//tauri.conf.json
 "bundle": {
    "externalBin": ["bin/server"],
```

`Note: Take the exact name here, just server as it will look for this only, those are called : sidecar `
`Sidecar was confusing since i though it was related to the project's name`

### d- Starting the server at main.rs

`We 1-Packed the server, 2-Told tauri that it is present and we want to use it , now the usage time`

```rust
  let sidecar_command = app.shell().sidecar("server").unwrap();
            let (mut rx, mut child) = sidecar_command
                .env("NODE_ENV", "development")
                .env("PORT", "8000")
                .env("DATABASE_URL", "ENV_OF_DATABASE")
                .env("BACKUP_DATABASE_URL", "ENV_OF_BACKUP_DATABASE")
                .args(["--port", "8000"])
                .spawn()
                .expect("failed to spawn sidecar");
```

`Here envs took me 2 hours to realise, as it was not giving any error, just crashing`

## 3- Tauri build and executables

`WHAT TO HAVE BEFORE RUNNING TAURI?`

- Downloaded rust from the official rust

`RUNNING THE BUILD`

- run the `npm run tauri:build` from the root, However in future we should make it better by automating building client and server and packaging server into tauri and then building tauri
- - We should add a public key and private key to the "/src-tauri/~/.tauri/myapp.key" and "/src-tauri/~/.tauri/myapp.key.pub" (those are key text files) that will make the signature for the updater
- When running from the root (on cmnd line ) we should tell tauri that : the env is at: some path , example:

```cmd
%% THIS IS ONLY ON WINDOWS %%

$env:TAURI_SIGNING_PRIVATE_KEY = Get-Content -Raw ".\src-tauri\~\.tauri\myapp.key"

%% THIS IS ONLY ON MAC %%

export TAURI_SIGNING_PRIVATE_KEY="$(cat ./src-tauri/~/.tauri/myapp.key)"
```

- When building is finished, it will ask us for a password ( to make the .sig file ) , here we should add :

```cmd
ams-123
```

- If we want to add

`EXECUTABLE`

- An executable installer will be at `src-tauri\target\release\bundle\nsis`
- Or you can just double click : `src-tauri\target\release\cars.exe`

## 4-Updater Plugin

good reference: https://thatgurjot.com/til/tauri-auto-updater/

`Description: a plugin for updating the app automatically`

#### How it works?

It will search for the url we provide for a latest.json referencing a github release

```json
{
  "pubkey": "dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmlzaWduIHB1YmxpYyBrZXk6IENEOENERjY1NzA1NjRGNjQKUldSa1QxWndaZCtNemRxOHdqWDZxOXA0K2FkM2dwTnVLWHRJVFRicS82Yk1tTDJMU3IzUmMyUHAK",

  "endpoints": [
    "https://github.com/michelazzam/car-components/releases/latest/download/latest.json"
  ]
}
```

and we on the frontend will handle that using the libraries:

```tsx
//  path: /header/UpdateButton.tsx
//This function will be automatically fed by the tauri with github url ( just in production )
//It is self descriptive : Cehck for updates and if there are , just ask user if he wants

import { check } from "@tauri-apps/plugin-updater";
import { ask } from "@tauri-apps/plugin-dialog";

async function checkForUpdates() {
  const token = process.env.GITHUB_TOKEN;
  const update = await check({
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (update) {
    console.log("Update found", update);
    const proceed = await ask(
      "A new version is available. Do you want to update?"
    );
    if (proceed) {
      await update.downloadAndInstall();
      window.location.reload();
    }
    return true;
  } else {
    console.log("No update found");
  }
  return false;
}
```

### Github needs:

1- a public repo ( private wont work as i tried)
2-we should add releases to detect it as follow:

- tag the release as v[version] (example : v0.1.0)
- attach latest.json && the .exe version
  3- latest.json content example

```json
{
  "version": "0.1.0",
  "notes": "Bug fixes and improvements",
  "pub_date": "2025-05-21T09:00:00Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "//here the .sig that comes with the release, convert it to base x64",
      "url": "https://github.com/mohammadNouredine/steps/releases/download/v0.2.0/car-components_0.2.0_x64-setup.exe" //this is just the url of the .exe, make sure to name it correctly
    }
  }
}
```

4- the .exe file (installer) and make sure that each url for exe is matching the platform (windows-x86_64 -> it has custom app and the windows will search for its name )
5- inside latest.json add the .sig file content , windows using:

```
[Convert]::ToBase64String([IO.File]::ReadAllBytes("path\to\file.sig"))
```

`NOTE: WE DIDNT REACH AN END HERE TILL NOW...`
`HERE IT SEEMS THAT WE NEED TO MAKE THE GITHUB REPO **PUBLIC**`

HOW TO MAKE A NEW VERSION?

- The updater plugin will check for versions > current version
  1-edit the versions in : tauri config and package json & cargo.toml
  2-add a new release on github and mark it as latest and tag it exactly: "v<version>"
  3-build the app
  4-make a latest.json file ( will be attached )
  5- extract the signature from the new build using any tool or command line and then add it to the latest.json
  6- add the latest json adn the .exe app to the new release

## 5-Environmental Variables

A short story: .env that is in src-tauri will not appear in the production, which will make unknown crashes

.envs should be fed for the server by using the following method:

```rust
 let (mut _rx, mut _child) = sidecar_command
                .env("NODE_ENV", "development")
                .env("PORT", "8000")
```

using the normal `dotenv` plugin will let us loose those envs in prod!

### ENV in client

- To make sure that client takes the .env , name it as : NEXT*PUBLIC*<your_name> , to let the env be printed on the .out folder (static folder) , otherwise it will be kept on the client's server which will not be available on production
