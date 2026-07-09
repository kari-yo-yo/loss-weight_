import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.name) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { username: session.user.name },
  })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const records = await prisma.dimensionRecord.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(records)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.name) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { username: session.user.name },
  })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const data = await request.json()
  const record = await prisma.dimensionRecord.create({
    data: {
      userId: user.id,
      waist: data.waist,
      hip: data.hip,
      chest: data.chest,
      arm: data.arm,
      thigh: data.thigh,
      date: new Date(data.date),
    },
  })

  return NextResponse.json(record)
}
