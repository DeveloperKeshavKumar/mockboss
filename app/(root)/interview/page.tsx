import Agent from '@/components/Agent'
import React from 'react'

const page = () => {
    return (
        <>
            <h3>Interview Generation</h3>
            <Agent username={"You"} userId="user123" type="generate" />
        </>
    )
}

export default page