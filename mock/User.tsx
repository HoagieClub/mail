import {
    withPageAuthRequired, useUser, UserProvider, withApiAuthRequired,
} from '@auth0/nextjs-auth0'

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

export const withMockablePageAuthRequired = (
    IS_DEVELOPMENT
        ? (arg: () => any) => arg
        : withPageAuthRequired);

// Provides a mock user in development environment
export const useMockableUser = (
    IS_DEVELOPMENT
        ? () => ({
            user: {
                name: 'Meatball Hoagie',
                email: 'meatball@princeton.edu',
            },
            error: null,
            isLoading: false,
        })
        : useUser
);

export const MockableUserProvider = (
    IS_DEVELOPMENT
        ? ({ children }) => children
        : UserProvider
)

export const withMockableApiAuthRequired = (
    IS_DEVELOPMENT
        ? (arg: any) => arg
        : withApiAuthRequired
);
