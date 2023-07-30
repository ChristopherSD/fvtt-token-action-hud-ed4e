// System Module Imports
import { Utils } from "./utils.js";
import {
    ACTION_TYPE,
    ATTRIBUTES,
    ATTRIBUTES_ABBREVIATED,
    ATTRIBUTES_FULL_NAME,
    MAX_SPELL_CIRCLE, SPELLCASTING_DISCIPLINES,
    WEAPON_TYPE_ICON
} from "./constants.js";


export let ActionHandler = null;

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    ActionHandler = class ActionHandler extends coreModule.api.ActionHandler {

        i18n = game.i18n;

        // Initialize actor and token variables
        actors = null;
        tokens = null;
        actorType = null;

        // Initialize items variable
        items = null;

        // Initialize setting variables
        abbreviateAttributes;
        showWeaponAmmoInfo;

        // Initialize groupIds variables
        talentSkillGroupIds = null;
        spellGroupIds = null;
        inventoryGroupIds = null;

        /**
         * Build System Actions
         * @override
         * @param {array} groupIds
         * @returns {object}
         */
        async buildSystemActions(groupIds) {
            // set actor and token variables
            this.actors = (!this.actor) ? this.#getActors() : [this.actor];
            this.tokens = (!this.token) ? this.#getTokens() : [this.token];
            this.actorType = this.actor?.type;

            // Set items variable
            if (this.actor) {
                let items = this.actor.items;
                items = coreModule.api.Utils.sortItemsByName(items);
                this.items = items;
            }

            // set settings variables

            this.abbreviateAttributes = Utils.getSetting('abbreviateAttributes');
            this.showWeaponAmmoInfo = Utils.getSetting('showWeaponAmmoInfo')

            // set group IDs

            this.talentSkillGroupIds = [
                'standard',
                'simple',
                'free',
                'sustained',
                'na'
            ]

            this.spellGroupIds = Array.from(
                { length: MAX_SPELL_CIRCLE },
                (_, idx) => `circle${idx + 1}spells`
            );

            this.spellGroupIds.push(
                ...Array.from(
                    SPELLCASTING_DISCIPLINES,
                    (discipline, _) => `${discipline}Spells`
                )
            )

            if (this.actor) {
                if (this.actor.type === 'pc' || this.actor.type === 'npc') {
                    this.inventoryGroupIds = [
                        'equipped',
                        'unequipped',
                        'threadItems',
                        'armors',
                        'equipment',
                        'shields',
                        'weapons'
                    ]
                    await this.#buildCharacterActions();
                }
                if (this.actor.type === 'creature') {
                    await this.#buildCreatureActions();
                }
            } else {
                await this.#buildMultipleTokenActions();
            }
        }

        /**
         * Build Character Actions
         * @private
         * @returns {object}
         */
        async #buildCharacterActions() {
            await Promise.all([
                this.#buildFavorites(),
                this.#buildTalentsOrSkill('talent'),
                this.#buildTalentsOrSkill('skill'),
                this.#buildSpells(),
                this.#buildMatrices(),
                this.#buildInventory(),
                this.#buildCombat()
            ]);
            this.#buildGeneral();
            this.#buildUtility();
            /*this._buildMatrixCategory();
            this._buildSkillsCategory();
            this._buildItemsCategory();
            this._buildAttacksCategory();
            this._buildCreaturePowersCategory();
            this._buildCreatureManeuversCategory();
            this._buildCombatCategory();*/
        }

        /**
         * Build Character Actions
         * @private
         * @returns {object}
         */
        async #buildCreatureActions() {
            this.#buildGeneral();
        }

        /**
         * Build Multiple Token Actions
         * @private
         * @returns {object}
         *
         */
        async #buildMultipleTokenActions () {
            this.#buildGeneral();
            this.#buildUtility();
        }

        #buildGeneral() {
            this.#buildAttributes();
            this.#buildOther();
            if (this.actor) this.#buildSystem();
        }

        #buildSystem() {
            //**********************
            // Create actions for 'System' category
            //**********************

            const isCreature = 'creature' === this.actor?.type;

            const mapPropToActionID = {
                "earthdawn.u.useKarma": "usekarma"
            }

            const systemProperties = [
                "earthdawn.u.useKarma"
            ]
            let systemActions = systemProperties.map(e => {
                    return {
                        id: `action_system_${e}`,
                        name: this.i18n.localize(e), // localize in system
                        encodedValue: ["toggle", mapPropToActionID[e]].join(this.delimiter),
                        cssClass: this.actor.system["usekarma"] === "true" ? 'toggle active' : 'toggle'
                    }
                }
            ).filter(s => !!s) // filter out nulls
                .sort((a, b) => a.name.localeCompare(b.name));

            // create group data
            const systemGroupData = {
                id: 'system',
                type: 'system'
            };

            // add actions to action list
            if (!isCreature) {
                this.addActions(systemActions, systemGroupData);
            }
        }

        #buildOther() {
            //**********************
            // Create actions for 'Other' category
            //**********************

            const isCreature = 'creature' === this.actor?.type;

            let otherActions = [
                {
                    id: null,
                    name: this.i18n.localize("earthdawn.r.recovery"),
                    encodedValue: ["recovery", "recovery"].join(this.delimiter),
                    info1: {
                        text: this.actor
                            ? `${this.actor.system.recoverytestscurrent ?? 0}/${this.actor.system.recoverytestsrefreshFinal ?? 0}`
                            : '',
                        title: this.actor
                            ? this.i18n.localize('tokenActionHud.ed4e.infoTitles.recoveryTests')
                            : ''
                    }
                }
            ];
            if (!isCreature) {
                otherActions.push(
                    {
                        id: 'action_other_newDay',
                        name: this.i18n.localize("earthdawn.n.newDay"),
                        encodedValue: ["newday", "newday"].join(this.delimiter),
                    },
                    {
                        id: 'action_other_halfMagic',
                        name: this.i18n.localize("earthdawn.h.halfMagic"),
                        encodedValue: ["halfmagic", "halfmagic"].join(this.delimiter),
                    }
                )
            }

            // create group data
            const otherGroupData = {
                id: 'other',
                type: 'system'
            };

            // add actions to action list
            this.addActions(otherActions, otherGroupData);
        }

        #buildAttributes() {
            //**********************
            // Create attribute check actions
            //**********************

            // create action for each attribute
            let attributeActions = ATTRIBUTES.map(e => {
                    return {
                        id: `action_attribute_${e}`,
                        name: this.i18n.localize(
                            this.abbreviateAttributes
                                ? ATTRIBUTES_ABBREVIATED[e]
                                : ATTRIBUTES_FULL_NAME[e]
                        ), // localize in system
                        encodedValue: ["attribute", e].join(this.delimiter),
                        tooltip: this.i18n.format(
                            "tokenActionHud.ed4e.tooltips.attributeTest",
                            {attribute: this.i18n.localize(e)}
                        ),
                        info1: {
                            text: this.actor ? `${this.actor.system[`${e}Step`]}` : '',
                            title: this.actor
                                ? this.i18n.localize('tokenActionHud.ed4e.infoTitles.attributeStep')
                                : ''
                        }
                    }
                }
            )

            // create group data
            const attributesGroupData = {
                id: 'attributes',
                type: 'system'
            };

            // add actions to action list
            this.addActions(attributeActions, attributesGroupData);
        }

        async #buildFavorites() {
            if ('creature' === this.actor.type) return;

            const favoriteItems = Array.from(
                this.actor.items.values()
            ) .filter(
                (e => 'true' === e.system.favorite)
            );

            // exit early if ther are no favorite items
            if (favoriteItems.length < 1) return;

            // create group data
            const favoritesGroupData = {
                id: 'favorites',
                type: 'system'
            };

            let favoriteActions = await Promise.all(favoriteItems.map(async item =>
                await this.#getAction(item.type, item, favoritesGroupData)
            ));
            favoriteActions.sort((a,b) => a.name.localeCompare(b.name));

            // add actions to action list
            this.addActions(favoriteActions, favoritesGroupData);
        }

        async #buildTalentsOrSkill(type) {
            // Get talent or skill items
            const talentsSkills = new Map();
            for (const [key, value] of this.items) {
                const itemType = value.type;
                if (itemType === type) talentsSkills.set(key, value);
            }

            // Early exit if no items exist
            if (talentsSkills.size === 0) return;

            coreModule.api.Logger.debug(`Building group "${type}s"`);

            // Map talents/skill by action type to new maps
            const actionTypeMap = new Map();
            for (const [key, value] of talentsSkills) {
                const actionType = value.system.action?.toLowerCase() ?? 'na';
                if (!actionTypeMap.has(actionType)) actionTypeMap.set(actionType, new Map());
                actionTypeMap.get(actionType).set(key, value);
            }
            // Create group name mappings
            const groupNameMappings = {
                'standard': this.i18n.localize('earthdawn.s.standard'),
                'simple': this.i18n.localize('earthdawn.s.simple'),
                'free': this.i18n.localize('earthdawn.s.free'),
                'sustained': this.i18n.localize('earthdawn.s.sustained'),
                'na': this.i18n.localize('tokenActionHud.ed4e.na')
            }
            // Loop through group IDs
            for (const groupId of this.talentSkillGroupIds) {
                if (!actionTypeMap.has(groupId)) continue;
                // create group data
                const groupData = {
                    id: groupId,
                    nestId: `${type}s_${groupId}`,
                    name: groupNameMappings[groupId] ?? '',
                    type: 'system'
                }
                const items = actionTypeMap.get(groupId);
                await this.#buildActions(items, groupData, type);
            }

            // build ungrouped talent group
            const groupId = `${type}s`
            const groupData = {
                id: groupId,
                nestId: [groupId, groupId].join('_'),
                type: 'system'
            }
            await this.#buildActions(talentsSkills, groupData, type);
        }

        async #buildSpells() {
            const actionType = 'spell';
            const spellsMap = new Map();
            // loop through items
            for (const [key, value] of this.items) {
                const itemType = value.type;
                if (itemType === 'spell') {
                    const circle = value.system.circle;
                    const circleGroupId = `circle${circle}spells`;
                    const discipline = value.system.discipline.toLowerCase();
                    const disciplineGroupId = `${discipline}Spells`;
                    this.#addToMapOfMaps(spellsMap, circleGroupId, key, value);
                    this.#addToMapOfMaps(spellsMap, disciplineGroupId, key, value);
                }
            }

            // create array of spell circles
            const spellCircles = [...Array(MAX_SPELL_CIRCLE).keys()].map(circle => circle +1);

            let groupMappings = {};

            for (const spellCircle of spellCircles) {
                groupMappings[`circle${spellCircle}spells`] = {
                    spellCircle: spellCircle,
                    name: `${this.i18n.localize('earthdawn.c.circle')} ${spellCircle}`
                }
            }

            for (const discipline of SPELLCASTING_DISCIPLINES) {
                groupMappings[`${discipline}Spells`] = {
                    discipline: discipline,
                    name: discipline.charAt(0).toUpperCase() + discipline.slice(1)
                    //`${this.i18n.localize(`tokenActionHud.ed4e.disciplines.${discipline}`)}`
                }
            }

            for (const groupId of this.spellGroupIds) {
                const groupName = groupMappings[groupId].name;

                // skip if no spells exist
                if (!spellsMap.has(groupId)) continue;

                // create group data
                const groupData = {
                    id: groupId,
                    name: groupName,
                    type: 'system'
                };

                const spells = spellsMap.get(groupId);

                await this.#buildActions(spells, groupData, actionType)
            }
        }

        async #buildInventory() {
            // exit early if no items exist
            if (this.items.size === 0) return;

            const inventoryMap = new Map();

            for (const [itemId, itemEntity] of this.items) {
                const isEquipabble = itemEntity.system.hasOwnProperty('worn');
                const isThreadItem = itemEntity.system.isthread;
                const equipped = !!itemEntity.system.worn;
                const hasQuantity = itemEntity.system?.amount > 0;
                const itemType = itemEntity.type;

                // populate Map
                if (equipped) {
                    this.#addToMapOfMaps(inventoryMap, 'equipped', itemId, itemEntity);
                } else if (isEquipabble) {
                    this.#addToMapOfMaps(inventoryMap, 'unequipped', itemId, itemEntity);
                }
                if (isThreadItem) {
                    this.#addToMapOfMaps(inventoryMap, 'threadItems', itemId, itemEntity);
                }
                if (itemType === 'armor') {
                    this.#addToMapOfMaps(inventoryMap, 'armors', itemId, itemEntity);
                }
                if (itemType === 'equipment') {
                    this.#addToMapOfMaps(inventoryMap, 'equipment', itemId, itemEntity);
                }
                if (itemType === 'shield') {
                    this.#addToMapOfMaps(inventoryMap, 'shields', itemId, itemEntity);
                }
                if (itemType === 'weapon') {
                    this.#addToMapOfMaps(inventoryMap, 'weapons', itemId, itemEntity);
                }
            }

            const groupNameMappings = {
                equipped: this.i18n.localize('earthdawn.e.equipped'),
                unequipped: this.i18n.localize('tokenActionHud.ed4e.unequipped'),
                threadItems: this.i18n.localize('earthdawn.t.threadItems'),
                armors: this.i18n.localize('earthdawn.a.armors'),
                equipment: this.i18n.localize('earthdawn.e.equipment'),
                shields: this.i18n.localize('earthdawn.s.shields'),
                weapons: this.i18n.localize('earthdawn.w.weapons')
            }

            for (const groupId of this.inventoryGroupIds) {
                if (!inventoryMap.has(groupId)) continue;

                const groupData = {
                    id: groupId,
                    name: groupNameMappings[groupId],
                    type: 'system'
                }

                const inventory = inventoryMap.get(groupId);

                //console.debug("Building Inventory Actions. Inventory Map:", inventoryMap);
                await this.#buildActions(inventory, groupData);
            }
        }


        /**
         * Build actions
         * @private
         * @param {object} items
         * @param {object} groupData
         * @param {string} actionType
         */
        async #buildActions (items, groupData, actionType = 'item') {
            // Exit if there are no items
            if (items.size === 0) return;

            // Exit if there is no groupId
            const groupId = (typeof groupData === 'string' ? groupData : groupData?.id);
            if (!groupId) return;

            // Get actions
            const actions = await Promise.all(
                [...items].map(async item => await this.#getAction(actionType, item[1], groupData))
            );

            // Add actions to action list
            this.addActions(actions, groupData);
        }

        /**
         * Get action
         * @private
         * @param {string} actionType
         * @param {object} entity
         * @param {object} groupData
         * @returns {object}
         */
        async #getAction(actionType, entity, groupData) {
            const id = entity.id ?? entity._id;
            let name = entity?.name ?? entity?.label;
            /*if (
                entity?.system?.recharge &&
                !entity?.system?.recharge?.charged &&
                entity?.system?.recharge?.value
            ) {
                name += ` (${coreModule.api.Utils.i18n('DND5E.Recharge')})`
            }*/
            const actionTypeName = `${coreModule.api.Utils.i18n(ACTION_TYPE[actionType])}: ` ?? '';
            const listName = `${actionTypeName}${name}`;
            if (!listName) coreModule.api.Logger.debug("No list name for: ", {actionType, entity, groupData});
            let cssClass = '';
            if (Object.hasOwn(entity, 'disabled')) {
                const active = (!entity.disabled) ? ' active' : '';
                cssClass = `toggle${active}`;
            }
            const encodedValue = [actionType, id].join(this.delimiter);
            const img = coreModule.api.Utils.getImage(entity);
            const icon = this.#getItemIcons(entity);
            const icon1 = icon.icon1;
            const icon2 = icon.icon2;
            const icon3 = icon.icon3;
            const info = this.#getItemInfo(entity, groupData);
            const info1 = info?.info1;
            const info2 = info?.info2;
            const info3 = info?.info3;
            //const tooltipData = await this.#getTooltipData(entity)
            //const tooltip = await this.#getTooltip(tooltipData)
            return {
                id,
                name,
                encodedValue,
                cssClass,
                img,
                icon1,
                icon2,
                icon3,
                info1,
                info2,
                info3,
                listName,
                //tooltip
            }
        }

        /**
         * Get item info
         * @private
         * @param {object} item
         * @param {object} groupData
         * @returns {object}
         */
        #getItemInfo(item, groupData) {
            let info1, info2, info3;
            switch (item.type) {
                case 'talent':
                case 'skill':
                    info1 = {
                        text: `${item.system.finalranks ?? item.system.ranks}`,
                        title: this.i18n.localize('earthdawn.r.rank')
                    };
                    info2 = {
                        text: this.i18n.localize(
                            ATTRIBUTES_ABBREVIATED[item.system.attribute.replace('Step', '')]
                            ?? 'earthdawn.n.none'
                        ),
                        title: this.i18n.localize('earthdawn.a.attribute')
                    };
                    if (item.system.strain > 0) {
                        info3 = {
                            text: item.system.strain.toString(),
                            title: this.i18n.localize('earthdawn.s.strain')
                        };
                    }
                    break;
                case 'spell':
                    info1 = {
                        text: `${item.system.threadsrequired}`,
                        title: this.i18n.localize('earthdawn.s.spellThreads')
                    };
                    if (groupData.id.includes('circle')) {
                        info2 = {
                            text: item.system.discipline ?? this.i18n.localize('tokenActionHud.ed4e.na'),
                            title: this.i18n.localize('earthdawn.d.discipline')
                        };
                    } else {
                        info2 = {
                            text: `${item.system.circle}`,
                            title: this.i18n.localize('earthdawn.c.circle')
                        };
                    }
                    info3 = null;
                    break;
                case 'equipment':
                    if (item.system.amount > 1) {
                        info1 = {
                            text: `${item.system.amount}x`,
                            title: this.i18n.localize('earthdawn.a.amount')
                        };
                    }
                    break;
                case 'armor':
                    info1 = {
                        text: `${item.system.physicalArmorFinal} ${this.i18n.localize('tokenActionHud.ed4e.abbreviations.physicalArmor')}`,
                        title: this.i18n.localize('earthdawn.p.physicalArmor')
                    };
                    info2 = {
                        text: `${item.system.mysticArmorFinal} ${this.i18n.localize('tokenActionHud.ed4e.abbreviations.mysticArmor')}`,
                        title: this.i18n.localize('earthdawn.m.mysticArmor')
                    };
                    break;
                case 'shield':
                    info1 = {
                        text: `${item.system.physicaldefense} ${this.i18n.localize('tokenActionHud.ed4e.abbreviations.physicalDefense')}`,
                        title: this.i18n.localize('earthdawn.p.physicalDefense')
                    };
                    info2 = {
                        text: `${item.system.mysticdefense} ${this.i18n.localize('tokenActionHud.ed4e.abbreviations.mysticDefense')}`,
                        title: this.i18n.localize('earthdawn.m.mysticDefense')
                    };
                    info3 = {
                        text: `${item.system.shatterthreshold}`,
                        title: this.i18n.localize('earthdawn.s.shatterThreshold')
                    };
                    break;
                case 'weapon':
                    info1 = {
                        text: `${item.system.damageTotal}`,
                        title: this.i18n.localize('tokenActionHud.ed4e.tooltips.info.weaponStepTotal')
                    };
                    if (['ranged', 'thrown'].includes(item.system.weapontype)) {
                        info2 = {
                            text: `${item.system.shortrange}/${item.system.longrange}`,
                            title: this.i18n.localize('tokenActionHud.ed4e.tooltips.info.weaponRange')
                        };
                        info3 = {
                            text: `${item.system.ammo}`,
                            title: this.i18n.localize('tokenActionHud.ed4e.tooltips.info.weaponAmmo')
                        };
                    }
                    break;
                default:
                    break;
            }
            return {
                info1,
                info2,
                info3
            }
        }

        /**
         * Get icons name for item based on type, shown to left of action/group
         */
        #getItemIcons(item) {
            let icon1, icon2, icon3;

            switch (item.type) {
                case 'talent':
                case 'skill':
                    if (item.system.strain > 0) {
                        icon1 = `<i class="fa-thin fa-droplet" title="${this.i18n.localize('earthdawn.s.strain')}"></i>`;
                    }
                    break;
                case 'weapon':
                    icon1 = `<i class="${WEAPON_TYPE_ICON[item.system.weapontype.toLowerCase()]}" title="${this.i18n.localize('earthdawn.w.weaponType')}"></i>`;
                case 'armor':
                    if (
                        item.system.timesForged > 0
                        || item.system.timesForgedMystic > 0
                        || item.system.timesForgedPhysical > 0
                    ) {
                        icon2 = `<i class="fa-thin fa-hammer-crash" title="${this.i18n.localize('tokenActionHud.ed4e.forged')}"></i>`;
                    }
                    break;
                default:
                    break;
            }

            if (item.system.isthread) {
                icon3 = `<i class="fa-thin fa-wand-sparkles" title="${this.i18n.localize('earthdawn.t.threadItem')}"></i>`;
            }

            return {icon1, icon2, icon3};
        }

        /**
         * Get actors
         * @private
         * @returns {object}
         */
        #getActors() {
            const allowedTypes = ['pc', 'npc', 'creature'];
            const actors = canvas.tokens.controlled.filter(token => token.actor).map((token) => token.actor);
            if (actors.every((actor) => allowedTypes.includes(actor.type))) {
                return actors;
            } else {
                return [];
            }
        }

        /**
         * Get tokens
         * @private
         * @returns {object}
         */
        #getTokens() {
            const allowedTypes = ['pc', 'npc', 'creature'];
            const tokens = canvas.tokens.controlled;
            const actors = tokens.filter(token => token.actor).map((token) => token.actor);
            if (actors.every((actor) => allowedTypes.includes(actor.type))) {
                return tokens
            } else {
                return [];
            }
        }

        #addToMapOfMaps(map, mainKey, subKey, subValue) {
            if (!map.has(mainKey)) {
                map.set(mainKey, new Map());
            }
            map.get(mainKey).set(subKey, subValue);
        }

        #getTooltipData(entity) {}

        #getTooltip(tooltipData) {}

        #buildUtility() {
            const actionType = 'utility';

            // Set combat types
            const combatTypes = {
                initiative: { id: 'initiative', name: coreModule.api.Utils.i18n('tokenActionHud.ed4e.rollInitiative') },
                endTurn: { id: 'endTurn', name: coreModule.api.Utils.i18n('tokenActionHud.endTurn') }
            };

            // Delete endTurn for multiple tokens
            if (game.combat?.current?.tokenId !== this.token?.id) delete combatTypes.endTurn;

            // Get actions
            const actions = Object.entries(combatTypes).map((combatType) => {
                const id = combatType[1].id;
                const name = combatType[1].name;
                const actionTypeName = `${coreModule.api.Utils.i18n(ACTION_TYPE[actionType])}: ` ?? '';
                const listName = `${actionTypeName}${name}`
                const encodedValue = [actionType, id].join(this.delimiter)
                const info1 = {}
                let cssClass = ''
                if (combatType[0] === 'initiative' && game.combat) {
                    const tokenIds = canvas.tokens.controlled.map((token) => token.id)
                    const combatants = game.combat.combatants.filter((combatant) => tokenIds.includes(combatant.tokenId))

                    // Get initiative for single token
                    if (combatants.length === 1) {
                        const currentInitiative = combatants[0].initiative
                        info1.class = 'tah-spotlight'
                        info1.text = currentInitiative
                    }

                    const active = combatants.length > 0 && (combatants.every((combatant) => combatant?.initiative)) ? ' active' : ''
                    cssClass = `toggle${active}`
                }
                return {
                    id,
                    name,
                    encodedValue,
                    info1,
                    cssClass,
                    listName
                }
            })

            // Create group data
            const groupData = { id: 'combatUtilities', type: 'system' }

            // Add actions to HUD
            this.addActions(actions, groupData)
        }

        async #buildCombat() {
            // weapons
            const weaponAttackGroup = {
                id: 'weaponAttack',
                name: this.i18n.localize('tokenActionHud.ed4e.attack'),
                type: 'system'
            }
            const weapons = this.actor.items.filter(i => i.type === "weapon" && i.system.worn);
            const weaponActions = await Promise.all(
                weapons.map(async w => await this.#getAction("weaponAttack", w, weaponAttackGroup))
            );
            this.addActions(weaponActions, weaponAttackGroup);

            // tactics
            const tacticsProperties = [
                "earthdawn.c.combatOptionsAggressive",
                "earthdawn.c.combatOptionsDefensive",
                "earthdawn.c.combatModifierHarried",
                "earthdawn.c.combatModifierKnockedDown"
            ]

            const mapPropToActionID = {
                "earthdawn.c.combatOptionsAggressive": "tactics.aggressive",
                "earthdawn.c.combatOptionsDefensive": "tactics.defensive",
                "earthdawn.c.combatModifierHarried": "tactics.harried",
                "earthdawn.c.combatModifierKnockedDown": "tactics.knockeddown",
            }

            let tacticsActions = tacticsProperties.map( e => {
                    return {
                        id: `combatTactic_${e}`,
                        name: this.i18n.localize(e), // localize in system
                        encodedValue: ['toggle', mapPropToActionID[e]].join(this.delimiter),
                        cssClass: this.actor.system.tactics[mapPropToActionID[e].split(".")[1]] === true
                            ? 'toggle active'
                            : 'toggle'
                    }
                }
            ).sort((a,b) => a.name.localeCompare(b.name));

            const optionsModifier =  {
                id: 'optionsModifier',
                name: 'earthdawn.c.combatOptions',
                type: 'system'
            }

            this.addActions(tacticsActions, optionsModifier);

            // actions

            const combatActionGroup = {
                id: 'combatActions',
                name: this.i18n.localize('earthdawn.a.actions'),
                type: 'system'
            }
            const combatActions = [
                {
                    id: 'combatAction_takeDamage',
                    name: this.i18n.localize("earthdawn.t.takeDamage"),
                    encodedValue: ["takedamage", "takedamage"].join(this.delimiter),
                },
                {
                    id: 'combatAction_knockdownTest',
                    name: this.i18n.localize("earthdawn.c.combatOptionsKnockdownTest"),
                    encodedValue: ["knockdowntest", "knockdowntest"].join(this.delimiter),
                },
                {
                    id: 'combatAction_jumpUp',
                    name: this.i18n.localize("earthdawn.c.combatOptionsJumpUp"),
                    encodedValue: ["jumpup", "jumpup"].join(this.delimiter),
                },
            ];
            this.addActions(combatActions, combatActionGroup);
        }

        async #buildMatrices() {
            const matrices = this.actor.items.filter(i => i.type === "spellmatrix");

            // exit early if there are no matrices
            if (matrices.length < 1) return;

            const matrixParentGroupData = {
                id: 'matrices',
            }

            for (const matrix of matrices) {
                const matrixGroupData = {
                    id: `matrix_${matrix.id}`,
                    name: matrix.name,
                    type: 'system-derived',
                    selected: true,
                    info1: {
                        text: matrix.system.currentspell,
                        info: this.i18n.localize('tokenActionHud.ed4e.tooltips.info.matrixSpell'),
                        class: 'tah-spotlight'
                    },
                    info2: {
                        text: `${matrix.system.totalthreads}/${matrix.system.totalthreadsneeded}`,
                        title: this.i18n.localize('tokenActionHud.ed4e.tooltips.info.matrixThreads')
                    }
                }

                const actionNameMapping = {
                    matrixAttune: 'earthdawn.a.attune',
                    matrixWeave: 'earthdawn.m.matrixWeaveRed',
                    matrixCast: 'earthdawn.m.matrixCastRed',
                    matrixClear: 'earthdawn.m.matrixClearRed'
                }

                const matrixActions = Array.from(Object.entries(actionNameMapping), ([key, value]) => {
                    return {
                        id: matrix.id,
                        name: this.i18n.localize(value),
                        encodedValue: [key, matrix.id].join(this.delimiter),
                        selected: true
                    };
                })

                await this.addGroup(matrixGroupData, matrixParentGroupData, true);
                this.addActions(matrixActions, matrixGroupData);
            }
        }
    }
})