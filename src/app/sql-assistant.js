import { Together } from "together-ai";

const together = new Together({
  apiKey: "cf1dd8aa9641b9278d212c4e1e7c2b645c2629fcdbd63507c3a74e7875f90e63", // store your key securely in .env.local
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Invalid prompt" });
  }

  try {
    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that only writes SQL queries based on a given database schema.\n\n" +
            `Schema:\n${dummy_schema_description}\n\n` +
            "Rules:\n" +
            "- If the user input is vague or irrelevant (like 'next', 'thanks'), reply: 'No SQL available for this request.'\n" +
            "- Otherwise, generate a valid SQL query using only the fields from the schema above.\n" +
            "- Output only the SQL code followed by exactly 2 lines explaining what it does.\n" +
            "- Do not use SELECT *.\n",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const assistantMessage = response.choices[0].message.content;

    res.status(200).json({ response: assistantMessage });
  } catch (error) {
    res.status(500).json({ response: "Error contacting SQL assistant API." });
  }
}

const dummy_schema_description = `
Table: users
- id (integer, primary key)
- name (varchar)
- email (varchar)
- created_at (timestamp)

Table: orders
- id (integer, primary key)
- user_id (integer, foreign key to users.id)
- product (varchar)
- amount (decimal)
- order_date (date)
`;
