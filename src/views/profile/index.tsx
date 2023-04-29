import Container from "react-bootstrap/Container";
import { UIError } from "@components/ui-error";
import { UserInfoUpdateForm } from "./components/user-info-update-form";
import { UserInfo } from "./components/user-info";
import { useState, useEffect, useRef, Fragment } from "react";
import { FormModel } from "@app-types/form-model";
import { formModelService } from "@services/form-model";
import { Loader } from "@components/loader";
import { ClassName } from "@services/class-name";

export const Profile = () => {
  const loadedInitialData = useRef(false);
  const [profileUpdateForm, setProfileUpdateForm] = useState<
    FormModel | null | undefined
  >(undefined);

  /**
   * Retrieves the update profile form.
   */
  useEffect(() => {
    if (!loadedInitialData.current) {
      const getProfileUpdateForm = async () => {
        loadedInitialData.current = true;
        setProfileUpdateForm(await formModelService.getProfileUpdateForm());
      };

      getProfileUpdateForm();
    }
  }, []);

  const getProfileContentJSX = () => {
    if (profileUpdateForm) {
      const title = profileUpdateForm.title;
      const inputs = profileUpdateForm.inputs;

      return (
        <Fragment>
        <Container
          fluid="md"
          className="p-0 mt-2 mb-5 text-white border border-primary rounded overflow-hidden"
        >
          <Container className="px-4 py-2 bg-primary text-md-start">
            <h3 className="m-0">Profile</h3>
          </Container>

          <Container className="px-4 py-0">
            <UserInfo />
          </Container>
        </Container>

        <Container
          fluid="md"
          className="p-0 my-2 text-white border border-primary rounded overflow-hidden"
        >
          <Container className="px-4 py-2 bg-primary text-md-start">
            <h3 className="m-0">{title}</h3>
          </Container>

          <Container className="px-4 py-0">
            <UserInfoUpdateForm formInputs={inputs} />
          </Container>
        </Container>
        </Fragment>
      );
    } // Failed to get profile update form from api
    else if (profileUpdateForm === null) {
      return <UIError />;
    }
    // Page is loading initial data
    else {
      return (
        <Container className="d-flex align-items-center">
          <Loader />
        </Container>
      );
    }
  };

  return (
    <Container
      className={
        new ClassName("my-5").addClass(
          profileUpdateForm === undefined,
          "d-flex",
          ""
        ).fullClass
      }
    >
      {getProfileContentJSX()}
    </Container>
  );
};
