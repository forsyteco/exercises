import "dotenv/config";
import { hash } from "bcrypt";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { IdGenerator } from "@/utils/id-generator";

const BCRYPT_SALT_ROUNDS = 12;

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const organisationIdGenerator = new IdGenerator("org");
const agentIdGenerator = new IdGenerator("agt");
const agentSessionIdGenerator = new IdGenerator("ags");
const agentMessageIdGenerator = new IdGenerator("agm");
const userIdGenerator = new IdGenerator("usr");
const clientIdGenerator = new IdGenerator("cli");
const matterIdGenerator = new IdGenerator("mat");
const riskAssessmentIdGenerator = new IdGenerator("ris");
const riskAssessmentFlagIdGenerator = new IdGenerator("rif");

async function main(): Promise<void> {
  const organisation = await prisma.organisation.upsert({
    where: { slug: "forsyte" },
    create: {
      id: organisationIdGenerator.randomId(),
      name: "Forsyte Risk",
      slug: "forsyte",
    },
    update: {},
  });

  await prisma.organisation.upsert({
    where: { slug: "bumble-law" },
    create: {
      id: organisationIdGenerator.randomId(),
      name: "Bumble Law",
      slug: "bumble-law",
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

  const verifiedAt = new Date();
  const seedPasswordHash = await hash("beeCompliant33", BCRYPT_SALT_ROUNDS);

  await prisma.user.upsert({
    where: { email: "buzz.aldrin@forsyte.co" },
    create: {
      id: userIdGenerator.randomId(),
      organisationId: organisation.id,
      name: "Buzz Aldrin",
      email: "buzz.aldrin@forsyte.co",
      password: seedPasswordHash,
      status: "active",
      verifiedAt,
    },
    update: { password: seedPasswordHash },
  });
  await prisma.user.upsert({
    where: { email: "morgan.beeman@forsyte.co" },
    create: {
      id: userIdGenerator.randomId(),
      organisationId: organisation.id,
      name: "Morgan Beeman",
      email: "morgan.beeman@forsyte.co",
      password: seedPasswordHash,
      status: "active",
      verifiedAt,
    },
    update: { password: seedPasswordHash },
  });
  const honeyPotter = await prisma.user.upsert({
    where: { email: "honey.potter@forsyte.co" },
    create: {
      id: userIdGenerator.randomId(),
      organisationId: organisation.id,
      name: "Honey Potter",
      email: "honey.potter@forsyte.co",
      password: seedPasswordHash,
      status: "active",
      verifiedAt,
    },
    update: { password: seedPasswordHash },
  });

  // Clients (bee themed) — prefixes cli, mat, ris at repo layer
  const seedClientId1 = clientIdGenerator.randomId();
  const seedClientId2 = clientIdGenerator.randomId();
  const seedMatterId1 = matterIdGenerator.randomId();
  const seedMatterId2 = matterIdGenerator.randomId();
  const seedMatterId3 = matterIdGenerator.randomId();
  const seedRiskId1 = riskAssessmentIdGenerator.randomId();
  const seedRiskId2 = riskAssessmentIdGenerator.randomId();
  const seedRiskId3 = riskAssessmentIdGenerator.randomId();

  const client1 = await prisma.client.upsert({
    where: { id: seedClientId1 },
    create: {
      id: seedClientId1,
      organisationId: organisation.id,
      reference: "833833",
      type: "individual",
      name: "Augusta Honeycomb",
      ownedById: honeyPotter.id,
    },
    update: {},
  });
  const client2 = await prisma.client.upsert({
    where: { id: seedClientId2 },
    create: {
      id: seedClientId2,
      organisationId: organisation.id,
      reference: "APIA1",
      type: "business",
      name: "Buzzworth Apiaries",
      ownedById: honeyPotter.id,
    },
    update: {},
  });

  // Matters: 2 for client 1, 1 for client 2 (bee themed)
  const matter1 = await prisma.matter.upsert({
    where: { id: seedMatterId1 },
    create: {
      id: seedMatterId1,
      organisationId: organisation.id,
      clientId: client1.id,
      reference: "APIA1/1",
      description: "Sale of 49c South Pollen Way",
      status: "active",
      type: "property",
      ownedById: honeyPotter.id,
    },
    update: {},
  });
  const matter2 = await prisma.matter.upsert({
    where: { id: seedMatterId2 },
    create: {
      id: seedMatterId2,
      organisationId: organisation.id,
      clientId: client1.id,
      reference: "APIA1/2",
      description: "Hive placement dispute at Oak Meadow",
      status: "pending",
      type: "dispute",
      ownedById: honeyPotter.id,
    },
    update: {},
  });
  const matter3 = await prisma.matter.upsert({
    where: { id: seedMatterId3 },
    create: {
      id: seedMatterId3,
      organisationId: organisation.id,
      clientId: client2.id,
      reference: "123456",
      description: "Beekeeper employment contract",
      status: "active",
      type: "employment",
      ownedById: honeyPotter.id,
    },
    update: {},
  });

  // Risk assessments: 1 per matter
  await prisma.riskAssessment.upsert({
    where: { id: seedRiskId1 },
    create: {
      id: seedRiskId1,
      organisationId: organisation.id,
      clientId: client1.id,
      matterId: matter1.id,
      status: "in_progress",
      riskLevel: "medium",
      ownedById: honeyPotter.id,
    },
    update: {},
  });
  await prisma.riskAssessment.upsert({
    where: { id: seedRiskId2 },
    create: {
      id: seedRiskId2,
      organisationId: organisation.id,
      clientId: client1.id,
      matterId: matter2.id,
      status: "in_progress",
      riskLevel: "low",
      ownedById: honeyPotter.id,
    },
    update: {},
  });
  await prisma.riskAssessment.upsert({
    where: { id: seedRiskId3 },
    create: {
      id: seedRiskId3,
      organisationId: organisation.id,
      clientId: client2.id,
      matterId: matter3.id,
      status: "completed",
      riskLevel: "high",
      ownedById: honeyPotter.id,
    },
    update: {},
  });

  // Risk assessment flags: 5 standard flags per risk assessment, all pending
  const riskAssessmentFlagDefinitions: { name: string; description: string }[] = [
    {
      name: "Has the client's identity been verified remotely without a face-to-face meeting?",
      description:
        "Whether identity was verified only by remote or digital means (e.g. video call, document upload) with no in-person meeting.",
    },
    {
      name: "Has the identity verification confidence level been met?",
      description:
        "Whether the required identity verification confidence level (e.g. high or medium) has been achieved for this client.",
    },
    {
      name: "Is the client a designated person or entity under sanctions?",
      description:
        "Sanctions screening result: whether the client or any beneficial owners appear on designated lists (e.g. OFAC, UN, EU).",
    },
    {
      name: "Has adverse media been identified about the client or beneficial owners?",
      description:
        "Result of adverse media screening for the client and beneficial owners (negative news, enforcement, litigation, etc.).",
    },
    {
      name: "Was the client born in or resides in a high risk third country jurisdiction?",
      description:
        "Whether the client’s place of birth or current residence is in a high-risk third country under applicable regulations.",
    },
  ];

  const seedRiskIds = [seedRiskId1, seedRiskId2, seedRiskId3];
  for (const riskAssessmentId of seedRiskIds) {
    for (const def of riskAssessmentFlagDefinitions) {
      await prisma.riskAssessmentFlag.create({
        data: {
          id: riskAssessmentFlagIdGenerator.randomId(),
          organisationId: organisation.id,
          riskAssessmentId,
          name: def.name,
          description: def.description,
          status: "pending",
        },
      });
    }
  }

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