import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface OtpTemplateProps {
  readonly code: string;
  readonly email: string;
}

export const OtpTemplate = ({ code, email }: OtpTemplateProps) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>Your SyndeoCare verification code: {code}</Preview>
      <Body className="bg-zinc-50 font-sans">
        <Container className="mx-auto py-12">
          <Section
            className="rounded-t-md px-8 py-6"
            style={{
              background: "linear-gradient(135deg, #663C6D 0%, #56849A 100%)",
            }}
          >
            <Heading className="m-0 font-bold text-2xl text-white">
              SyndeoCare
            </Heading>
          </Section>
          <Section className="mt-0 rounded-b-md bg-white p-8">
            <Text className="mt-0 mb-2 font-semibold text-xl text-zinc-950">
              Verify your email
            </Text>
            <Text className="m-0 text-zinc-500">
              Enter the following code to verify your email address ({email}):
            </Text>
            <Section className="my-6 rounded-md bg-zinc-100 px-6 py-4 text-center">
              <Text
                className="m-0 font-mono font-bold text-3xl tracking-widest"
                style={{ color: "#663C6D", letterSpacing: "0.5em" }}
              >
                {code}
              </Text>
            </Section>
            <Text className="m-0 text-zinc-500">
              This code expires in 10 minutes. If you didn't request this code,
              you can safely ignore this email.
            </Text>
            <Hr className="my-4" />
            <Text className="m-0 text-xs text-zinc-400">
              SyndeoCare - Healthcare Staffing Platform
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

OtpTemplate.PreviewProps = {
  code: "482916",
  email: "user@example.com",
};

export default OtpTemplate;
