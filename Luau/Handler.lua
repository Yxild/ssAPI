task.wait(5)

if (not game:GetService("RunService"):IsStudio()) then -- Studio jobId donotworkatallbruh
	local server = require(script.Server)
	local TimedOut = false

	if (server.connectServer()) then
		Init = true
	end

	game:BindToClose(function()
		server.disconnectServer()
	end)
	
	while true do
		task.wait(1.5)
		pcall(function()
			server.backend.checkScriptQueue()
		end)
	end
end
