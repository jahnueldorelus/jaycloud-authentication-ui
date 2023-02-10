import { ProfileLoaderData } from "@app-types/views/profile";
import Container from "react-bootstrap/Container";
import { useLoaderData } from "react-router-dom";
import { UIError } from "@components/ui-error";
import { UserInfoUpdateForm } from "./components/user-info-update-form";
import { UserInfo } from "./components/user-info";

export const Profile = () => {
  const loaderData = useLoaderData() as ProfileLoaderData;

  if (loaderData.formModel) {
    const title = loaderData.formModel.title;
    const inputs = loaderData.formModel.inputs;

    return (
      <Container className="view-profile my-5">
        <Container
          fluid="md"
          className="login-form p-0 my-2 text-white bg-senary rounded overflow-hidden shadow"
        >
          <Container className="px-4 py-2 bg-primary text-center text-md-start">
            <h3 className="m-0">Profile</h3>
          </Container>

          <Container className="px-4 py-0">
            <UserInfo />
            <hr className="bg-white" />
            <UserInfoUpdateForm formInputs={inputs} formTitle={title} />
          </Container>
        </Container>
      </Container>
    );
  } else {
    return <UIError />;
  }
};
