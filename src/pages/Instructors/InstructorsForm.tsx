import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import PhoneInput from "../../components/form/group-input/React-PhoneInput2";
import Button from "../../components/ui/button/Button";
// import FetchLocationButton from "../../components/form/Location/fetchLocationButton";
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
  phone?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  profile?: FileList | string | null;
  pan?: FileList | string | null;
  aadhar?: FileList | string | null;
};

export default function InstructorsForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const instructor = location.state as
    | Partial<InstructorFormData & { id: number }>
    | undefined;
  const isEditMode = !!instructor;

  const { data: previewData, refetch } = useReactQuery(
    "VIEW_INSTRUCTOR",
    `id=${instructor?.id}`,
    !!isEditMode
  );

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
    phone: yup.string().notRequired(),
    street: yup.string().notRequired(),
    city: yup.string().notRequired(),
    state: yup.string().notRequired(),
    country: yup.string().notRequired(),
    profile: yup.mixed<FileList | string>().notRequired(),
    pan: yup.mixed<FileList | string>().notRequired(),
    aadhar: yup.mixed<FileList | string>().notRequired(),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<InstructorFormData>({
    resolver: yupResolver(schema, { abortEarly: false }),
    defaultValues: isEditMode
      ? {
        ...preview,
        profile: undefined,
        pan: undefined,
        aadhar: undefined,
        password: "",
        country: String(preview?.country ?? ""),
        state: String(preview?.state ?? ""),
      }
      : undefined,
  });

  const selectedCountry = watch("country");
  const watchedProfile = watch("profile");
  const watchedPan = watch("pan");
  const watchedAadhar = watch("aadhar");

  const createInstructor = useApiMutation("post", "/instructors");
  const updateInstructor = useApiMutation("put", "/instructors");
  const isSubmitting = createInstructor.isPending || updateInstructor.isPending;

  const { data: countries = [] } = useReactQuery("GET_COUNTRY", "");
  const { data: states = [] } = useReactQuery(
    "GET_STATE",
    `country_id=${selectedCountry}`,
    !!selectedCountry,
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
    if (isEditMode) {
      refetch();
    }
  }, [isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      setValue("state", "");
    }
  }, [selectedCountry, setValue])

  useEffect(() => {
    if (previewData?.success) {
      reset({
        ...preview,
        profile: undefined,
        pan: undefined,
        aadhar: undefined,
        password: "",
        country: String(preview?.country ?? ""),
        state: String(preview?.state ?? ""),
      });

      // Set fallback string values so they exist in `data`
      if (isEditMode) {
        if (preview?.profile) setValue("profile", preview.profile);
        if (preview?.pan) setValue("pan", preview.pan);
        if (preview?.aadhar) setValue("aadhar", preview.aadhar);
      }
    }
  }, [previewData?.data, reset, setValue]);

  const onSubmit = async (data: InstructorFormData) => {
    const formData = new FormData();
    formData.append("user_group", "instructor");

    // Append all fields explicitly
    formData.append("first_name", data.first_name || "");
    formData.append("last_name", data.last_name || "");
    formData.append("email_id", data.email_id || "");
    formData.append("password", data.password || "");
    formData.append("phone", data.phone || "");
    formData.append("street", data.street || "");
    formData.append("city", data.city || "");
    formData.append("state", data.state || "");
    formData.append("country", data.country || "");

    // Handle file or preview string
    formData.append(
      "profile",
      data.profile instanceof FileList
        ? data.profile[0] ?? ""
        : data.profile ?? ""
    );
    formData.append(
      "pan",
      data.pan instanceof FileList
        ? data.pan[0] ?? ""
        : data.pan ?? ""
    );
    formData.append(
      "aadhar",
      data.aadhar instanceof FileList
        ? data.aadhar[0] ?? ""
        : data.aadhar ?? ""
    );

    // Edit mode
    let response;
    if (isEditMode && instructor?.id) {
      formData.append("id", instructor.id.toString());
      response = await updateInstructor.mutateAsync({
        url: { apiUrl: `${APICONSTANT.UPDATE_INSTRUCTOR}/${instructor?.id}` },
        body: formData,
      });
    } else {
      response = await createInstructor.mutateAsync({
        url: { apiUrl: APICONSTANT.CREATE_INSTRUCTOR },
        body: formData,
      });
    }

    // Invalidate queries if needed
    if (response?.success) {
      await queryClient.invalidateQueries({ queryKey: ["GET_INSTRUCTOR"] });
      await queryClient.invalidateQueries({
        queryKey: [`GET_STATE?country_id=${selectedCountry}`],
      });
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
            <Label>Phone</Label>
            <Controller
              name="phone"
              control={control}
              rules={{ required: "Phone number is required" }}
              render={({ field }) => (
                <PhoneInput
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Enter phone number"
                />
              )}
            />
          </div>

          <div>
            <Label>Country</Label>
            <Controller
              name="country"
              control={control}
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value ?? undefined}
                  options={countryOptions}
                  placeholder="Select country"
                />
              )}
            />
          </div>

          <div>
            <Label>State</Label>
            <Controller
              name="state"
              control={control}
              rules={{ required: "State is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value ?? undefined}
                  options={stateOptions}
                  placeholder="Select state"
                />
              )}
            />
          </div>

          <div className="relative">
            <Label>City</Label>
            <Input
              {...register("city")}
              className="pr-28"
            />
            {/* <div className="absolute right-2 top-[30px]">
              <FetchLocationButton
                onLocationFetched={({ city, street }) => {
                  reset({
                    ...watch(),
                    city,
                    street,
                  });
                }}
              />
            </div> */}
          </div>

          <div>
            <Label>Street</Label>
            <Input
              {...register("street")}
            />
          </div>

          <div>
            <Label>Profile Image</Label>
            <Controller
              name="profile"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <FileInput
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                  ref={field.ref}
                />
              )}
            />
          </div>

          <div>
            <Label>PAN Document</Label>
            <Controller
              name="pan"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <FileInput
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                  ref={field.ref}
                />
              )}
            />
          </div>

          <div>
            <Label>Aadhar Document</Label>
            <Controller
              name="aadhar"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <FileInput
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                  ref={field.ref}
                />
              )}
            />
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

      {/* {Object.keys(errors).length > 0 && (
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
      )} */}

      {(watchedProfile?.[0] || watchedPan?.[0] || watchedAadhar?.[0] || isEditMode) && (
        <div className="mt-10 pt-6 border-t border-gray-300">
          <div className="flex flex-wrap gap-6 justify-start">

            <PreviewImage
              file={watchedProfile instanceof FileList ? watchedProfile[0] : undefined}
              url={typeof watchedProfile === "string" ? watchedProfile : preview?.profile}
              label="Profile Preview"
            />

            <PreviewImage
              file={watchedPan instanceof FileList ? watchedPan[0] : undefined}
              url={typeof watchedPan === "string" ? watchedPan : preview?.pan}
              label="PAN Preview"
            />

            <PreviewImage
              file={watchedAadhar instanceof FileList ? watchedAadhar[0] : undefined}
              url={typeof watchedAadhar === "string" ? watchedAadhar : preview?.aadhar}
              label="Aadhar Preview"
            />
          </div>
        </div>
      )}
    </>
  );
}
