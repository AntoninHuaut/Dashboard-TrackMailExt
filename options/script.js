const state = {
    toast: null
}

const toastId = 'toastDiv';

function saveToken(tokenValue) {
    browser.storage.sync.set({
        token: tokenValue
    });
}

async function getToken() {
    const syncItem = await browser.storage.sync.get('token');
    return syncItem.token ?? '';
}

document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById('submitBtn');
    const tokenInput = document.getElementById('tokenInput');
    if (!submitBtn || !tokenInput) return console;

    getToken().then(token => tokenInput.value = token);

    submitBtn.addEventListener('click', async () => {
        try {
            submitBtn.disabled = true;

            const res = await getTrackMailSettings(tokenInput.value);
            if (!res.ok) throw new Error();
            const json = await res.json();

            // TODO settings

            saveToken(tokenInput.value);
            showToast(state, toastId, 'success', "Your token has been saved!");
        } catch (err) {
            showToast(state, toastId, 'danger', "Can't verify your token.");
        } finally {
            submitBtn.disabled = false;
        }
    });
});