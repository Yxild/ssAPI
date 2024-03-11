### External Server-Side Execution Proof-of-Concept (This isn't meant for actual, global implementation)

ROBLOX Asset URL: https://create.roblox.com/store/asset/16708734208
ROBLOX Asset ID: 16708734208

# ssAPI
Just a really simple & small server-side where you can execute scripts from the Server to a ROBLOX client.
This will probably get updated overtime because it's for learning

This works by the ROBLOX server calling a Path (in particular `/checck/`) which checks a Table if there is a script for the game directly.
Also this will connect to the backend by using a function called `connect`, this just add's the game's Identified (`jobId`) to the table :)
There is a `disconnect` function that is only called via `bind to close`

This is probably really unoptimized and shit but it'll work I guess
There is 0 authentication to the client & server.

**WARNING**: This requires `HttpService` to work as it uses External URLs.

## Backend (Server)
1. run `npm init` and fill out the information.
2. run the command `npm i express helmet` and let the two packages install.
3. add `app.js` to the backend where npm init is and then follow to the next step.
4. run `node ./app.js` to run the backend server.
5. If you are going to do this on a ROBLOX game, run something such a ngrok, or use a DDNS.

## Client (ROBLOX)
1. Add the Asset (Module) to `ServerScriptStorage`
2. Go to the `Server` ModuleScript
3. Go to the Backend Table and change the URL and PORT to the correct settings.
4. Save & Publish the Game
