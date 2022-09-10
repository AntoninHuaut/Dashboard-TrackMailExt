const BASE_URL = "https://dashapi.antoninhuaut.fr";
const API_URL = `${BASE_URL}/api/v1`;
const TRACKMAIL_URL = `${API_URL}/app/trackmail`;

function createMail(trackmailToken, email_from, email_to, subject) {
    return fetch(TRACKMAIL_URL + "/mail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + trackmailToken,
        },
        body: JSON.stringify({
            email_from,
            email_to,
            subject,
        })
    });
}

function getTrackMailSettings(trackmailToken) {
    return fetch(TRACKMAIL_URL + "/settings", {
        method: "GET",
        headers: {
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
            log_email_from,
            log_email_to,
            log_subject,
        })
    });
}

function deleteSelfPixelTrack(trackmailToken, emailId) {
    return fetch(TRACKMAIL_URL + "/selfPixelTrack/" + emailId, {
        method: "DELETE",
        headers: {
            "Authorization": 'Bearer ' + trackmailToken,
        }
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