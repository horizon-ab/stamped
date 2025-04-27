import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyD2KGjF77UQVOJ2l8h7YjvUxvAWrBTES90" });

export async function generateChallenge(poi: string){ // poi = point of interest
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: "generate a challenge for this " + poi + " that uniquely captures the essence of the location and is fun to do. The challenge should be a single sentence and should be something that can be done in 5 minutes or less. The challenge should be unique to this location and not something generic like 'take a picture'. return the challenge as a JSON object with a challenge name and a description of how to complete the challenge. The acceptance criteria in the description should be specific and measurable.",
    }); // fix this prompt later
    return response.text;
}

// // Example usage/test:
// generateChallenge("ucla").then((response) => {
//     console.log(response);
// }).catch((error) => {
//     console.error("Error generating challenge:", error);
// });

export async function verifyChallenge(image: Buffer, challenge: string) { // temporarily, will change this for actual verification
    // const base64Image = image.toString("base64");

    // const response = await ai.models.generateContent({
    //     model: "gemini-2.5-pro-preview-03-25",
    //     contents: "verify this image [" + base64Image + "] satisfies the requirements of the challenge: " + challenge,
    // });
    // return response.text;

    return true; // TODO: if we decide to have verify challenge, we can use this function
}