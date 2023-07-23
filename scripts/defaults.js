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
            },
            {
                nestId: 'favorites',
                id: 'favorites',
                name: coreModule.api.Utils.i18n('tokenActionHud.ed4e.favorites'),
                groups: [
                    { ...groups.favorites, nestId: 'favorites_favorites'}
                ]
            },
            {
                nestId: 'talents',
                id: 'talents',
                name: 'TODO',
                groups: []
            },
            {
                nestId: 'skills',
                id: 'skills',
                name: 'TODO',
                groups: []
            },
            {
                nestId: 'spells',
                id: 'spells',
                name: 'TODO',
                groups: []
            },
            {
                nestId: 'inventory',
                id: 'inventory',
                name: 'TODO',
                groups: [
                    { ...groups.weapons, nestId: 'inventory_weapons'},
                    { ...groups.armors, nestId: 'inventory_armors'},
                    { ...groups.shields, nestId: 'inventory_shields'},
                    { ...groups.equipment, nestId: 'inventory_equipment'}
                ]
            },
            {
                nestId: 'combat',
                id: 'combat',
                name: 'TODO',
                groups: [
                    { ...groups.weaponAttack, nestId: 'combat_weaponAttack'},
                    { ...groups.optionsModifier, nestId: 'combate_optionsModifier'},
                    { ...groups.actions, nestId: 'combat_actions'},
                ]
            },
            {
                nestId: 'effects',
                id: 'effects',
                name: 'TODO',
                groups: []
            }
        ],
        groups: groupsArray
    }
})