'use client';

import React from 'react';

import { Heading, majorScale, Pane, Text, useTheme } from 'evergreen-ui';
import Image from 'next/image';

// --- Helper Components & Data ---
interface member {
    name: string;
    role: string;
    year: string;
    imgSrc: string;
    socials: {
        linkedin: string;
    };
}

// Icon for social media links
const SocialIcon = ({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) => (
    <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className='text-gray-400 transition-colors duration-300'
    >
        {children}
    </a>
);

// SVG components for icons
const LinkedinIcon = () => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' />
        <rect x='2' y='9' width='4' height='12' />
        <circle cx='4' cy='4' r='2' />
    </svg>
);

// Team data organized for easier management
const teamLeads: member[] = [
    {
        name: 'Jenny Fan',
        role: 'Team Lead',
        year: '2025 - 2026',
        imgSrc: 'https://media.licdn.com/dms/image/v2/D4E03AQFOQEWyofLFhw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1710648138236?e=1773273600&v=beta&t=oWwpbTq8Ncnv6eWnBsFcGUMpDx2l1iWu1_nbT4ijRQE',
        socials: {
            linkedin: 'https://www.linkedin.com/in/jennyfan04/',
        },
    },
];

const teamMembers: member[] = [
    // Add your name, role, and image here!
];

const pastLeadership: member[] = [
    {
        name: 'Spencer Doyle',
        role: 'Team Lead',
        year: '2024 - 2025',
        imgSrc: 'https://media.licdn.com/dms/image/v2/D4E03AQFgKlbpu5PV9Q/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1710630696392?e=1773273600&v=beta&t=1k-bOwMR0VcGoJpjI3S8eTs3E-x52eNoya-LOO6080I',
        socials: {
            linkedin: 'https://www.linkedin.com/in/spencer-doyle3/',
        },
    },
];

/**
 * Modern "Meet the Team" page component.
 * Features a clean, professional design with interactive cards.
 */
export function App() {
    const theme = useTheme();
    return (
        <div className='min-h-screen font-sans text-slate-800'>
            <style
                dangerouslySetInnerHTML={{
                    __html: `.group:hover .group-hover-border { border-color: ${theme.colors.blue300}; }`,
                }}
            />
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                {/* Header */}
                <Pane textAlign='center' marginBottom={majorScale(6)}>
                    <Heading
                        size={900}
                        fontSize='3rem'
                        fontWeight={700}
                        marginBottom={majorScale(4)}
                    >
                        Meet the{' '}
                        <Text
                            size={900}
                            fontSize='3rem'
                            color={theme.colors.blue500}
                        >
                            HoagieMail
                        </Text>{' '}
                        Team
                    </Heading>
                    <Text
                        size={500}
                        display='block'
                        maxWidth={900}
                        marginX='auto'
                    >
                        HoagieMail is Princeton&apos;s go-to platform for
                        campus-wide email communication. Built by students, for
                        students, it serves as the primary channel through which
                        clubs, organizations, and student groups reach the
                        broader Princeton community from event announcements and
                        recruitment blasts to club updates and campus
                        initiatives. <br /> <br />
                        HoagieMail has become an indispensable part of campus
                        life, ensuring that students stay connected to the
                        communities and opportunities that matter most to them.
                    </Text>
                </Pane>

                {/* Team Leadership Section */}
                <section className='mb-16'>
                    <h2 className='text-3xl font-bold text-slate-900 mb-12 text-center'>
                        Team Leadership
                    </h2>
                    <div
                        className={`grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto ${teamLeads.length === 1 ? 'justify-items-center' : ''}`}
                    >
                        {teamLeads.map((lead) => (
                            <div
                                key={lead.name}
                                className={`bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 ease-in-out w-full ${teamLeads.length === 1 ? 'lg:col-span-2 max-w-lg' : ''}`}
                            >
                                <div className='p-8 flex flex-col sm:flex-row items-center'>
                                    <Pane
                                        flexShrink={0}
                                        marginBottom={majorScale(3)}
                                        marginRight={majorScale(4)}
                                        width={128}
                                        height={128}
                                        borderRadius='50%'
                                        border={`4px solid ${theme.colors.blue300}`}
                                        boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                        overflow='hidden'
                                    >
                                        <Image
                                            src={lead.imgSrc}
                                            alt={lead.name}
                                            height={128}
                                            width={128}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </Pane>
                                    <div className='text-center sm:text-left'>
                                        <h3 className='text-2xl font-bold text-slate-900'>
                                            {lead.name}
                                        </h3>
                                        <p
                                            className='text-md font-semibold mb-2'
                                            style={{
                                                color: theme.colors.blue500,
                                            }}
                                        >
                                            {lead.role}
                                        </p>
                                        <div className='flex justify-center sm:justify-start space-x-4'>
                                            <SocialIcon
                                                href={lead.socials.linkedin}
                                            >
                                                <LinkedinIcon />
                                            </SocialIcon>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Team Members Section */}
                <section className='mb-16'>
                    <h2 className='text-3xl font-bold text-slate-900 mb-12 text-center'>
                        Contributors
                    </h2>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8'>
                        {teamMembers.map((member) => (
                            <div
                                key={member.name}
                                className='bg-white rounded-xl shadow-md p-6 text-center transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group'
                            >
                                <Image
                                    src={member.imgSrc}
                                    alt={member.name}
                                    className='w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-200 group-hover-border transition-colors duration-300'
                                    height={128}
                                    width={128}
                                    style={{ objectFit: 'cover' }}
                                />
                                <h4 className='font-bold text-slate-800 text-lg'>
                                    {member.name}
                                </h4>
                                <p
                                    className='!text-sm'
                                    style={{ color: theme.colors.blue500 }}
                                >
                                    {member.role}
                                </p>
                                <div className='flex mx-auto w-min mt-2 justify-center sm:justify-start space-x-4'>
                                    <SocialIcon href={member.socials.linkedin}>
                                        <LinkedinIcon />
                                    </SocialIcon>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Past Leadership Section */}
                <section className='mb-16'>
                    <h2 className='text-3xl font-bold text-slate-900 mb-12 text-center'>
                        Past Leadership
                    </h2>
                    <div
                        className={`grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto ${pastLeadership.length === 1 ? 'justify-items-center' : ''}`}
                    >
                        {pastLeadership.map((lead) => (
                            <div
                                key={lead.name}
                                className={`bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 ease-in-out w-full ${pastLeadership.length === 1 ? 'lg:col-span-2 max-w-lg' : ''}`}
                            >
                                <div className='p-8 flex flex-col sm:flex-row items-center'>
                                    <Pane
                                        flexShrink={0}
                                        marginBottom={majorScale(3)}
                                        marginRight={majorScale(4)}
                                        width={128}
                                        height={128}
                                        borderRadius='50%'
                                        border={`4px solid ${theme.colors.blue300}`}
                                        boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                        overflow='hidden'
                                    >
                                        <Image
                                            src={lead.imgSrc}
                                            alt={lead.name}
                                            height={128}
                                            width={128}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </Pane>
                                    <div className='text-center sm:text-left'>
                                        <h3 className='text-2xl font-bold text-slate-900'>
                                            {lead.name}
                                        </h3>
                                        <p
                                            className='text-md font-semibold mb-2'
                                            style={{
                                                color: theme.colors.blue500,
                                            }}
                                        >
                                            {lead.year}
                                        </p>
                                        <div className='flex justify-center sm:justify-start space-x-4'>
                                            <SocialIcon
                                                href={lead.socials.linkedin}
                                            >
                                                <LinkedinIcon />
                                            </SocialIcon>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default App;
