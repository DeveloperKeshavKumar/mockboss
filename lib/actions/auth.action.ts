'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get()
        if (userRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please sign instead.',
            }
        }

        await db.collection('users').doc(uid).set({ name, email })
        return {
            success: true,
            message: 'User created successfully. Please sign in now.'
        }
    } catch (error: any) {
        console.error('Error creating user', error)

        if (error.code === 'auth/email-already-exists') {
            return {
                success: false,
                messsage: 'This email is already in use',

            }
        }

        return {
            sucess: false,
            message: 'Error creating user',
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies()
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    })
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email)
        if (!userRecord) {
            return {
                success: false,
                message: 'User not found. Please sign up instead.',
            }
        }

        await setSessionCookie(idToken)
        return {
            success: true,
            message: 'Signed in successfully',
        }
    } catch (error: any) {
        console.error('Error signing in', error)

        if (error.code === 'auth/user-not-found') {
            return {
                success: false,
                message: 'User not found. Please sign up instead.',
            }
        }

        return {
            success: false,
            message: 'Error signing in',
        }
    }
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')?.value

    if (!sessionCookie) {
        return null
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get()

        if (!userRecord.exists) {
            return null
        }

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User
    } catch (error) {
        console.error('Error getting current user', error)
        return null
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser()
    return !!user
}