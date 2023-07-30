import {circleGroupData, GROUP} from "./constants.js";

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
                name: coreModule.api.Utils.i18n('tokenActionHud.ed4e.groupTitles.general'),
                groups: [
                    { ...groups.attributes, nestId: 'general_attributes'},
                    { ...groups.other, nestId: 'general_other'},
                    { ...groups.system, nestId: 'general_system'}
                ]
            },
            {
                nestId: 'powers',
                id: 'powers',
                name: coreModule.api.Utils.i18n('earthdawn.p.powers'),
                groups: [
                    { ...groups.powerAttacks, nestId: 'powers_powerAttacks'},
                    { ...groups.powerManeuvers, nestId: 'powers_powerManeuvers'},
                    { ...groups.powerPowers, nestId: 'powers_powerPowers'},
                ]
            },
            {
                nestId: 'favorites',
                id: 'favorites',
                name: coreModule.api.Utils.i18n('tokenActionHud.ed4e.groupTitles.favorites'),
                groups: [
                    { ...groups.favorites, nestId: 'favorites_favorites'}
                ]
            },
            {
                nestId: 'talents',
                id: 'talents',
                name: coreModule.api.Utils.i18n('earthdawn.t.talents'),
                type: 'system',
                groups: [
                    {...groups.standard, nestId: 'talents_standard'},
                    {...groups.simple, nestId: 'talents_simple'},
                    {...groups.free, nestId: 'talents_free'},
                    {...groups.sustained, nestId: 'talents_sustained'},
                    {...groups.na, nestId: 'talents_na'},
                ]
            },
            {
                nestId: 'skills',
                id: 'skills',
                name: coreModule.api.Utils.i18n('earthdawn.s.skills'),
                groups: [
                    {...groups.standard, nestId: 'skills_standard'},
                    {...groups.simple, nestId: 'skills_simple'},
                    {...groups.free, nestId: 'skills_free'},
                    {...groups.sustained, nestId: 'skills_sustained'},
                    {...groups.na, nestId: 'skills_na'},
                ]
            },
            {
                nestId: 'spells',
                id: 'spells',
                name: coreModule.api.Utils.i18n('earthdawn.s.spells'),
                groups: Array.from(
                    Object.values(circleGroupData),
                    group => {
                        group['nestId'] = `spells_${group.id}`;
                        return group;
                    }
                )
            },
            {
                nestId: 'inventory',
                id: 'inventory',
                name: coreModule.api.Utils.i18n('earthdawn.i.inventory'),
                groups: [
                    { ...groups.weapons, nestId: 'inventory_weapons'},
                    { ...groups.armors, nestId: 'inventory_armors'},
                    { ...groups.shields, nestId: 'inventory_shields'},
                    { ...groups.equipment, nestId: 'inventory_equipment'}
                ]
            },
            {
                nestId: 'matrices',
                id: 'matrices',
                name: coreModule.api.Utils.i18n('tokenActionHud.ed4e.groupTitles.matrix')
            },
            {
                nestId: 'combat',
                id: 'combat',
                name: coreModule.api.Utils.i18n('earthdawn.c.combat'),
                groups: [
                    { ...groups.weaponAttack, nestId: 'combat_weaponAttack'},
                    { ...groups.optionsModifier, nestId: 'combat_optionsModifier'},
                    { ...groups.combatActions, nestId: 'combat_actions'},
                ]
            },
            {
                nestId: 'effects',
                id: 'effects',
                name: coreModule.api.Utils.i18n('earthdawn.e.effects'),
                groups: [
                    { ...groups.effects, nestId: 'effects_effects' }
                ]
            },
            {
                nestId: 'utility',
                id: 'utility',
                name: coreModule.api.Utils.i18n('tokenActionHud.utility'),
                groups: [
                    { ...groups.combatUtilities, nestId: 'utility_combatUtilities' },
                    { ...groups.token, nestId: 'utility_token' },
                ]
            }
        ],
        groups: groupsArray
    }
})