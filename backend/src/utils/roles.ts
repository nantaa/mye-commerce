import { User, Role } from '@prisma/client';

/**
 * Checks if a user is a Seller
 */
export const isSeller = (user: User): boolean => {
    return user.role === Role.SELLER;
};

/**
 * Checks if a user is a Customer
 */
export const isCustomer = (user: User): boolean => {
    return user.role === Role.CUSTOMER;
};

/**
 * Checks if a user is an Admin
 */
export const isAdmin = (user: User): boolean => {
    return user.role === Role.ADMIN;
};

/**
 * Helper to determine redirect path based on role
 */
export const getRoleRedirectPath = (role: Role): string => {
    switch (role) {
        case Role.ADMIN:
            return '/admin/dashboard';
        case Role.SELLER:
            return '/seller/dashboard';
        default:
            return '/dashboard'; // or homepage
    }
};
