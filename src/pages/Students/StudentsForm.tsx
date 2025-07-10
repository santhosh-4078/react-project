import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { ChevronLeftIcon } from "../../icons";
import useApiMutation from "../../hooks/Mutations/useApiMutation";
import { APICONSTANT } from "../../services/config";
import FileInput from "../../components/form/input/FileInput";
import PhoneInput from "../../components/form/group-input/React-PhoneInput2";
import { Controller } from "react-hook-form";
import useReactQuery from "../../hooks/useReactQuery";
import Select from "../../components/form/Select";
import FetchLocationButton from "../../components/form/Location/fetchLocationButton";
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

type StudentsFormData = {
    first_name: string;
    last_name: string;
    email_id: string;
    phone?: string | null;
    street?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    batches?: string | null;
    profile?: FileList | string | null;
    pan?: FileList | string | null;
    aadhar?: FileList | string | null;
};

interface Batches {
    id: number;
    text: string;
}

export default function StudentsForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const students = location.state as Partial<StudentsFormData & { id: number }> | undefined;
    const isEditMode = !!students;
    const { data: previewData, refetch } = useReactQuery(
        "VIEW_STUDENTS",
        `id=${students?.id}`,
        !!isEditMode
    );

    const preview = previewData?.data;
    const schema: yup.ObjectSchema<StudentsFormData> = yup.object({
        first_name: yup.string().required("First name is required"),
        last_name: yup.string().required("Last name is required"),
        email_id: yup.string().email("Invalid email").required("Email is required"),
        batches: yup.string().notRequired(),
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
    } = useForm<StudentsFormData>({
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
    const createStudents = useApiMutation("post", "/student");
    const updateStudents = useApiMutation("put", "/student");
    const isSubmitting = createStudents.isPending || updateStudents.isPending;
    const { data: batches = [] } = useReactQuery("BATCHES_DROPDOWN", "");

    const batchesOptions = [
        { value: "", label: "Select batch" },
        ...(batches?.datas ?? []).map((course: Batches) => ({ value: String(course.id), label: course.text })),
    ];
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

            if (isEditMode) {
                if (preview?.profile) setValue("profile", preview.profile);
                if (preview?.pan) setValue("pan", preview.pan);
                if (preview?.aadhar) setValue("aadhar", preview.aadhar);
            }
        }
    }, [previewData?.data, reset, setValue]);

    const onSubmit = async (data: StudentsFormData) => {
        const formData = new FormData();
        formData.append("user_group", "instructor");

        // Append all fields explicitly
        formData.append("first_name", data.first_name || "");
        formData.append("last_name", data.last_name || "");
        formData.append("email_id", data.email_id || "");
        formData.append("phone", data.phone || "");
        formData.append("street", data.street || "");
        formData.append("city", data.city || "");
        formData.append("state", data.state || "");
        formData.append("country", data.country || "");
        formData.append("batches", data.country || "");

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
        if (isEditMode && students?.id) {
            formData.append("id", students.id.toString());
            response = await updateStudents.mutateAsync({
                url: { apiUrl: `${APICONSTANT.UPDATE_STUDENTS}/${students?.id}` },
                body: formData,
            });
        } else {
            response = await createStudents.mutateAsync({
                url: { apiUrl: APICONSTANT.CREATE_STUDENTS },
                body: formData,
            });
        }
        if (response?.success) {
            await queryClient.invalidateQueries({ queryKey: ["GET_STUDENTS"] });
        }
    };


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-1xl mx-auto mt-10">
                <div className="flex items-center gap-2">
                    <button type="button" onClick={() => navigate(-1)} className="text-gray-700 dark:text-white hover:text-brand-500 flex items-center gap-1">
                        <ChevronLeftIcon />
                    </button>
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{isEditMode ? "Edit Students" : "Add New Students"}</h3>
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
                    <div>
                        <Label>Phone *</Label>
                        <Controller
                            name="phone"
                            control={control}
                            rules={{ required: "Phone number is required" }}
                            render={({ field }) => (
                                <PhoneInput
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    error={!!errors.phone}
                                    placeholder="Enter phone number"
                                />
                            )}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                    </div>
                    <div>
                        <Label>Country *</Label>
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
                        <Label>State *</Label>
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
                        <Label>City *</Label>
                        <Input
                            {...register("city")}
                            className="pr-28"
                        />
                        <div className="absolute right-2 top-[30px]">
                            <FetchLocationButton
                                onLocationFetched={({ city, street }) => {
                                    reset({
                                        ...watch(),
                                        city,
                                        street,
                                    });
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Street *</Label>
                        <Input
                            {...register("street")}
                        />
                    </div>
                    <div>
                        <Label>Profile Image *</Label>
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
                        {errors?.profile && (
                            <p className="text-red-500 text-sm mt-1">{errors?.profile?.message}</p>
                        )}
                    </div>
                    <div>
                        <Label>Batches *</Label>
                        <Controller name="batches" control={control} rules={{ required: "Batch is required" }} render={({ field }) => (
                            <Select {...field}
                                options={batchesOptions}
                                value={field.value ?? undefined}
                                placeholder="Select course"
                                className="dark:bg-dark-900" />
                        )} />
                        {errors.batches && <p className="text-red-500 text-sm">{errors.batches.message}</p>}
                    </div>
                    <div><Label>PAN Document *</Label><FileInput {...register("pan")} /></div>
                    <div><Label>Aadhar Document *</Label><FileInput {...register("aadhar")} /></div>
                </div>
                <div className="md:flex justify-end w-full">
                    <Button type="submit" disabled={isSubmitting}>
                        {(isSubmitting)
                            ? (isEditMode ? "Updating..." : "Submitting...")
                            : (isEditMode ? "Update Student" : "Submit Student")}
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
