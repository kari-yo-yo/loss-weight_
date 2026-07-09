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

  const recentWeights = await prisma.weightRecord.findMany({
    where: {
      userId: user.id,
      date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
    orderBy: { date: 'asc' },
  })

  const recentExercises = await prisma.exerciseRecord.findMany({
    where: {
      userId: user.id,
      date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
  })

  const recentDiets = await prisma.dietRecord.findMany({
    where: {
      userId: user.id,
      date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
  })

  const advice = []

  if (recentWeights.length >= 2) {
    const firstWeight = recentWeights[0].weight
    const lastWeight = recentWeights[recentWeights.length - 1].weight
    if (lastWeight > firstWeight + 0.5) {
      advice.push({
        type: 'warning',
        title: '体重略有上升',
        content: '最近体重呈上升趋势，建议增加太极站桩时长，饮食注意晚餐清淡，可配合红豆薏米粥调理。',
      })
    } else if (lastWeight < firstWeight - 0.5) {
      advice.push({
        type: 'success',
        title: '减肥进展顺利',
        content: '体重持续下降，您的努力正在见效！建议加入八段锦练习，增强气血运行，巩固成果。',
      })
    } else {
      advice.push({
        type: 'info',
        title: '体重保持稳定',
        content: '体重处于稳定状态。建议保持当前运动节奏，适当增加走路时长至每日6000步以上。',
      })
    }
  }

  const totalExercise = recentExercises.reduce((sum, ex) => sum + ex.duration, 0)
  if (totalExercise < 150) {
    advice.push({
      type: 'warning',
      title: '运动量偏少',
      content: `本周运动时长共${totalExercise}分钟，建议每周至少150分钟温和运动。可尝试每日太极20分钟 + 散步30分钟。`,
    })
  } else {
    advice.push({
      type: 'success',
      title: '运动量达标',
      content: `本周运动时长共${totalExercise}分钟，达标！保持这个节奏，身心将更加舒畅。`,
    })
  }

  const totalCalories = recentDiets.reduce((sum: number, d: any) => sum + d.calories, 0)
  const avgDailyCalories = recentDiets.length > 0 ? Math.round(totalCalories / 7) : 0
  if (avgDailyCalories > 2500) {
    advice.push({
      type: 'warning',
      title: '饮食热量偏高',
      content: '日均摄入热量偏高，建议晚餐以蔬菜为主，可用荷叶茶、决明子茶辅助调理。',
    })
  }

  return NextResponse.json(advice)
}
