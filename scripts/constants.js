/**
 * Module-based constants
 */
export const MODULE = {
    ID: 'token-action-hud-ed4e'
}

/**
 * Core module
 */
export const CORE_MODULE = {
    ID: 'token-action-hud-core'
}

/**
 * Core module version required by the system module
 */
export const REQUIRED_CORE_MODULE_VERSION = '1.4'

/**
 * Type of TAH actions
 */
export const ACTION_TYPE = {
    talent: 'earthdawn.t.talent',
    skill: 'earthdawn.s.skill',
    spell: 'earthdawn.s.spell',
    matrix: 'tokenActionHud.ed4e.groupTitles.matrix',
    item: 'tokenActionHud.ed4e.item',
    utility: 'tokenActionHud.ed4e.utility',
    weaponAttack: 'earthdawn.a.attack'
}

/**
 * Spellcasting disciplines list
 */
export const SPELLCASTING_DISCIPLINES = [
    'elementalist',
    'illusionist',
    'nethermancer',
    'shaman',
    'wizard'
]

/**
 * Attributes list
 */
export const ATTRIBUTES = [
    'dexterity',
    'strength',
    'toughness',
    'perception',
    'willpower',
    'charisma'
]

/**
 * Attributes to lang file property full name mapping
 */
export const ATTRIBUTES_FULL_NAME = {
    'dexterity': "earthdawn.d.dexterity",
    'strength': "earthdawn.s.strength",
    'toughness': "earthdawn.t.toughness",
    'perception': "earthdawn.p.perception",
    'willpower': "earthdawn.w.willpower",
    'charisma': "earthdawn.c.charisma",
}

/**
 * Attributes to lang file property abbreviated mapping
 */
export const ATTRIBUTES_ABBREVIATED = {
    'dexterity': "earthdawn.d.DEX",
    'strength': "earthdawn.s.STR",
    'toughness': "earthdawn.t.TOU",
    'perception': "earthdawn.p.PER",
    'willpower': "earthdawn.w.WIL",
    'charisma': "earthdawn.c.CHA",
    'initiative': "earthdawn.i.INI"
}

/**
 * Max circle of spells
 */
export const MAX_SPELL_CIRCLE = 15;

/**
 * The group data for grouping by circle
 */
//Created overly complex and complicated because I have to initialize it and make
// it just from @MAX_SPELL_CIRCLE.
export const circleGroupData = Object.values(
    Object.assign(
        {},
        [...Array(MAX_SPELL_CIRCLE).keys()].map(
            idx => {
                const circle = idx + 1;
                const groupId = `circle${circle}spells`;
                return {
                    id: groupId,
                    name: `Circle ${circle}`,
                    type: 'system'
                };

            }
        )
    )
).reduce(
    (acc, current) => {
        acc[current.id] = current;
        return acc;
    },
    {}
)

/**
 * The group data for grouping by discipline
 * @type {{}}
 */
export const disciplineGroupData = SPELLCASTING_DISCIPLINES.reduce(
    (o, discipline) => {
        const groupId = `${discipline}Spells`;
        return {...o, [groupId]:
                {id: groupId,
                    name: discipline.charAt(0).toUpperCase() + discipline.slice(1),
                    type: 'system'
                }
        };
    },
    {}
)

/**
 * Weapon type icons
 */
export const WEAPON_TYPE_ICON = {
    melee: 'fa-thin fa-sword',
    ranged: 'fa-thin fa-bow-arrow',
    thrown: 'fa-thin fa-bullseye-arrow',
    unarmed: 'fa-thin fa-hand-fist'
}

/**
 * Concentration icon
 */
export const CONCENTRATION_ICON = 'fas fa-circle-c'

/**
 * Prepared icon
 */
export const PREPARED_ICON = 'fas fa-sun'

/**
 * Ritual icon
 */
export const RITUAL_ICON = 'fas fa-circle-r'

/**
 * Proficiency level icons
 */
export const PROFICIENCY_LEVEL_ICON = {
    0.5: 'fas fa-adjust',
    1: 'fas fa-check',
    2: 'fas fa-check-double'
}

