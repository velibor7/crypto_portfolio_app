import bcolors as b
import json
import datetime

from requests import Request, Session
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects

from models import *

url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'

parameters = {
  'start':'1',
  'limit':'199',
  'convert':'USD'
}

headers = {
  'Accepts': 'application/json',
  'X-CMC_PRO_API_KEY': '1c180187-7a10-42e7-b0c6-a946473c3e8d',
}

session = Session()
session.headers.update(headers)


def get_data_from_cmp():
    try:
        response = session.get(url, params=parameters)
        data = json.loads(response.text)
        json_file = open("data.json", "w")
        json_file.write(json.dumps(data))
        json_file.close()
    except (ConnectionError, Timeout, TooManyRedirects) as e:
        print(e)

def calculate_portfolio_value(user_id):
    f = open('data.json')
    data = json.load(f)
    f.close()

    total_value = 0

    investments_list = Investment.get_all_investments_by_user(user_id)

    for my_investment in investments_list:
        for instance in data['data']:
            if my_investment['short_name_handle'] == instance['symbol']:
                # print(f'{my_investment["short_name_handle"]} amount:{my_investment["amount"]} old_price:{my_investment["price"]} new_price:{instance["quote"]["USD"]["price"]}')
                total_value += my_investment['amount'] * instance['quote']['USD']['price']

    PortfolioValue.add_portfolio_value(user_id, total_value)
    # print(total_value)

def calculate_all_portfolio_values():
    get_data_from_cmp() # dobijamo data fajl

    users_list = User.get_all() # dobijamo usere

    for user in users_list:
        calculate_portfolio_value(user['id'])

    print("\033[1m" + f"{b.OK}PORTFOLIO VALUES UPDATED - {datetime.now()}{b.END}" + "\033[0m")

if __name__ == '__main__':
    pass
    # calculate_all_portfolio_values()