import { LOY_LOCAL_API } from "@/lib/urls"

/**
 * Generate voice from text using the generate-voice endpoint
 * @param text - The text to convert to voice
 * @param provider - The provider to use for voice generation (default: "openai")
 */
export async function generateVoice(text: string, provider: string = "openai"): Promise<void> {
    const response = await fetch(`${LOY_LOCAL_API}/messages/generate-voice`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            text,
            provider
        }),
    });
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    await audio.play();
}
