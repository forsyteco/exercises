import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { IdGenerator } from "@/utils/id-generator";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const organisationIdGenerator = new IdGenerator("org");
const agentIdGenerator = new IdGenerator("agt");
const agentSessionIdGenerator = new IdGenerator("ags");
const agentMessageIdGenerator = new IdGenerator("agm");

async function main(): Promise<void> {
  const organisation = await prisma.organisation.upsert({
    where: { slug: "forsyte" },
    create: {
      id: organisationIdGenerator.randomId(),
      name: "Forsyte",
      slug: "forsyte",
    },
    update: {},
  });

  const wiredAgent = await prisma.agent.upsert({
    where: { model: "forsyte.ask-forsyte-mock-1-alpha-v5" },
    create: {
      id: agentIdGenerator.randomId(),
      organisationId: organisation.id,
      name: "Wired Compliance Agent",
      slug: "wired-agent",
      model: "forsyte.ask-forsyte-mock-1-alpha-v5",
      description: "Mock agent wired for demo conversation.",
    },
    update: {},
  });

  await prisma.agent.upsert({
    where: { model: "anthropic.claude-sonnet-4-5-20250929-v1:0" },
    create: {
      id: agentIdGenerator.randomId(),
      organisationId: organisation.id,
      name: "Anthropic Sonnet Agent",
      slug: "unwired-agent",
      model: "anthropic.claude-sonnet-4-5-20250929-v1:0",
      description: "Placeholder agent that is not wired yet.",
    },
    update: {},
  });

  const demoSession = await prisma.agentSession.create({
    data: {
      id: agentSessionIdGenerator.randomId(),
      organisationId: organisation.id,
      agentId: wiredAgent.id,
    },
  });

  await prisma.agentMessage.createMany({
    data: [
      {
        id: agentMessageIdGenerator.randomId(),
        organisationId: organisation.id,
        sessionId: demoSession.id,
        role: "user",
        sequenceId: 1,
        content: { text: "Do I have matters in high risk jurisdictions?" },
      },
      {
        id: agentMessageIdGenerator.randomId(),
        organisationId: organisation.id,
        sessionId: demoSession.id,
        role: "agent",
        sequenceId: 2,
        content: {
          text: "Yes, you have 12 matters in high-risk jurisdictions across three regions.",
        },
      },
      {
        id: agentMessageIdGenerator.randomId(),
        organisationId: organisation.id,
        sessionId: demoSession.id,
        role: "user",
        sequenceId: 3,
        content: {
          text: "How many of these have outstanding risk assessments?",
        },
      },
      {
        id: agentMessageIdGenerator.randomId(),
        organisationId: organisation.id,
        sessionId: demoSession.id,
        role: "agent",
        sequenceId: 4,
        content: {
          text: "Out of these, 5 matters currently have outstanding risk assessments.",
        },
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });