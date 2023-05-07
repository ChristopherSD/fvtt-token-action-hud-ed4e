import { MODULE } from "./constants.js";

export function register(updateFunc) {
    game.settings.register(MODULE.ID, 'showGeneral', {
        name: "Show General",
        hint: "Display category for general rolls like Attributes, Half-Magic or Recovery",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: value => {updateFunc(value);}
    });

    game.settings.register(MODULE.ID, 'showFavorites', {
        name: "Show Favorites",
        hint: "Display category for items marked as favorites",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: value => {updateFunc(value);}
    });

    game.settings.register(MODULE.ID, 'showTalents', {
        name: "Show Talents",
        hint: "Display category for all talents",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: value => {updateFunc(value);}
    });

    game.settings.register(MODULE.ID, 'showSkills', {
        name: "Show Skills",
        hint: "Display category for all skills",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: value => {updateFunc(value);}
    });

    game.settings.register(MODULE.ID, 'showMatrices', {
        name: "Show Matrices",
        hint: "Display category for all spell matrices",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: value => {updateFunc(value);}
    });

    game.settings.register(MODULE.ID, 'showInventory', {
        name: "Show Inventory",
        hint: "Display category for weapons and equipment",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: value => {updateFunc(value);}
    });

    game.settings.register(MODULE.ID, 'showStatusToggle', {
        name: "Show Status Toggle",
        hint: "Display category for toggling system use and conditions",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: value => {updateFunc(value);}
    });

    game.settings.register(MODULE.ID, 'showCombat', {
        name: "Show Combat",
        hint: "Display category for combat (Weapons, Matrices, Favorites, etc.",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: value => {updateFunc(value);}
    });
}