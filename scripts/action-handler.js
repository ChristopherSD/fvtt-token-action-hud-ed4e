// System Module Imports
import { Utils } from "./utils.js";


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
        showGeneral = null;
        showFavorites = null;
        showTalents = null;
        showSkills = null;
        showMatrices = null;
        showInventory = null;
        showStatusToggle = null;
        showCombat = null;

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

            this.showGeneral = Utils.getSetting('showGeneral');
            this.showFavorites = Utils.getSetting('showFavorites');
            this.showTalents = Utils.getSetting('showTalents');
            this.showSkills = Utils.getSetting('showSkills');
            this.showMatrices = Utils.getSetting('showMatrices');
            this.showInventory = Utils.getSetting('showInventory');
            this.showStatusToggle = Utils.getSetting('showStatusToggle');
            this.showCombat = Utils.getSetting('showCombat');

            if (this.actor) {
                await this.#buildCharacterActions();
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
            this.#buildGeneralCategory();
            this.#buildFavoritesCategory();
            /*this._buildTalentsCategory();
            this._buildMatrixCategory();
            this._buildSkillsCategory();
            this._buildItemsCategory();
            this._buildAttacksCategory();
            this._buildCreaturePowersCategory();
            this._buildCreatureManeuversCategory();
            this._buildCombatCategory();*/
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

        #buildGeneralCategory() {
            //if (!settings.get("showGeneral")) return;

            const isCreature = 'creature' === this.actor.type;

            //**********************
            // Create attribute check actions
            //**********************

            const attributeProperties = [
                "earthdawn.d.dexterity",
                "earthdawn.s.strength",
                "earthdawn.t.toughness",
                "earthdawn.p.perception",
                "earthdawn.w.willpower",
                "earthdawn.c.charisma",
            ]

            // create action for each attribute
            let attributeActions = attributeProperties.map( e => {
                    return {
                        id: null,
                        name: this.i18n.localize(e), // localize in system
                        encodedValue: ["attribute", this.token.id, e].join(this.delimiter),
                        tooltip: this.i18n.format(
                            "tokenActionHud.ed4e.tooltips.attributeTest",
                            {attribute: this.i18n.localize(e)}
                        )
                    }
                }
            ).filter(s => !!s); // filter out nulls

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
                    tooltip: this.i18n.localize("tokenActionHud.ed4e.tooltips.recoveryTest")
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
                        cssClass: this.actor.system["usekarma"] === "true" ? 'active' : 'toggle'
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

        #buildFavoritesCategory() {
            //if (!settings.get("showFavorites")) return;

            if ('creature' === this.actor.type) return;

            const favoriteItems = Array.from(
                this.actor.items.values()
            ) .filter(
                (e => 'true' === e.system.favorite)
            );

            let favoriteActions = favoriteItems.map(e => {
                try {
                    let itemID = e.id;
                    let macroType = e.type.toLowerCase();
                    let name = e.name;
                    if (e.system.hasOwnProperty("ranks")) {
                        name += " (" + e.system.ranks + ")";
                    }
                    let encodedValue = [macroType, this.token.id, itemID].join(this.delimiter);
                    return {name: name, id: itemID, encodedValue: encodedValue};
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
    }
})