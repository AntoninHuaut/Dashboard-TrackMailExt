const EMAIL_ID_LENGTH = 128;

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
        if (addTrackerMailResponse === "cancel") return { cancel: true }
        else if (addTrackerMailResponse === 'no') return;

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
                cancel: errorCreateMailResponse === 'cancel'
            }
        }
    }
});



browser.messageDisplay.onMessageDisplayed.addListener(async (tab, message) => {
    function getHTMLParts(item) {
        const subParts = [];
        if (item.parts) {
            item.parts.forEach(part => {
                subParts.push(...getHTMLParts(part));
            });
        } else if (item.body && item.contentType === 'text/html') {
            subParts.push(item.body);
        }

        return subParts;
    }
    const details = await browser.messages.getFull(message.id);
    const parts = getHTMLParts(details);

    setTimeout(async () => {
        const trackMailEmailId = parts.map(part => {
            try {
                const document = new DOMParser().parseFromString(part, "text/html");
                const trackMailUrls = [...document.images].filter(image => image.src.startsWith(TRACKMAIL_URL)).map(image => image.src);
                return trackMailUrls.map(url => url.split('/').pop()).filter(id => id.length === EMAIL_ID_LENGTH)[0];
            } catch (parseErr) {
                console.error(parseErr);
                return false;
            }
        }).filter(item => item);

        if (trackMailEmailId.length == 0) return;

        try {
            const token = await getToken();
            await Promise.all(
                [...new Set(trackMailEmailId)] // Remove duplicate values
                    .map(async emailId => {
                        const response = await safeFetch(() => deleteSelfPixelTrack(token, emailId));
                        if (response.error) throw response.error;
                    })
            );
        } catch (err) {
            console.error(err);
            await blockingPopup("errorDeleteSelfTrack");
        }
    }, 100);
});