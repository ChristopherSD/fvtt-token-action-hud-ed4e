// System Module Imports
import { ActionHandler } from "./action-handler.js";
import { RollHandler as Core } from './roll-handler.js';
import * as systemSettings from './settings.js'
import { DEFAULTS } from './defaults.js';

export let SystemManager = null;

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) =>{
    SystemManager = class SystemManager extends coreModule.api.SystemManager {
        /** @override */
        doGetCategoryManager (user) {
            return new coreModule.api.CategoryManager();
        }

        /** @override */
        getActionHandler (categoryManager) {
            const actionHandler = new ActionHandler(categoryManager);
            return actionHandler;
        }

        /** @override */
        getAvailableRollHandlers () {
            const coreTitle = 'Core Earthdawn 4th Edition';
            const choices = {
                core: coreTitle
            };
            return choices;
        }

        /** @override */
        getRollHandler (handlerId) {
            let rollHandler;
            switch (handlerId) {
                case 'core':
                default:
                    rollHandler = new Core();
                    break;
            }

            return rollHandler;
        }

        /** @override */
        registerSettings (updateFunc) {
            systemSettings.register(updateFunc);
        }

        /** @override */
        async registerDefaults () {
            const defaults = DEFAULTS;
            return defaults;
        }
    }
})