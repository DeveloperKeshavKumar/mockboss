import Image from 'next/image'
import { redirect } from 'next/navigation'

import Agent from '@/components/Agent'
import { getRandomInterviewCover } from '@/lib/utils'

import {
    getFeedbackByInterviewId,
    getInterviewById,
} from '@/lib/actions/general.action'
import { getCurrentUser } from '@/lib/actions/auth.action'
import DisplayTechIcons from '@/components/DisplayTechIcons'

const InterviewDetails = async ({ params }: RouteParams) => {
    const { id } = await params

    const user = await getCurrentUser()

    const interview = await getInterviewById(id)
    if (!interview) redirect('/')

    const feedback = await getFeedbackByInterviewId({
        interviewId: id,
        userId: user?.id!,
    })

    return (
        <>
            <div className='w-full flex flex-row gap-4 justify-between'>
                <div className='w-full flex flex-row gap-4 items-center justify-between max-sm:flex-col'>
                    <div className='flex flex-row gap-4 items-center '>
                        <Image
                            src={getRandomInterviewCover()}
                            alt='cover-image'
                            width={60}
                            height={60}
                            className='rounded-full object-cover size-[100] outline outline-amber-50'
                        />
                        <h3 className='capitalize'>{interview.role} Interview</h3>
                    </div>

                    <div className='flex flex-row items-start justify-center gap-6'>
                        <DisplayTechIcons techStack={interview.techstack} />
                        <p className='bg-dark-200 px-4 py-2 rounded-lg h-fit'>
                            {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)}
                        </p>
                    </div>

                </div>

            </div>

            <Agent
                userName={user?.name || 'User'}
                userId={user?.id}
                interviewId={id}
                type='interview'
                questions={interview.questions}
                feedbackId={feedback?.id}
            />
        </>
    )
}

export default InterviewDetails