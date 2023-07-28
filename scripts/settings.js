import { MODULE } from "./constants.js";

export function register(updateFunc) {
    game.settings.register(MODULE.ID, 'abbreviateAttributes', {
        name: game.i18n.localize("tokenActionHud.ed4e.settings.abbreviateAttributes.name"),
        hint: game.i18n.localize("tokenActionHud.ed4e.settings.abbreviateAttributes.hint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
        onChange: value => {updateFunc(value);}
    });

    game.settings.register(MODULE.ID, 'showWeaponAmmoInfo', {
        name: game.i18n.localize("tokenActionHud.ed4e.settings.showWeaponAmmoInfo.name"),
        hint: game.i18n.localize("tokenActionHud.ed4e.settings.showWeaponAmmoInfo.hint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: value => {updateFunc(value);}
    });
}