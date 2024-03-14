local services = {
	HttpService = game:GetService("HttpService"),
	Players = game:GetService("Players"),
}

local backend = {
	url = "https://kpr8tn2n-1234.aue.devtunnels.ms", -- URL (e.g. ngrok, ip address)
	port = "", -- If needed do something like ":6967" or ":1234"
}

local execution = require(script.Parent.Execution)

-- Server
local function connectServer()
	local jsonData = services.HttpService:JSONEncode({
		gameId = game.GameId,
		jobId = game.JobId
	})
	
	local url = string.format("%s%s/connect", backend.url, backend.port) -- ends up like localhost:1234/connect
	local response = services.HttpService:PostAsync(url, jsonData, Enum.HttpContentType.ApplicationJson, false)
	
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
	local jsonData = services.HttpService:JSONEncode({
		gameId = game.GameId,
		jobId = game.JobId
	})
	
	local url = string.format("%s%s/disconnect", backend.url, backend.port) -- ends up like localhost:1234/disconnect
	local response = services.HttpService:PostAsync(url, jsonData, Enum.HttpContentType.ApplicationJson, false)

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
local function updatePlayerList()
	local playerList = {}
	
	for _, player: Player in pairs(services.Players:GetPlayers()) do
		table.insert(playerList, player.Name) -- I'm doing this because player is a instance rather than a string
	end
	
	local jsonData = services.HttpService:JSONEncode({
		gameId = game.GameId,
		jobId = game.JobId,
		playerList = playerList
	})
	
	local url = string.format("%s%s/updateplayers/", backend.url, backend.port) -- ends up like localhost:1234/updateplayers
	local response = services.HttpService:PostAsync(url, jsonData, Enum.HttpContentType.ApplicationJson, false)
	
	if (response) then
		local data = services.HttpService:JSONEncode(response)
		
		if (data.success) then
			return true
		else
			return false
		end
	else
		return false
	end
end

local function checkScriptQueue()
	local url = string.format("%s%s/check/%s/%s", backend.url, backend.port, game.GameId, game.JobId) -- ends up like localhost:1234/check/gameid_here/jobid_here
	local response = services.HttpService:GetAsync(url)

	if (response) then
		local data = services.HttpService:JSONDecode(response)

		if (data.success) then
			local sources = data["scripts"] -- TABLE
			
			for _, source in pairs(sources) do
				if source then
					-- execution.runLua(source)
					execution.runLuau(source)
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
		updatePlayerList = updatePlayerList,
		checkScriptQueue = checkScriptQueue,
	},
}
