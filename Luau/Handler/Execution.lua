local base64 = require(script.Parent.Base64)

-- Luau/Lua51 Virtual Machines
local luaVM = require(script:WaitForChild('Lua51')) -- Lua51 VM (vLua)
local luauVM = require(script:WaitForChild('Luau')) -- Luau VM (vLuau)

-- Lua51/Luau Runners
function runLua(source)
	local newThread = coroutine.create(function()
		local scriptRun, compileFailure = luaVM(base64.decode(source))

		if (not compileFailure) then
			scriptRun()
		else
			print(string.format("ssAPI @ ROBLOX: %s", compileFailure))
		end
	end)
	
	coroutine.resume(newThread)
end

function runLuau(source)
	local newThread = coroutine.create(function()
		local scriptRan = luauVM.luau_execute(base64.decode(source), getfenv(0))()

		if (not scriptRan) then
			print(string.format("ssAPI @ ROBLOX: %s", scriptRan))
		end
	end)

	coroutine.resume(newThread)
end

return {
	runLua = runLua,
	runLuau = runLuau,
}
