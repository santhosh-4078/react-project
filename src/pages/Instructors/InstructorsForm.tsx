import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";
import { ChevronLeftIcon } from "../../icons";
import useApiMutation from "../../hooks/Mutations/useApiMutation";
import useReactQuery from "../../hooks/useReactQuery";
import { APICONSTANT } from "../../services/config";
import FileInput from "../../components/form/input/FileInput";
import { PreviewImage } from "../../components/ui/images/previewImage";

interface Country {
  id: number;
  name: string;
  country_id?: number;
}

interface State {
  id: number;
  name: string;
  zone_id?: number;
}

type InstructorFormData = {
  first_name: string;
  last_name: string;
  email_id: string;
  password?: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  profile: FileList;
  pan: FileList;
  aadhar: FileList;
};

export default function InstructorsForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const instructor = location.state as
    | Partial<InstructorFormData & { id: number }>
    | undefined;
  const isEditMode = !!instructor;

  const { data: previewData } = useReactQuery("UPDATE_INSTRUCTOR", `id=${instructor?.id}`);
  const preview = previewData?.data;

  const schema: yup.ObjectSchema<InstructorFormData> = yup.object({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email_id: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .when([], {
        is: () => !isEditMode,
        then: (schema) => schema.required("Password is required").min(6, "Minimum 6 characters"),
        otherwise: (schema) => schema.notRequired().nullable(),
      }),
    phone: yup.string().required("Phone number is required"),
    street: yup.string().required("Street is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    country: yup.string().required("Country is required"),
    profile: yup
      .mixed<FileList>()
      .test("required", "Profile image is required", value =>
        isEditMode ? true : !!value && value.length > 0
      )
      .required(),
    pan: yup
      .mixed<FileList>()
      .test("required", "PAN file is required", value =>
        isEditMode ? true : !!value && value.length > 0
      )
      .required(),
    aadhar: yup
      .mixed<FileList>()
      .test("required", "Aadhar file is required", value =>
        isEditMode ? true : !!value && value.length > 0
      )
      .required(),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<InstructorFormData>({
    // resolver: yupResolver(schema),
    resolver: yupResolver(schema, { abortEarly: false }),
    defaultValues: isEditMode
      ? {
        ...preview,
        profile: undefined,
        pan: undefined,
        aadhar: undefined,
        password: "",
      }
      : undefined,
  });

  const selectedCountry = watch("country");
  const watchedProfile = watch("profile");
  const watchedPan = watch("pan");
  const watchedAadhar = watch("aadhar");

  const createInstructor = useApiMutation("post", "/instructors");
  const updateInstructor = useApiMutation("post", "/instructors");
  const isSubmitting = createInstructor.isPending || updateInstructor.isPending;

  const { data: countries = [] } = useReactQuery("GET_COUNTRY", "");
  const { data: states = [] } = useReactQuery(
    "GET_STATE",
    `country_id=${selectedCountry}`
  );

  const countryOptions = [
    { value: "", label: "Select country" },
    ...(countries?.datas ?? []).map((c: Country) => ({
      value: String(c.id || c.country_id),
      label: c.name,
    })),
  ];

  const stateOptions = [
    { value: "", label: "Select state" },
    ...(states?.datas ?? []).map((s: State) => ({
      value: String(s.id || s.zone_id),
      label: s.name,
    })),
  ];

  useEffect(() => {
    if (previewData?.success) {
      reset({
        ...preview,
        profile: undefined,
        pan: undefined,
        aadhar: undefined,
        password: "",
      });
    }
  }, [previewData?.data, reset]);

  const onSubmit = async (data: InstructorFormData) => {
    // try {
    //   const validated = await schema.validate(data, { abortEarly: false });
    //   console.log("Validation Passed", validated);
    // } catch (e) {
    //   console.error("Validation Errors:", e);
    // }
    const formData = new FormData();
    formData.append("user_group", "instructor");

    for (const [key, value] of Object.entries(data)) {
      if (value instanceof FileList && value.length > 0) {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value as string);
      }
    }

    let response;
    if (isEditMode && instructor?.id) {
      formData.append("id", instructor.id.toString());
      response = await updateInstructor.mutateAsync({
        url: { apiUrl: APICONSTANT.UPDATE_INSTRUCTOR },
        body: formData,
      });
    } else {
      response = await createInstructor.mutateAsync({
        url: { apiUrl: APICONSTANT.CREATE_INSTRUCTOR },
        body: formData,
      });
    }

    if (response?.success) {
      await queryClient.invalidateQueries({ queryKey: ["GET_INSTRUCTOR"] });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-1xl mx-auto mt-10"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-700 dark:text-white hover:text-brand-500 flex items-center gap-1"
          >
            <ChevronLeftIcon />
          </button>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {isEditMode ? "Edit Instructor" : "Add New Instructor"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>First Name *</Label>
            <Input type="text" {...register("first_name")} error={!!errors.first_name} hint={errors.first_name?.message} />
          </div>

          <div>
            <Label>Last Name *</Label>
            <Input type="text" {...register("last_name")} error={!!errors.last_name} hint={errors.last_name?.message} />
          </div>

          <div>
            <Label>Email *</Label>
            <Input type="email" {...register("email_id")} error={!!errors.email_id} hint={errors.email_id?.message} />
          </div>

          {!isEditMode && (
            <div>
              <Label>Password *</Label>
              <Input type="password" {...register("password")} error={!!errors.password} hint={errors.password?.message} />
            </div>
          )}

          <div>
            <Label>Phone *</Label>
            <Input type="number" {...register("phone")} error={!!errors.phone} hint={errors.phone?.message} />
          </div>

          <div>
            <Label>Street *</Label>
            <Input {...register("street")} error={!!errors.street} hint={errors.street?.message} />
          </div>

          <div>
            <Label>City *</Label>
            <Input {...register("city")} error={!!errors.city} hint={errors.city?.message} />
          </div>

          <div>
            <Label>Country *</Label>
            <Controller
              name="country"
              control={control}
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <Select {...field} options={countryOptions} placeholder="Select country" />
              )}
            />
            {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
          </div>

          <div>
            <Label>State *</Label>
            <Controller
              name="state"
              control={control}
              rules={{ required: "State is required" }}
              render={({ field }) => (
                <Select {...field} options={stateOptions} placeholder="Select state" />
              )}
            />
            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
          </div>

          <div>
            <Label>Profile Image *</Label>
            <FileInput {...register("profile")} />
          </div>

          <div>
            <Label>PAN Document *</Label>
            <FileInput {...register("pan")} />
          </div>

          <div>
            <Label>Aadhar Document *</Label>
            <FileInput {...register("aadhar")} />
          </div>
        </div>

        <div className="md:flex justify-end w-full">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Submitting..."
              : isEditMode
                ? "Update Instructor"
                : "Submit Instructor"}
          </Button>
        </div>
      </form>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 p-3 rounded text-sm text-red-700 mt-4">
          <h4 className="font-medium mb-1">Validation Errors:</h4>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>
                {(error)?.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(watchedProfile?.[0] || watchedPan?.[0] || watchedAadhar?.[0] || isEditMode) && (
        <div className="mt-10 pt-6 border-t border-gray-300">
          <div className="flex flex-wrap gap-6 justify-start">
            <PreviewImage file={watchedProfile?.[0]} url={preview?.profile} label="Profile Preview" />
            <PreviewImage file={watchedPan?.[0]} url={preview?.pan} label="PAN Preview" />
            <PreviewImage file={watchedAadhar?.[0]} url={preview?.aadhar} label="Aadhar Preview" />
          </div>
        </div>
      )}
    </>
  );
}
