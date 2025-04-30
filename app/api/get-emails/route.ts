import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const token = body.token

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  try {
    const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await gmailRes.json()

    if (!gmailRes.ok) {
      return NextResponse.json(data, { status: gmailRes.status })
    }

    const messages = data.messages || []
    
    const messageDetails = await Promise.all(
      messages.map(async (message: { id: string }) => {
        const messageRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const messageData = await messageRes.json()
        return messageData
      })
    )

    return NextResponse.json(messageDetails)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
