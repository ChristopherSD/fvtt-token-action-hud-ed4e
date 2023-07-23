// System Module Imports
import { Utils } from "./utils.js";
import {ATTRIBUTES, ATTRIBUTES_ABBREVIATED, ATTRIBUTES_FULL_NAME} from "./constants.js";


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
        abbreviateAttributes

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
            this.#buildTalentsCategory();
            /*this._buildMatrixCategory();
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

        #buildFavoritesCategory() {
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

        #buildTalentsCategory() {}

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