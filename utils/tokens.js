async function saveToken(tokenValue) {
    await browser.storage.sync.set({
        token: tokenValue
    });
}

async function getToken() {
    const syncItem = await browser.storage.sync.get('token');
    return syncItem.token ?? '';
}