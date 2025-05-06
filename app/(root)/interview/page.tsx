import Agent from '@/components/Agent'
import InterviewGenerator from '@/components/InterviewGenerator'
import { getCurrentUser } from '@/lib/actions/auth.action'
import React from 'react'

const page = async () => {
    const user = await getCurrentUser()
    console.log(user)
    return (
        <>
            <h3>Interview Generation</h3>
            {/* <Agent userName={user?.name || 'User'} userId={user?.id} type='generate' /> */}
            <InterviewGenerator userId={user?.id} />
        </ >
    )
}

export default page