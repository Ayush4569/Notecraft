import { Response, Request } from "express";
import Groq from "groq-sdk"
import { prisma } from "../db/db";
import { promptSchema } from "../schemas/index";
const groq = new Groq({
    apiKey: process.env.GROK_API_KEY
})
const formatTextWithAi = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return
    }
    const user = await prisma.user.findFirst({
        where: {
            id: req.user.id as string,
        },
        select: {
            freeAiTrials: true,
            isPro: true,
            subscription: {
                select: {
                    aiCreditsLeft: true,
                }
            }
        }
    })
    if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
    }

    if (user.isPro) {
        if (user.isPro && (user.subscription?.aiCreditsLeft ?? 0) <= 0) {
            res.status(403).json({ success: false, message: "You have no AI credits left" });
            return
        }
    }
    else {
        if (user.freeAiTrials <= 0) {
            res.status(403).json({ success: false, message: "You have no free AI trials left" });
            return
        }
    }
    const body = req.body

    const parsed = promptSchema.safeParse(body);
    if (!parsed.success) {
        res.status(400).json({ success: false, message: "Invalid prompt" });
        return;
    }
    const { selectedText } = parsed.data;
    if (selectedText.length > 1000) {
        res.status(400).json({ success: false, message: "Selected text is too long" });
        return;
    }
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
        if (user.isPro) {
            await prisma.subscription.update({
                where: {
                    userId: req.user.id,
                    aiCreditsLeft: {
                        gt: 0
                    }
                },
                data: {
                    aiCreditsLeft: {
                        decrement: 1
                    }
                }
            })
        } else {
            await prisma.user.update({
                where: {
                    id: req.user.id,
                    freeAiTrials: {
                        gt: 0
                    }
                },
                data: {
                    freeAiTrials: {
                        decrement: 1
                    }
                }
            })
        }
        res.status(200).json({ success: true, message: formattedText });
        return
    } catch (error) {
        console.log('Error generating ai response', error);
        res.status(500).json({
            success: false,
            message: 'Error formatting text'
        })
        return;
    }
}

export {
    formatTextWithAi
}