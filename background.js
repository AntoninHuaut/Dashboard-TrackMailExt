async function sendCreateMail(trackmailToken, email_from, email_to, subject) {
    const { responseBody, error } = await safeFetch(() => createMail(trackmailToken, email_from, email_to, subject));
    if (error) throw error;
    if (!responseBody?.__paths?.pixel || !responseBody?.__paths?.link) throw new Error("Invalid response");

    return responseBody.__paths;
}

browser.compose.onBeforeSend.addListener(async (tab, details) => {
    const from = details.from;
    const to = details.to;
    const subject = details.subject;

    // Only HTML
    if (!details.isPlainText) {
        const addTrackerMailResponse = await blockingPopup("addTrackerMail");
        if (addTrackerMailResponse === "cancel") return;

        try {
            const token = await getToken();
            const paths = await sendCreateMail(token, from, to, subject);

            const document = new DOMParser().parseFromString(details.body, "text/html");

            const trackerImg = document.createElement("img");
            trackerImg.src = `${BASE_URL}${paths.pixel}`;
            trackerImg.height = '0';
            trackerImg.width = '0';

            [...document.links].forEach(link => {
                link.href = `${BASE_URL}${paths.link}/${encodeURIComponent(link.href)}`;
            });

            document.body.appendChild(trackerImg);

            const html = new XMLSerializer().serializeToString(document);

            return {
                details: { ...details, body: html, deliveryFormat: "html" }
            }
        } catch (err) {
            console.error(err);
            const errorCreateMailResponse = await blockingPopup("errorCreateMail");

            return {
                cancel: errorCreateMailResponse !== 'ok'
            }
        }
    }
});

browser.messageDisplay.onMessageDisplayed.addListener(async (tab, message) => {
    const details = await browser.messages.getFull(message.id);
    // TODO: check if has tracker, get tracker id, show results
});