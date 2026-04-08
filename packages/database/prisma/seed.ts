import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
  // ─── Job Roles ──────────────────────────────────────────────
  const jobRoles = [
    { name: "Registered Nurse", nameAr: "ممرض/ة مسجل/ة", displayOrder: 1 },
    {
      name: "Licensed Practical Nurse",
      nameAr: "ممرض/ة عملي/ة مرخص/ة",
      displayOrder: 2,
    },
    {
      name: "Certified Nursing Assistant",
      nameAr: "مساعد/ة تمريض معتمد/ة",
      displayOrder: 3,
    },
    { name: "Medical Assistant", nameAr: "مساعد/ة طبي/ة", displayOrder: 4 },
    { name: "Dental Hygienist", nameAr: "أخصائي/ة صحة أسنان", displayOrder: 5 },
    { name: "Dental Assistant", nameAr: "مساعد/ة أسنان", displayOrder: 6 },
    {
      name: "Physical Therapist",
      nameAr: "أخصائي/ة علاج طبيعي",
      displayOrder: 7,
    },
    {
      name: "Occupational Therapist",
      nameAr: "أخصائي/ة علاج وظيفي",
      displayOrder: 8,
    },
    { name: "Pharmacist", nameAr: "صيدلاني/ة", displayOrder: 9 },
    { name: "Pharmacy Technician", nameAr: "فني/ة صيدلة", displayOrder: 10 },
    { name: "Radiologic Technologist", nameAr: "فني/ة أشعة", displayOrder: 11 },
    { name: "Lab Technician", nameAr: "فني/ة مختبر", displayOrder: 12 },
  ];

  for (const role of jobRoles) {
    await prisma.jobRole.upsert({
      where: { name: role.name },
      update: { nameAr: role.nameAr, displayOrder: role.displayOrder },
      create: role,
    });
  }

  // ─── Document Type Configs ──────────────────────────────────
  const documentTypes = [
    {
      name: "National ID",
      nameAr: "الهوية الوطنية",
      isRequired: true,
      appliesTo: "both",
      displayOrder: 1,
    },
    {
      name: "Professional License",
      nameAr: "الرخصة المهنية",
      isRequired: true,
      appliesTo: "professional",
      displayOrder: 2,
    },
    {
      name: "Certification",
      nameAr: "شهادة اعتماد",
      isRequired: false,
      appliesTo: "professional",
      displayOrder: 3,
    },
    {
      name: "Business License",
      nameAr: "رخصة تجارية",
      isRequired: true,
      appliesTo: "clinic",
      displayOrder: 4,
    },
    {
      name: "Insurance Certificate",
      nameAr: "شهادة تأمين",
      isRequired: false,
      appliesTo: "both",
      displayOrder: 5,
    },
  ];

  for (const dt of documentTypes) {
    await prisma.documentTypeConfig.upsert({
      where: { name: dt.name },
      update: {
        nameAr: dt.nameAr,
        isRequired: dt.isRequired,
        appliesTo: dt.appliesTo,
        displayOrder: dt.displayOrder,
      },
      create: dt,
    });
  }

  // ─── Certifications ─────────────────────────────────────────
  const certifications = [
    {
      name: "Basic Life Support",
      nameAr: "دعم الحياة الأساسي",
      abbreviation: "BLS",
      displayOrder: 1,
    },
    {
      name: "Advanced Cardiovascular Life Support",
      nameAr: "دعم الحياة القلبي المتقدم",
      abbreviation: "ACLS",
      displayOrder: 2,
    },
    {
      name: "Pediatric Advanced Life Support",
      nameAr: "دعم الحياة المتقدم للأطفال",
      abbreviation: "PALS",
      displayOrder: 3,
    },
    {
      name: "HIPAA Compliance",
      nameAr: "الامتثال لقانون HIPAA",
      abbreviation: "HIPAA",
      displayOrder: 4,
    },
    {
      name: "IV Therapy Certification",
      nameAr: "شهادة العلاج الوريدي",
      abbreviation: "IV",
      displayOrder: 5,
    },
    {
      name: "Wound Care Certification",
      nameAr: "شهادة العناية بالجروح",
      abbreviation: "WCC",
      displayOrder: 6,
    },
  ];

  for (const cert of certifications) {
    await prisma.certification.upsert({
      where: { name: cert.name },
      update: {
        nameAr: cert.nameAr,
        abbreviation: cert.abbreviation,
        displayOrder: cert.displayOrder,
      },
      create: cert,
    });
  }

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
