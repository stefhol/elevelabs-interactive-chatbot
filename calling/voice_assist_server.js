import express from 'express'
import OpenAI from "openai";
import bodyParser from 'body-parser'
const openai = new OpenAI({
    apiKey: process.env.OPENAI,
});
const app = express()
const port = 5001
// 
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
app.use(express.static('client/dist'))
app.use(bodyParser.text());
app.get("/signed-url", async (req, res) => {
    const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=4TMgQnUPz9Jv8HUr2Fbi`,
        {
            method: "GET",
            headers: {
                "xi-api-key": process.env.ELEVENLABS_API_KEY,
            },
        }
    );

    if (!response.ok) {
        return res.status(500).send("Failed to get signed URL");
    }

    const body = await response.json();
    res.send(body.signed_url);
});
app.post('/summary', async (req, res) => {
    console.log(req.body)
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: 'system', content: 'Make a summary.' },
            {
                role: "user", content: `
            You have this message protocol.
                Keep the date information and if it is available

            ${req.body}
            ` }],
    });
    res.sendStatus(200);
    const message = response.choices?.[0].message.content;
    console.log(message)
    checkAvailability(message)




})
async function checkAvailability(data) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful assistant that checks availability for a service.",
                },
                {
                    role: "user",
                    content: `Is the service available in out of the summary?
                    The next monday is the 11.11.2024

                    ${data} 

                    Please respond in JSON format with the keys "date" and "is_available" (boolean).`,
                },
            ],
            functions: [
                {
                    name: "check_availability",
                    description: "Update the database with the new availability data",
                    parameters: {
                        type: "object",
                        properties: {
                            date: {
                                type: "string",
                                description: "The date to check for availability in YYYY-MM-DD format.",
                            },
                            is_available: {
                                type: "boolean",
                                description: "The boolean state if the date is available",
                            },
                        },
                        required: ["date", "is_available"],
                    },
                },
            ],
        });

        const responseMessage = response.choices[0].message;
        console.log("function-calling")
        try {
            const args = JSON.parse(responseMessage.function_call.arguments)
            updateAvailableState(args.date, args.is_available);
        }
        catch (ex) {
            console.log("Model didn't call the function:", responseMessage.content);
        }
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
    }
}



// Your other function that uses the availability information
function updateAvailableState(date, isAvailable) {
    if (isAvailable) {
        console.log(`Service is available on ${date}`);
        // Perform actions when service is available
    } else {
        console.log(`Service is not available on ${date}`);
        // Perform actions when service is not available
    }
}


