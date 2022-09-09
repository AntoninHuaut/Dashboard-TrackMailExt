const BASE_URL = "https://dashapi.antoninhuaut.fr/api/v1";
const TRACKMAIL_URL = `${BASE_URL}/app/trackmail`;

function getTrackMailSettings(trackmailToken) {
    return fetch(TRACKMAIL_URL + "/settings", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + trackmailToken,
        }
    });
}

function updateTrackMailSettings(trackmailToken, log_email_from, log_email_to, log_subject) {
    return fetch(TRACKMAIL_URL + "/settings", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + trackmailToken,
        },
        body: JSON.stringify({
            log_email_from: log_email_from,
            log_email_to: log_email_to,
            log_subject: log_subject,
        })
    });
}

async function safeFetch(requestFetch) {
    try {
        const res = await requestFetch();
        if (!res.ok) throw new Error();
        const responseBody = await res.json();

        return { success: true, responseBody };
    } catch (err) {
        return { success: false, error: err };
    }
}