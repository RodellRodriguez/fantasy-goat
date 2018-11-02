import json
from time import time

from requests_oauthlib import OAuth2Session


class Authentication:

	def __init__(self):
		with open('secrets.json') as f:
			secret_keys = json.load(f)
		self.client_id = secret_keys['client_id']
		self.client_secret = secret_keys['client_secret']
		self.token = secret_keys['token_payload']

		self.redirect_uri = 'oob'
		self.yahoo_oauth_url = 'https://api.login.yahoo.com/oauth2/request_auth'
		self.yahoo_oauth_get_token_url = 'https://api.login.yahoo.com/oauth2/get_token'
		self.yahoo = None
		self.authorization_url = None
		self.state = None
		
	# This method was only necessary to get a token for the first time.
	def authenticate(self):
		self.yahoo = OAuth2Session(self.client_id, redirect_uri=self.redirect_uri)
		self.authorization_url, self.state = self.yahoo.authorization_url(self.yahoo_oauth_url, 
												access_type='offline',prompt='select_account')

		print("Please go to this website to get the authentication code: {}".format(self.authorization_url))
		auth_code = input("Type the exact code given from the website. Then press enter.")
		self.token = self.yahoo.fetch_token(token_url=self.yahoo_oauth_get_token_url, 
			code=auth_code, client_secret=self.client_secret)

	def automatic_refresh_access_token(self):
		self.force_access_token_expiration()
		extra = {
			'client_id': self.client_id,
			'client_secret': self.client_secret,
		}

		self.yahoo = OAuth2Session(self.client_id,
							   token=self.token,
							   auto_refresh_kwargs=extra,
							   auto_refresh_url=self.yahoo_oauth_get_token_url,
							   token_updater=self.token_updater)

	# Forces access token to expire in order to always refresh when interacting with API
	def force_access_token_expiration(self):
		self.token['expires_at'] = time() - 10

	def token_updater(self, token):
			self.token = token

def main():
	test = Authentication()
	test.automatic_refresh_access_token()
	
	headers = {"Content-type": "application/json"}
	r = test.yahoo.get('https://fantasysports.yahooapis.com/fantasy/v2/game/nba', headers=headers)
	from pprint import pprint
	pprint(r.content)
	pprint(r)


if __name__ == "__main__":
	main()