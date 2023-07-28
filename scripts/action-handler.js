// System Module Imports
import { Utils } from "./utils.js";
import {
    ACTION_TYPE,
    ATTRIBUTES,
    ATTRIBUTES_ABBREVIATED,
    ATTRIBUTES_FULL_NAME,
    MAX_SPELL_CIRCLE,
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
        spellCircleGroupIds = null;
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

            this.spellCircleGroupIds = Array.from(
                { length: MAX_SPELL_CIRCLE },
                (_, idx) => `circle${idx + 1}spells`
            );

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
                //await this._buildMultipleTokenActions();
            }
        }

        /**
         * Build Character Actions
         * @private
         * @returns {object}
         */
        async #buildCharacterActions() {
            await Promise.all([
                this.#buildTalentsOrSkill('talent'),
                this.#buildTalentsOrSkill('skill'),
                this.#buildSpells(),
                this.#buildInventory()
            ]);
            this.#buildGeneral();
            this.#buildFavorites();
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
         async _buildMultipleTokenActions () {
         this._buildGeneralCategory();
         this._buildFavoritesCategory();
         this._buildTalentsCategory();
         this._buildMatrixCategory();
         this._buildSkillsCategory();
         this._buildItemsCategory();
         this._buildAttacksCategory();
         this._buildCreaturePowersCategory();
         this._buildCreatureManeuversCategory();
         this._buildCombatCategory();
         }*/

        #buildGeneral() {
            const isCreature = 'creature' === this.actor.type;

            //**********************
            // Create attribute check actions
            //**********************

            // create action for each attribute
            let attributeActions = ATTRIBUTES.map( e => {
                    return {
                        id: null,
                        name: this.i18n.localize(
                            this.abbreviateAttributes
                                ? ATTRIBUTES_ABBREVIATED[e]
                                : ATTRIBUTES_FULL_NAME[e]
                        ), // localize in system
                        encodedValue: ["attribute", this.token.id, e].join(this.delimiter),
                        tooltip: this.i18n.format(
                            "tokenActionHud.ed4e.tooltips.attributeTest",
                            {attribute: this.i18n.localize(e)}
                        ),
                        info1: {
                            text: `${this.actor.system[`${e}Step`]}`,
                            title: this.i18n.localize('tokenActionHud.ed4e.infoTitles.attributeStep')}
                    }
                }
            ).filter(s => !!s); // filter out nulls

            console.debug('Attribute Actions: ', attributeActions);

            // create group data
            const attributesGroupData = {
                id: 'attributes',
                type: 'system'
            };

            // add actions to action list
            this.addActions(attributeActions, attributesGroupData);

            //**********************
            // Create actions for 'Other' category
            //**********************

            let otherActions = [
                {
                    id: null,
                    name: this.i18n.localize("earthdawn.r.recovery"),
                    encodedValue: ["recovery", this.token.id, "recovery"].join(this.delimiter),
                    info1: {
                        text: `${this.actor.system.recoverytestscurrent}/${this.actor.system.recoverytestsrefreshFinal}`
                    }
                    //tooltip: this.i18n.localize("tokenActionHud.ed4e.tooltips.recoveryTest")
                }
            ];
            if (!isCreature) {
                otherActions.push(
                    {
                        id: null,
                        name: this.i18n.localize("earthdawn.n.newDay"),
                        encodedValue: ["newday", this.token.id, "newday"].join(this.delimiter),
                    },
                    {
                        id: null,
                        name: this.i18n.localize("earthdawn.h.halfMagic"),
                        encodedValue: ["halfmagic", this.token.id, "halfmagic"].join(this.delimiter),
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

            //**********************
            // Create actions for 'System' category
            //**********************

            const mapPropToActionID = {
                "earthdawn.u.useKarma": "usekarma"
            }

            const systemProperties = [
                "earthdawn.u.useKarma"
            ]
            let systemActions = systemProperties.map( e => {
                    return {
                        id: null,
                        name: this.i18n.localize(e), // localize in system
                        encodedValue: ["toggle", this.token.id, mapPropToActionID[e]].join(this.delimiter),
                        cssClass: this.actor.system["usekarma"] === "true" ? 'toggle active' : 'toggle'
                    }
                }
            ).filter(s => !!s) // filter out nulls
                .sort((a,b) => a.name.localeCompare(b.name));

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

        #buildFavorites() {
            if ('creature' === this.actor.type) return;

            const favoriteItems = Array.from(
                this.actor.items.values()
            ) .filter(
                (e => 'true' === e.system.favorite)
            );

            let favoriteActions = favoriteItems.map(e => {
                try {
                    const itemID = e.id;
                    const macroType = e.type.toLowerCase();
                    const name = e.name;
                    let infoText = e.system.hasOwnProperty("ranks") ? `${e.system.ranks}` : null;
                    let encodedValue = [macroType, this.token.id, itemID].join(this.delimiter);
                    return {
                        id: itemID,
                        name: name,
                        encodedValue: encodedValue,
                        info1: {
                            text: infoText
                        }
                    };
                } catch (error) {
                    error(e ?? 'No item in favorites');
                    return null;
                }
            }).filter(s => !!s) // filter out nulls
                .sort((a,b) => a.name.localeCompare(b.name));

            // create group data
            const favoritesGroupData = {
                id: 'favorites',
                type: 'system'
            };

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

            coreModule.api.Logger.debug(`Building category, type: ${type}`);
            console.debug(`Building category, type: ${type}`);

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
                    const groupId = `circle${circle}spells`;
                    if (!spellsMap.has(groupId)) spellsMap.set(groupId, new Map());
                    spellsMap.get(groupId).set(key, value);
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

            for (const groupId of this.spellCircleGroupIds) {
                //const spellCircle = groupMappings[groupId].spellCircle;
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
                [...items].map(async item => await this.#getAction(actionType, item[1]))
            );

            // Add actions to action list
            this.addActions(actions, groupData);
        }

        /**
         * Get action
         * @private
         * @param {string} actionType
         * @param {object} entity
         * @returns {object}
         */
        async #getAction (actionType, entity) {
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
            let cssClass = '';
            if (Object.hasOwn(entity, 'disabled')) {
                const active = (!entity.disabled) ? ' active' : '';
                cssClass = `toggle${active}`;
            }
            const encodedValue = [actionType, this.token.id, id].join(this.delimiter);
            const img = coreModule.api.Utils.getImage(entity);
            const icon = this.#getItemIcons(entity);
            const icon1 = icon.icon1;
            const icon2 = icon.icon2;
            const info = this.#getItemInfo(entity);
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
         * @returns {object}
         */
        #getItemInfo (item) {
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
                    info2 = {
                        text: item.system.discipline ?? this.i18n.localize('tokenActionHud.ed4e.na'),
                        title: this.i18n.localize('earthdawn.d.discipline')
                    };
                    info3 = null;
                    break;
                case 'armor':
                    info1 = {
                        text: `${item.system.physicalArmorFinal} ${this.i18n.localize('tokenActionHud.ed4e.abbreviations.physicalArmor')}`,
                        title: this.i18n.localize('earthdawn.p.physicalArmor')
                    }
                    info2 = {
                        text: `${item.system.mysticArmorFinal} ${this.i18n.localize('tokenActionHud.ed4e.abbreviations.mysticArmor')}`,
                        title: this.i18n.localize('earthdawn.m.mysticArmor')
                    }
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
            let icon1, icon2;

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
                        icon2 = `<i class="fa-duotone fa-hammer-crash" title="${this.i18n.localize('tokenActionHud.ed4e.forged')}"></i>`;
                    }
                    break;
                default:
                    break;
            }

            return {icon1, icon2};
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
    }
})