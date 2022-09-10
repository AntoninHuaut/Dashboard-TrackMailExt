async function blockingPopup(type) {
    async function popupClosePromise(popupId, defaultPopupCloseMode) {
        try {
            await messenger.windows.get(popupId);
        } catch (e) {
            return defaultPopupCloseMode;
        }

        return new Promise(resolve => {
            let popupCloseMode = defaultPopupCloseMode;

            function windowRemoveListener(closedId) {
                if (popupId == closedId) {
                    messenger.windows.onRemoved.removeListener(windowRemoveListener);
                    messenger.runtime.onMessage.removeListener(messageListener);
                    resolve(popupCloseMode);
                }
            }

            function messageListener(request, sender, sendResponse) {
                if (sender.tab.windowId == popupId && request && request.popupCloseMode) {
                    popupCloseMode = request.popupCloseMode;
                }
            }

            messenger.runtime.onMessage.addListener(messageListener);
            messenger.windows.onRemoved.addListener(windowRemoveListener);
        });
    }

    const window = await messenger.windows.create({
        url: `popup/${type}.html`,
        type: "popup",
        height: 200,
        width: 500
    });

    return await popupClosePromise(window.id, "cancel");
}
