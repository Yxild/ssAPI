Just a really simple & small server-side where you can execute scripts from the Server to a ROBLOX client.

This works by the ROBLOX server calling a Path (in particular `/checck/`) which checks a Table if there is a script for the game directly.
Also this will connect to the backend by using a function called `connect`, this just add's the game's Identified (`jobId`) to the table :)
There is a `disconnect` function that is only called via `bind to close`

This is probably really unoptimized and shit but it'll work i guess
There is 0 authentication to the client & server.
