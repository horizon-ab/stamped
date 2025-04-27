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

export async function verifyChallenge(image: string, challenge: string) { // temporarily, will change this for actual verification

    // const base64Image = image;

    // const contents = [
    // {
    //     inlineData: {
    //     mimeType: "image/heic",
    //     data: base64Image,
    //     },
    // },
    // { text: "If the image vaguely in any way fulfills the challenge: " + challenge + " simply ONLY return true. If the image does not fulfill the challenge, ONLY return false. Do not return any other text or explanation."},
    // ];

    // const response = await ai.models.generateContent({
    //     model: "gemini-2.0-flash",
    //     contents: contents,
    // });


    // // return true if response.text is simply true, otherwise return false
    // if (typeof response.text === "string" && response.text.trim().length > 0) {
    //     if (response.text.trim() === "true") {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // } else {
    //     throw new Error("Failed to generate a valid stamp name.");
    // }

    return true; // TODO: if we decide to have verify challenge, we can use this function
}


export async function generateStampName(image: string, poi: string, challenge: string) {
    const base64Image = image;

    const contents = [
    {
        inlineData: {
        mimeType: "image/heic",
        data: base64Image,
        },
    },
    { text: "Point of Interest: " + poi + "\n"  + "Challenge: " + challenge + "\n\n" + "Create a funny quirky stamp name that reflects the image submission and the challenge it attempted to fulfill at the point of interest. Provide name only"},
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: contents,
    });

    if (typeof response.text === "string" && response.text.trim().length > 0) {
        return response.text.trim(); // Return the trimmed string
    } else {
        throw new Error("Failed to generate a valid stamp name.");
    }

    return challenge; // TODO: if we decide to have fun stamp names, we can use this function
}
