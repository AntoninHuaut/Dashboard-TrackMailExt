browser.compose.onBeforeSend.addListener((tab, details) => {
    console.log(tab, details, details.isPlainText);

    const from = details.from;
    const to = details.to;
    const subject = details.subject;

    // Only HTML

    return; // TODO

    if (!details.isPlainText) {
        const document = new DOMParser().parseFromString(details.body, "text/html");

        // TODO create email API
        // TODO add pixel tracker
        // TODO add link tracker
        const trackerImg = document.createElement("img");
        trackerImg.src = "https://i.imgur.com/400hIZi.png";
        trackerImg.alt = 'c bo';
        trackerImg.height = '700';
        trackerImg.width = '700';

        document.body.appendChild(trackerImg);

        const test2 = document.createElement("p");
        test2.textContent = "This is a second test";
        document.body.appendChild(test2);

        const html = new XMLSerializer().serializeToString(document);

        return {
            details: { ...details, body: html, deliveryFormat: "html" }
        }
    }
});

browser.messageDisplay.onMessageDisplayed.addListener((tab, message) => {
    // Get the existing message.
    browser.messages.getFull(message.id).then((details) => {
        // TODO: check if has tracker, get tracker id, show results
    });
});