import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { ProfileForm } from "./ProfileForm";
import { Button } from "@/components/ui/button";

interface AuthContentProps {
  session: any;
  handleSignOut: () => Promise<void>;
}

export function AuthContent({ session, handleSignOut }: AuthContentProps) {
  if (session) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Profile Settings
          </h2>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
        <ProfileForm />
      </div>
    );
  }

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: 'rgb(147, 51, 234)',
              brandAccent: 'rgb(126, 34, 206)',
              messageText: 'rgb(239, 68, 68)',
              messageBackground: 'rgb(254, 242, 242)',
            },
          },
        },
        className: {
          message: 'text-red-500 bg-red-50 p-3 rounded-md mb-4',
          button: 'bg-primary hover:bg-primary/90 text-primary-foreground',
          container: 'space-y-4',
          label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          input: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          anchor: 'text-primary hover:text-primary/80',
        },
      }}
      localization={{
        variables: {
          sign_in: {
            email_label: 'Email',
            password_label: 'Password',
            email_input_placeholder: 'Your email address',
            password_input_placeholder: 'Your password',
            button_label: 'Sign In',
            loading_button_label: 'Signing in...',
            social_provider_text: 'Sign in with {{provider}}',
            link_text: "Don't have an account? Sign up",
          },
          sign_up: {
            email_label: 'Email',
            password_label: 'Password',
            password_label_confirm: 'Confirm Password',
            email_input_placeholder: 'Your email address',
            password_input_placeholder: 'Create a strong password',
            password_input_placeholder_confirm: 'Confirm your password',
            button_label: 'Sign Up',
            loading_button_label: 'Signing up...',
            social_provider_text: 'Sign up with {{provider}}',
            link_text: "Already have an account? Sign in",
            confirmation_text: 'Check your email for the confirmation link',
          },
          forgotten_password: {
            email_label: 'Email',
            password_label: 'Password',
            email_input_placeholder: 'Your email address',
            button_label: 'Send Reset Instructions',
            loading_button_label: 'Sending reset instructions...',
            link_text: "Forgot your password?",
          },
        },
      }}
      providers={[]}
      redirectTo={window.location.origin}
      view="sign_in"
      showLinks={true}
    />
  );
}