// InstructorsForm.tsx
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
  const instructor = location.state as Partial<InstructorFormData & { id: number }> | undefined;
  const isEditMode = !!instructor;

  const schema: yup.ObjectSchema<InstructorFormData> = yup.object({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email_id: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Minimum 6 characters")
      .when([], {
        is: () => !isEditMode,
        then: schema => schema.required("Password is required"),
      }),
    phone: yup.string().required("Phone number is required"),
    street: yup.string().required("Street is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    country: yup.string().required("Country is required"),
    profile: yup.mixed<FileList>().test("required", "Profile image is required", (value) => !!value && value.length > 0).required(),
    pan: yup.mixed<FileList>().test("required", "PAN file is required", (value) => !!value && value.length > 0).required(),
    aadhar: yup.mixed<FileList>().test("required", "Aadhar file is required", (value) => !!value && value.length > 0).required(),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<InstructorFormData>({
    resolver: yupResolver(schema),
    defaultValues: isEditMode ? { ...instructor, password: "" } : undefined,
  });

  const selectedCountry = watch("country");
  const watchedProfile = watch("profile");
  const watchedPan = watch("pan");
  const watchedAadhar = watch("aadhar");

  const createInstructor = useApiMutation("post", "/instructors");
  const updateInstructor = useApiMutation("put", "/instructors");
  const isSubmitting = createInstructor.isPending || updateInstructor.isPending;
  // const { data: previewData } = useReactQuery("UPDATE_INSTRUCTOR", `id=${instructor?.id}`);
  const { data: countries = [] } = useReactQuery("GET_COUNTRY", "");
  const { data: states = [] } = useReactQuery("GET_STATE", `country_id=${selectedCountry}`);

  const countryOptions = [
    { value: "", label: "Select country" },
    ...(countries?.datas ?? []).map((c: Country) => ({ value: String(c.id || c.country_id), label: c.name })),
  ];

  const stateOptions = [
    { value: "", label: "Select state" },
    ...(states?.datas ?? []).map((s: State) => ({ value: String(s.id || s.zone_id), label: s.name })),
  ];

  useEffect(() => {
    if (instructor) {
      reset({ ...instructor, password: "" });
    }
  }, [instructor, reset]);

  const onSubmit = async (data: InstructorFormData) => {
    const formData = new FormData();
    formData.append("user_group", "instructor");
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList && value.length > 0) {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value as string);
      }
    });

    let response;
    if (isEditMode && instructor?.id) {
      formData.append("id", instructor.id.toString());
      response = await updateInstructor.mutateAsync({ url: { apiUrl: APICONSTANT.UPDATE_INSTRUCTOR }, body: formData });
    } else {
      response = await createInstructor.mutateAsync({ url: { apiUrl: APICONSTANT.CREATE_INSTRUCTOR }, body: formData });
    }

    if (response?.success) {
      await queryClient.invalidateQueries({ queryKey: ["GET_INSTRUCTOR"] });
    }
  };

  return (
    <>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-1xl mx-auto mt-10">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate(-1)} className="text-gray-700 dark:text-white hover:text-brand-500 flex items-center gap-1">
            <ChevronLeftIcon />
          </button>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{isEditMode ? "Edit Instructor" : "Add New Instructor"}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>First Name *</Label><Input {...register("first_name")} error={!!errors.first_name} hint={errors.first_name?.message} /></div>
          <div><Label>Last Name *</Label><Input {...register("last_name")} error={!!errors.last_name} hint={errors.last_name?.message} /></div>
          <div><Label>Email *</Label><Input type="email" {...register("email_id")} error={!!errors.email_id} hint={errors.email_id?.message} /></div>
          {!isEditMode && (<div><Label>Password *</Label><Input type="password" {...register("password")} error={!!errors.password} hint={errors.password?.message} /></div>)}
          <div><Label>Phone *</Label><Input {...register("phone")} error={!!errors.phone} hint={errors.phone?.message} /></div>
          <div><Label>Street *</Label><Input {...register("street")} error={!!errors.street} hint={errors.street?.message} /></div>
          <div><Label>City *</Label><Input {...register("city")} error={!!errors.city} hint={errors.city?.message} /></div>

          <div>
            <Label>Country *</Label>
            <Controller name="country" control={control} rules={{ required: "Country is required" }} render={({ field }) => (
              <Select {...field} options={countryOptions} placeholder="Select country" className="dark:bg-dark-900" />
            )} />
            {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
          </div>

          <div>
            <Label>State *</Label>
            <Controller name="state" control={control} rules={{ required: "State is required" }} render={({ field }) => (
              <Select {...field} options={stateOptions} placeholder="Select state" className="dark:bg-dark-900" />
            )} />
            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
          </div>

          <div><Label>Profile Image *</Label><FileInput {...register("profile")} /></div>
          <div><Label>PAN Document *</Label><FileInput {...register("pan")} /></div>
          <div><Label>Aadhar Document *</Label><FileInput {...register("aadhar")} /></div>
        </div>

        <div className="md:flex justify-end w-full">
          <Button type="submit" disabled={isSubmitting}>
            {(isSubmitting)
              ? (isEditMode ? "Updating..." : "Submitting...")
              : (isEditMode ? "Update Instructor" : "Submit Instructor")}
          </Button>
        </div>
      </form>

      {/* Preview Section */}
      {(watchedProfile?.[0] || watchedPan?.[0] || watchedAadhar?.[0]) && (
        <div className="mt-10 pt-6 border-t border-gray-300">
          <div className="flex flex-wrap gap-6 justify-start">
            {watchedProfile?.[0] instanceof File && (
              <div className="text-center">
                <img
                  src={URL.createObjectURL(watchedProfile[0])}
                  alt="Profile Preview"
                  className="w-22 h-22 object-contain rounded border border-gray-300 bg-white p-1"
                />
                <p className="text-sm mt-1 text-gray-600">Profile Preview</p>
              </div>
            )}
            {watchedPan?.[0] instanceof File && (
              <div className="text-center">
                <img
                  src={URL.createObjectURL(watchedPan[0])}
                  alt="PAN Preview"
                  className="w-22 h-22 object-contain rounded border border-gray-300 bg-white p-1"
                />
                <p className="text-sm mt-1 text-gray-600">PAN Preview</p>
              </div>
            )}
            {watchedAadhar?.[0] instanceof File && (
              <div className="text-center">
                <img
                  src={URL.createObjectURL(watchedAadhar[0])}
                  alt="Aadhar Preview"
                  className="w-22 h-22 object-contain rounded border border-gray-300 bg-white p-1"
                />
                <p className="text-sm mt-1 text-gray-600">Aadhar Preview</p>
              </div>
            )}
          </div>
        </div>
      )}

    </>
  );
}
