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

type CoursesFormData = {
  name: string;
  description?: string;
};

export default function CoursesForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const courses = location.state as Partial<CoursesFormData & { id: number }> | undefined;
  const isEditMode = !!courses;

  const schema: yup.ObjectSchema<CoursesFormData> = yup.object({
    name: yup.string().required("Course_Name is required"),
    description: yup.string().notRequired(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CoursesFormData>({
    resolver: yupResolver(schema),
    defaultValues: isEditMode ? { ...courses } : undefined,
  });

  const createCourses = useApiMutation("post", "/courses");
  const updateCourses = useApiMutation("post", "/courses");
  const isSubmitting = createCourses.isPending || updateCourses.isPending;

    useEffect(() => {
      if (courses) {
        reset({ ...courses});
      }
    }, [courses, reset]);

  const onSubmit = async (data: CoursesFormData) => {
    const payload: Record<string, string> = {
      name: data.name,
      description: data.description || "",
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
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{isEditMode ? "Edit Courses" : "Add New Courses"}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Course Name *</Label><Input {...register("name")} error={!!errors.name} hint={errors.name?.message} /></div>
          <div><Label>Description *</Label><Input {...register("description")} error={!!errors.description} hint={errors.description?.message} /></div>
        </div>
        <div className="md:flex justify-end w-full">
          <Button type="submit" disabled={isSubmitting}>
            {(isSubmitting)
              ? (isEditMode ? "Updating..." : "Submitting...")
              : (isEditMode ? "Update Course" : "Submit Course")}
          </Button>
        </div>
      </form>
    </>
  );
}
