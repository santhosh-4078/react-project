import { useNavigate } from "react-router";
import { ColumnDef } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import ComponentCard from "../../components/common/ComponentCard";
import RowActionsMenu from "../../components/tableActions/RowActionsMenu";
import { APICONSTANT } from "../../services/config";
import useDeleteMutation from "../../hooks/Mutations/useDeleteMutation";
import useReactQuery from "../../hooks/useReactQuery";

type Batches = {
    id: number;
    name: string;
    description: string;
};

interface Courses {
    id: number;
    text: string;
}

interface Instructors {
    id: number;
    text: string;
}

const pageDetails = {
    title: "Batches",
    addPage: "batches-form",
};

export default function BatchesList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const deleteMutation = useDeleteMutation();
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

    const handleDelete = async (id: number) => {
        try {
            const apiUrl = `${APICONSTANT.DELETE_BATCHES}/${id}`;
            const response = await deleteMutation.mutateAsync({
                url: { apiUrl },
            });
            if ((response as any)?.success) {
                await queryClient.invalidateQueries({
                    queryKey: ["GET_BATCHES"]
                })
            }
        } catch (error) {
            console.error("Error deleting instructor:", error);
        }
    };

    const columns: ColumnDef<Batches>[] = [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            header: "Batch Name",
            accessorKey: "name",
        },
        {
            header: "Start Date",
            accessorKey: "start_date",
            cell: ({ getValue }) => {
                const value = getValue();
                if (!value || typeof value !== "string") return "-";
                const date = new Date(value);
                if (isNaN(date.getTime())) return "-";
                return date.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", year: "numeric", month: "short", day: "2-digit" });
            },
        },
        {
            header: "Start Time",
            accessorKey: "start_time",
        },
        {
            header: "Course Name",
            accessorKey: "course_name",
        },
        {
            header: "Instructor Name",
            accessorKey: "instructor_first_name",
        },
        {
            header: "Location",
            accessorKey: "location",
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const batches = row.original;
                return (
                    <RowActionsMenu
                        onEdit={() =>
                            navigate("batches-form", { state: batches })
                        }
                        onDelete={() =>
                            handleDelete(batches.id)
                        }
                    />
                );
            },
        },
    ];

    return (
        <div>
            <ComponentCard<Batches>
                title={pageDetails.title}
                listAPI="GET_BATCHES"
                addPage={pageDetails.addPage}
                columns={columns}
                queryParams={{
                    filter_batchname: "",
                    filter_course_id: "",
                    filter_instructor_id: "",
                }}
                selectOptions={{
                    filter_course_id: coursesOptions,
                    filter_instructor_id: instructorOptions,
                }}
            />
        </div>
    );
}