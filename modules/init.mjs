import { SystemManager } from "./system-manager.mjs";
import {MODULE, REQUIRED_CORE_MODULE_VERSION} from "./constants.mjs";

Hooks.on('tokenActionHudCoreApiReady', async () => {
    const module = game.modules.get(MODULE.ID);
    module.api = {
        requiredCoreModuleVersion: REQUIRED_CORE_MODULE_VERSION,
        SystemManager
    }
    Hooks.call('tokenActionHudSystemReady', module);
})