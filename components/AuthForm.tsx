"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormField from "./FormField";
import { signIn, signUp } from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type, dictionary: t }: { type: FormType, dictionary?: any }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const result = await signUp({
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success(t?.auth?.signUpSuccess || "Account created successfully!");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const result = await signIn({ email, password });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success(t?.auth?.signInSuccess || "Signed in successfully!");
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-141.5">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>

        <h3>{t?.auth?.subtitle || "Practice job interviews with AI"}</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label={t?.auth?.nameLabel || "Name"}
                placeholder={t?.auth?.namePlaceholder || "Your Name"}
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label={t?.auth?.emailLabel || "Email"}
              placeholder={t?.auth?.emailPlaceholder || "Your email address"}
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label={t?.auth?.passwordLabel || "Password"}
              placeholder={t?.auth?.passwordPlaceholder || "Enter your password"}
              type="password"
            />

            <Button className="btn" type="submit">
              {isSignIn ? (t?.auth?.signInBtn || "Sign In") : (t?.auth?.signUpBtn || "Create an Account")}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? (t?.auth?.noAccount || "No account yet?") : (t?.auth?.haveAccount || "Have an account already?")}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? (t?.auth?.signInBtn || "Sign In") : (t?.auth?.signUpBtn || "Sign Up")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
