local services = {
	HttpService = game:GetService("HttpService"),
	Players = game:GetService("Players"),
	UserInputService = game:GetService("UserInputService")
}

local backend = {
	url = "", -- URL (e.g. ngrok, ip address)
	port = "", -- If needed do something like ":6967" or ":1234"
}

local base64 = require(script.Parent.Base64)
local luaVM = require(script.Parent.Lua51) -- Lua VM, just as an example
local GlobalEnv = {	} -- Global Env for all client's that can comunicate with each other!

-- ssAPI Globals
local HWID = services.HttpService:GenerateGUID(true)
local HUINAME = services.HttpService:GenerateGUID(false)
local HUISET = false
local IDENTITY = 420

-- Lua VM
local function setEnv()
	-- TODO
end

local function runLua(source)
	local newThread = coroutine.create(function()
		local scriptRun, compileFailure = luaVM(base64.decode(source))
		setEnv() -- set's the ROBLOX env for the thread.

		if (not compileFailure) then
			scriptRun()
		else
			print(string.format("ssAPI @ ROBLOX: %s", compileFailure))
		end
	end)
	
	coroutine.resume(newThread)
end

-- Server
local function connectServer()
	local url = string.format("%s%s/connect", backend.url, backend.port) -- ends up like localhost:1234/connect
	local response = services.HttpService:PostAsync(url, services.HttpService:JSONEncode({ gameId = game.GameId,  jobId = game.JobId }), Enum.HttpContentType.ApplicationJson, false)
	
	if (response) then
		local data = services.HttpService:JSONDecode(response)
		
		if (data.success) then
			return true
		else
			return false
		end
	else
		return false
	end
end

local function disconnectServer()
	local url = string.format("%s%s/disconnect", backend.url, backend.port) -- ends up like localhost:1234/disconnect
	local response = services.HttpService:PostAsync(url, services.HttpService:JSONEncode({ gameId = game.GameId, jobId = game.JobId }), Enum.HttpContentType.ApplicationJson, false)

	if (response) then
		local data = services.HttpService:JSONDecode(response)

		if (data.success) then
			print("Disconnected") -- Only called after the ROBLOX server is Closing (bindtoclose)
			return true
		else
			return false
		end
	else
		return false
	end
end

-- Backend
local function checkScriptQueue()
	local url = string.format("%s%s/check/%s/%s", backend.url, backend.port, game.GameId, game.JobId) -- ends up like localhost:1234/check/gameid_here/jobid_here
	local response = services.HttpService:GetAsync(url)

	if (response) then
		local data = services.HttpService:JSONDecode(response)

		if (data.success) then
			local sources = data["scripts"] -- TABLE
			
			for _, source in pairs(sources) do
				if source then
					runLua(source)
				end
			end

			return true
		else
			return false
		end
	else
		return false
	end
end

return {
	connectServer = connectServer,
	disconnectServer = disconnectServer,
	backend = {
		checkScriptQueue = checkScriptQueue,
	},
}
