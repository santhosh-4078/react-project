// import React from 'react'
// import { Link } from "react-router";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { EyeCloseIcon, EyeIcon } from "../../icons";
// import Label from '../../components/form/Label';
// import Input from '../../components/form/input/InputField';
// // import Select from "../form/Select";
// import Checkbox from '../../components/form/input/Checkbox';
// import Button from '../../components/ui/button/Button';
// import { APICONSTANT } from "../../services/config";

// export default function InstructorsForm() {
//   return (
//     <div>
//       Instructors Form
//     </div>
//   )
// }

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { ChevronLeftIcon } from "../../icons";
import useApiMutation from "../../hooks/Mutations/useApiMutation";
import { APICONSTANT } from "../../services/config";
import FileInput from "../../components/form/input/FileInput";

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
  const instructor = location.state as Partial<InstructorFormData & { id: number }> | undefined;
  const isEditMode = !!instructor;

  const schema: yup.ObjectSchema<InstructorFormData> = yup.object({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email_id: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
    phone: yup.string().required("Phone number is required"),
    street: yup.string().required("Street is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    country: yup.string().required("Country is required"),
    profile: yup
      .mixed<FileList>()
      .test("required", "Profile image is required", (value) => !!value && value.length > 0)
      .required(),
    pan: yup
      .mixed<FileList>()
      .test("required", "PAN file is required", (value) => !!value && value.length > 0)
      .required(),
    aadhar: yup
      .mixed<FileList>()
      .test("required", "Aadhar file is required", (value) => !!value && value.length > 0)
      .required(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InstructorFormData>({
    resolver: yupResolver(schema),
    defaultValues: isEditMode ? { ...instructor, password: "" } : undefined,
  });

  useEffect(() => {
    if (instructor) {
      reset({ ...instructor, password: "" });
    }
  }, [instructor, reset]);

  const createInstructor = useApiMutation("post", "/instructors");
  const updateInstructor = useApiMutation("put", "/instructors");

  const onSubmit = async (data: InstructorFormData) => {
  const formData = new FormData();

  formData.append("user_group", "instructor");

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof FileList && value.length > 0) {
      formData.append(key, value[0]); // only append the actual File object
    } else {
      formData.append(key, value as string);
    }
  });

  if (isEditMode && instructor?.id) {
    formData.append("id", instructor.id.toString());
    await updateInstructor.mutateAsync({
      url: { apiUrl: APICONSTANT.UPDATE_INSTRUCTOR },
      body: formData,
    });
  } else {
    createInstructor.mutateAsync({
      url: { apiUrl: APICONSTANT.CREATE_INSTRUCTOR },
      body: formData,
    });
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-1xl mx-auto mt-10">
      {/* Back Button */}
      <div className="mb-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-gray-700 hover:text-brand-500 flex items-center gap-1"
        >
          <ChevronLeftIcon />
          <span className="text-sm">Back</span>
        </button>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold mb-4">
        {isEditMode ? "Edit Instructor" : "Add New Instructor"}
      </h2>

      {/* Form Fields */}
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

        {!isEditMode && (
          <div>
            <Label>Password *</Label>
            <Input
              type="password"
              {...register("password")}
              error={!!errors.password}
              hint={errors.password?.message}
            />
          </div>
        )}

        <div>
          <Label>Phone *</Label>
          <Input {...register("phone")} error={!!errors.phone} hint={errors.phone?.message} />
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
          <Label>State *</Label>
          <Input {...register("state")} error={!!errors.state} hint={errors.state?.message} />
        </div>
        <div>
          <Label>Country *</Label>
          <Input {...register("country")} error={!!errors.country} hint={errors.country?.message} />
        </div>
        {/* <div>
          <Label>Profile Image *</Label>
          <Input type="file" {...register("profile")} error={!!errors.profile} />
        </div>
        <div>
          <Label>PAN Document *</Label>
          <Input type="file" {...register("pan")} error={!!errors.pan} />
        </div>
        <div>
          <Label>Aadhar Document *</Label>
          <Input type="file" {...register("aadhar")} error={!!errors.aadhar} />
        </div> */}
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

      {/* Submit Button */}
      <div className="md:flex justify-end w-full">
        <Button type="submit">
          {isEditMode ? "Update Instructor" : "Submit Instructor"}
        </Button>
      </div>
    </form>
  );
}