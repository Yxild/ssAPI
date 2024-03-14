local Loader = require(script:WaitForChild("Fiu"))
local Compiler = require(script:WaitForChild("LuauInLuau"))

local function ValidLuauBytecode(bytecode)
	return string.unpack(">B", bytecode, 1) == 3
end
function luau_compile(source, chunkname)
	local suc, bytecode = Compiler.Compile(source)
	return suc == true and bytecode or error((chunkname or '@') .. bytecode:sub(2), 0) -- stack level is 0 to make debugging easier
end
function luau_load(bytecode, env)
	assert(ValidLuauBytecode(bytecode), "luau_load: Argument #1 got invalid bytecode (v3 bytecode expected)")
	assert(type(env) == 'table' or env == nil, ("luau_load: Argument #2 got '%s' (table expected)"):format(typeof(env)))
	return Loader.luau_load(bytecode, env or getfenv(2))
end

return setmetatable({
	luau_compile = luau_compile,
	luau_load = luau_load,
	luau_execute = function(source, env, chunkname)
		if ValidLuauBytecode(source) then
			return luau_load(source, env)
		end
		return luau_load(luau_compile(source, chunkname), env or getfenv(2))
	end,
}, {
	__call = function(self, source, env, chunkname)
		return self.luau_execute(source, env or getfenv(2), chunkname)
	end,
})
