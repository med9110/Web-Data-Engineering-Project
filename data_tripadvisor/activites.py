#blaaaaaaaaaaaan
import pandas as pd
from amadeus import ResponseError, Client

amadeus = Client(
    client_id='WvMpPNc1RByQOzym9K4lam1JGZgkv6NQ',
    client_secret='31G2EGKJDpu7ptAn'
)




if __name__ == '__main__':
    amadeus = Client(
    client_id='WvMpPNc1RByQOzym9K4lam1JGZgkv6NQ',
    client_secret='31G2EGKJDpu7ptAn'
)

    try:
        # this call is taken from the code examples
        activities = amadeus.shopping.activities.get(latitude=48.859224882383316, longitude=2.318601380075136)
        #activity_price = amadeus.shopping.activity('56777').get().result['data']['price']
        df = pd.DataFrame(activities.data)
    except ResponseError as error:
        print(error)
        exit(1)

    excerpt = df[['name', 'price']]
    print(excerpt.to_string())