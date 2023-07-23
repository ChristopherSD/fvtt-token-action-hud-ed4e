import {GROUP} from "./constants.js";

/**
 * Default categories and groups
 */
export let DEFAULTS = null;

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    const groups = GROUP;
    Object.values(groups).forEach(group => {
        group.name = coreModule.api.Utils.i18n(group.name);
        group.listName = `Group: ${coreModule.api.Utils.i18n(group.name)}`;
    })
    const groupsArray = Object.values(groups);
    DEFAULTS = {
        layout: [
            {
                nestId: 'general',
                id: 'general',
                name: coreModule.api.Utils.i18n('tokenActionHud.ed4e.general'),
                groups: [
                    { ...groups.attributes, nestId: 'general_attributes'},
                    { ...groups.other, nestId: 'general_other'},
                    { ...groups.system, nestId: 'general_system'}
                ]
            }
        ],
        groups: groupsArray
    }
})