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
    start_time: string;
    course_name: string;
    instructor_first_name: string;
    location: string;
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
            if (response?.success) {
                await queryClient.invalidateQueries({
                    queryKey: ["GET_BATCHES"],
                });
            }
        } catch (error) {
            console.error("Error deleting instructor:", error);
        }
    };

    const columns: ColumnDef<Batches>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <span>{row?.original?.id || "---"}</span>
            )
        },
        {
            accessorKey: "name",
            header: "Batch Name",
            cell: ({ row }) => (
                <span>{row?.original?.name || "---"}</span>
            )
        },
        {
            accessorKey: "start_date",
            header: "Start Date",
            cell: ({ getValue }) => {
                const value = getValue();
                if (!value || typeof value !== "string") return "-";
                const date = new Date(value);
                if (isNaN(date.getTime())) return "-";
                return date.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", year: "numeric", month: "short", day: "2-digit" });
            },
        },
        {
            accessorKey: "start_time",
            header: "Start Time",
            cell: ({ row }) => (
                <span>{row?.original?.start_time || "---"}</span>
            )
        },
        {
            accessorKey: "course_name",
            header: "Course Name",
            cell: ({ row }) => (
                <span>{row?.original?.course_name || "---"}</span>
            )
        },
        {
            accessorKey: "instructor_first_name",
            header: "Instructor Name",
            cell: ({ row }) => (
                <span>{row?.original?.instructor_first_name || "---"}</span>
            )
        },
        {
            accessorKey: "location",
            header: "Location",
            cell: ({ row }) => (
                <span>{row?.original?.location || "---"}</span>
            )
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