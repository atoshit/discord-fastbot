export const owners: string[] = [
    '1210343418786488334',
    '813886677142994994'
];

export function isOwner(userId: string): boolean {
    console.log('Checking owner:', userId, 'Is owner?', owners.includes(userId));  // Debug log
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