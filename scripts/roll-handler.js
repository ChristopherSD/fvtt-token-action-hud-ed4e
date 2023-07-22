export let RollHandler = null;

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    RollHandler = class RollHandler extends coreModule.api.RollHandler {
        /**
         * Handle Action Event
         * @override
         * @param {object} event
         * @param {string} encodedValue
         */
        async doHandleActionEvent (event, encodedValue) {
            console.log('TOKEN ACTION HUD: WE"RE HANDLING AN EVENT! IN THEORY... I MEAN... IT WORKS UP UNTIL HERE');
        }
    }
})