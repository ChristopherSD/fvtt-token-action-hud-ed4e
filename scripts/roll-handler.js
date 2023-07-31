export let RollHandler = null;

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    RollHandler = class RollHandler extends coreModule.api.RollHandler {
        /**
         * Handle Action Event
         * @override
         * @param {object} event
         * @param {string} encodedValue
         */
        async doHandleActionEvent(event, encodedValue) {
            let payload = encodedValue.split(this.delimiter);

            if (payload.length !== 2) {
                super.throwInvalidValueErr();
            }

            let actionType = payload[0];
            let actionId = payload[1];

            if (!this.actor) {
                for (const token of canvas.tokens.controlled) {
                    const actor = token.actor;
                    await this.#handleAction(event, actionType, actor, token, actionId);
                }
            } else {
                await this.#handleAction(event, actionType, this.actor, this.token, actionId);
            }
        }

        async #handleAction(event, actionType, actor, token, actionId) {
            if (this.isRenderItem()) {
                if (['skill', 'talent', 'power', 'item', 'spell'].includes(actionType)) {
                    this.doRenderItem(actor, actionId);
                } else if (actionType === 'effect') {
                    actor.effects.get(actionId).sheet.render(true);
                }
            } else {
                switch (actionType) {
                    case 'skill':
                    // fall through
                    case 'talent':
                        this.rollTalentMacro(event, actor, token, actionId);
                        break;
                    case 'attack':
                    // fall through
                    case 'power':
                    // fall through
                    case 'maneuver':
                        this.handleCreatureActionMacro(event, actor, token, actionId);
                        break;
                    case 'item':
                        await this.rollInventoryMacro(event, actor, token, actionId);
                        break;
                    case 'toggle':
                        await this.toggleDataProperty(event, actor, token, actionId);
                        break;
                    case 'attribute':
                        this.rollAttributeMacro(event, actor, token, actionId);
                        break;
                    case 'utility':
                        await this.#performUtilityAction(event, actor, token, actionId);
                        break;
                    case 'recovery':
                        actor.recoveryTest();
                        break;
                    case 'newday':
                        actor.newDay();
                        break;
                    case 'halfmagic':
                        actor.halfMagic();
                        break;
                    case 'matrixAttune':
                        actor.attuneMatrix(actor.items.get(actionId));
                        break;
                    case 'matrixWeave':
                        actor.weaveThread(actor.items.get(actionId));
                        break;
                    case 'matrixCast':
                        actor.castSpell(actor.items.get(actionId));
                        break;
                    case 'matrixClear':
                        actor.clearMatrix(actor.items.get(actionId));
                        break;
                    case 'weaponAttack':
                        actor.rollPrep({weaponID: actionId, rolltype: 'attack'});
                        break;
                    case 'takedamage':
                        await this.takeDamage(actor);
                        break;
                    case 'knockdowntest':
                        actor.knockdownTest({});
                        break;
                    case 'jumpup':
                        actor.jumpUpTest();
                        break;
                    case 'effect':
                        await this.#toggleEffect(event, actor, actionId);
                        break;
                    default:
                        break;
                }
            }
        }

        rollAttributeMacro(event, actor, tokenId, actionId) {
            actor.rollPrep({ attribute: `${actionId.split('.').slice(-1)}Step`, name: actionId });
        }

        rollTalentMacro(event, actor, tokenId, actionId) {
            actor.rollPrep({ talentID: actionId});
        }

        async rollInventoryMacro(event, actor, tokenId, actionId) {
            const item = actor.items.get(actionId);
            if (item.system.hasOwnProperty('worn')) {
                await this.toggleItemWornProperty(event, actor, tokenId, actionId);
            }
        }

        async toggleDataProperty(event, actor, tokenId, actionId) {
            if (actionId.includes("tactics")) {
                const tactic = actionId.split('.')[1];
                const updateData = {system: {tactics: {}}};
                updateData.system.tactics[tactic] = !actor.system.tactics[tactic];
                await actor.update(updateData);
            } else {
                const currentValue = actor.system[actionId];
                const valueType = typeof currentValue;
                const newValue = valueType === "string" ? this._toggleBooleanString(currentValue) : !currentValue;
                await actor.update({
                    system: {
                        [actionId]: newValue
                    }
                })
            }
            // Update HUD
            Hooks.callAll('forceUpdateTokenActionHud');
        }

        async toggleItemWornProperty(event, actor, tokenId, actionId) {
            const item = actor.items.get(actionId);
            const currentValue = item.system['worn'];
            const valueType = typeof currentValue;
            let newValue = valueType === "string" ? this._toggleBooleanString(currentValue) : !currentValue;
            await item.update({
                system: {
                    worn: newValue
                }
            })
            // Update HUD
            Hooks.callAll('forceUpdateTokenActionHud');
        }

        _toggleBooleanString(val) {
            if (val.toLowerCase().includes("true")) return "false";
            if (val.toLowerCase().includes("false")) return "true";
            return "false";
        }

        handleCreatureActionMacro(event, actor, tokenId, actionId) {
            const item = actor.items.get(actionId);

            if (item.system.attackstep !== 0) {
                const modifier = 0;
                const strain = item.system.strain ? item.system.strain : 0;
                const karma = 0;

                let type = (item.system.powerType === "Attack") ? "attack" : (item.system.attackstep > 0) ? "test" : "";
                const parameters = {
                    itemID: actionId,
                    steps: item.system.attackstep,
                    talent: item.name,
                    strain: strain,
                    type: type,
                    karma: karma,
                    modifier: modifier,
                };
                actor.NPCtest(parameters);
            } else {
                actor.items.get(actionId).sheet.render(true);
            }
        }

        async takeDamage(actor) {
            let inputs = await new Promise((resolve) => {
                new Dialog({
                    title: coreModule.api.Utils.i18n('earthdawn.t.takeDamage'),
                    content: `
          <div style="float: left">
              <label>${coreModule.api.Utils.i18n('earthdawn.d.damage')}: </label>
              <input id="damage_box" value=0 autofocus/>
          </div>
          <div>
              <label>${coreModule.api.Utils.i18n('earthdawn.t.type')}: </label>
              <select id="type_box">
                <option value="physical">Physical</option>
                <option value="mystic">Mystic</option>
              </select>
          </div>
          <div>
            <label>${coreModule.api.Utils.i18n('earthdawn.i.ignoreArmor')}?</label>
            <input type="checkbox" id="ignore_box"/>
          </div>`,
                    buttons: {
                        ok: {
                            label: coreModule.api.Utils.i18n('earthdawn.o.ok'),
                            callback: (html) => {
                                resolve({
                                    damage: html.find('#damage_box').val(),
                                    type: html.find('#type_box').val(),
                                    ignore: html.find('#ignore_box:checked'),
                                });
                            },
                        },
                    },
                    default: 'ok',
                }).render(true);
            });

            inputs.ignorearmor = inputs.ignore.length > 0;
            await actor.takeDamage(inputs);
        }

        async #performUtilityAction(event, actor, token, actionId) {
            switch (actionId) {
                case 'endTurn':
                    if (!token) break;
                    if (game.combat?.current?.tokenId === token.id) {
                        await game.combat?.nextTurn();
                    }
                    break;
                case 'initiative':
                    await this.#rollInitiative(actor);
                    break;
            }

            // Update HUD
            Hooks.callAll('forceUpdateTokenActionHud');
        }

        async #rollInitiative(actor) {
            if (!actor) return;
            await actor.rollInitiative({ createCombatants: true });

            Hooks.callAll('forceUpdateTokenActionHud');
        }

        async #toggleEffect(event, actor, actionId) {
            const effects = 'find' in actor.effects.entries ? actor.effects.entries : actor.effects;
            const effect = effects.find(effect => effect.id === actionId);

            if (!effect) return;

            await effect.update({ disabled: !effect.disabled});

            Hooks.callAll('forceUpdateTokenActionHud');
        }
    }
})
