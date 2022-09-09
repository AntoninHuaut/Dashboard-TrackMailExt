const state = {
    toast: null
}

const toastId = 'toastDiv';

async function saveToken(tokenValue) {
    await browser.storage.sync.set({
        token: tokenValue
    });
}

async function getToken() {
    const syncItem = await browser.storage.sync.get('token');
    return syncItem.token ?? '';
}

async function isValidToken(tokenValue) {
    try {
        const res = await getTrackMailSettings(tokenValue);
        if (!res.ok) throw new Error();
        const responseBody = await res.json();

        return { success: true, responseBody };
    } catch (err) {
        return { success: false, error: err };
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById('submitBtn');
    const tokenInput = document.getElementById('tokenInput');
    if (!submitBtn || !tokenInput) return console;

    getToken().then(token => tokenInput.value = token);

    submitBtn.addEventListener('click', async () => {
        submitBtn.disabled = true;

        const { success, responseBody } = await isValidToken(tokenInput.value);
        // TODO use response body to show user what is the current settings

        if (success) {
            saveToken(tokenInput.value);
            showToast(state, toastId, 'success', "Your token has been saved!");
        } else {
            showToast(state, toastId, 'danger', "Can't verify your token.");
        }

        submitBtn.disabled = false;
    });
});