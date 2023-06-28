import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Container from "../../components/container";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Modal from "../../components/Modal";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import {
  EditPencil,
  Trash,
  AddCircle,
  FastArrowRight,
  FastArrowLeft,
} from "iconoir-react";
import { toast } from "react-toastify";

const Index = () => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [user, setUser] = useState({});
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const initialValues = {
    id: isUpdate ? user.id : "",
    name: isUpdate ? user.name : "",
    email: isUpdate ? user.email : "",
    gender: isUpdate ? user.gender : "",
    status: isUpdate ? user.status : "",
  };

  const showToast = ({ content, type }) => {
    return toast[type](content, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const editUser = (user) => {
    setUser(user);
    setIsUpdate(true);
    setOpen(true);
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Name field is required";
    }
    if (!values.email) {
      errors.email = "Email field is required";
    }
    if (!values.gender) {
      errors.gender = "Gender field is required";
    }
    if (!values.status) {
      errors.status = "Status field is required";
    }

    return errors;
  };

  const openModal = () => {
    setIsUpdate(false);
    setOpen(true);
  };

  const deleteUser = async (userId) => {
    setMounted(false);
    try {
      const response = await axios.delete(
        `https://gorest.co.in/public/v2/users/${userId}`,

        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GOREST_TOKEN}`,
          },
        }
      );
      if (response.status == 204) {
        showToast({ content: "User deleted", type: "success" });
        setMounted(true);
      }
    } catch (error) {
      showToast({ content: "Failed delete user", type: "error" });
      console.log(error);
    }
  };

  const onSubmit = async (values, { setErrors, setSubmitting, resetForm }) => {
    setSubmitting(true);
    setMounted(false);
    if (isUpdate) {
      try {
        const response = await axios.patch(
          `https://gorest.co.in/public/v2/users/${values.id}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_GOREST_TOKEN}`,
            },
          }
        );
        if (response.status == 200) {
          showToast({ content: "User updated", type: "success" });
          setSubmitting(false);
          setMounted(true);
          setOpen(false);
          resetForm();
        }
      } catch (error) {
        error.response.data.forEach((item) => {
          setErrors({ [item.field]: [item.message] });
        });
      }
    } else {
      try {
        const response = await axios.post(
          `https://gorest.co.in/public/v2/users`,
          values,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_GOREST_TOKEN}`,
            },
          }
        );
        if (response.status == 201) {
          showToast({ content: "User added", type: "success" });
          setSubmitting(false);
          setMounted(true);
          setOpen(false);
          resetForm();
        }
      } catch (error) {
        error.response.data.forEach((item) => {
          setErrors({ [item.field]: [item.message] });
        });
      }
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (mounted) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(
            `https://gorest.co.in/public/v2/users?page=${page}&per_page=12&name=${searchTerm}`
          );
          if (response.status === 200) {
            setUsers(response.data);
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchUsers();
    }
  }, [mounted, page, searchTerm]);

  const genders = [
    {
      label: "Male",
      value: "male",
    },
    {
      label: "Female",
      value: "female",
    },
  ];

  const statuses = [
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Inactive",
      value: "inactive",
    },
  ];

  return (
    <>
      <Navbar />
      <Container>
        <div className="w-full flex flex-col">
          <div className="inline-flex justify-between">
            <div>
              <input
                type="text"
                placeholder="Search user..."
                value={searchTerm}
                onChange={handleSearch}
                className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div />
            <button
              onClick={() => openModal(true)}
              className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
            >
              <AddCircle />
              <span>Add new user</span>
            </button>
          </div>
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-4">
            {users &&
              users.map((user, index) => (
                <div className="lg:col-span-2 xl:col-auto" key={index}>
                  <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-8 rounded-lg py-8 dark:bg-trueGray-800 gap-2 cursor-pointer dark:hover:opacity-80 transition-colors text-gray-500">
                    <div className="text-center">
                      <h5 className="text-xl font-bold">{user.name}</h5>
                      <p className="text-sm">{user.email}</p>
                      <p className="text-sm font-bold">{user.status}</p>
                    </div>
                    <div className="w-full inline-flex justify-end gap-2">
                      <button
                        onClick={() => editUser(user)}
                        className="px-2 py-1 text-sm bg-green-100 text-green-600 rounded-md hover:bg-green-200"
                      >
                        <EditPencil />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="px-2 py-2 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                      >
                        <Trash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="w-full inline-flex justify-center mt-4 gap-4 mb-10">
            <button
              disabled={page == 1}
              onClick={() =>
                setPage((prev) => {
                  if (page > 1) {
                    return prev - 1;
                  }
                })
              }
              className="px-4 py-1 rounded-md bg-gray-300 text-white hover:bg-gray-400 dark:bg-trueGray-800 dark:hover:opacity-80"
            >
              <FastArrowLeft />
            </button>
            <button
              onClick={() =>
                setPage((prev) => {
                  return prev + 1;
                })
              }
              className="px-4 py-1 rounded-md bg-gray-300 text-white hover:bg-gray-400 dark:bg-trueGray-800 dark:hover:opacity-80"
            >
              <FastArrowRight />
            </button>
          </div>
        </div>
      </Container>
      <Modal open={open} setOpen={setOpen} title={"Add new user"}>
        <div className="mt-2">
          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, setFieldValue, errors, touched }) => (
              <Form>
                <div className="grid grid-cols-1 gap-2">
                  <label className="block">
                    <span className="text-gray-700">Full name</span>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      placeholder="name..."
                      component={Input}
                    />
                    {errors.name && touched.name && (
                      <span className="text-sm text-red-700">
                        {errors.name}
                      </span>
                    )}
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Email</span>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      component={Input}
                    />
                    {errors.email && touched.email && (
                      <span className="text-sm text-red-700">
                        {errors.email}
                      </span>
                    )}
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Gender</span>
                    <Field
                      id="gender"
                      name="gender"
                      options={genders?.map((option) => option)}
                      component={Select}
                    />
                    {errors.gender && touched.gender && (
                      <span className="text-sm text-red-700">
                        {errors.gender}
                      </span>
                    )}
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Status</span>
                    <Field
                      id="status"
                      name="status"
                      options={statuses?.map((option) => option)}
                      component={Select}
                    />
                    {errors.status && touched.status && (
                      <span className="text-sm text-red-700">
                        {errors.status}
                      </span>
                    )}
                  </label>
                </div>
                <div className="mt-8 inline-flex justify-end w-full gap-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    Submit
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </>
  );
};

export default Index;
