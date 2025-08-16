import {
  Html,
  Head,
  Preview,
  Text,
  Section,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

const VerificationEmail = ({ username, otp }: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your verification code is: {otp}</Preview>
      <Section>
        <Text>Hi {username},</Text>
        <Text>Your verification code is:</Text>
        <Text><strong>{otp}</strong></Text>
        <Text>If you didn’t request this, you can ignore this email.</Text>
      </Section>
    </Html>
  );
};

export default VerificationEmail;
