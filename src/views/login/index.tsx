import { Fragment, useContext, useEffect, useState } from "react";
import ErrorSVG from "@assets/error-circle.svg";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { ClassName } from "@services/class-name";
import { EditableInput } from "@components/editable-input";
import { FormModelInputOption } from "@app-types/form-model";
import { useLoaderData, useNavigate } from "react-router";
import { LoginLoaderData } from "@app-types/views/login";
import { authStore } from "@store/index";
import { objectService } from "@services/object";
import { userService } from "@services/user";
import "./index.scss";
import { NavLink } from "react-router-dom";

export const Login = () => {
  const loaderData = useLoaderData() as LoginLoaderData;
  const authState = useContext(authStore);
  const navigate = useNavigate();
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(
    null
  );
  const [isApiRequestPending, setApiRequestPending] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [userModifiedInputs, setUserModifiedInputs] = useState<
    Record<string, string>
  >({});
  const [inputsValidity, setInputsValidity] = useState<Record<string, boolean>>(
    {}
  );

  // Validates the registration form upon user input
  useEffect(() => {
    validateForm();
  }, [userModifiedInputs]);

  /**
   * Handles the change of the text for an input.
   * @param formModelInput The form model input option
   * @param newInputValue The new value from the input
   */
  const onInputChange =
    (formModelInput: FormModelInputOption) => (newInputValue: string) => {
      const inputName = formModelInput.name;

      const userModifiedInputsCopy = { ...userModifiedInputs };
      userModifiedInputsCopy[inputName] = newInputValue;
      setUserModifiedInputs(userModifiedInputsCopy);
    };

  /**
   * Handles submitting the form
   */
  const onFormSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (isFormValid) {
      setApiRequestPending(true);
      const result = await userService.authenticateUser(
        userModifiedInputs,
        authState.dispatch
      );
      setApiRequestPending(false);

      if (result.errorOccurred) {
        setLoginErrorMessage(result.errorMessage);
      } else {
        setLoginErrorMessage(null);
        navigate("/");
      }
    }
  };

  /**
   * Validates the form model.
   */
  const validateForm = () => {
    const formInputsValidity: Record<string, boolean> = {};

    if (
      loaderData.formModel &&
      !objectService.isObjectEmpty(userModifiedInputs)
    ) {
      const formInputs = loaderData.formModel.inputs;

      // Validates each form input
      formInputs.forEach((input) => {
        const inputName = input.name;
        const inputText = userModifiedInputs[inputName];
        const isInputRequired = input.validation.required;
        const inputRegexes = input.validation.regex;

        // If the user didn't give an input and an input is required
        if (!inputText) {
          formInputsValidity[inputName] = isInputRequired ? false : true;
        }
        // Tests against the input's regex(es)
        else {
          formInputsValidity[inputName] = inputRegexes.every((regex) => {
            return RegExp(regex).test(inputText) === true;
          });
        }
      });

      // Determines if all inputs are valid
      const formIsValid =
        Object.keys(formInputsValidity).length > 0 &&
        Object.values(formInputsValidity).every((value) => value === true);

      setInputsValidity(formInputsValidity);
      setIsFormValid(formIsValid);
    }
  };

  const formModelJSX = (): JSX.Element => {
    if (loaderData.formModel) {
      const title = loaderData.formModel.title;
      const inputs = loaderData.formModel.inputs;
      return (
        <Fragment>
          <Container className="px-4 py-2 bg-primary text-center text-md-start">
            <h3 className="m-0">{title}</h3>
          </Container>

          <Container className="px-4 pt-3">
            <p className="mb-0">Don't have an account?</p>
            <NavLink
              to="/register"
              className="text-secondary text-decoration-none"
            >
              Click here to create a new account
            </NavLink>
          </Container>

          <Container className="px-4 pt-4">
            {loginErrorMessage && (
              <Alert className="py-2 d-flex" variant="danger">
                <img src={ErrorSVG} alt={"A red X in a circle"} width={20} />
                <p className="m-0 ms-2">{loginErrorMessage}</p>
              </Alert>
            )}
            <p>* Required Input</p>
            <Form>
              {inputs.map((modelInput, index) => {
                const inputName = modelInput.name;
                const inputText = userModifiedInputs[inputName] || "";
                const isInputValid = !!inputsValidity[modelInput.name];

                return (
                  <Form.Group key={index}>
                    <EditableInput
                      formModelName={inputName}
                      input={modelInput}
                      inputText={inputText}
                      isInputValid={isInputValid}
                      placeholder={`Enter your ${modelInput.label.toLowerCase()}`}
                      labelClassName="text-white"
                      invalidMessageClassName="mt-1 text-warning"
                      onTextChange={onInputChange(modelInput)}
                      disabled={isApiRequestPending}
                    />
                  </Form.Group>
                );
              })}

              <Container className="my-4 d-flex justify-content-center">
                <Button
                  className="mt-2"
                  type="submit"
                  variant="primary"
                  aria-disabled={!isFormValid}
                  onClick={onFormSubmit}
                >
                  <Spinner
                    className={
                      new ClassName("me-2").addClass(
                        isApiRequestPending,
                        "d-inline-block",
                        "d-none"
                      ).fullClass
                    }
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    as="span"
                  />
                  {isApiRequestPending ? "Loading" : "Login"}
                </Button>
              </Container>
            </Form>
          </Container>
        </Fragment>
      );
    } else {
      return <></>;
    }
  };
  return (
    <Container
      className="view-login py-5 bg-tertiary d-flex align-items-center"
      fluid
    >
      <Container
        fluid="md"
        className="login-form p-0 text-white bg-senary rounded overflow-hidden shadow"
      >
        {formModelJSX()}
      </Container>
    </Container>
  );
};
