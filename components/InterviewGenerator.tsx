'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

const InterviewGenerator = ({ userId }: { userId: string }) => {
    // State management
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<InterviewGeneratorFormData>({
        type: '',
        role: '',
        level: '',
        techstack: '',
        amount: 5,
        userid: userId
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Navigation
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    // Form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/vapi/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to generate questions');
            }

            setIsSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error('Submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Styles
    const inputStyles = "w-full p-2 mt-1 border border-gray-300 rounded bg-transparent text-black focus:outline-none focus:ring-1 focus:ring-gray-500";
    const buttonStyles = "px-6 py-2 rounded border border-white text-white hover:bg-gray-900 transition";

    return (
        <div className="inset-0 flex items-center justify-center p-4 z-50">
            <div className="rounded-lg shadow-lg p-6 w-full max-w-3xl h-[26rem] flex flex-col">

                {isSuccess ? (
                    <div className="text-center flex flex-col justify-center h-full">
                        <p className="text-2xl mb-6 text-white">Interview questions generated successfully!</p>
                        <div className='flex gap-4 justify-center'>
                            <Button className='btn-secondary flex-1 max-w-xs'>
                                <Link href='/' className='flex w-full justify-center'>
                                    <p className='text-sm font-semibold text-primary-100 text-center'>
                                        Back to dashboard
                                    </p>
                                </Link>
                            </Button>
                            <button
                                onClick={() => {
                                    setIsSuccess(false);
                                    setStep(1);
                                    setFormData({
                                        type: '',
                                        role: '',
                                        level: '',
                                        techstack: '',
                                        amount: 5,
                                        userid: userId
                                    });
                                }}
                                className={'btn-primary flex-1 max-w-xs text-sm font-semibold text-primary-100 text-center'}
                            >
                                Generate Another
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex-1">
                        {/* Step 1: Interview Type and Role */}
                        {step === 1 && (
                            <div className="h-full flex flex-col">
                                <div className="mb-6">
                                    <label className="block text-lg font-medium text-white mb-2">
                                        Job Role
                                    </label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className={`${inputStyles} text-primary-100`}
                                        placeholder="e.g. Frontend Developer"
                                        required
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-lg font-medium text-white mb-2">
                                        Interview Type
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className={`${inputStyles} text-primary-100`}
                                        required
                                    >
                                        <option value="" className='bg-dark-100 text-gray-500'>Select type</option>
                                        <option value="technical" className='bg-dark-100 text-gray-500'>Technical</option>
                                        <option value="behavioral" className='bg-dark-100 text-gray-500'>Behavioral</option>
                                        <option value="mixed" className='bg-dark-100 text-gray-500'>Mixed</option>
                                    </select>
                                </div>

                                <div className="mt-auto flex justify-end">
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={!formData.type || !formData.role}
                                        className={`${buttonStyles} ${(!formData.type || !formData.role) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Experience Level and Question Count */}
                        {step === 2 && (
                            <div className="h-full flex flex-col">
                                <div className="mb-6">
                                    <label className="block text-lg font-medium text-white mb-2">
                                        Experience Level
                                    </label>
                                    <select
                                        name="level"
                                        value={formData.level}
                                        onChange={handleChange}
                                        className={`${inputStyles} text-primary-100`}
                                        required
                                    >
                                        <option value="" className='bg-dark-100 text-gray-500'>Select level</option>
                                        <option value="entry" className='bg-dark-100 text-gray-500'>Entry</option>
                                        <option value="mid" className='bg-dark-100 text-gray-500'>Mid-level</option>
                                        <option value="senior" className='bg-dark-100 text-gray-500'>Senior</option>
                                    </select>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-lg font-medium text-white mb-2">
                                        Number of Questions
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        min="1"
                                        max="20"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        className={`${inputStyles} text-primary-100`}
                                        required
                                    />
                                </div>

                                <div className="mt-auto flex justify-between">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className={buttonStyles}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={!formData.level}
                                        className={`${buttonStyles} ${!formData.level ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Tech Stack Selection */}
                        {step === 3 && (
                            <div className="h-full flex flex-col">
                                <div className="mb-6">
                                    <label className="block text-lg font-medium text-white mb-2">
                                        Tech Stack (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        name="techstack"
                                        value={formData.techstack}
                                        onChange={handleChange}
                                        className={`${inputStyles} text-primary-100`}
                                        placeholder="e.g. React, Node.js, TypeScript"
                                        required
                                    />
                                </div>

                                <div className="mt-auto flex justify-between">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className={buttonStyles}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !formData.techstack}
                                        className={`${buttonStyles} ${(isSubmitting || !formData.techstack) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isSubmitting ? 'Generating...' : 'Generate Questions'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Error Display */}
                        {error && (
                            <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};

export default InterviewGenerator;