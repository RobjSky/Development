import requests

apiKey = "a367b64b"
movieTitle = input("Filmtitel: ")

response = requests.get("http://www.omdbapi.com/?apikey=" + apiKey + "&t=" + movieTitle)
results = response.json()
print(results)

input("ENTER to exit")