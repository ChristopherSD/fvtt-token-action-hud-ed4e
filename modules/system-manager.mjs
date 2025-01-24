// System Module Imports
import {ActionHandler} from "./action-handler.mjs";
import {RollHandler as Core} from './roll-handler.mjs';
import * as systemSettings from './settings.mjs'
import {Defaults} from './defaults.mjs';

export let SystemManager = null;

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) =>{
    SystemManager = class SystemManager extends coreModule.api.SystemManager {

        /** @override */
        getActionHandler (categoryManager) {
            return new ActionHandler(categoryManager);
        }

        /** @override */
        getAvailableRollHandlers () {
            const coreTitle = 'Core Earthdawn 4th Edition';
            return {
                core: coreTitle
            };
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
            return Defaults;
        }
    }
})