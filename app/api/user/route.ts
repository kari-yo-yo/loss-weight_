import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.name) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { username: session.user.name },
    select: { id: true, username: true, targetWeight: true, height: true, createdAt: true },
  })

  return NextResponse.json(user)
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.name) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()
  const user = await prisma.user.update({
    where: { username: session.user.name },
    data: {
      targetWeight: data.targetWeight,
      height: data.height,
    },
  })

  return NextResponse.json(user)
}

export async function POST(request: NextRequest) {
  const data = await request.json()

  const existing = await prisma.user.findUnique({
    where: { username: data.username },
  })

  if (existing) {
    return NextResponse.json({ error: 'Username already exists' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(data.password, 10)
  const user = await prisma.user.create({
    data: {
      username: data.username,
      password: hashedPassword,
      targetWeight: data.targetWeight,
      height: data.height,
    },
  })

  return NextResponse.json({ id: user.id, username: user.username })
}
