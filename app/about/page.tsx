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
        github?: string;
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

const GitHubIcon = () => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 16 16'
        fill='currentColor'
    >
        <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8' />
    </svg>
);

// Team data organized for easier management
const teamLeads: member[] = [
    {
        name: 'Zhao Song Zhou',
        role: 'Team Lead',
        year: '2026 - 2027',
        imgSrc: 'https://i.imgur.com/JeUh9dc.jpeg',
        socials: {
            linkedin: 'https://www.linkedin.com/in/zhao-song-zhou/',
            github: 'https://github.com/ZhaoSongZh7',
        },
    },
    {
        name: 'Alvin Sze',
        role: 'Team Lead',
        year: '2026 - 2027',
        imgSrc: 'https://i.imgur.com/mZy9kzp.jpeg',
        socials: {
            linkedin: 'https://www.linkedin.com/in/alvinsze/',
            github: 'https://github.com/asze17',
        },
    },
];

const teamMembers: member[] = [
    {
        name: 'Allison Lee',
        role: 'Product Manager',
        year: '2026 - 2027',
        imgSrc: 'https://i.imgur.com/3SPqM7z.jpeg',
        socials: {
            linkedin: 'https://www.linkedin.com/in/allisonelee/',
            github: 'https://github.com/allisonelee',
        },
    },
    {
        name: 'Christal Chen',
        role: 'Software Engineer',
        year: '2026 - 2027',
        imgSrc: 'https://i.imgur.com/ZshQ3Fj.jpeg',
        socials: {
            linkedin: 'https://www.linkedin.com/in/christalchen/',
            github: 'https://github.com/12chenec',
        },
    },
];

const pastLeadership: member[] = [
    {
        name: 'Spencer Doyle',
        role: 'Team Lead',
        year: '2024 - 2025',
        imgSrc: 'https://i.imgur.com/kUbzXL9.png',
        socials: {
            linkedin: 'https://www.linkedin.com/in/spencer-doyle3/',
            github: 'https://github.com/Spencer04Hire',
        },
    },
    {
        name: 'Jenny Fan',
        role: 'Team Lead',
        year: '2025 - 2026',
        imgSrc: 'https://i.imgur.com/zDqurNZ.jpeg',
        socials: {
            linkedin: 'https://www.linkedin.com/in/jennyfan04/',
            github: 'https://github.com/jfmath04',
        },
    },
];

// Small pill-style badge used to display role + year together with proper spacing
const MemberBadges = ({
    role,
    year,
    align = 'left',
}: {
    role: string;
    year: string;
    align?: 'left' | 'center';
}) => {
    const theme = useTheme();
    return (
        <div
            className={`flex flex-wrap gap-2 mt-1 mb-3 ${
                align === 'center'
                    ? 'justify-center'
                    : 'justify-center sm:justify-start'
            }`}
        >
            <span
                className='inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide'
                style={{
                    backgroundColor: theme.colors.blue50 ?? '#EBF5FF',
                    color: theme.colors.blue600 ?? theme.colors.blue500,
                }}
            >
                {role}
            </span>
            <span className='inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide bg-slate-100 text-slate-500'>
                {year}
            </span>
        </div>
    );
};

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
                                        <MemberBadges
                                            role={lead.role}
                                            year={lead.year}
                                        />
                                        <div className='flex justify-center sm:justify-start space-x-4'>
                                            {lead.socials.github ? (
                                                <SocialIcon
                                                    href={lead.socials.github}
                                                >
                                                    <GitHubIcon />
                                                </SocialIcon>
                                            ) : null}
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
                                <MemberBadges
                                    role={member.role}
                                    year={member.year}
                                    align='center'
                                />
                                <div className='flex mx-auto w-min justify-center sm:justify-start space-x-4'>
                                    {member.socials.github ? (
                                        <SocialIcon
                                            href={member.socials.github}
                                        >
                                            <GitHubIcon />
                                        </SocialIcon>
                                    ) : null}
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
                                        <MemberBadges
                                            role={lead.role}
                                            year={lead.year}
                                        />
                                        <div className='flex justify-center sm:justify-start space-x-4'>
                                            {lead.socials.github ? (
                                                <SocialIcon
                                                    href={lead.socials.github}
                                                >
                                                    <GitHubIcon />
                                                </SocialIcon>
                                            ) : null}
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