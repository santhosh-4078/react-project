import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useReactQuery from "../../hooks/useReactQuery";
import * as yup from "yup";
import useApiMutation from "../../hooks/Mutations/useApiMutation";
import { useEffect, useState } from "react";
import FileInput from "../form/input/FileInput";
import Select from "../form/Select";
import PhoneInput from "../../components/form/group-input/React-PhoneInput2";
import { APICONSTANT } from "../../services/config";
import { PreviewImage } from "../ui/images/previewImage";

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

type ProfileFormData = {
    first_name: string;
    last_name: string;
    email_id: string;
    phone?: string | null;
    street?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    country_name?: string | null;
    state_name?: string | null;
    profile?: FileList | string | null;
};

export default function UserEditProfile() {
    const { isOpen, openModal, closeModal } = useModal();
    const queryClient = useQueryClient();

    const userId = localStorage.getItem("user_id") ?? "1";
    const profileId = Number(userId);

    const { data: previewData, refetch } = useReactQuery("GET_PROFILE", `id=${profileId}`, true);
    const [displayProfile, setDisplayProfile] = useState<ProfileFormData | null>(null);

    const schema: yup.ObjectSchema<ProfileFormData> = yup.object({
        first_name: yup.string().required("First name is required"),
        last_name: yup.string().required("Last name is required"),
        email_id: yup.string().email("Invalid email").required("Email is required"),
        phone: yup.string().notRequired(),
        street: yup.string().notRequired(),
        city: yup.string().notRequired(),
        state: yup.string().notRequired(),
        country: yup.string().notRequired(),
        country_name: yup.string().notRequired(),
        state_name: yup.string().notRequired(),
        profile: yup.mixed<FileList | string>().notRequired(),
    });

    const {
        register,
        handleSubmit,
        reset,
        watch,
        control,
        setValue,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: yupResolver(schema),
    });

    const selectedCountry = watch("country");
    const watchedProfile = watch("profile");
    const updateProfile = useApiMutation("put", "/profile");

    const { data: countries = [] } = useReactQuery("GET_COUNTRY", "");
    const { data: states = [] } = useReactQuery("GET_STATE", `country_id=${selectedCountry}`, !!selectedCountry);

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
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (previewData?.success) {
            const current = previewData?.data;
            setDisplayProfile(current);
            reset({
                ...current,
                profile: undefined,
                country: String(current?.country ?? ""),
                state: String(current?.state ?? ""),
            });

            if (current?.profile) setValue("profile", current.profile);
        }
    }, [previewData?.data, reset, setValue]);

    const handleSave = async (data: ProfileFormData) => {
        const formData = new FormData();
        formData.append("user_group", "instructor");
        formData.append("id", profileId.toString());
        formData.append("first_name", data.first_name || "");
        formData.append("last_name", data.last_name || "");
        formData.append("email_id", data.email_id || "");
        formData.append("phone", data.phone || "");
        formData.append("street", data.street || "");
        formData.append("city", data.city || "");
        formData.append("state", data.state || "");
        formData.append("country", data.country || "");
        formData.append(
            "profile",
            data.profile instanceof FileList ? data.profile[0] ?? "" : data.profile ?? ""
        );

        const response = await updateProfile.mutateAsync({
            url: { apiUrl: `${APICONSTANT.UPDATE_PROFILE}/${profileId}` },
            body: formData,
        });

        if (response?.success) {
            await queryClient.invalidateQueries({ queryKey: ["profileData"] });
            await refetch();
            closeModal();
        }

        // if (response?.success) {
        //     queryClient.setQueryData(["profileData", `${APICONSTANT.GET_PROFILE}`, `id=${profileId}`], {
        //         data: response.data,
        //     });
        // }
    };

    return (
        <>
            {/* <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6"> */}
            {displayProfile ? (
                <>
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex flex-col gap-[30px]">
                            <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                                <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                                    <img
                                        src={typeof displayProfile.profile === "string" ? displayProfile.profile : "/images/user/owner.jpg"}
                                        alt="Profile"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div>
                                    <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                        {displayProfile.first_name} {displayProfile.last_name}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{displayProfile.email_id}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                    Personal Information
                                </h4>
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            First Name
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {displayProfile.first_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Last Name
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {displayProfile.last_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Email address
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {displayProfile.email_id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Phone
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {displayProfile.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                    Address
                                </h4>
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Country
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {displayProfile.country_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            State
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {displayProfile.state_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            City
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {displayProfile.city}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Street
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {displayProfile.street}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={openModal}
                            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                        >
                            <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                    fill=""
                                />
                            </svg>
                            Edit
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-gray-500">Loading profile...</p>
            )}
            {/* </div> */}

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">Edit Profile</h4>
                    <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>First Name *</Label>
                                <Input {...register("first_name")} error={!!errors.first_name} hint={errors.first_name?.message} />
                            </div>
                            <div>
                                <Label>Last Name *</Label>
                                <Input {...register("last_name")} error={!!errors.last_name} hint={errors.last_name?.message} />
                            </div>
                            <div>
                                <Label>Email *</Label>
                                <Input type="email" {...register("email_id")} error={!!errors.email_id} hint={errors.email_id?.message} />
                            </div>
                            <div>
                                <Label>Phone</Label>
                                <Controller
                                    name="phone"
                                    control={control}
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
                            <div>
                                <Label>City</Label>
                                <Input {...register("city")} />
                            </div>
                            <div>
                                <Label>Street</Label>
                                <Input {...register("street")} />
                            </div>
                            <div>
                                <Label>Profile Image</Label>
                                <Controller
                                    name="profile"
                                    control={control}
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

                                {(watchedProfile?.[0]) && (
                                    <div className="flex flex-wrap gap-6 justify-start">
                                        <PreviewImage
                                            file={watchedProfile instanceof FileList ? watchedProfile[0] : undefined}
                                            url={typeof watchedProfile === "string" ? watchedProfile : undefined}
                                            label="Profile Preview"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={closeModal}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
