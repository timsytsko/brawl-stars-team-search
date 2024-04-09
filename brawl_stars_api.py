import urllib
import requests

from brawl_stars_api_key import key

def validate_player_tag(tag):
    tag = urllib.parse.quote(tag)
    headers = {
        'Accept': 'application/json',
        'authorization': f'Bearer {key}'
    }

    response = requests.get(f'https://api.brawlstars.com/v1/players/{tag}/', headers=headers)
    if (response.status_code != 200):
        print(response.text)
    return response.status_code == 200

def get_stats_by_tag(tag):
    tag = urllib.parse.quote(tag)
    headers = {
        'Accept': 'application/json',
        'authorization': f'Bearer {key}'
    }

    response = requests.get(f'https://api.brawlstars.com/v1/players/{tag}/', headers=headers)
    if (response.status_code != 200):
        print(response.text)
    return response.json()
