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
    'talent': 'earthdawn.t.talent',
    'skill': 'earthdawn.s.skill',
    'spell': 'earthdawn.s.spell',
    'matrix': 'earthdawn.m.matrix',
    'item': 'tokenActionHud.ed4e.item'
}

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
 * Activation type icons
 */
export const ACTIVATION_TYPE_ICON = {
    bonus: 'fas fa-plus',
    crew: 'fas fa-users',
    day: 'fas fa-hourglass-end',
    hour: 'fas fa-hourglass-half',
    lair: 'fas fa-home',
    minute: 'fas fa-hourglass-start',
    legendary: 'fas fas fa-dragon',
    reaction: 'fas fa-bolt',
    special: 'fas fa-star'
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

export const GROUP = {
    attributes: { id: 'attributes', name: 'earthdawn.a.attributes', type: 'system' },
    other: { id: 'other', name: 'earthdawn.o.other', type: 'system' },
    system: { id: 'system', name: 'tokenActionHud.ed4e.system', type: 'system' },
    favorites: { id: 'favorites', name: 'tokenActionHud.ed4e.favorites', type: 'system'},
    weapons: { id: 'weapons', name: 'earthdawn.w.weapons', type: 'system'},
    armors: { id: 'armors', name: 'earthdawn.a.armors', type: 'system'},
    shields: { id: 'shields', name: 'earthdawn.s.shields', type: 'system'},
    equipment: { id: 'equipment', name: 'earthdawn.e.equipment', type: 'system'},
    weaponAttack: { id: 'weaponAttack', name: 'tokenActionHud.ed4e.attack', type: 'system'},
    optionsModifier: { id: 'optionsModifier', name: 'tokenActionHud.ed4e.options', type: 'system'},
    actions: { id: 'actions', name: 'earthdawn.a.actions', type: 'system'},
    standardSkills: { id: 'standardSkills', name: 'earthdawn.s.standard', type: 'system'},
    simpleSkills: { id: 'simpleSkills', name: 'earthdawn.s.sustained', type: 'system'},
    freeSkills: { id: 'freeSkills', name: 'earthdawn.f.free', type: 'system'},
    sustainedSkills: { id: 'sustainedSkills', name: 'earthdawn.s.sustained', type: 'system'},
    naSkills: { id: 'naSkills', name: 'tokenActionHud.ed4e.na', type: 'system'},
    standardTalents: { id: 'standardTalents', name: 'earthdawn.s.standard', type: 'system'},
    simpleTalents: { id: 'simpleTalents', name: 'earthdawn.s.sustained', type: 'system'},
    freeTalents: { id: 'freeTalents', name: 'earthdawn.f.free', type: 'system'},
    sustainedTalents: { id: 'sustainedTalents', name: 'earthdawn.s.sustained', type: 'system'},
    naTalents: { id: 'naTalents', name: 'tokenActionHud.ed4e.na', type: 'system'},
    standard: { id: 'standard', name: 'earthdawn.s.standard', type: 'system'},
    simple: { id: 'simple', name: 'earthdawn.s.sustained', type: 'system'},
    free: { id: 'free', name: 'earthdawn.f.free', type: 'system'},
    sustained: { id: 'sustained', name: 'earthdawn.s.sustained', type: 'system'},
    na: { id: 'na', name: 'tokenActionHud.ed4e.na', type: 'system'},
    /*_1stLevelSpells: { id: '1st-level-spells', name: 'tokenActionHud.dnd5e.1stLevelSpells', type: 'system' },
    _2ndLevelSpells: { id: '2nd-level-spells', name: 'tokenActionHud.dnd5e.2ndLevelSpells', type: 'system' },
    _3rdLevelSpells: { id: '3rd-level-spells', name: 'tokenActionHud.dnd5e.3rdLevelSpells', type: 'system' },
    _4thLevelSpells: { id: '4th-level-spells', name: 'tokenActionHud.dnd5e.4thLevelSpells', type: 'system' },
    _5thLevelSpells: { id: '5th-level-spells', name: 'tokenActionHud.dnd5e.5thLevelSpells', type: 'system' },
    _6thLevelSpells: { id: '6th-level-spells', name: 'tokenActionHud.dnd5e.6thLevelSpells', type: 'system' },
    _7thLevelSpells: { id: '7th-level-spells', name: 'tokenActionHud.dnd5e.7thLevelSpells', type: 'system' },
    _8thLevelSpells: { id: '8th-level-spells', name: 'tokenActionHud.dnd5e.8thLevelSpells', type: 'system' },
    _9thLevelSpells: { id: '9th-level-spells', name: 'tokenActionHud.dnd5e.9thLevelSpells', type: 'system' },
    abilities: { id: 'abilities', name: 'tokenActionHud.dnd5e.abilities', type: 'system' },
    actions: { id: 'actions', name: 'DND5E.ActionPl', type: 'system' },
    activeFeatures: { id: 'active-features', name: 'tokenActionHud.dnd5e.activeFeatures', type: 'system' },
    artificerInfusions: { id: 'artificer-infusions', name: 'tokenActionHud.dnd5e.artificerInfusions', type: 'system' },
    atWillSpells: { id: 'at-will-spells', name: 'tokenActionHud.dnd5e.atWillSpells', type: 'system' },
    backgroundFeatures: { id: 'background-features', name: 'tokenActionHud.dnd5e.backgroundFeatures', type: 'system' },
    bonusActions: { id: 'bonus-actions', name: 'tokenActionHud.dnd5e.bonusActions', type: 'system' },
    cantrips: { id: 'cantrips', name: 'tokenActionHud.dnd5e.cantrips', type: 'system' },
    channelDivinity: { id: 'channel-divinity', name: 'tokenActionHud.dnd5e.channelDivinity', type: 'system' },
    checks: { id: 'checks', name: 'tokenActionHud.dnd5e.checks', type: 'system' },
    classFeatures: { id: 'class-features', name: 'tokenActionHud.dnd5e.classFeatures', type: 'system' },
    combat: { id: 'combat', name: 'tokenActionHud.combat', type: 'system' },
    conditions: { id: 'conditions', name: 'tokenActionHud.dnd5e.conditions', type: 'system' },
    consumables: { id: 'consumables', name: 'ITEM.TypeConsumablePl', type: 'system' },
    containers: { id: 'containers', name: 'ITEM.TypeContainerPl', type: 'system' },
    crewActions: { id: 'crew-actions', name: 'tokenActionHud.dnd5e.crewActions', type: 'system' },
    defensiveTactics: { id: 'defensive-tactics', name: 'tokenActionHud.dnd5e.defensiveTactics', type: 'system' },
    eldritchInvocations: { id: 'eldritch-invocations', name: 'tokenActionHud.dnd5e.eldritchInvocations', type: 'system' },
    elementalDisciplines: { id: 'elemental-disciplines', name: 'tokenActionHud.dnd5e.elementalDisciplines', type: 'system' },
    equipment: { id: 'equipment', name: 'ITEM.TypeEquipmentPl', type: 'system' },
    equipped: { id: 'equipped', name: 'DND5E.Equipped', type: 'system' },
    feats: { id: 'feats', name: 'tokenActionHud.dnd5e.feats', type: 'system' },
    fightingStyles: { id: 'fighting-styles', name: 'tokenActionHud.dnd5e.fightingStyles', type: 'system' },
    huntersPrey: { id: 'hunters-prey', name: 'tokenActionHud.dnd5e.huntersPrey', type: 'system' },
    innateSpells: { id: 'innate-spells', name: 'tokenActionHud.dnd5e.innateSpells', type: 'system' },
    kiAbilities: { id: 'ki-abilities', name: 'tokenActionHud.dnd5e.kiAbilities', type: 'system' },
    lairActions: { id: 'lair-actions', name: 'tokenActionHud.dnd5e.lairActions', type: 'system' },
    legendaryActions: { id: 'legendary-actions', name: 'tokenActionHud.dnd5e.legendaryActions', type: 'system' },
    loot: { id: 'loot', name: 'ITEM.TypeLootPl', type: 'system' },
    maneuvers: { id: 'maneuvers', name: 'tokenActionHud.dnd5e.maneuvers', type: 'system' },
    metamagicOptions: { id: 'metamagic-options', name: 'tokenActionHud.dnd5e.metamagicOptions', type: 'system' },
    monsterFeatures: { id: 'monster-features', name: 'tokenActionHud.dnd5e.monsterFeatures', type: 'system' },
    multiattacks: { id: 'multiattacks', name: 'tokenActionHud.dnd5e.multiattacks', type: 'system' },
    otherActions: { id: 'other-actions', name: 'tokenActionHud.dnd5e.otherActions', type: 'system' },
    pactBoons: { id: 'pact-boons', name: 'tokenActionHud.dnd5e.pactBoons', type: 'system' },
    pactSpells: { id: 'pact-spells', name: 'tokenActionHud.dnd5e.pactSpells', type: 'system' },
    passiveEffects: { id: 'passive-effects', name: 'DND5E.EffectPassive', type: 'system' },
    passiveFeatures: { id: 'passive-features', name: 'tokenActionHud.dnd5e.passiveFeatures', type: 'system' },
    psionicPowers: { id: 'psionic-powers', name: 'tokenActionHud.dnd5e.psionicPowers', type: 'system' },
    raceFeatures: { id: 'race-features', name: 'tokenActionHud.dnd5e.raceFeatures', type: 'system' },
    reactions: { id: 'reactions', name: 'DND5E.ReactionPl', type: 'system' },
    rests: { id: 'rests', name: 'tokenActionHud.dnd5e.rests', type: 'system' },
    runes: { id: 'runes', name: 'tokenActionHud.dnd5e.runes', type: 'system' },
    saves: { id: 'saves', name: 'DND5E.ClassSaves', type: 'system' },
    skills: { id: 'skills', name: 'tokenActionHud.dnd5e.skills', type: 'system' },
    superiorHuntersDefense: { id: 'superior-hunters-defense', name: 'tokenActionHud.dnd5e.superiorHuntersDefense', type: 'system' },
    temporaryEffects: { id: 'temporary-effects', name: 'DND5E.EffectTemporary', type: 'system' },
    token: { id: 'token', name: 'tokenActionHud.token', type: 'system' },
    tools: { id: 'tools', name: 'ITEM.TypeToolPl', type: 'system' },
    unequipped: { id: 'unequipped', name: 'DND5E.Unequipped', type: 'system' },
    utility: { id: 'utility', name: 'tokenActionHud.utility', type: 'system' },
    weapons: { id: 'weapons', name: 'ITEM.TypeWeaponPl', type: 'system' }*/
}
