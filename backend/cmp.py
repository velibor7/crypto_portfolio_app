import json
import datetime
import bcolors as b
import config
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
    '''Gets data from coin market cap and save it to the data.json'''
    try:
        response = session.get(url, params=parameters)
        data = json.loads(response.text)
        json_file = open("data.json", "w")
        json_file.write(json.dumps(data))
        json_file.close()
    except (ConnectionError, Timeout, TooManyRedirects) as e:
        print(e)

def calculate_portfolio_value(user_id):
    '''Updates investments of a user and makes a new portfoliovalue entry in the db'''
    f = open('data.json')
    data = json.load(f)
    f.close()

    total_value = 0
    investments_list = Investment.get_all_by_user_id(user_id)

    # ovo ovde postoji bolji nacin da se napise
    for my_investment in investments_list:
        for instance in data['data']:
            if my_investment['short_name_handle'] == instance['symbol']:
                # update my_investments price
                Investment.update_investment(
                    my_investment['id'], 
                    my_investment['name'], 
                    my_investment['short_name_handle'],
                    instance['quote']['USD']['price'],
                    my_investment['amount'])
                total_value += my_investment['amount'] * instance['quote']['USD']['price']

    PortfolioValue.add_portfolio_value(user_id, total_value)
    config.updated_flag = 1

def calculate_all_portfolio_values():
    get_data_from_cmp() # dobijamo data fajl

    users_list = User.get_all() # dobijamo usere

    for user in users_list:
        calculate_portfolio_value(user['id'])

    print("\033[1m" + f"{b.OK}PORTFOLIO VALUES UPDATED - {datetime.now()}{b.END}" + "\033[0m")
