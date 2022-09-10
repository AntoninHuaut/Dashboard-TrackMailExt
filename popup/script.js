document.addEventListener("DOMContentLoaded", onLoad);

async function notifyMode(event) {
    await messenger.runtime.sendMessage({ popupCloseMode: event.target.getAttribute("data") });
    const win = await messenger.windows.getCurrent();
    messenger.windows.remove(win.id);
}

async function onLoad() {
    [...document.querySelectorAll(".btn-track-submit")].forEach(item => item?.addEventListener("click", notifyMode));
}