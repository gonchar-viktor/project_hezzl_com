// КОД НА JS Я ПЕРЕНЁС С PYTHON !!!
// ВОЗМОЖНА НЕТОЧНОСТЬ.

const requests = require('requests');
const allure = require('allure');

const email = "test@hezzl.com";
const password = 123456;
const base_url = "https://api-prod.hezzl.com/";
const campaign_id = 145602;
let access_token;
let time_zone;

allure.title('Метод Init');
function test_init() {
    const url = `${base_url}gw/v1/game/${campaign_id}/init`;
    const body = JSON.stringify({
        "Content-Type": "application/json"
    });
    try {
        allure.step("Отправка запроса", () => {
            const response = requests.post(url, body);
        });
        allure.step("Проверка, что статус ответа равен 200", () => {
            assert(response.status_code === 200);
        });
        allure.step("Запись параметра 'time' в переменную 'time_zone'", () => {
            time_zone = response.json().time;
        });
        allure.step("Проверка наличия параметра 'data' в ответе", () => {
            assert("data" in response.json());
        });
        allure.step("Проверка наличия параметра 'auth' в 'data' в ответе", () => {
            assert("auth" in response.json().data);
        });
    } catch (error) {
        console.log("Error:", error);
    }
}
test_init();

allure.title('Метод CheckLogin');
function test_check_login() {
    const url = `${base_url}auth/v1/game/${campaign_id}/check-login`;
    const body = JSON.stringify({
        "login": email
    });
    try {
        allure.step("Отправка запроса", () => {
            const response = requests.post(url, body);
        });
        allure.step("Проверка, что статус ответа равен 200", () => {
            assert(response.status_code === 200);
        });
        allure.step("Запись параметра 'access_token' в переменную", () => {
            access_token = response.json().accessToken;
        });
        allure.step("Запись времени ответа от сервера в переменную", () => {
            const server_response_speed = parseInt(
                response.elapsed.microseconds.toString().slice(0, 3)
            );
        });
        allure.step("Проверка, что время ответа от сервера менее 200ms", () => {
            assert(server_response_speed < 200);
        });
    } catch (error) {
        console.log("Error:", error);
    }
}
test_check_login();

function test_confirm_code() {
    const url = `${base_url}auth/v1/game/${campaign_id}/confirm-code`;
    const body = JSON.stringify({
        "code": `${password}`
    });
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `apiKey ${access_token}`
    };
    try {
        allure.step("Отправка запроса", () => {
            const response = requests.post(url, headers, body);
        });
        allure.step("Проверка, что статус ответа равен 200", () => {
            assert(response.status_code === 200);
        });
        allure.step("Запись времени ответа от сервера в переменную", () => {
            const server_response_speed = parseInt(
                response.elapsed.microseconds.toString().slice(0, 3)
            );
        });
        allure.step("Проверка, что время ответа от сервера менее 200ms", () => {
            assert(server_response_speed < 200);
        });
    } catch (error) {
        console.log("Error:", error);
    }
}
test_confirm_code();

