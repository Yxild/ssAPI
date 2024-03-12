### External Server-Side Execution Proof-of-Concept (This isn't meant for actual, global implementation)

ROBLOX Asset URL: https://create.roblox.com/store/asset/16708734208 <br/>
ROBLOX Asset ID: 16708734208

# ssAPI
![Alt text](https://i.imgur.com/lxFLXL2.png "Imgur")

Just a really simple & small server-side where you can execute scripts from the Server to a ROBLOX client.
This will probably get updated overtime because it's for learning

This is probably really unoptimized and shit but it'll work I guess
There is 0 authentication to the client & server.

**WARNING**: This requires `HttpService` to work as it uses External URLs from the ROBLOX URLs.

## Backend (Server)
1. run `npm init` and fill out the information.
2. run the command `npm i express helmet` and let the two packages install.
3. add the files that's in the github repo to the backend where npm init is and then follow to the next step.
4. run `node ./app.js` to run the backend server.
5. If you are going to do this on a ROBLOX game, run something such a ngrok, or use a DDNS.

## Client (ROBLOX)
1. Add the Asset (Module) to `ServerScriptStorage`
2. Go to the `Server` ModuleScript
3. Go to the Backend Table and change the URL and PORT to the correct settings.
4. Save & Publish the Game

## Path Systems (Backend)
`/connect` (POST): Sends JSON data to the backend and adds to a Table of the game information.
`/disconnect` (POST): Sends JSON data to remove the game information.
`/runscript` (POST): Awaits for JSON data to add to a Script Queue for Execution on a Server.
`/check/{gameId}/{jobId}` (GET): Sends out the Script Data for a ROBLOX game to then Run the Script Queue.
`/servers` (GET): Sends JSON data of each game in the Backend.

### Requests
`/connect` POST request (JSON)
```json
{
    "gameId": "{Enter gameId here}",
    "jobId": "{Enter servers jobId here}"
}
```

`/disconnect` POST request (JSON)
```json
{
    "gameId": "{Enter gameId here}",
    "jobId": "{Enter servers jobId here}"
}
```

`/runscript` POST request (JSON)
```json
{
    "gameId": "{Enter gameId here}",
    "jobId": "{Enter servers jobId here}",
    "script": "{Script Here}"
}
```
