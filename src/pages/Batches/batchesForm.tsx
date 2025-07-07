import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import DatePicker from "../../components/form/DatePicker";
import Button from "../../components/ui/button/Button";
import { ChevronLeftIcon } from "../../icons";
import useApiMutation from "../../hooks/Mutations/useApiMutation";
import { APICONSTANT } from "../../services/config";
import useReactQuery from "../../hooks/useReactQuery";
import Select from "../../components/form/Select";

type BatchesFormData = {
    name: string;
    description: string;
    location: string;
    facility: string;
    start_date: string;
    start_time: string;
    end_time: string;
    instructors: string;
    courses: string;
    course_id?: number | string | null;
    instructor_id?: number | string | null;
};
interface Courses {
    id: number;
    text: string;
}

interface Instructors {
    id: number;
    text: string;
}
export default function BatchesForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const Batches = location.state as Partial<BatchesFormData & { id: number }> | undefined;
    const isEditMode = !!Batches;

    const schema: yup.ObjectSchema<BatchesFormData> = yup.object({
        name: yup.string().required("Name is required"),
        description: yup.string().required("Batch_Description is required"),
        location: yup.string().required("Location is required"),
        facility: yup.string().required("Facility is required"),
        start_date: yup.string().required("Start Date is required"),
        start_time: yup.string().required("Start_Time is required"),
        end_time: yup.string().required("End_Time is required"),
        courses: yup.string().required("Course is required"),
        instructors: yup.string().required("Instructor is required"),
        course_id: yup.string().notRequired(),
        instructor_id: yup.string().notRequired(),
    });

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<BatchesFormData>({
        resolver: yupResolver(schema),
        defaultValues: isEditMode ? { ...Batches } : undefined,
    });

    const createBatches = useApiMutation("post", "/batches");
    const updateBatches = useApiMutation("put", "/batches");
    const isSubmitting = createBatches.isPending || updateBatches.isPending;
    const { data: courses = [] } = useReactQuery("COURSES_DROPDOWN", "");
    const { data: instructors = [] } = useReactQuery("INSTRUCTOR_DROPDOWN", "");

    const coursesOptions = [
        { value: "", label: "Select courses" },
        ...(courses?.datas ?? []).map((course: Courses) => ({ value: String(course.id), label: course.text })),
    ];

    const instructorOptions = [
        { value: "", label: "Select instructors" },
        ...(instructors?.datas ?? []).map((instr: Instructors) => ({ value: String(instr.id), label: instr.text })),
    ];
    useEffect(() => {
        if (Batches) {
            let formattedDate = "";
            if (Batches.start_date) {
                const date = new Date(Batches.start_date);
                if (!isNaN(date.getTime())) {
                    // Convert to Asia/Kolkata and format as YYYY-MM-DD
                    const offsetDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
                    const year = offsetDate.getFullYear();
                    const month = String(offsetDate.getMonth() + 1).padStart(2, "0");
                    const day = String(offsetDate.getDate()).padStart(2, "0");
                    formattedDate = `${day}-${month}-${year}`;
                }
            }
            reset({
                ...Batches,
                start_date: formattedDate,
                courses: Batches.course_id ? String(Batches.course_id) : (Batches.courses ? String(Batches.courses) : ""),
                instructors: Batches.instructor_id ? String(Batches.instructor_id) : (Batches.instructors ? String(Batches.instructors) : ""),
                start_time: Batches.start_time ? String(Batches.start_time).slice(0,5) : "",
                end_time: Batches.end_time ? String(Batches.end_time).slice(0,5) : "",
            });
        }
    }, [Batches, reset]);

    const onSubmit = async (data: BatchesFormData) => {
        const payload: Record<string, string> = {
            name: data.name,
            description: data.description,
            start_date: data.start_date,
            start_time: data.start_time,
            end_time: data.end_time,
            facility: data.facility,
            location: data.location,
            course_id: data.courses,
            instructor_id: data.instructors,
        };
        let response;
        if (isEditMode && Batches?.id) {
            payload["id"] = String(Batches.id);
            response = await updateBatches.mutateAsync({ url: { apiUrl: APICONSTANT.UPDATE_BATCHES }, body: payload });
        } else {
            response = await createBatches.mutateAsync({ url: { apiUrl: APICONSTANT.CREATE_BATCHES }, body: payload });
        }
        if (response?.success) {
            await queryClient.invalidateQueries({ queryKey: ["GET_BATCHES"] });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-1xl mx-auto mt-10">
                <div className="flex items-center gap-2">
                    <button type="button" onClick={() => navigate(-1)} className="text-gray-700 dark:text-white hover:text-brand-500 flex items-center gap-1">
                        <ChevronLeftIcon />
                    </button>
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{isEditMode ? "Edit Batches" : "Add New Batches"}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Batch Name *</Label><Input {...register("name")} error={!!errors.name} hint={errors.name?.message} /></div>
                    <div><Label>Description *</Label><Input {...register("description")} error={!!errors.description} hint={errors.description?.message} /></div>
                    <div>
                        <Controller
                            name="start_date"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    id="start_date"
                                    label="Start Date *"
                                    error={!!errors.start_date}
                                    hint={errors.start_date?.message}
                                    value={field.value}
                                    onInput={field.onChange}
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Controller
                            name="start_time"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    id="start_time"
                                    label="Start Time *"
                                    error={!!errors.start_time}
                                    hint={errors.start_time?.message}
                                    value={field.value}
                                    onInput={field.onChange}
                                    mode="time"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Controller
                            name="end_time"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    id="end_time"
                                    label="End Time *"
                                    error={!!errors.end_time}
                                    hint={errors.end_time?.message}
                                    value={field.value}
                                    onInput={field.onChange}
                                    mode="time"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Label>Courses *</Label>
                        <Controller name="courses" control={control} rules={{ required: "course is required" }} render={({ field }) => (
                            <Select {...field} options={coursesOptions} placeholder="Select course" className="dark:bg-dark-900" />
                        )} />
                        {errors.courses && <p className="text-red-500 text-sm">{errors.courses.message}</p>}
                    </div>
                    <div>
                        <Label>Instructors *</Label>
                        <Controller name="instructors" control={control} rules={{ required: "Instructor is required" }} render={({ field }) => (
                            <Select {...field} options={instructorOptions} placeholder="Select instructor" className="dark:bg-dark-900" />
                        )} />
                        {errors.instructors && <p className="text-red-500 text-sm">{errors.instructors.message}</p>}
                    </div>
                    <div><Label>Location *</Label><Input {...register("location")} error={!!errors.location} hint={errors.location?.message} /></div>
                    <div><Label>Facility *</Label><Input {...register("facility")} error={!!errors.facility} hint={errors.facility?.message} /></div>
                </div>
                <div className="md:flex justify-end w-full">
                    <Button type="submit" disabled={isSubmitting}>
                        {(isSubmitting)
                            ? (isEditMode ? "Updating..." : "Submitting...")
                            : (isEditMode ? "Update Batch" : "Submit Batch")}
                    </Button>
                </div>
            </form>
        </>
    );
}
