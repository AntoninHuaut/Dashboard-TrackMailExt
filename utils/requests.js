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