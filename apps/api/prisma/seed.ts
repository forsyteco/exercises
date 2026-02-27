import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const wiredModel = 'forsyte.ask-forsyte-mock-1-alpha-v5';
const anthropicModel = 'anthropic.claude-sonnet-4-5-20250929-v1:0';

async function main(): Promise<void> {
  await prisma.agent.upsert({
    where: { model: wiredModel },
    create: {
      name: 'Wired Compliance Agent',
      slug: 'wired-agent',
      model: wiredModel,
      description: 'Mock agent wired for demo conversation.',
    },
    update: {},
  });

  await prisma.agent.upsert({
    where: { model: anthropicModel },
    create: {
      name: 'Anthropic Sonnet Agent',
      slug: 'unwired-agent',
      model: anthropicModel,
      description: 'Placeholder agent that is not wired yet.',
    },
    update: {},
  });
}

void (async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();

