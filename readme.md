### External Server-Side Execution Proof-of-Concept (This isn't meant for actual, global implementation)

ROBLOX Asset URL: https://create.roblox.com/store/asset/16708734208 <br/>
ROBLOX Asset ID: 16708734208

# ssAPI
![Alt text](https://i.imgur.com/lxFLXL2.png "Imgur")

Just a really simple & small server-side where you can execute scripts from the Server to a ROBLOX client. <br/>
This will probably get updated overtime because it's for learning

This is probably really unoptimized and shit but it'll work I guess <br/>
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
`/connect` (POST): Sends JSON data to the backend and adds to a Table of the game information. <br/>
`/disconnect` (POST): Sends JSON data to remove the game information. <br/>
`/runscript` (POST): Awaits for JSON data to add to a Script Queue for Execution on a Server. <br/>
`/check/{gameId}/{jobId}` (GET): Sends out the Script Data for a ROBLOX game to then Run the Script Queue. <br/>
`/servers` (GET): Sends JSON data of each game in the Backend. <br/>

### Requests
`/connect` POST request (JSON) and `/disconnect` POST request (JSON) <br/>
```json
{
    "gameId": "{Enter gameId here}",
    "jobId": "{Enter servers jobId here}"
}
```

`/runscript` POST request (JSON) <br/>
```json
{
    "gameId": "{Enter gameId here}",
    "jobId": "{Enter servers jobId here}",
    "script": "{Script Here}"
}
```

## How does this Work?
Alright, so it uses ExpressJS to allow Connection between ROBLOX and our Backend, which in return could give us basic external Execution on the Server/Client which is also what we did!<br/>
Our Execution Method uses vLua 5.1 and vLuau, a simple Luau Library that uses FiOne/Fiu to allow `loadstring` without actually using `loadstring`.<br/>
We first have 4 actual Requests, 3 POST requests and 1 GET request.<br/>
Stated in the `Path Systems` above you can see 5 of them, but we really only need about 4 of them. this is because `/servers` is useless.
We will use `/connect` and `/disconnect` the server from the backend as we want to log the data sent from the Backend to ROBLOX.<br/>
Then we will use `/runscript` to add a script to the script queue for a Game. this is just easier to do :)<br/>
And then lastly we use `/check/{gameId}/{jobId}` every 1.50 seconds because we want to check the script queue for new scripts, if not it'll return a Error or Invalid Request from the Backend.

This is all fairly simple to do, it seems not to much people know how they could do this at all which is why I made this for free!
