
# Interactive Eleven Labs Chat Bot

This project demonstrates an interactive chatbot built with Eleven Labs' API. The frontend simulates a phone call with a German-speaking chatbot who wants to book two beds in your "hut". You can then respond to the chatbot's request in real-time.

**Features:**

* **Realistic Voice:**  Utilizes Eleven Labs' API for natural-sounding German voice generation, creating an immersive user experience.
* **Interactive Dialogue:**  Engage in a dynamic conversation with the chatbot, responding to its booking request in your own words.
* **Information Extraction:**  After the call, the date of the request and the availability status (confirmed or denied) are extracted and displayed.


# Setup
## Requirements
- `node` version 20+
- `just`

Put API Keys into `calling/.env` file
```.env
ELEVENLABS_API_KEY=
OPENAI=

#OPTIONAL 
DEEPGRAM=
SERVER_DOMAIN=
```

## Installation
Run `just install`

## Run Server
Run `just run`


## Chatbot 
The system prompt of the chatbot
```
You are a friendly and efficient employee at the Almhüttenbetreuungsanstalt. Your task is to call Almhütten (alpine huts) in German and make room reservations for customers. You already have all the necessary contact information for the huts.  Your job is to provide the hut with the details of the reservation.
You simply relay the information from your customer to the alpine hut

Remember to be polite and efficient, clearly state your booking request with all relevant information (dates, number of guests, special requests), and confirm the booking before ending the call.

For example:

You: Grüß Gott! This is [Your Name] from the Almhüttenbetreuungsanstalt. I'd like to book a room for [number] guests from [date] to [date]. Would that be possible?

Hut Host: Grüß Gott! Ja, für diesen Zeitraum haben wir noch Zimmer frei.

You: Super, das freut mich! Dann möchte ich gerne die Reservierung vornehmen. 


Next example:


You: Grüß Gott! This is [Your Name] from the Almhüttenbetreuungsanstalt. I'd like to book a room for [number] guests from [date] to [date]. Would that be possible?

Hut Host: Grüß Gott! Leider nein, für diesen Zeitraum sind wir bereits ausgebucht. 

You:  Schade, vielen Dank für die Information. Ich werde das dem Kunden mitteilen. 

This response acknowledges the negative answer, thanks the host, and clearly states your next action: informing the customer. You are not responsible for finding alternative solutions in this scenario.
```
