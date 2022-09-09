const state = {
    toast: null
}

const toastId = 'toastDiv';

function getSettingsElements() {
    const settingsDiv = document.getElementById('settingsDiv');
    if (!settingsDiv) return;
    const emailFrom = settingsDiv.querySelector('#emailFrom');
    const emailTo = settingsDiv.querySelector('#emailTo');
    const subject = settingsDiv.querySelector('#subject');
    const submitSettings = settingsDiv.querySelector('#submitSettings');
    return { emailFrom, emailTo, subject, submitSettings, elements: [emailFrom, emailTo, subject, submitSettings] };
}

async function saveToken(tokenValue) {
    await browser.storage.sync.set({
        token: tokenValue
    });
}

async function getToken() {
    const syncItem = await browser.storage.sync.get('token');
    return syncItem.token ?? '';
}

async function fetchAndShowSettings(token) {
    if (!token) return showToast(state, toastId, 'danger', "Your token is not valid.");
    const { emailFrom, emailTo, subject } = getSettingsElements();
    if (!emailFrom || !emailTo || !subject) return;

    const { success, responseBody } = await safeFetch(() => getTrackMailSettings(token));
    if (!success) return showToast(state, toastId, 'danger', "Can't get your settings.");

    emailFrom.checked = responseBody.log_email_from;
    emailTo.checked = responseBody.log_email_to;
    subject.checked = responseBody.log_subject;
}

async function onUpdateToken(token) {
    const { elements } = getSettingsElements();
    if (!elements) return;

    const { success } = await safeFetch(() => getTrackMailSettings(token));
    elements.forEach(el => el.disabled = !success);
    if (!success) {
        elements.forEach(el => el.checked = false);
    }

    await fetchAndShowSettings(token);

    return success;
}

function onLoad() {
    const submitToken = document.getElementById('submitToken');
    const tokenInput = document.getElementById('tokenInput');
    const { submitSettings, elements } = getSettingsElements();
    if (!submitToken || !tokenInput || !submitSettings || !elements) return console;

    elements.forEach(el => el.disabled = true);

    getToken().then(async (token) => {
        tokenInput.value = token;
        await onUpdateToken(token);
    });

    submitToken.addEventListener('click', async () => {
        const token = tokenInput.value;
        submitToken.disabled = true;
        tokenInput.disabled = true;

        const success = await onUpdateToken(token);

        if (success) {
            saveToken(token);
            showToast(state, toastId, 'success', "Your token has been saved!");
        } else {
            showToast(state, toastId, 'danger', "Can't verify your token.");
        }

        submitToken.disabled = false;
        tokenInput.disabled = false;
    });

    submitSettings.addEventListener('click', async () => {
        const token = tokenInput.value;
        const { emailFrom, emailTo, subject, elements } = getSettingsElements();
        if (!elements || !emailFrom || !emailTo || !subject) return;

        elements.forEach(el => el.disabled = true);

        const success = await safeFetch(() => updateTrackMailSettings(token, emailFrom.checked, emailTo.checked, subject.checked));
        if (success) {
            await fetchAndShowSettings(token);
            showToast(state, toastId, 'success', "Your settings have been updated!");
        } else {
            showToast(state, toastId, 'danger', "Can't update your settings.");
        }

        elements.forEach(el => el.disabled = false);
    });

    document.getElementById('refreshSettings')?.addEventListener('click', () => getToken().then((token) => fetchAndShowSettings(token)));
}

document.addEventListener("DOMContentLoaded", onLoad);