/**
 * The available groups for use in the HUD (editable by the user)
 * @type {{favorites: {name: string, id: string, type: string}, standard: {name: string, id: string, type: string}, circle14spells: {spellMode: number, name: string}, other: {name: string, id: string, type: string}, circle8spells: {spellMode: number, name: string}, circle1spells: {spellMode: number, name: string}, simple: {name: string, id: string, type: string}, sustained: {name: string, id: string, type: string}, circle5spells: {spellMode: number, name: string}, circle12spells: {spellMode: number, name: string}, skills: {name: string, id: string, type: string}, optionsModifier: {name: string, id: string, type: string}, circle6spells: {spellMode: number, name: string}, circle15spells: {spellMode: number, name: string}, free: {name: string, id: string, type: string}, circle10spells: {spellMode: number, name: string}, circle3spells: {spellMode: number, name: string}, weaponAttack: {name: string, id: string, type: string}, circle9spells: {spellMode: number, name: string}, circle13spells: {spellMode: number, name: string}, circle2spells: {spellMode: number, name: string}, equipment: {name: string, id: string, type: string}, armors: {name: string, id: string, type: string}, shields: {name: string, id: string, type: string}, system: {name: string, id: string, type: string}, na: {name: string, id: string, type: string}, circle11spells: {spellMode: number, name: string}, circle4spells: {spellMode: number, name: string}, circle7spells: {spellMode: number, name: string}, attributes: {name: string, id: string, type: string}, weapons: {name: string, id: string, type: string}, actions: {name: string, id: string, type: string}, talents: {name: string, id: string, type: string}}}
 */
export const GROUP = {
    attributes: { id: 'attributes', name: 'earthdawn.a.attributes', type: 'system' },
    combat: { id: 'combat', name: 'tokenActionHud.combat', type: 'system' },
    combatUtilities: { id: 'combatUtilities', name: 'tokenActionHud.combat', type: 'system' },
    other: { id: 'other', name: 'earthdawn.o.other', type: 'system' },
    system: { id: 'system', name: 'tokenActionHud.ed4e.system', type: 'system' },
    favorites: { id: 'favorites', name: 'tokenActionHud.ed4e.groupTitles.favorites', type: 'system'},
    weapons: { id: 'weapons', name: 'earthdawn.w.weapons', type: 'system'},
    armors: { id: 'armors', name: 'earthdawn.a.armors', type: 'system'},
    shields: { id: 'shields', name: 'earthdawn.s.shields', type: 'system'},
    equipment: { id: 'equipment', name: 'earthdawn.e.equipment', type: 'system'},
    equipped: { id: 'equipped', name: 'earthdawn.e.equipped', type: 'system' },
    unequipped: { id: 'unequipped', name: 'tokenActionHud.ed4e.unequipped', type: 'system' },
    weaponAttack: { id: 'weaponAttack', name: 'tokenActionHud.ed4e.attack', type: 'system'},
    threadItems: { id: 'threadItems', name: 'earthdawn.t.threadItems', type: 'system'},
    optionsModifier: { id: 'optionsModifier', name: 'earthdawn.c.combatOptions', type: 'system'},
    combatActions: { id: 'combatActions', name: 'earthdawn.a.actions', type: 'system'},
    talents: { id: 'talents', name: 'earthdawn.t.talents', type: 'system'},
    skills: { id: 'skills', name: 'earthdawn.s.skills', type: 'system'},
    standard: { id: 'standard', name: 'earthdawn.s.standard', type: 'system'},
    simple: { id: 'simple', name: 'earthdawn.s.sustained', type: 'system'},
    free: { id: 'free', name: 'earthdawn.f.free', type: 'system'},
    sustained: { id: 'sustained', name: 'earthdawn.s.sustained', type: 'system'},
    na: { id: 'na', name: 'tokenActionHud.ed4e.na', type: 'system'},
    token: { id: 'token', name: 'tokenActionHud.token', type: 'system' },
    utility: { id: 'utility', name: 'tokenActionHud.utility', type: 'system' },
    matrices: { id: 'matrices', name: 'tokenActionHud.ed4e.groupTitles.matrix', type: 'system' },
    ...circleGroupData,
    ...disciplineGroupData,
}
