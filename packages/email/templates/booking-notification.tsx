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

interface BookingNotificationTemplateProps {
  readonly recipientName: string;
  readonly status: string;
  readonly shiftTitle: string;
  readonly shiftDate: string;
  readonly clinicName?: string;
  readonly professionalName?: string;
}

const statusMessages: Record<string, string> = {
  accepted: "Your booking has been accepted",
  declined: "Your booking has been declined",
  confirmed: "Your booking has been confirmed",
  checked_in: "Check-in confirmed",
  checked_out: "Check-out confirmed",
  completed: "Shift completed",
  cancelled: "Booking has been cancelled",
};

export const BookingNotificationTemplate = ({
  recipientName,
  status,
  shiftTitle,
  shiftDate,
  clinicName,
  professionalName,
}: BookingNotificationTemplateProps) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>
        {statusMessages[status] ?? "Booking update"} - {shiftTitle}
      </Preview>
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
              {statusMessages[status] ?? "Booking Update"}
            </Text>
            <Text className="m-0 text-zinc-500">
              Hi {recipientName},
            </Text>
            <Section className="my-4 rounded-md bg-zinc-100 p-4">
              <Text className="m-0 font-medium text-zinc-950">
                {shiftTitle}
              </Text>
              <Text className="m-0 text-sm text-zinc-500">
                Date: {shiftDate}
              </Text>
              {clinicName && (
                <Text className="m-0 text-sm text-zinc-500">
                  Clinic: {clinicName}
                </Text>
              )}
              {professionalName && (
                <Text className="m-0 text-sm text-zinc-500">
                  Professional: {professionalName}
                </Text>
              )}
            </Section>
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

BookingNotificationTemplate.PreviewProps = {
  recipientName: "Dr. Sarah",
  status: "accepted",
  shiftTitle: "Night Shift - Registered Nurse",
  shiftDate: "January 15, 2026",
  clinicName: "Downtown Medical Center",
};

export default BookingNotificationTemplate;
