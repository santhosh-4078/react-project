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

type StudentsFormData = {
    first_name: string;
    last_name: string;
    email_id: string;
    phone: string;
    profile?: FileList | string;
    pan: FileList;
    batches: string;
    aadhar: FileList;
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
    const { data: previewData } = useReactQuery(
        "VIEW_INSTRUCTOR",
        `id=${students?.id}`,
        !!isEditMode
    );

    const preview = previewData?.data;
    const schema: yup.ObjectSchema<StudentsFormData> = yup.object({
        first_name: yup.string().required("First name is required"),
        last_name: yup.string().required("Last name is required"),
        email_id: yup.string().email("Invalid email").required("Email is required"),
        phone: yup.string().required("Phone number is required"),
        batches: yup.string().required("Batch is required"),
        profile: yup
            .mixed<FileList>()
            .test("fileRequired", "Profile image is required", function (value) {
                const hasFile = value instanceof FileList && value.length > 0;
                const hasUrl = !!preview?.profile;
                return isEditMode ? hasFile || hasUrl : hasFile;
            }),
        pan: yup.mixed<FileList>().test("required", "PAN file is required", (value) => !!value && value.length > 0).required(),
        aadhar: yup.mixed<FileList>().test("required", "Aadhar file is required", (value) => !!value && value.length > 0).required(),
    });

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<StudentsFormData>({
        resolver: yupResolver(schema),
        defaultValues: isEditMode ? { ...students } : undefined,
    });

    const createCourses = useApiMutation("post", "/student");
    const updateCourses = useApiMutation("post", "/student");
    const isSubmitting = createCourses.isPending || updateCourses.isPending;
    const { data: batches = [] } = useReactQuery("BATCHES_DROPDOWN", "");

    const batchesOptions = [
        { value: "", label: "Select batch" },
        ...(batches?.datas ?? []).map((course: Batches) => ({ value: String(course.id), label: course.text })),
    ];
    useEffect(() => {
        if (students) {
            reset({ ...students });
        }
    }, [students, reset]);

    const onSubmit = async (data: StudentsFormData) => {
        const payload: Record<string, string> = {
        };
        let response;
        if (isEditMode && students?.id) {
            payload["id"] = students.id.toString()
            response = await updateCourses.mutateAsync({ url: { apiUrl: APICONSTANT.UPDATE_COURSE }, body: payload });
        } else {
            response = await createCourses.mutateAsync({ url: { apiUrl: APICONSTANT.CREATE_COURSE }, body: payload });
        }
        if (response?.success) {
            await queryClient.invalidateQueries({ queryKey: ["GET_COURSES"] });
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
                                    value={field.value}
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
                            <Select {...field} options={batchesOptions} placeholder="Select course" className="dark:bg-dark-900" />
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
        </>
    );
}
