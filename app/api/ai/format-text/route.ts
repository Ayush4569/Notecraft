import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options"
import { promptSchema } from "@/schemas"
import Groq from "groq-sdk"
const groq = new Groq({
    apiKey: process.env.GROK_API_KEY
})
export async function POST(req: NextRequest, res: NextResponse) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return NextResponse.json({ success: false, message: "unauthorized" }, { status: 401 })
    }

    const body = await req.json();
    const parsed = promptSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ success: false, message: "Invalid prompt" }, { status: 400 });
    }
    const { selectedText } = parsed.data;
    try {
        const aiResponse = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: "system",
                    content: "You are a text editor AI. Only return the corrected version of the input text. Do not include any explanations, notes, or commentary. Return only the improved text and nothing else."
                }

                ,
                {
                    role: "user",
                    content: selectedText
                },
            ],
            temperature: 0.2
        })
        const formattedText = aiResponse.choices[0]?.message?.content || ""
        return NextResponse.json({ success: true, message: formattedText }, { status: 200 });

    } catch (error) {
        console.log('Error generating ai response', error);
        return NextResponse.json({
            success: false,
            message: 'Error formatting text'
        }, {
            status: 500
        })
    }
}