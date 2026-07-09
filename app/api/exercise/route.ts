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

  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '0')

  const where: any = { userId: user.id }
  if (days > 0) {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    where.date = { gte: cutoff }
  }

  const records = await prisma.exerciseRecord.findMany({
    where,
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
  const record = await prisma.exerciseRecord.create({
    data: {
      userId: user.id,
      type: data.type,
      duration: data.duration,
      calories: data.calories,
      note: data.note,
      date: new Date(data.date),
    },
  })

  return NextResponse.json(record)
}
