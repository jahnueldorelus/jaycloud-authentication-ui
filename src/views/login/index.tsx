import { useEffect, useState, useRef } from "react";
import ErrorSVG from "@assets/error-circle.svg";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { ClassName } from "@services/class-name";
import { EditableInput } from "@components/editable-input";
import { FormModel, FormModelInputOption } from "@app-types/form-model";
import { useNavigate } from "react-router";
import { objectService } from "@services/object";
import { userService } from "@services/user";
import { formModelService } from "@services/form-model";
import { NavLink } from "react-router-dom";
import { UIError } from "@components/ui-error";
import { uiRoutes } from "@components/navbar/routes";
import { Loader } from "@components/loader";
import "./index.scss";

export const Login = () => {
  const navigate = useNavigate();
  const loadedInitialData = useRef(false);
  const [authenticationForm, setAuthenticationForm] = useState<
    FormModel | null | undefined
  >(undefined);
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

  /**
   * Retrieves the authentication form.
   */
  useEffect(() => {
    if (!loadedInitialData.current) {
      const getAuthenticationForm = async () => {
        loadedInitialData.current = true;
        setAuthenticationForm(await formModelService.getAuthenticationForm());
      };

      getAuthenticationForm();
    }
  }, []);

  // Validates the authentication form upon user input
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
      const result = await userService.authenticateUser(userModifiedInputs);
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
      authenticationForm &&
      !objectService.isObjectEmpty(userModifiedInputs)
    ) {
      const formInputs = authenticationForm.inputs;

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

  /**
   * Retrieves the form model JSX.
   */
  const formModelJSX = (): JSX.Element => {
    if (authenticationForm) {
      const title = authenticationForm.title;
      const inputs = authenticationForm.inputs;

      return (
        <Container
          fluid="md"
          className="login-form p-0 text-white bg-senary rounded overflow-hidden shadow"
        >
          <Container className="px-4 py-2 bg-primary text-center text-md-start">
            <h3 className="m-0">{title}</h3>
          </Container>

          <Container className="px-4 pt-3">
            <p className="mb-0">Don't have an account?</p>
            <NavLink
              to={uiRoutes.register}
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

              <NavLink
                to={uiRoutes.forgotPassword}
                className="text-secondary text-decoration-none"
              >
                Forgot password?
              </NavLink>

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
        </Container>
      );
    } // Failed to get authentication form from api
    else if (authenticationForm === null) {
      return <UIError />;
    }
    // Page is loading initial data
    else {
      return <Loader />;
    }
  };
  return (
    <Container
      className="view-login py-5 bg-tertiary d-flex align-items-center"
      fluid
    >
      {formModelJSX()}
    </Container>
  );
};
