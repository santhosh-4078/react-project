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

type StudentsFormData = {
    name: string;
    pan: FileList;
    aadhar: FileList;
};

export default function StudentsForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const courses = location.state as Partial<StudentsFormData & { id: number }> | undefined;
    const isEditMode = !!courses;

    const schema: yup.ObjectSchema<StudentsFormData> = yup.object({
        name: yup.string().required("Student_Name is required"),
        pan: yup.mixed<FileList>().test("required", "PAN file is required", (value) => !!value && value.length > 0).required(),
        aadhar: yup.mixed<FileList>().test("required", "Aadhar file is required", (value) => !!value && value.length > 0).required(),
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<StudentsFormData>({
        resolver: yupResolver(schema),
        defaultValues: isEditMode ? { ...courses } : undefined,
    });

    const createCourses = useApiMutation("post", "/student");
    const updateCourses = useApiMutation("post", "/student");
    const isSubmitting = createCourses.isPending || updateCourses.isPending;

    useEffect(() => {
        if (courses) {
            reset({ ...courses });
        }
    }, [courses, reset]);

    const onSubmit = async (data: StudentsFormData) => {
        const payload: Record<string, string> = {
            name: data.name,
        };
        let response;
        if (isEditMode && courses?.id) {
            payload["id"] = courses.id.toString()
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
                    <div><Label>Student Name *</Label><Input {...register("name")} error={!!errors.name} hint={errors.name?.message} /></div>
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
