import requests
import json
import allure

# ENVIRONMENT
email = "test@hezzl.com"
password = 123456
base_url = "https://api-prod.hezzl.com/"
campaign_id = 145602
access_token = str
time_zone = str


@allure.title('Метод Init')
def test_init():
    url = f"{base_url}gw/v1/game/{campaign_id}/init"
    body = json.dumps({
        "Content-Type": "application/json"
    })
    try:
        with allure.step("Отправка запроса"):
            response = requests.post(url, data=body)
        with allure.step("Проверка, что статус ответа равен 200"):
            assert response.status_code == 200
        with allure.step("Запись параметра 'time' в переменную 'time_zone'"):
            global time_zone
            time_zone = response.json()["time"]
        with allure.step("Проверка наличия параметра 'data' в ответе"):
            assert "data" in response.json()
        with allure.step(
                "Проверка наличия параметра 'auth' в 'data' в ответе"):
            assert "auth" in response.json()["data"]

    except Exception as error:
        print("Error:", error)


test_init()


@allure.title('Метод CheckLogin')
def test_check_login():
    url = f"{base_url}auth/v1/game/{campaign_id}/check-login"
    body = json.dumps({
        "login": email
    })
    try:
        with allure.step("Отправка запроса"):
            response = requests.post(url, data=body)
        with allure.step("Проверка, что статус ответа равен 200"):
            assert response.status_code == 200
        with allure.step("Запись параметра 'access_token' в переменную"):
            global access_token
            access_token = response.json()['accessToken']
        with allure.step("Запись времени ответа от сервера в переменную"):
            server_response_speed = int(
                str(response.elapsed.microseconds)[0:3]
            )
        with allure.step("Проверка, что время ответа от сервера менее 200ms"):
            assert server_response_speed < 200

    except Exception as error:
        print("Error:", error)


test_check_login()


def test_confirm_code():
    url = f"{base_url}auth/v1/game/{campaign_id}/confirm-code"
    body = json.dumps({
        "code": f"{password}"
    })

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"apiKey {access_token}"
    }
    try:
        with allure.step("Отправка запроса"):
            response = requests.post(url, headers=headers, data=body)
        with allure.step("Проверка, что статус ответа равен 200"):
            assert response.status_code == 200
        with allure.step("Запись времени ответа от сервера в переменную"):
            server_response_speed = int(
                str(response.elapsed.microseconds)[0:3]
            )
        with allure.step("Проверка, что время ответа от сервера менее 200ms"):
            assert server_response_speed < 200

    except Exception as error:
        print("Error:", error)


test_confirm_code()
