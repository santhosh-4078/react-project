const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/";

export const APIURLS = {
  // baseUrl: BASE_URL.endsWith("v1/") ? BASE_URL : BASE_URL + "v1/",
  baseUrl: BASE_URL.endsWith("/") ? BASE_URL : BASE_URL + "/",
  imageUrl: BASE_URL,
};

export const APPCONFIG = {
  name: "Friends Project",
  appMode: import.meta.env.MODE || "development",
};

export const APICONSTANT = {
  LOGIN: "api/users/verifylogin",
  STUDENTS: "students",
  PROFILE: "auth/profile",
  GET_PROFILE: "api/users/getprofile",
  GET_INSTRUCTOR: "api/users/list",
  CREATE_INSTRUCTOR: "api/users/createusers",
  VIEW_INSTRUCTOR: "api/users/viewuser",
  UPDATE_INSTRUCTOR: "api/users/updateuser",
  DELETE_INSTRUCTOR: "api/users/deleteuser",
  GET_COUNTRY: "api/users/getcountries",
  GET_STATE: "api/users/getstates",
  GET_COURSES: "api/courses/list",
  CREATE_COURSE: "api/courses/create",
  UPDATE_COURSE: "api/courses/update",
  DELETE_COURSE: "api/courses/delete",
  GET_BATCHES: "api/batches/list",
  CREATE_BATCHES: "api/batches/create",
  UPDATE_BATCHES: "api/batches/update",
  DELETE_BATCHES: "api/batches/delete",
  COURSES_DROPDOWN: "api/courses/allcourses",
  INSTRUCTOR_DROPDOWN: "api/users/allusers",
  GET_STUDENTS: "api/students/list",
  VIEW_STUDENTS: "api/students/view",
  CREATE_STUDENTS: "api/students/createstudent",
  UPDATE_STUDENTS: "api/students/updatestudent",
  DELETE_STUDENTS: "api/students/delete",
  BATCHES_DROPDOWN: "api/batches/allbatches",
} as const

export type APIKeys = keyof typeof APICONSTANT;