export const owners: string[] = [
    '1210343418786488334'
];

export function isOwner(userId: string): boolean {
    return owners.includes(userId);
}

export function addOwner(userId: string): void {
    if (!owners.includes(userId)) {
        owners.push(userId);
    }
}

export function removeOwner(userId: string): void {
    const index = owners.indexOf(userId);
    if (index > -1) {
        owners.splice(index, 1);
    }
}

// addOwner('1210343418786488334'); function for add owner