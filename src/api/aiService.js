const OPENAI_KEY = "your-secret-key";

async function askAI(message, context = "") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant for SmartShop." },
                { role: "user", content: context + "\n\n" + message }
            ]
        })
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content;
}
