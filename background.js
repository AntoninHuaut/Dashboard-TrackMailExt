browser.compose.onBeforeSend.addListener(async (tab, details) => {
    console.log(tab, details, details.isPlainText);

    const from = details.from;
    const to = details.to;
    const subject = details.subject;

    // Only HTML
    if (!details.isPlainText) {
        const document = new DOMParser().parseFromString(details.body, "text/html");

        const test = document.createElement("p");
        test.textContent = "This is a test";
        document.body.appendChild(test);

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
        details.body = html;
        details.isPlainText = false;
        details.deliveryFormat = "both"; // html

        console.log(details)

        await browser.compose.setComposeDetails(tab.id, details);
        const newDetails = await browser.compose.getComposeDetails(tab.id);
        console.log("NEW", newDetails);
    }
});

browser.messageDisplay.onMessageDisplayed.addListener((tab, message) => {
    console.log(`Message displayed in tab ${tab.id}: ${message.subject}`);
});

browser.messageDisplay.onMessageDisplayed.addListener((tab, message) => {
    // Get the existing message.
    browser.messages.getFull(message.id).then((details) => {
        console.log(details);
    });
});