import axios from "axios";
import {URL_API} from "../config.ts";


interface ConfigAlert {
    telegram_chat_id: string
    container_stopped: {
        condition: boolean;
    };
    dos: {
        condition: boolean;
    };
    ram: {
        condition: boolean;
        percent: string;
    };
    cpu: {
        condition: boolean;
        percent: string;
    };
    storage: {
        condition: boolean;
        percent: string;
    };

}

const defaultConfigAlert: ConfigAlert = {
    "telegram_chat_id": "1",
    "container_stopped": {
        "condition": false,
    },
    "dos": {
        "condition": false,
    },
    "ram": {
        "condition": false,
        "percent": "0"
    },
    "cpu": {
        "condition": false,
        "percent": "0"
    },
    "storage": {
        "condition": false,
        "percent": "0"
    },
}

let oldConfigAlert = defaultConfigAlert
let newConfigAlert = {}

export async function getConfigAlert() {

    try {
        const response = await axios.get(URL_API + "/notifications/get-settings");
        newConfigAlert = JSON.parse(JSON.stringify(response.data))
        oldConfigAlert = JSON.parse(JSON.stringify(response.data))
    } catch (err) {
        newConfigAlert = JSON.parse(JSON.stringify(defaultConfigAlert));
        oldConfigAlert = JSON.parse(JSON.stringify(defaultConfigAlert));
    }
    return oldConfigAlert;
}

export async function saveConfigAlert() {
    try {
        await axios.post(URL_API + "/notifications/save-settings", newConfigAlert, {
            headers: {
                'Content-Type': 'application/json',  // Указываем, что тело запроса - это JSON
            },
        });
        oldConfigAlert = JSON.parse(JSON.stringify(newConfigAlert))
        return true;
    } catch (error) {
        return false;
    }

}

export async function updateTelegram(newTelegram: string) {

    if (oldConfigAlert.telegram_chat_id == newTelegram) {
        return true;
    }

    try {
        await axios.get(`${URL_API}/notifications/confirm-chat-id?chat_id=${encodeURIComponent(newTelegram)}`)
            .then(response => console.log(response.data))
            .catch(error => console.error('Ошибка:', error));

        oldConfigAlert["telegram_chat_id"] = newTelegram;
        return true;
    } catch (error) {
        return false;
    }

}

export function updateAlerts(info: {}) {
    newConfigAlert = info

}

export function getTelegram(): string {
    return oldConfigAlert.telegram_chat_id
}

export function getAlerts() {
    return oldConfigAlert;
}

export async function testMessage() {
    try {
        await axios.get(URL_API + "/notifications/test-message");
        return true
    } catch (err) {
        return false
    }
}
