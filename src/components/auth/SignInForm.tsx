import { useState } from "react";
// import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
// import Select from "../form/Select";
// import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import useLoginMutation from "../../hooks/Mutations/useLoginMutation";
import { APICONSTANT } from "../../services/config";
// import { Link } from "react-router";

// ✅ Only email and password validation
const schema = yup.object().shape({
  email_id: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
});

type SignInFormData = {
  email_id: string;
  password: string;
  // role?: string;
};

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);

  const {
    register,
    handleSubmit,
    // control,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(schema),
  });

  const loginMutation = useLoginMutation();

  const onSubmit = async (data: SignInFormData) => {
    const payload = {
      ...data,
      // rememberMe: isChecked,
      // role: data.role ?? "admin",
    };

    try {
      await loginMutation.mutateAsync({
        url: { apiUrl: APICONSTANT.LOGIN },
        body: payload,
      });
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto" />
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          {/* <div className="flex flex-col items-center">
            <Link to="" className="block mb-4">
                <img
                  width={100}
                  height={100}
                  // src="/images/logo/auth-logo.svg"
                  src="/images/logo/logo-icon.svg"
                  alt="Logo"
                />
              </Link>
          </div> */}
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {/* Email */}
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="info@gmail.com"
                  {...register("email_id")}
                  error={!!errors.email_id}
                  hint={errors.email_id?.message}
                />
              </div>

              {/* Password */}
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    error={!!errors.password}
                    hint={errors.password?.message}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              {/* Optional Role Select (no validation) */}
              {/* <div>
                <Label>Login As</Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={[
                        { value: "admin", label: "Admin" },
                        { value: "instructor", label: "Instructor" },
                      ]}
                      placeholder="Select role"
                      className="dark:bg-dark-900"
                    />
                  )}
                />
              </div> */}

              {/* Keep me logged in */}
              <div className="flex items-center justify-between">
                {/* <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div> */}
                {/* <Link
                  to="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link> */}
              </div>

              {/* Submit */}
              <div>
                <Button className="w-full" size="sm" type="submit">
                  Sign in
                </Button>
              </div>

              {/* Optional error message */}
              {/* {loginMutation.isError && (
                <p className="mt-2 text-sm text-error-500 text-center">
                  {(loginMutation.error as unknown)?.response?.data?.message || "Login failed. Please try again."}
                </p>
              )} */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}