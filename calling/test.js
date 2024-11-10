import { createClient } from "@deepgram/sdk";
import { Readable } from "node:stream";
import { ElevenLabsClient } from 'elevenlabs';
import speaker from "speaker";
import OpenAI from "openai";
const deepgram = createClient(process.env.DEEPGRAM);
const openai = new OpenAI({
    apiKey: process.env.OPENAI,
});

async function main() {
    console.time('runtime')
    const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "Du bist Anton von der Almhuettenbetreuungsanstalt, du rufst bei einer Alm Huette an. Du brauchst umbedingt ein Bett heute Abend und bist total verzweifelt. Franz geht nicht ans Telefon also sprich ihm aufs Band. Sei ueberzeugend. Antworte nur mit der Voicemail" }],
        stream: true,
    });
    let text = ''
    for await (const chunk of stream) {
        process.stdout.write(chunk.choices[0]?.delta?.content || "");
        text += chunk.choices[0]?.delta?.content || "";

    }
    await call(text)
    console.timeEnd('runtime')
}
main();


async function call(text) {
    const elevenlabs = new ElevenLabsClient();
    const voiceId = 'oWJ0GSUjVyxG4cvdzY5t';
    const outputFormat = 'ulaw_8000';
    const text1 = 'Grüß Gott Franz, hier ist Anton von der Almüttenbetreuungsanstalt. Wir bräuchten heute noch 10 Betten bei dir. Hättest du die zufällig frei? Du weißt ja, wir sind zuverlässige Gäste und zahlen pünktlich. Viele Grüße!';
    try {
        console.time('tts')
        // Generate speech audio
        const response = await elevenlabs.textToSpeech.convert(voiceId, {
            model_id: 'eleven_turbo_v2_5',
            output_format: "pcm_16000",
            //output_format: outputFormat,
            text,
        });
        console.timeEnd('tts')

        // Create a readable stream from the audio data
        const readableStream = Readable.from(response);

        // Pipe the audio stream to the speaker
        response.pipe(
            new speaker({
                channels: 2,
                bitDepth: 16,
                sampleRate: 8000,
            })
        );
    } catch (error) {
        console.error("Error generating speech:", error);
    }


}

