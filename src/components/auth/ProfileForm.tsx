import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormData } from "./types";
import { ProfileFormProvider } from "./profile/ProfileFormProvider";
import { ProfileFormContent } from "./profile/ProfileFormContent";

export function ProfileForm() {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      zip_code: "",
      renewable_preference: false,
      universal_kwh_usage: "",
      universal_price_threshold: "",
    },
  });

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl h-[calc(100vh-4rem)] overflow-y-auto">
      <ProfileFormProvider form={form}>
        <ProfileFormContent form={form} />
      </ProfileFormProvider>
    </div>
  );
}