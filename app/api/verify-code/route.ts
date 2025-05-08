import { NextResponse, NextRequest } from "next/server";
import client from "@/db/index"

export async function POST(req: NextRequest) {
    const { username, code } = await req.json()
    try {
        const user = await client.user.findFirst({ where: { username, isVerified: false } });
        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'No such user'
            }, { status: 400 })
        }
        const isCodeCorrect = user.verifyCode === code;
        const isCodeValid = new Date(user.verifyCodeExpiry) > new Date();
        if (isCodeCorrect && isCodeValid) {
            await client.user.update({ where: { username }, data: { isVerified: true } })
            return NextResponse.json({
                success: true,
                message: 'code verified successfully'
            }, { status: 200 })
        } else if (!isCodeCorrect) {
            return NextResponse.json({
                success: false,
                message: 'Incorrect code'
            }, { status: 400 })
        }
        else {
            return NextResponse.json({
                success: false,
                message: 'code expired pls signup again to get new code'
            }, { status: 400 })
        }
    } catch (error) {
        console.log('Error verifying code', error);
        return NextResponse.json({
            success: false,
            message: 'Error verifying code'
        }, { status: 500 })

    }
}