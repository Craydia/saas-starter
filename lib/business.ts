import { prisma } from "./db";

export async function getBusinessBySecretCode(secretCode: string) {
  return prisma.business.findUnique({
    where: { secretCode: secretCode }
  });
}

function generateRandomSegment(length: number): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export function generateSecretCode(): string {
  const segment1 = generateRandomSegment(4);
  const segment2 = generateRandomSegment(4);
  const segment3 = generateRandomSegment(4);
  return `${segment1}-${segment2}-${segment3}`;
}

export async function createBusiness() {
  let uniqueSecretCode;
  let businessCreated = false;

  while (true) {
    // Generate a new secret code
    uniqueSecretCode = generateSecretCode();
    
    // Check if the secret code already exists
    const existingBusiness = await prisma.business.findUnique({
      where: { secretCode: uniqueSecretCode }
    });

    // If it does not exist, create the business
    if (!existingBusiness) {
      const newBusiness = await prisma.business.create({
        data: {
          name: "Your Business",
          secretCode: uniqueSecretCode
        },
        include: {users: true}
      });
      businessCreated = true; // Set flag to true to exit the loop
      return newBusiness;
    } else {
      // Optionally log that the code was not unique
      console.log(`Secret code ${uniqueSecretCode} is already in use, generating a new one...`);
    }
  }
}